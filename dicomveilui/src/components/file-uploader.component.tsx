import { ChangeEvent, useRef } from "react";
import JSZip from 'jszip';

export type FileUploaderProps = {
    addFile: (file: File) => void;
}

const zipTypes = [
    'application/zip',
    'application/x-zip-compressed'
];

export const FileUploader = (props: FileUploaderProps) => {
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const handleFileInputClick = () => {
        if (fileInputRef.current) fileInputRef.current.click();
    };
    const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
        const file = event?.target?.files?.[0];
        if (!file) return false;
        if (!(zipTypes.includes(file.type))) {
            if(!file.name.toLowerCase().endsWith('.dcm')) return false;
            props.addFile(file);
            if (fileInputRef.current) fileInputRef.current.value = '';
            return false;
        }
        const zip = new JSZip();
        const contents = await zip.loadAsync(file);
        contents.forEach(async (_, jsZipObject) => {
            if (!jsZipObject.dir) {
                const blob = await jsZipObject.async("blob");
                if (!blob) return false;
                const file = new File([blob], jsZipObject.name, { type: blob.type });
                if (!file) return false;
                props.addFile(file);
            }
        });
        if (fileInputRef.current) fileInputRef.current.value = '';
    };
    return (
        <div className="p-4 w-full h-full border border-blue-700">
            <input
                type="file"
                className='hidden'
                ref={fileInputRef}
                onChange={handleFileChange}
            />
            <button
                className="p-2 w-full h-full select-none hover:scale-105"
                onClick={handleFileInputClick}
            >
                <div className="grid auto-rows-min gap-4">
                    <i className="fa fa-upload text-3xl" aria-hidden="true"></i>
                    Upload Images
                </div>
            </button>
        </div>
    );
}