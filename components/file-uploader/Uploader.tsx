"use client";
import { useCallback, useEffect, useState } from "react";
import { FileRejection, useDropzone } from "react-dropzone";
import { Card, CardContent } from "../ui/card";
import { cn } from "@/lib/utils";
import ReanderEmptyState, {
  ReanderErrorState,
  ReanderUploadingState,
  RenderUploadedState,
} from "./ReanderState";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

interface UplotedState {
  id: string | null;
  file: File | null;
  uploading: boolean;
  progress: number;
  key?: string;
  isDeleting: boolean;
  error: boolean;
  objectUrl?: string;
  fileType: "image" | "video";
}

interface IAppProps {
  value?: string;
  onChange?: (value: string) => void;
}

export default function Uploader({ value, onChange }: IAppProps) {
  const [fileState, setFileState] = useState<UplotedState>({
    error: false,
    file: null,
    id: null,
    uploading: false,
    progress: 0,
    isDeleting: false,
    fileType: "image",
    key: value,
  });

  async function uploadFile(file: File) {
    setFileState((prev) => ({
      ...prev,
      uploading: true,
      progress: 0,
    }));

    try {
      const res = await fetch("/api/s-three/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },

        body: JSON.stringify({
          fileName: file.name,
          contentType: file.type,
          size: file.size,

          isImage: true,
        }),
      });

      if (!res.ok) {
        toast.error("Faild to get presined url");
        setFileState((prev) => ({
          ...prev,
          uploading: false,
          progress: 0,
          error: true,
        }));

        return;
      }

      const { presignedUrl, key } = await res.json();

      await new Promise<void>((resolve, reject) => {
        const xsr = new XMLHttpRequest();
        xsr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const persentesComplited = (event.loaded / event.total) * 100;
            setFileState((prev) => ({
              ...prev,

              progress: Math.round(persentesComplited),
            }));
          }
        };
        xsr.onload = () => {
          if (xsr.status === 200 || xsr.status === 204) {
            setFileState((prev) => ({
              ...prev,
              uploading: false,
              progress: 100,
              key: String(key),
            }));
            onChange?.(key);

            toast.success("File uploaded sucessfully ");
            resolve();
          } else {
            toast.error("Upload field...");
          }
        };
        xsr.onerror = () => {
          reject(new Error("Upload filed...."));
        };

        xsr.open("PUT", String(presignedUrl));
        console.log("p", presignedUrl);

        xsr.setRequestHeader("Content-Type", file.type);

        xsr.send(file);
      });
    } catch (error) {
      toast.error("Sumthing went wrong on upload file");

      console.log("error", error);

      setFileState((prev) => ({
        ...prev,
        uploading: false,
        progress: 0,
        error: true,
      }));
    }
  }

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];

        if (fileState.objectUrl && !fileState.objectUrl.startsWith("http")) {
          URL.revokeObjectURL(fileState.objectUrl);
        }

        setFileState({
          file,
          uploading: false,
          progress: 0,
          objectUrl: URL.createObjectURL(file),
          error: false,
          id: uuidv4(),
          isDeleting: false,
          fileType: "image",
        });

        uploadFile(file);
      }
    },
    [fileState.objectUrl]
  );

  async function handaleRemoveFile() {
    if (fileState.isDeleting || !fileState.objectUrl) return;

    try {
      setFileState((prev) => ({
        ...prev,
        isDeleting: true,
      }));

      console.log("key", fileState.key);
      const res = await fetch("/api/s-three/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: fileState.key }),
      });

      if (!res.ok) {
        toast.error("Field to remove file from storage");
        setFileState((prev) => ({
          ...prev,
          isDeleting: true,
          error: true,
        }));

        return;
      }
      if (fileState.objectUrl && !fileState.objectUrl.startsWith("http")) {
        URL.revokeObjectURL(fileState.objectUrl);
      }

      onChange?.("");

      setFileState(() => ({
        file: null,
        uploading: false,
        progress: 0,
        objectUrl: undefined,
        error: false,
        fileType: "image",
        id: null,
        isDeleting: false,
      }));

      return toast.success("file remove sucessfully");
    } catch {
      toast.error("Sumthing went wrong while delete the file");
      setFileState((prev) => ({
        ...prev,
        isDeleting: false,
        error: true,
      }));
    }
  }

  const regectedFiles = (fileRejection: FileRejection[]) => {
    if (fileRejection.length) {
      const toMannyFile = fileRejection.find(
        (rejection) => rejection.errors[0].code === "too-many-files"
      );

      const fileSizeToBig = fileRejection.find(
        (rejections) => rejections.errors[0].code === "file-too-large"
      );

      if (fileSizeToBig) {
        toast.error("File size is too big plige provide file less then 5 mb");
      }

      if (toMannyFile) {
        toast.error("Too manny file is selected max is 1");
      }
    }
  };

  function renderContent() {
    if (fileState.uploading) {
      return (
        <ReanderUploadingState
          file={fileState.file as File}
          progress={fileState.progress}
        />
      );
    }

    if (fileState.error) {
      return <ReanderErrorState />;
    }
    if (fileState.objectUrl) {
      return (
        <RenderUploadedState
          prevjewUrl={fileState.objectUrl}
          isDeleting={fileState.isDeleting}
          handaleRemoveFile={handaleRemoveFile}
        />
      );
    }

    return <ReanderEmptyState isDragActive={isDragActive} />;
  }

  useEffect(() => {
    return () => {
      if (fileState.objectUrl && !fileState.objectUrl.startsWith("http")) {
        URL.revokeObjectURL(fileState.objectUrl);
      }
    };
  }, [fileState.objectUrl]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [],
    },
    maxFiles: 1,
    multiple: false,
    maxSize: 5 * 1024 * 1024, //5md
    onDropRejected: regectedFiles,
    disabled: fileState.uploading || !!fileState.objectUrl,
  });

  return (
    <Card
      {...getRootProps()}
      className={cn(
        "relative border-2 border-dashed transition-colors duration-100 w-full h-64",
        isDragActive
          ? "border-primary bg-primary/10 border-solid"
          : "border-border hover:border-primary"
      )}
    >
      <CardContent className="flex items-center justify-center w-full h-full p-4">
        <input {...getInputProps()} />
        {renderContent()}
      </CardContent>
    </Card>
  );
}
