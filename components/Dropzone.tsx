import { useDropzone } from "react-dropzone";
import { useState } from "react";
import { useToast } from "../hooks/use-toast";
import { Toaster } from "../components/ui/toaster";
import { FiUploadCloud } from "react-icons/fi";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";

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
      "audio/*": [".mp3", ".wav", ".ogg", ".flac", ".aiff", ".m4a"],
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

  return (
    <div className="mt-5">
      <div {...getRootProps({ className: "mx-10 py-28 border dropzone flex flex-col items-center justify-center" })}>
        <FiUploadCloud className="w-10 h-10 mb-2" />
        <input {...getInputProps()} />
        <p>Drag & drop your files here, or click to <span className="text-violet-800 cursor-pointer">select</span> files</p>
      </div>
      <div className="mt-5">
        {files.map((file, index) => (
          <div key={index} className="border p-2 mb-2 flex justify-between items-center">
            <div className="">
              <p><strong>Name:</strong> {file.name}</p>
              <p><strong>Format:</strong> {file.type}</p>
              <p><strong>Size:</strong> {(file.size / 1024).toFixed(2)} KB</p>
              <label htmlFor={`format-${index}`}><strong>Convert to:</strong></label>

              <DropdownMenu>
                <DropdownMenuTrigger className="ml-2 border p-1">Choose...</DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>Select format</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onSelect={() => handleFormatChange(index, "jpeg")}>JPEG</DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => handleFormatChange(index, "png")}>PNG</DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => handleFormatChange(index, "pdf")}>PDF</DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => handleFormatChange(index, "mp3")}>MP3</DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => handleFormatChange(index, "mp4")}>MP4</DropdownMenuItem>
                  {/* Add more options as needed */}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <button
              onClick={() => handleDelete(index)}
              className="ml-4 bg-red-500 text-white p-1 rounded"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
      <Toaster />
    </div>
  );
};

export default Dropzone;