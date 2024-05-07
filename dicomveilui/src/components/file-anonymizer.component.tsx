import React from "react";
import { fileElement, fileStatus } from "../hooks/useFiles.hook";

export type FileAnonymizerProps = {
    files: fileElement[];
    removeFile: (id: string) => void;
    anonymizeFiles: (ids: string[]) => void;
    downloadFiles: (ids: string[]) => void;
    clearFiles: () => void;
}

export const FileAnonymizer = (props: FileAnonymizerProps) => {
    const handleAnonymization = () => {
        const filesToAnonymize = props?.files
            ?.filter(file => file.status === fileStatus.UPLOADED)
            ?.map(file => file.index);
        props.anonymizeFiles(filesToAnonymize);
    }
    const handleDownload = () => {
        const filesToDonwload = props?.files
            ?.filter(file => file.status === fileStatus.ANONYMIZED)
            ?.map(file => file.index);
        props.downloadFiles(filesToDonwload);
    }
    return (
        <div className="p-4 w-full h-full border border-blue-700">
            {
                props.files?.map((current) =>
                    <React.Fragment key={current.index} >
                        <p>{current.file.name}</p>
                    </React.Fragment>
                )
            }
            <button
                className="block p-4 bg-blue-700  text-white m-2"
                onClick={handleAnonymization}
            >Anonymize All</button>
            <button
                className="block p-4 bg-blue-700 text-white m-2"
                onClick={handleDownload}
            >Dowload All</button>
        </div>
    );
}