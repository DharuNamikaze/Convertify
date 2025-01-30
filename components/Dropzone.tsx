import { useDropzone } from "react-dropzone";
import { useState } from "react";
import { Button } from "../components/ui/button"
import { useToast } from "../hooks/use-toast";
import { Toaster } from "../components/ui/toaster";
import { FiUploadCloud } from "react-icons/fi";
import { MdDelete } from "react-icons/md";
import { LiaImageSolid } from "react-icons/lia";
import { FcAddImage } from "react-icons/fc";
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
      "audio/*": [".mp3", ".wav", ".ogg", ".flac", ".aiff", ".m4a","wma","aac"],
      "video/*": [".mp4", ".avi", ".mov", ".wmv", ".mkv", ".flv", ".webm"],
    },
    onDrop: (acceptedFiles) => {
      setFiles(acceptedFiles.map(file => ({
        name: file.name,
        size: file.size,
        type: file.type,
        targetFormat: ""
      })));
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
  
  const formatFileSize = (size: number) => {
    if (size >= 1024 * 1024) {
      return `${(size / (1024 * 1024)).toFixed(2)} MB`;
    } else {
      return `${(size / 1024).toFixed(2)} KB`;
    }
  };

  return (
    <div className="mt-5">
      <div {...getRootProps({ className: "mx-52 py-28 border dropzone flex flex-col items-center justify-center" })}>
        <FiUploadCloud className="w-10 h-10 mb-2" />
        <input {...getInputProps()} />
        <p>Drag & drop your files here, or click to <span className="text-violet-800 cursor-pointer">select</span> files</p>
      </div>
      {files.length > 0 && (
              <div className="mt-5 lg:mx-52 sm:mx-10 border  py-10 uploaded-files">
              {files.map((file, index) => (
                <div key={index} className="border flex gap-20 items-center justify-center max-sm:flex max-sm:flex-col max-sm:gap-5 max-sm:justify-evenly">
                  <div className="p-5">
                    <span className="items-center justify-center flex gap-1">{file.type.startsWith("image/") && (<FcAddImage />)} {file.name}</span>
                    <small className="text-gray-700">({formatFileSize(file.size)})</small>
                    
                    {/* Add more options as needed */}
                  </div>
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
                    className=" px-2.5 rounded-full bg-violet-900 hover:text-white text-white hover:bg-violet-700 mb-4"
                  >
                    <MdDelete />
                  </Button>
                </div>
              ))}
              <Button className="m-10">Convert Now</Button>
              </div>
      )}
      <Toaster />
    </div>
  );
};

export default Dropzone;