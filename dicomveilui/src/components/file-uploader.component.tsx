import { ChangeEvent, useEffect, useRef, useState } from "react";
import JSZip from 'jszip';
import { ErrorScreen } from "./error-screen.component";

export type FileUploaderProps = {
    addFile: (file: File) => void;
    postUploading: () => void;
}

const zipTypes = [
    'application/zip',
    'application/x-zip-compressed'
];

export const FileUploader = (props: FileUploaderProps) => {
    const [error, setError] = useState<string | null>(null);
    const [timeoutId, setTimeoutId] = useState<ReturnType<typeof setTimeout> | null>(null);
    useEffect(() => {
        if (error !== null) {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
            const id = setTimeout(() => {
                setError(null);
            }, 3000);
            setTimeoutId(id);
        }
        return () => {
            if (timeoutId) clearTimeout(timeoutId);
        }
    }, [error]);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const handleFileInputClick = () => {
        if (fileInputRef.current) fileInputRef.current.click();
    };
    const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
        const file = event?.target?.files?.[0];
        if (!file) {
            setError("Can't load file");
            if (fileInputRef.current) fileInputRef.current.value = '';
            props.postUploading();
            return false;
        }
        if (!(zipTypes.includes(file.type))) {
            if (!file.name.toLowerCase().endsWith('.dcm')) {
                setError('Upload a valid dcm or zip file');
                if (fileInputRef.current) fileInputRef.current.value = '';
                props.postUploading();
                return false;
            }
            props.addFile(file);
            if (fileInputRef.current) fileInputRef.current.value = '';
            props.postUploading();
            return false;
        }
        const zip = new JSZip();
        const contents = await zip.loadAsync(file);
        contents.forEach(async (_, jsZipObject) => {
            if (!jsZipObject.dir) {
                const blob = await jsZipObject.async("blob");
                if (!blob) {
                    setError("Can't load file");
                    if (fileInputRef.current) fileInputRef.current.value = '';
                    props.postUploading();
                    return false;
                }
                const file = new File([blob], jsZipObject.name, { type: blob.type });
                if (!file) {
                    setError("Can't load file");
                    if (fileInputRef.current) fileInputRef.current.value = '';
                    props.postUploading();
                    return false;
                }
                props.addFile(file);
            }
        });
        if (fileInputRef.current) fileInputRef.current.value = '';
        props.postUploading();
    };
    return (
        <>
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
            {
                error ? <ErrorScreen error={error} /> : null
            }

        </>
    );
}