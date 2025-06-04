"use client";
import { useDropzone } from "react-dropzone";
import { useState, useEffect } from "react";
import { Button } from "../components/ui/button";
import { useToast } from "../hooks/use-toast";
import { Toaster } from "../components/ui/toaster";
import { FiUploadCloud } from "react-icons/fi";
import { MdDelete } from "react-icons/md";
import { FcAddImage, FcDocument, FcAudioFile, FcVideoFile } from "react-icons/fc";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectGroup,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";

import { createFFmpeg } from "@ffmpeg/ffmpeg";

const ffmpeg = createFFmpeg({ log: true });

type FileType = {
  file: File;
  name: string;
  size: number;
  type: string;
  targetFormat: string;
};

const Dropzone = () => {
  const { toast } = useToast();
  const [files, setFiles] = useState<FileType[]>([]);
  const [ffmpegLoaded, setFfmpegLoaded] = useState(false);

  useEffect(() => {
    const loadFFmpeg = async () => {
      try {
        await ffmpeg.load();
        // Enable hardware acceleration
        await ffmpeg.run('-hwaccel', 'auto');
        setFfmpegLoaded(true);
      } catch (error) {
        toast({
          title: "FFmpeg Error",
          description: "Failed to initialize FFmpeg",
          variant: "destructive",
        });
      }
    };
    loadFFmpeg();
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/*": [".jpeg", ".png", ".jpg", ".gif", ".pdf", ".tiff", ".psd", ".raw", ".eps", ".webp", ".svg", ".ico", ".bmp"],
      "audio/*": [".mp3", ".wav", ".ogg", ".flac", ".aiff", ".m4a", ".wma", ".aac"],
      "video/*": [".mp4", ".avi", ".mov", ".wmv", ".mkv", ".flv", ".webm", ".mpeg"],
    },
    onDrop: (acceptedFiles) => {
      setFiles((prevFiles) => [
        ...prevFiles,
        ...acceptedFiles.map((file) => ({
          file,
          name: file.name,
          size: file.size,
          type: file.type,
          targetFormat: "",
        })),
      ]);
    },
    onDropRejected: (fileRejections) => {
      fileRejections.forEach(({ file, errors }) => {
        errors.forEach(() => {
          toast({
            title: "Invalid File Format",
            description: `The file "${file.name}" is not accepted.`,
            variant: "destructive",
          });
        });
      });
    },
  });

  const handleFormatChange = (index: number, format: string) => {
    setFiles((prevFiles) => {
      const newFiles = [...prevFiles];
      newFiles[index].targetFormat = format;
      return newFiles;
    });
  };

  const handleDelete = (index: number) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const handleDeleteAll = () => {
    setFiles([]);
  };

  const formatFileSize = (size: number) => {
    return size >= 1024 * 1024
      ? `${(size / (1024 * 1024)).toFixed(2)} MB`
      : `${(size / 1024).toFixed(2)} KB`;
  };

  const handleConvertNow = async () => {
    if (!ffmpegLoaded) {
      toast({
        title: "Loading Files",
        description: "Please wait for FFmpeg to load.",
        variant: "destructive",
      });
      return;
    }

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file.targetFormat) {
        toast({
          title: "Target Format Missing",
          description: `Please select a target format for ${file.name}.`,
          variant: "destructive",
        });
        continue;
      }

      try {
        const inputName = file.name;
        const outputName = `output.${file.targetFormat}`;

        const reader = new FileReader();
        reader.onload = async (event) => {
          if (event.target?.result instanceof ArrayBuffer) {
            try {
              const uint8Array = new Uint8Array(event.target.result);
              ffmpeg.FS("writeFile", inputName, uint8Array);

              const fileType = file.file.type.split('/')[0];
              
              // Special handling for HEIF format
              if (file.targetFormat === 'heif') {
                await ffmpeg.run(
                  '-i', inputName,
                  '-vf', 'format=yuv420p',
                  '-c:v', 'libx265',
                  '-preset', 'medium',
                  '-crf', '23',
                  outputName
                );
              } else if (fileType === 'video') {
                await ffmpeg.run(
                  '-i', inputName,
                  '-c:v', 'h264',
                  '-preset', 'ultrafast',
                  '-threads', '0',
                  '-movflags', '+faststart',
                  outputName
                );
              } else if (fileType === 'audio') {
                await ffmpeg.run(
                  '-i', inputName,
                  '-c:a', 'aac',
                  '-q:a', '2',
                  outputName
                );
              } else {
                // For images
                await ffmpeg.run(
                  '-i', inputName,
                  '-quality', '85',
                  outputName
                );
              }

              // Verify if the output file exists
              const files = ffmpeg.FS('readdir', '/');
              if (!files.includes(outputName)) {
                throw new Error('Conversion failed: Output file not created');
              }

              const data = ffmpeg.FS("readFile", outputName);
              const blob = new Blob([new Uint8Array(data).buffer], { type: `${fileType}/${file.targetFormat}` });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = `${inputName.substring(0, inputName.lastIndexOf("."))}.${file.targetFormat}`;
              document.body.appendChild(a);
              a.click();
              a.remove();
              URL.revokeObjectURL(url);

              // Clean up FFmpeg memory
              ffmpeg.FS("unlink", inputName);
              ffmpeg.FS("unlink", outputName);

              toast({
                title: "Success",
                description: `Converted ${file.name} successfully!`
              });
            } catch (error) {
              toast({
                title: "Conversion Error",
                description: `Failed to convert ${file.name}: ${error}`,
                variant: "destructive"
              });
            }
          }
        };
        reader.readAsArrayBuffer(file.file);
        toast({ 
          title: "Conversion Started", 
          description: `Converting ${file.name}...` 
        });
      } catch (e) {
        toast({ 
          title: "Conversion Error", 
          description: `Error converting ${file.name}: ${e}`, 
          variant: "destructive" 
        });
      }
    }
  };

  return (
    <div className="mt-5">
      <div {...getRootProps({ className: "lg:mx-52 mx-10 py-28 border dropzone flex flex-col items-center justify-center" })}>
        <FiUploadCloud className="w-10 h-10 mb-2" />
        <input {...getInputProps()} />
        <p>
          Drag & drop your files here, or click to{" "}
          <span className="text-violet-800 cursor-pointer">select</span> files
        </p>
      </div>

      {files.length > 0 && (
        <div className="mt-5 lg:mx-52 max-sm:m-10 sm:mx-10 items-center justify-center py-10 uploaded-files">
          {files.map((file, index) => (
            <div key={index} className="pb-4 border flex items-center max-sm:flex max-sm:flex-col max-sm:gap-5">
              <div className="p-5 flex-1">
                <span id="FileName" className="flex items-center gap-1">
                  {file.type.startsWith("image/") && <FcAddImage className="min-w-5 min-h-5" />}
                  {file.type.startsWith("application/") && <FcDocument className="min-w-5 min-h-5" />}
                  {file.type.startsWith("audio/") && <FcAudioFile className="min-w-5 min-h-5" />}
                  {file.type.startsWith("video/") && <FcVideoFile className="min-w-5 min-h-5" />}
                  {file.name.length > 40 ? file.name.slice(0, 10) + "....." + file.name.slice(file.name.length - 10, file.name.length) : file.name}
                  {/* {file.name.length > 40 && window.innerWidth<640 ? file.name.slice(0, 10) + "....." + file.name.slice(file.name.length - 10, file.name.length) : file.name} */}
                  <small className="text-gray-700">({formatFileSize(file.size)})</small>
                </span>
              </div>
              <div className="flex items-center gap-5 p-2">
                <Select onValueChange={(value) => handleFormatChange(index, value)}>
                  <SelectTrigger className="w-[250px]">
                    <SelectValue placeholder="Select Format" />
                  </SelectTrigger>
                  <SelectContent className="w-[300px]">
                    <div className={file.type.startsWith("audio/") || file.type.startsWith("video/") ? '' : 'grid grid-cols-2 gap-2 p-2'}>
                      <div>
                        {file.type.startsWith("image/") && <SelectGroup>
                          <SelectItem value="jpeg">JPEG</SelectItem>
                          <SelectItem value="png">PNG</SelectItem>
                          <SelectItem value="jpg">JPG</SelectItem>
                          <SelectItem value="svg">SVG</SelectItem>
                          <SelectItem value="pdf">PDF</SelectItem>
                          <SelectItem value="ico">ICO</SelectItem>
                          <SelectItem value="gif">GIF</SelectItem>
                        </SelectGroup>
                        }
                      </div>
                      <div>
                        {file.type.startsWith("image/") && <SelectGroup>
                          <SelectItem value="heif">HEIF</SelectItem>
                          <SelectItem value="tiff">TIFF</SelectItem>
                          <SelectItem value="psd">PSD</SelectItem>
                          <SelectItem value="raw">RAW</SelectItem>
                          <SelectItem value="eps">EPS</SelectItem>
                          <SelectItem value="webp">WEBP</SelectItem>
                          <SelectItem value="bmp">BMP</SelectItem>
                        </SelectGroup>}
                      </div>
                      <div>
                        {file.type.startsWith("audio/") && <SelectGroup>
                          <SelectItem value="mp3">MP3</SelectItem>
                          <SelectItem value="wav">WAV</SelectItem>
                          <SelectItem value="ogg">OGG</SelectItem>
                          <SelectItem value="flac">FLAC</SelectItem>
                          <SelectItem value="aiff">AIFF</SelectItem>
                          <SelectItem value="m4a">M4A</SelectItem>
                          <SelectItem value="wma">WMA</SelectItem>
                          <SelectItem value="aac">AAC</SelectItem>
                        </SelectGroup>
                        }
                      </div>
                      <div>
                        {file.type.startsWith("video/") && <SelectGroup>
                          <SelectItem value="mp4">MP4</SelectItem>
                          <SelectItem value="avi">AVI</SelectItem>
                          <SelectItem value="mov">MOV</SelectItem>
                          <SelectItem value="wmv">WMV</SelectItem>
                          <SelectItem value="mkv">MKV</SelectItem>
                          <SelectItem value="flv">FLV</SelectItem>
                          <SelectItem value="webm">WEBM</SelectItem>
                          <SelectItem value="mpeg">MPEG</SelectItem>
                        </SelectGroup>
                        }
                      </div>

                    </div>
                  </SelectContent>
                </Select>

                <Button
                  variant="outline"
                  onClick={() => handleDelete(index)}
                  className="px-2.5 rounded-full bg-violet-900 hover:text-white text-white hover:bg-violet-700"
                >
                  <MdDelete />
                </Button>
              </div>
            </div>
          ))}
          <Button variant="default" className="m-10" onClick={handleConvertNow}>
            Convert Now
          </Button>

          {files.length > 1 && (
            <Button variant="destructive" onClick={handleDeleteAll}>
              Delete All
            </Button>
          )}
        </div>
      )}
      <Toaster />
    </div>
  );
};

export default Dropzone;
