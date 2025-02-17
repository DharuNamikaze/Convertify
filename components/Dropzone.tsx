'use client'
import { useDropzone } from "react-dropzone";
import { useState, useCallback , useEffect} from "react";
import { Button } from "../components/ui/button";
import { useToast } from "../hooks/use-toast";
import { Toaster } from "../components/ui/toaster";
import { FiUploadCloud } from "react-icons/fi";
import { MdDelete } from "react-icons/md";
import { FcAddImage, FcDocument, FcAudioFile, FcVideoFile } from "react-icons/fc";
import React from "react";
import { createFFmpeg } from "@ffmpeg/ffmpeg";
// Import fetchFile separately
import {fetchFile} from "@ffmpeg/util";
import * as ffmpegModule from "@ffmpeg/ffmpeg";
console.log(ffmpegModule);
import {
  Select,
  SelectContent,
  SelectItem,
  SelectGroup,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";

type FileType = {
  name: string;
  size: number;
  type: string;
  targetFormat: string;
  file: File;
};
  

const Dropzone = () => {
  const { toast } = useToast();
  const [isFFmpegLoaded, setIsFFmpegLoaded] = useState(false);
  const [files, setFiles] = useState<FileType[]>([]);
  const [convertedUrl, setConvertedUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  if (!isFFmpegLoaded) {
    return <p>Loading FFmpeg...</p>;
  }

  const ffmpeg = createFFmpeg({ log: true });

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles(prevFiles => [
      ...prevFiles,
      ...acceptedFiles.map(file => ({
        name: file.name,
        size: file.size,
        type: file.type,
        targetFormat: "",
        file: file, // Store the actual file object
      }))
    ]);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/*": [".jpeg", ".png", ".jpg", ".gif", ".pdf", ".tiff", ".psd", ".raw", ".eps", ".webp", ".svg", ".ico", ".bmp"],
      "audio/*": [".mp3", ".wav", ".ogg", ".flac", ".aiff", ".m4a", ".wma", ".aac"],
      "video/*": [".mp4", ".avi", ".mov", ".wmv", ".mkv", ".flv", ".webm", ".mpeg"],
    },
    onDrop,
  });

  const handleFormatChange = useCallback((index: number, format: string) => {
    setFiles(prevFiles => {
      const newFiles = [...prevFiles];
      newFiles[index].targetFormat = format;
      return newFiles;
    });
  }, []);

  const handleDelete = useCallback((index: number) => {
    setFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
  }, []);

  const handleDeleteAll = useCallback(() => {
    setFiles([]);
  }, []);

  const formatFileSize = useCallback((size: number) => {
    return size >= 1024 * 1024
      ? `${(size / (1024 * 1024)).toFixed(2)} MB`
      : `${(size / 1024).toFixed(2)} KB`;
  }, []);

  const loadFFmpeg = async () => {
    if (!ffmpeg.isLoaded()) {
      await ffmpeg.load();
    }
  };

  const convertFile = async (file: FileType) => {
    if (!file || !file.file) return;
    setLoading(true);
    await loadFFmpeg();

    const input = file.name;
    const output = `${file.name.split('.').slice(0, -1).join('.')}.${file.targetFormat}`;

    try {
      ffmpeg.FS("writeFile", input, await fetchFile(file.file));
      await ffmpeg.run("-i", input, output);
      const data = ffmpeg.FS("readFile", output);

      // Create a downloadable URL
      const convertedBlob = new Blob([data.buffer], { type: file.type });
      const url = URL.createObjectURL(convertedBlob);
      setConvertedUrl(url);

      toast({
        title: "Conversion Successful",
        description: `File "${file.name}" converted successfully!`,
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "Conversion Error",
        description: `Failed to convert "${file.name}".`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    loadFFmpeg().then(() => setIsFFmpegLoaded(true));
  }, []);


  const handleConvert = () => {
    files.forEach(file => {
      if (file.targetFormat) {
        convertFile(file);
      } else {
        toast({
          title: "Format Not Selected",
          description: `Please select a target format for "${file.name}".`,
          variant: "destructive",
        });
      }
    });
  };

  return (
    <div className="mt-5">
      <div {...getRootProps({ className: "lg:mx-52 mx-10 py-28 border dropzone flex flex-col items-center justify-center" })}>
        <FiUploadCloud className="w-10 h-10 mb-2" />
        <input {...getInputProps()} />
        <p>Drag & drop your files here, or click to <span className="text-violet-800 cursor-pointer">select</span> files</p>
      </div>

      {files.length > 0 && (
        <div className="mt-5 lg:mx-52 max-sm:m-10 sm:mx-10 items-center justify-center py-10 uploaded-files">
          {files.map((file, index) => (
            <div key={index} className="pb-4 border flex items-center max-sm:flex max-sm:flex-col max-sm:gap-5">
              <div className="p-5 flex-1">
                <span className="flex items-center gap-1">
                  {file.type.startsWith("image/") && <FcAddImage />}
                  {file.type.startsWith("application/") && <FcDocument />}
                  {file.type.startsWith("audio/") && <FcAudioFile />}
                  {file.type.startsWith("video/") && <FcVideoFile />}
                  {file.name}
                  <small className="text-gray-700">({formatFileSize(file.size)})</small>
                </span>
              </div>

              <div className="flex items-center gap-5 p-2">
                <Select>
                  <SelectTrigger className="w-[250px]">
                    <SelectValue placeholder="Select Format" />
                  </SelectTrigger>
                  <SelectContent className="w-[300px]">
                    <SelectGroup>
                      <SelectItem value="jpeg" onClick={() => handleFormatChange(index, "jpeg")}>JPEG</SelectItem>
                      <SelectItem value="png" onClick={() => handleFormatChange(index, "png")}>PNG</SelectItem>
                      <SelectItem value="mp4" onClick={() => handleFormatChange(index, "mp4")}>MP4</SelectItem>
                    </SelectGroup>
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

          <Button variant='default' className="m-10" onClick={handleConvert}>Convert Now</Button>
          {files.length > 1 && <Button variant='destructive' onClick={handleDeleteAll}>Delete All</Button>}
        </div>
      )}

      {convertedUrl && (
        <a href={convertedUrl} download className="block text-center text-violet-800 mt-4">Download Converted File</a>
      )}

      <Toaster />
    </div>
  );
};

export default Dropzone;
