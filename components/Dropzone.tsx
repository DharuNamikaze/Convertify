"use client";
import { useDropzone } from "react-dropzone";
import { useState, useRef, useCallback } from "react";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { toBlobURL } from "@ffmpeg/util";
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

type ConvertFile = {
  file: File;
  name: string;
  size: number;
  type: string;
  targetFormat: string;
  progress: number;
  status: "pending" | "converting" | "completed" | "error";
};

const MAX_FILE_SIZE = 500 * 1024 * 1024;

const Dropzone = () => {
  const { toast } = useToast();
  const [files, setFiles] = useState<ConvertFile[]>([]);
  const [isConverting, setIsConverting] = useState(false);
  const ffmpegRef = useRef<FFmpeg | null>(null);
  const [ffmpegLoaded, setFfmpegLoaded] = useState(false);

  const loadFFmpeg = async () => {
    if (ffmpegLoaded && ffmpegRef.current) return ffmpegRef.current;

    const ffmpeg = new FFmpeg();
    ffmpegRef.current = ffmpeg;

    const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd";
    await ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
      wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, "application/wasm"),
    });

    setFfmpegLoaded(true);
    return ffmpeg;
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/*": [".jpeg", ".png", ".jpg", ".gif", ".tiff", ".webp", ".svg", ".ico", ".bmp"],
      "audio/*": [".mp3", ".wav", ".ogg", ".flac", ".aiff", ".m4a", ".wma", ".aac"],
      "video/*": [".mp4", ".avi", ".mov", ".wmv", ".mkv", ".flv", ".webm", ".mpeg"],
    },
    maxSize: MAX_FILE_SIZE,
    onDrop: (acceptedFiles) => {
      setFiles((prev) => [
        ...prev,
        ...acceptedFiles.map((file) => ({
          file,
          name: file.name,
          size: file.size,
          type: file.type,
          targetFormat: "",
          progress: 0,
          status: "pending" as const,
        })),
      ]);
    },
    onDropRejected: (fileRejections) => {
      fileRejections.forEach(({ file, errors }) => {
        errors.forEach((error) => {
          toast({
            title: error.code === "file-too-large" ? "File Too Large" : "Invalid File",
            description:
              error.code === "file-too-large"
                ? `${file.name} exceeds the 500MB limit.`
                : `"${file.name}" is not a supported format.`,
            variant: "destructive",
          });
        });
      });
    },
  });

  const handleFormatChange = (index: number, format: string) => {
    setFiles((prev) => {
      const updated = [...prev];
      updated[index].targetFormat = format;
      return updated;
    });
  };

  const handleDelete = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDeleteAll = () => setFiles([]);

  const formatFileSize = (size: number) =>
    size >= 1024 * 1024
      ? `${(size / (1024 * 1024)).toFixed(2)} MB`
      : `${(size / 1024).toFixed(2)} KB`;

  const updateFile = useCallback(
    (index: number, progress: number, status: ConvertFile["status"]) => {
      setFiles((prev) => {
        const updated = [...prev];
        if (updated[index]) {
          updated[index].progress = progress;
          updated[index].status = status;
        }
        return updated;
      });
    },
    []
  );

  const downloadFile = (data: Uint8Array, filename: string, mimeType: string) => {
    const blob = new Blob([data instanceof Uint8Array ? data.buffer as ArrayBuffer : data], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const getFFmpegArgs = (
    inputName: string,
    outputName: string,
    fileType: string,
    targetFormat: string
  ): string[] => {
    if (targetFormat === "heif") {
      return ["-i", inputName, "-vf", "format=yuv420p", "-c:v", "libx265", "-preset", "medium", "-crf", "23", outputName];
    }
    if (fileType === "video") {
      return ["-i", inputName, "-c:v", "libx264", "-preset", "ultrafast", "-movflags", "+faststart", outputName];
    }
    if (fileType === "audio") {
      return ["-i", inputName, "-c:a", "aac", "-b:a", "128k", outputName];
    }
    // Images
    if (targetFormat === "jpg" || targetFormat === "jpeg") {
      return ["-i", inputName, "-q:v", "2", outputName];
    }
    if (targetFormat === "png") {
      return ["-i", inputName, "-compression_level", "6", outputName];
    }
    if (targetFormat === "webp") {
      return ["-i", inputName, "-quality", "80", outputName];
    }
    if (targetFormat === "gif") {
      return ["-i", inputName, "-vf", "fps=10,scale=320:-1:flags=lanczos", outputName];
    }
    if (targetFormat === "bmp") {
      return ["-i", inputName, "-pix_fmt", "rgb24", outputName];
    }
    if (targetFormat === "tiff") {
      return ["-i", inputName, "-compression_algo", "lzw", outputName];
    }
    if (targetFormat === "ico") {
      return ["-i", inputName, "-vf", "scale=256:256", outputName];
    }
    return ["-i", inputName, outputName];
  };

  const handleConvertNow = async () => {
    const pending = files.filter((f) => f.targetFormat && f.status !== "completed");
    if (pending.length === 0) {
      toast({
        title: "Nothing to convert",
        description: "Please select a target format for at least one file.",
        variant: "destructive",
      });
      return;
    }

    setIsConverting(true);

    let ffmpeg: FFmpeg;
    try {
      toast({ title: "Loading FFmpeg…", description: "This may take a moment on first use." });
      ffmpeg = await loadFFmpeg();
    } catch {
      toast({
        title: "FFmpeg failed to load",
        description: "Could not load the conversion engine. Check your internet connection.",
        variant: "destructive",
      });
      setIsConverting(false);
      return;
    }

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file.targetFormat || file.status === "completed") continue;

      try {
        updateFile(i, 0, "converting");

        const inputName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
        const outputName = `output_${i}.${file.targetFormat}`;
        const fileType = file.file.type.split("/")[0];

        // Track progress for this file
        ffmpeg.on("progress", ({ progress }) => {
          updateFile(i, Math.min(Math.round(progress * 100), 99), "converting");
        });

        const fileBuffer = await file.file.arrayBuffer();
        await ffmpeg.writeFile(inputName, new Uint8Array(fileBuffer));

        const args = getFFmpegArgs(inputName, outputName, fileType, file.targetFormat);
        await ffmpeg.exec(args);

        const data = await ffmpeg.readFile(outputName) as Uint8Array;
        await ffmpeg.deleteFile(inputName);
        await ffmpeg.deleteFile(outputName);

        const baseName = file.name.substring(0, file.name.lastIndexOf(".")) || file.name;
        const mimeType = `${fileType}/${file.targetFormat}`;
        downloadFile(data, `${baseName}.${file.targetFormat}`, mimeType);

        updateFile(i, 100, "completed");
        toast({ title: "Done!", description: `${file.name} converted successfully.` });
      } catch (err) {
        updateFile(i, 0, "error");
        const msg = err instanceof Error ? err.message : "Unknown error";
        toast({
          title: "Conversion failed",
          description: `${file.name}: ${msg}`,
          variant: "destructive",
        });
      }
    }

    setIsConverting(false);
  };

  return (
    <div className="mt-5">
      <div
        {...getRootProps({
          className:
            "lg:mx-52 mx-10 py-28 border dropzone flex flex-col items-center justify-center cursor-pointer hover:border-violet-500 transition-colors",
        })}
      >
        <FiUploadCloud className="w-10 h-10 mb-2" />
        <input {...getInputProps()} />
        <p>
          Drag & drop your files here, or click to{" "}
          <span className="text-violet-800 cursor-pointer">select</span> files
        </p>
        <p className="text-sm text-gray-500 mt-1">Images, Audio, Video — up to 500MB each</p>
      </div>

      {files.length > 0 && (
        <div className="mt-5 lg:mx-52 max-sm:m-10 sm:mx-10 items-center justify-center py-10 uploaded-files">
          {files.map((file, index) => (
            <div key={index} className="pb-4 border flex flex-col max-sm:gap-5">
              <div className="flex items-center max-sm:flex max-sm:flex-col max-sm:gap-5">
                <div className="p-5 flex-1">
                  <span id="FileName" className="flex items-center gap-1">
                    {file.type.startsWith("image/") && <FcAddImage className="min-w-5 min-h-5" />}
                    {file.type.startsWith("application/") && <FcDocument className="min-w-5 min-h-5" />}
                    {file.type.startsWith("audio/") && <FcAudioFile className="min-w-5 min-h-5" />}
                    {file.type.startsWith("video/") && <FcVideoFile className="min-w-5 min-h-5" />}
                    <span className="truncate max-w-xs">
                      {file.name.length > 40
                        ? file.name.slice(0, 10) + "....." + file.name.slice(-10)
                        : file.name}
                    </span>
                    <small className="text-gray-500 whitespace-nowrap">({formatFileSize(file.size)})</small>
                  </span>
                </div>

                <div className="flex items-center gap-5 p-2">
                  <Select
                    onValueChange={(value) => handleFormatChange(index, value)}
                    disabled={file.status === "converting" || isConverting}
                  >
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Select Format" />
                    </SelectTrigger>
                    <SelectContent>
                      {file.type.startsWith("image/") && (
                        <div className="grid grid-cols-2 gap-1 p-1">
                          <SelectGroup>
                            <SelectItem value="jpeg">JPEG</SelectItem>
                            <SelectItem value="png">PNG</SelectItem>
                            <SelectItem value="jpg">JPG</SelectItem>
                            <SelectItem value="gif">GIF</SelectItem>
                            <SelectItem value="webp">WEBP</SelectItem>
                            <SelectItem value="bmp">BMP</SelectItem>
                            <SelectItem value="ico">ICO</SelectItem>
                          </SelectGroup>
                          <SelectGroup>
                            <SelectItem value="tiff">TIFF</SelectItem>
                            <SelectItem value="svg">SVG</SelectItem>
                            <SelectItem value="pdf">PDF</SelectItem>
                            <SelectItem value="heif">HEIF</SelectItem>
                            <SelectItem value="psd">PSD</SelectItem>
                            <SelectItem value="raw">RAW</SelectItem>
                            <SelectItem value="eps">EPS</SelectItem>
                          </SelectGroup>
                        </div>
                      )}
                      {file.type.startsWith("audio/") && (
                        <SelectGroup>
                          <SelectItem value="mp3">MP3</SelectItem>
                          <SelectItem value="wav">WAV</SelectItem>
                          <SelectItem value="ogg">OGG</SelectItem>
                          <SelectItem value="flac">FLAC</SelectItem>
                          <SelectItem value="aiff">AIFF</SelectItem>
                          <SelectItem value="m4a">M4A</SelectItem>
                          <SelectItem value="wma">WMA</SelectItem>
                          <SelectItem value="aac">AAC</SelectItem>
                        </SelectGroup>
                      )}
                      {file.type.startsWith("video/") && (
                        <SelectGroup>
                          <SelectItem value="mp4">MP4</SelectItem>
                          <SelectItem value="avi">AVI</SelectItem>
                          <SelectItem value="mov">MOV</SelectItem>
                          <SelectItem value="wmv">WMV</SelectItem>
                          <SelectItem value="mkv">MKV</SelectItem>
                          <SelectItem value="flv">FLV</SelectItem>
                          <SelectItem value="webm">WEBM</SelectItem>
                          <SelectItem value="mpeg">MPEG</SelectItem>
                        </SelectGroup>
                      )}
                    </SelectContent>
                  </Select>

                  <Button
                    variant="outline"
                    onClick={() => handleDelete(index)}
                    disabled={file.status === "converting" || isConverting}
                    className="px-2.5 rounded-full bg-violet-900 hover:text-white text-white hover:bg-violet-700 disabled:opacity-50"
                  >
                    <MdDelete />
                  </Button>
                </div>
              </div>

              {/* Progress */}
              {file.status === "converting" && (
                <div className="px-5 pb-3">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-violet-600 h-2.5 rounded-full transition-all duration-300"
                      style={{ width: `${file.progress}%` }}
                    />
                  </div>
                  <small className="text-gray-500 mt-1 block">Converting… {file.progress}%</small>
                </div>
              )}
              {file.status === "completed" && (
                <div className="px-5 pb-3">
                  <small className="text-green-600">✓ Conversion complete — file downloaded</small>
                </div>
              )}
              {file.status === "error" && (
                <div className="px-5 pb-3">
                  <small className="text-red-600">✗ Conversion failed</small>
                </div>
              )}
            </div>
          ))}

          <div className="flex items-center gap-4 mt-6 px-2">
            <Button
              variant="default"
              onClick={handleConvertNow}
              disabled={isConverting}
              className="bg-violet-900 hover:bg-violet-700"
            >
              {isConverting ? "Converting…" : "Convert Now"}
            </Button>

            {files.length > 1 && (
              <Button variant="destructive" onClick={handleDeleteAll} disabled={isConverting}>
                Delete All
              </Button>
            )}
          </div>
        </div>
      )}
      <Toaster />
    </div>
  );
};

export default Dropzone;
