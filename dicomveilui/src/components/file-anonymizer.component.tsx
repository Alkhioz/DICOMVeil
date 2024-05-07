import React from "react";
import { fileElement } from "../hooks/useFiles.hook";

export type FileAnonymizerProps = {
    files: fileElement[];
}

export const FileAnonymizer = (props: FileAnonymizerProps) => {
    return (
        <div className="p-4 w-full h-full border border-blue-700">
            {
                props.files?.map((current) =>
                    <React.Fragment key={current.index} >
                       <p>{current.file.name}</p>
                    </React.Fragment>
                )
            }
        </div>
    );
}