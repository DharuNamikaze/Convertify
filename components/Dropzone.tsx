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
      await ffmpeg.load();
      setFfmpegLoaded(true);
    };
    loadFFmpeg();
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/*": [".jpeg", ".png", ".jpg", ".gif", ".webp", ".svg"],
      "audio/*": [".mp3", ".wav", ".ogg"],
      "video/*": [".mp4", ".avi", ".mov"],
    },
    onDrop: (acceptedFiles) => {
      setFiles((prevFiles) => [...prevFiles, ...acceptedFiles.map((file) => ({
        file,
        name: file.name,
        size: file.size,
        type: file.type,
        targetFormat: "",
      }))]);
    },
    onDropRejected: (fileRejections) => {
      fileRejections.forEach(({ file }) => {
        toast({
          title: "Invalid File Format",
          description: `The file "${file.name}" is not accepted.`,
          variant: "destructive",
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

  const handleDelete = (index: number) => setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  const handleDeleteAll = () => setFiles([]);

  const formatFileSize = (size: number) => (size >= 1024 * 1024 ? `${(size / (1024 * 1024)).toFixed(2)} MB` : `${(size / 1024).toFixed(2)} KB`);

  const handleConvertNow = async () => {
    if (!ffmpegLoaded) {
      toast({ title: "FFmpeg not loaded", description: "Please wait for FFmpeg to load.", variant: "destructive" });
      return;
    }

    for (const file of files) {
      if (!file.targetFormat) {
        toast({ title: "Target Format Missing", description: `Select a target format for ${file.name}.`, variant: "destructive" });
        continue;
      }

      try {
        const inputName = file.name;
        const outputName = `${inputName.substring(0, inputName.lastIndexOf("."))}.${file.targetFormat}`;
        
        const reader = new FileReader();
        reader.onload = async (event) => {
          if (event.target?.result instanceof ArrayBuffer) {
            const uint8Array = new Uint8Array(event.target.result);
            await ffmpeg.FS("writeFile", inputName, uint8Array);
            await ffmpeg.run("-i", inputName, outputName);
            const data = await ffmpeg.FS("readFile", outputName);
            const blob = new Blob([new Uint8Array(data).buffer], { type: file.file.type });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = outputName;
            document.body.appendChild(a);
            a.click();
            a.remove();
            URL.revokeObjectURL(url);
          }
        };
        reader.readAsArrayBuffer(file.file);
      } catch (e) {
        toast({ title: "Conversion Error", description: `Error converting ${file.name}: ${e}`, variant: "destructive" });
      }
    }

    toast({ title: "Conversion Completed", description: "Files have been converted and downloaded." });
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
                <Select onValueChange={(value) => handleFormatChange(index, value)}>
                  <SelectTrigger className="w-[250px]">
                    <SelectValue placeholder="Select Format" />
                  </SelectTrigger>
                  <SelectContent className="w-[300px]">
                    <div className="grid grid-cols-2 gap-2 p-2">
                      <div>
                        <SelectGroup>
                          <SelectItem value="jpeg">JPEG</SelectItem>
                          <SelectItem value="png">PNG</SelectItem>
                          <SelectItem value="jpg">JPG</SelectItem>
                          <SelectItem value="svg">SVG</SelectItem>
                          <SelectItem value="pdf">PDF</SelectItem>
                          <SelectItem value="ico">ICO</SelectItem>
                          <SelectItem value="gif">GIF</SelectItem>
                        </SelectGroup>
                      </div>
                      <div>
                        <SelectGroup>
                          <SelectItem value="heif">HEIF</SelectItem>
                          <SelectItem value="tiff">TIFF</SelectItem>
                          <SelectItem value="psd">PSD</SelectItem>
                          <SelectItem value="raw">RAW</SelectItem>
                          <SelectItem value="eps">EPS</SelectItem>
                          <SelectItem value="webp">WEBP</SelectItem>
                          <SelectItem value="bmp">BMP</SelectItem>
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
