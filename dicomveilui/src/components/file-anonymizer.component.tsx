import { fileElement, fileStatus } from "@hooks/useFiles.hook";

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
        <div className="p-4 w-full h-full border border-blue-700 grid grid-rows-[1fr,auto]">
            <div className="relative">
                <div className="absolute w-full h-full overflow-y-scroll">
                    {
                        props.files?.map((current) =>
                            <div
                                className="p-2 px-4 flex gap-2"
                                key={current.index}
                            >
                                <div className="flex-grow">{current.file.name}</div>
                                <button
                                    type="button"
                                    className="px-4 rounded-md bg-blue-700  text-white"
                                    onClick={()=>{
                                        props.removeFile(current.index);
                                    }}
                                >X</button>
                            </div>
                        )
                    }
                </div>
            </div>
            <div>
                <button
                    className="w-full block p-4 bg-blue-700  text-white my-2"
                    onClick={handleAnonymization}
                >Anonymize All</button>
                <button
                    className="w-full block p-4 bg-blue-700 text-white my-2"
                    onClick={handleDownload}
                >Dowload All</button>
            </div>
        </div>
    );
}