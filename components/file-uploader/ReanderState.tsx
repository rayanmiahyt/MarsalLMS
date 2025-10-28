import { cn } from "@/lib/utils";
import { CloudUploadIcon, ImageIcon, Loader2, XIcon } from "lucide-react";
import { Button } from "../ui/button";
import Image from "next/image";

export default function ReanderEmptyState({
  isDragActive,
}: {
  isDragActive: boolean;
}) {
  return (
    <div className="text-center">
      <div className="flex items-center mx-auto justify-center size-12 rounded-full bg-muted mb-4">
        <CloudUploadIcon
          className={cn(
            "size-6 text-muted-foreground ",
            isDragActive && "text-primary"
          )}
        />
      </div>
      <p className="text-base font-semibold text-foreground">
        Drop your files here or{" "}
        <span className="text-primary font-bold cursor-pointer">
          Click To Upload
        </span>
      </p>
      <Button type="button" className="mt-4 ">
        Select File
      </Button>
    </div>
  );
}

export function ReanderErrorState() {
  return (
    <div className=" text-center">
      <div className="flex items-center mx-auto justify-center size-12 rounded-full bg-destructive/30  mb-4">
        <ImageIcon className={cn("size-6 text-destructive ")} />
      </div>
      <p className="text-base font-semibold ">Upload Faield</p>
      <p className="text-xs mt-1 text-muted-foreground">Sumthing went wrong </p>
      <Button type="button" className="mt-4">
        Retry File Selection
      </Button>
    </div>
  );
}

export function RenderUploadedState({
  prevjewUrl,
  isDeleting,
  handaleRemoveFile,
  fileTypeAcepted,
}: {
  prevjewUrl: string;
  isDeleting: boolean;
  handaleRemoveFile: () => void;
  fileTypeAcepted: "image" | "video";
}) {
  return (
    <div className="relative group w-full h-full flex items-center justify-center">
      {fileTypeAcepted === "video" ? (
        <video src={prevjewUrl} controls className="rounded-md w-full h-full" />
      ) : (
        <Image
          src={prevjewUrl}
          alt="uploadet image"
          fill
          className="object-contain p-2"
        />
      )}

      <Button
        variant={"destructive"}
        size={"icon"}
        className={cn("absolute top-4 right-4 ")}
        onClick={handaleRemoveFile}
        disabled={isDeleting}
      >
        {isDeleting ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <XIcon className="size-4" />
        )}
      </Button>
    </div>
  );
}

export function ReanderUploadingState({
  progress,
  file,
}: {
  progress: number;
  file: File;
}) {
  return (
    <div className="text-center flex justify-center items-center flex-col">
      <p>{progress}</p>
      <p className="mt-2 text-sm font-medium text-foreground">Uploading...</p>
      <p className="mt-1 text-xs text-muted-foreground truncate max-w-xs">
        {file.name}
      </p>
    </div>
  );
}
