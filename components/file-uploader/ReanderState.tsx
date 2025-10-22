import { cn } from "@/lib/utils";
import {  CloudUploadIcon, ImageIcon } from "lucide-react";
import { Button } from "../ui/button";


export default function ReanderEmptyState({ isDragActive }: { isDragActive :boolean}) {
  return <div className="text-center">
    <div className="flex items-center mx-auto justify-center size-12 rounded-full bg-muted mb-4">
        <CloudUploadIcon className={cn("size-6 text-muted-foreground " ,isDragActive && "text-primary")}/>
    </div>
    <p className="text-base font-semibold text-foreground">Drop your files here or <span className="text-primary font-bold cursor-pointer">Click To Upload</span></p>
    <Button type="button" className="mt-4 ">Select File</Button>
  </div>;
}


export function ReanderErrorState (){
return (
  <div className=" text-center">
    <div className="flex items-center mx-auto justify-center size-12 rounded-full bg-destructive/30  mb-4">
      <ImageIcon className={cn("size-6 text-destructive ")} />
    </div>
    <p className="text-base font-semibold ">Upload Faield</p>
    <p className="text-xs mt-1 text-muted-foreground">Sumthing went wrong </p>
    <Button type="button" className="mt-4">Retry File Selection</Button>
  </div>
);
}