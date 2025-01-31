import { useDropzone } from "react-dropzone";
import { useState } from "react";
import { Button } from "../components/ui/button"
import { useToast } from "../hooks/use-toast";
import { Toaster } from "../components/ui/toaster";
import { FiUploadCloud } from "react-icons/fi";
import { MdDelete } from "react-icons/md";
import { FcAddImage } from "react-icons/fc";
import { FcDocument } from "react-icons/fc";
import { FcAudioFile } from "react-icons/fc";
import { FcVideoFile } from "react-icons/fc";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectGroup,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select"

type FileType = {
  name: string;
  size: number;
  type: string;
  targetFormat: string;
};

const Dropzone = () => {
  const { toast } = useToast();
  const [files, setFiles] = useState<FileType[]>([]);

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/*": [".jpeg", ".png", ".jpg", ".gif", ".pdf", ".tiff", ".psd", ".raw", ".eps", ".webp", ".svg", ".ico", ".bmp"],
      "audio/*": [".mp3", ".wav", ".ogg", ".flac", ".aiff", ".m4a",".wma",".aac" ],
      "video/*": [".mp4", ".avi", ".mov", ".wmv", ".mkv", ".flv", ".webm",".mpeg"],
    },
    onDrop: (acceptedFiles) => {
      setFiles(prevFiles => [
        ...prevFiles,
        ...acceptedFiles.map(file => ({
        name: file.name,
        size: file.size,
        type: file.type,
        targetFormat: ""
      }))
    ]);
    },
    onDropRejected: (fileRejections) => {
      fileRejections.forEach(({ file, errors }) => {
        errors.forEach((error) => {
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
    const newFiles = [...files];
    newFiles[index].targetFormat = format;
    setFiles(newFiles);
  };

  const handleDelete = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
  };

  const handleDeleteAll = () => {
    setFiles([]);
  };
  
  const formatFileSize = (size: number) => {
    if (size >= 1024 * 1024) {
      return `${(size / (1024 * 1024)).toFixed(2)} MB`;
    } else {
      return `${(size / 1024).toFixed(2)} KB`;
    }
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
                    {file.type.startsWith("image/") && (<FcAddImage />)} 
                    {file.type.startsWith("application/") && (<FcDocument />)} 
                    {file.type.startsWith("audio/") && (<FcAudioFile />)}
                    {file.type.startsWith("video/") && (<FcVideoFile />)}
                    {file.name} {console.log(file.type)}
                    <small className="text-gray-700">({formatFileSize(file.size)})</small>
                  </span>
                  </div>
                  <div className="flex items-center gap-5 p-2">
                  <Select>
                    <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select Format" />
                    </SelectTrigger>
                    <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Select Format</SelectLabel>
                      <SelectItem value="jpeg" onSelect={() => handleFormatChange(index, "jpeg")}>JPEG</SelectItem>
                      <SelectItem value="png" onSelect={() => handleFormatChange(index, "png")}>PNG</SelectItem>
                      <SelectItem value="jpg" onSelect={() => handleFormatChange(index, "jpg")}>JPG</SelectItem>
                      <SelectItem value="svg" onSelect={() => handleFormatChange(index, "svg")}>SVG</SelectItem>
                      <SelectItem value="pdf" onSelect={() => handleFormatChange(index, "pdf")}>PDF</SelectItem>
                      <SelectItem value="ico" onSelect={() => handleFormatChange(index, "ico")}>ICO</SelectItem>
                      <SelectItem value="gif" onSelect={() => handleFormatChange(index, "gif")}>GIF</SelectItem>
                    </SelectGroup>
                    <SelectGroup>
                      <SelectItem value="tiff" onSelect={() => handleFormatChange(index, "tiff")}>TIFF</SelectItem>
                      <SelectItem value="psd" onSelect={() => handleFormatChange(index, "psd")}>PSD</SelectItem>
                      <SelectItem value="raw" onSelect={() => handleFormatChange(index, "raw")}>RAW</SelectItem>
                      <SelectItem value="eps" onSelect={() => handleFormatChange(index, "eps")}>EPS</SelectItem>
                      <SelectItem value="webp" onSelect={() => handleFormatChange(index, "webp")}>WEBP</SelectItem>
                      <SelectItem value="bmp" onSelect={() => handleFormatChange(index, "bmp")}>BMP</SelectItem>
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
              <Button variant='default' className="m-10">Convert Now</Button> {files.length > 1 && <Button variant='destructive' className="" onClick={()=>handleDeleteAll()}>Delete All</Button>}
              </div>
      )}
      <Toaster />
    </div>
  );
};

export default Dropzone;