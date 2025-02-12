'use client'
import { useDropzone } from "react-dropzone";
import { useState, useCallback } from "react";
import { Button } from "../components/ui/button";
import { useToast } from "../hooks/use-toast";
import { Toaster } from "../components/ui/toaster";
import { FiUploadCloud } from "react-icons/fi";
import { MdDelete } from "react-icons/md";
import { FcAddImage, FcDocument, FcAudioFile, FcVideoFile } from "react-icons/fc";
import React from "react";
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';
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
};

const Dropzone = () => {
  const { toast } = useToast();
  const [files, setFiles] = useState<FileType[]>([]);
  const [converted, setConverted] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const ffmpeg = createFFmpeg({ log: true });

  const onDrop = useCallback((acceptedFiles) => {
    setFiles(prevFiles => [
      ...prevFiles,
      ...acceptedFiles.map(file => ({
        name: file.name,
        size: file.size,
        type: file.type,
        targetFormat: ""
      }))
    ]);
  }, []);

  const onDropRejected = useCallback((fileRejections) => {
    fileRejections.forEach(({ file, errors }) => {
      errors.forEach((error) => {
        toast({
          title: "Invalid File Format",
          description: `The file "${file.name}" is not accepted.`,
          variant: "destructive",
        });
      });
    });
  }, [toast]);

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/*": [".jpeg", ".png", ".jpg", ".gif", ".pdf", ".tiff", ".psd", ".raw", ".eps", ".webp", ".svg", ".ico", ".bmp"],
      "audio/*": [".mp3", ".wav", ".ogg", ".flac", ".aiff", ".m4a", ".wma", ".aac"],
      "video/*": [".mp4", ".avi", ".mov", ".wmv", ".mkv", ".flv", ".webm", ".mpeg"],
    },
    onDrop,
    onDropRejected,
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
    if (size >= 1024 * 1024) {
      return `${(size / (1024 * 1024)).toFixed(2)} MB`;
    } else {
      return `${(size / 1024).toFixed(2)} KB`;
    }
  }, []);

  const loadFFmpeg = async () => {
    if (!ffmpeg.isLoaded()) {
      await ffmpeg.load();
    }
  };

  const convertFile = async (file: FileType) => {
    if (!file) return;
    setLoading(true);
    await loadFFmpeg();

    const input = file.name;
    const output = `${file.name.split('.').slice(0, -1).join('.')}.${file.targetFormat}`;

    try {
      ffmpeg.FS("writeFile", input, await fetchFile(file));
      await ffmpeg.run("-i", input, output);
      const data = ffmpeg.FS("readFile", output);

      // Create a downloadable URL
      const convertedBlob = new Blob([data.buffer], { type: file.type });
      const url = URL.createObjectURL(convertedBlob);
      setConverted(url);
    } catch (error) {
      toast({
        title: "Conversion Error",
        description: `Failed to convert the file "${file.name}".`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleConvert = () => {
    files.forEach(file => {
      if (file.targetFormat) {
        const isValidConversion = validateConversion(file.type, file.targetFormat);
        if (isValidConversion) {
          convertFile(file);
        } else {
          toast({
            title: "Invalid Conversion",
            description: `Cannot convert ${file.type} to ${file.targetFormat}.`,
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "Format Not Selected",
          description: `Please select a target format for the file "${file.name}".`,
          variant: "destructive",
        });
      }
    });
  };

  const validateConversion = (fileType: string, targetFormat: string) => {
    const imageFormats = ["jpeg", "png", "jpg", "svg", "pdf", "ico", "gif", "heif", "tiff", "psd", "raw", "eps", "webp", "bmp"];
    const audioFormats = ["mp3", "wav", "ogg", "flac", "aiff", "m4a", "wma", "aac"];
    const videoFormats = ["mp4", "avi", "mov", "wmv", "mkv", "flv", "webm", "mpeg"];

    if (fileType.startsWith("image/") && imageFormats.includes(targetFormat)) {
      return true;
    }
    if (fileType.startsWith("audio/") && audioFormats.includes(targetFormat)) {
      return true;
    }
    if (fileType.startsWith("video/") && videoFormats.includes(targetFormat)) {
      return true;
    }
    return false;
  };

  return (
    <div className="mt-5">
      {console.log("Render")}
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
                  {file.type.startsWith("image/") && (<FcAddImage />)}
                  {file.type.startsWith("application/") && (<FcDocument />)}
                  {file.type.startsWith("audio/") && (<FcAudioFile />)}
                  {file.type.startsWith("video/") && (<FcVideoFile />)}
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
                    <div className="grid grid-cols-2 gap-2 p-2">
                      {/* First Column */}
                      <div>
                        <SelectGroup>
                          <SelectItem value="jpeg" onSelect={() => handleFormatChange(index, "jpeg")}>JPEG</SelectItem>
                          <SelectItem value="png" onSelect={() => handleFormatChange(index, "png")}>PNG</SelectItem>
                          <SelectItem value="jpg" onSelect={() => handleFormatChange(index, "jpg")}>JPG</SelectItem>
                          <SelectItem value="svg" onSelect={() => handleFormatChange(index, "svg")}>SVG</SelectItem>
                          <SelectItem value="pdf" onSelect={() => handleFormatChange(index, "pdf")}>PDF</SelectItem>
                          <SelectItem value="ico" onSelect={() => handleFormatChange(index, "ico")}>ICO</SelectItem>
                          <SelectItem value="gif" onSelect={() => handleFormatChange(index, "gif")}>GIF</SelectItem>
                        </SelectGroup>
                      </div>

                      {/* Second Column */}
                      <div>
                        <SelectGroup>
                          <SelectItem value="heif" onSelect={() => handleFormatChange(index, "heif")}>HEIF</SelectItem>
                          <SelectItem value="tiff" onSelect={() => handleFormatChange(index, "tiff")}>TIFF</SelectItem>
                          <SelectItem value="psd" onSelect={() => handleFormatChange(index, "psd")}>PSD</SelectItem>
                          <SelectItem value="raw" onSelect={() => handleFormatChange(index, "raw")}>RAW</SelectItem>
                          <SelectItem value="eps" onSelect={() => handleFormatChange(index, "eps")}>EPS</SelectItem>
                          <SelectItem value="webp" onSelect={() => handleFormatChange(index, "webp")}>WEBP</SelectItem>
                          <SelectItem value="bmp" onSelect={() => handleFormatChange(index, "bmp")}>BMP</SelectItem>
                        </SelectGroup>
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
          <Button variant='default' className="m-10" onClick={handleConvert}>Convert Now</Button> {files.length > 1 && <Button variant='destructive' className="" onClick={() => handleDeleteAll()}>Delete All</Button>}
        </div>
      )}
      <Toaster />
    </div>
  );
};

export default Dropzone;