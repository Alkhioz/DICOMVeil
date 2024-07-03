import { fileElement, fileStatus } from "@hooks/useFiles.hook";

export type FileAnonymizerProps = {
    files: fileElement[];
    removeFile: (id: string) => void;
    anonymizeFiles: (ids: string[]) => void;
    downloadFiles: (ids: string[]) => void;
    clearFiles: () => void;
}

export const FileAnonymizer = (props: FileAnonymizerProps) => {
    const hasFilesToAnonymize = props?.files
        ?.filter(file =>
            file.status === fileStatus.UPLOADED
        )?.length > 0;
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
    const handleDelete = () => {
        const filesToDelete = props?.files
            ?.map(file => file.index);
        for (const id of filesToDelete) {
            props.removeFile(id);
        }
    }
    return (
        <div className="p-4 w-full h-full border border-blue-700 grid grid-rows-[1fr,auto]">
            <div className="relative">
                <div className="absolute w-full h-full overflow-y-scroll">
                    {
                        props.files?.map((current, idx) =>
                            <div
                                className="p-2 px-4 flex gap-2"
                                key={current.index}
                            >
                                <div className="flex-grow tooltip">
                                    <div className="md:overflow-hidden md:text-ellipsis md:text-nowrap md:max-w-32">
                                        {current.file.name}
                                    </div>
                                    <span
                                        className={
                                            idx == 0 ? "tooltiptextbottom" : "tooltiptext"
                                        }>
                                        {current.file.name}
                                    </span>
                                </div>
                                <div className="grid grid-cols-3 gap-2 items-center">
                                    <button
                                        disabled={current.status !== fileStatus.UPLOADED}
                                        type="button"
                                        className={`relative w-7 h-7 grid grid-cols-1 justify-items-center items-center rounded-full bg-blue-700 text-white p-1 ${current.status !== fileStatus.UPLOADED ? 'opacity-50' : ''
                                            }`}
                                        onClick={
                                            current.status !== fileStatus.UPLOADED ? () => { }
                                                : () => {
                                                    props.anonymizeFiles([current.index]);
                                                }
                                        }
                                    >
                                        <i className="fa fa-user-secret" aria-hidden="true"></i>
                                    </button>
                                    <button
                                        disabled={
                                            ![fileStatus.ANONYMIZED, fileStatus.DOWNLOADED].includes(current.status)
                                        }
                                        type="button"
                                        className={`w-7 h-7 grid grid-cols-1 justify-items-center items-center rounded-full bg-blue-700 text-white p-1 ${![fileStatus.ANONYMIZED, fileStatus.DOWNLOADED].includes(current.status)
                                            ? 'opacity-50' : ''
                                            }`}
                                        onClick={
                                            ![fileStatus.ANONYMIZED, fileStatus.DOWNLOADED].includes(current.status) ? () => { }
                                                : () => {
                                                    props.downloadFiles([current.index]);
                                                }
                                        }
                                    >
                                        <i className="fa fa-download" aria-hidden="true"></i>
                                    </button>
                                    <button
                                        type="button"
                                        className="w-7 h-7 grid grid-cols-1 justify-items-center items-center rounded-full bg-blue-700 text-white p-1 text-sm"
                                        onClick={() => {
                                            props.removeFile(current.index);
                                        }}
                                    >
                                        <i className="fa fa-trash" aria-hidden="true"></i>
                                    </button>
                                </div>
                            </div>
                        )
                    }
                </div>
            </div>
            <div>
                <button
                    disabled={props.files?.length === 0 || !hasFilesToAnonymize}
                    className={`w-full px-4 py-2 bg-blue-700  text-white my-2 flex gap-2 rounded-lg justify-center items-center ${props.files?.length === 0 || !hasFilesToAnonymize ? 'opacity-50' : ''}`}
                    onClick={props.files?.length === 0 || !hasFilesToAnonymize ? () => { } : handleAnonymization}
                >
                    <span className="text-xl">Anonymize All</span>
                    <i className="fa fa-user-secret" aria-hidden="true"></i>
                </button>
                <button
                    disabled={props.files?.length === 0}
                    className={`w-full px-4 py-2 bg-blue-700  text-white my-2 flex gap-2 rounded-lg justify-center items-center ${props.files?.length === 0 ? 'opacity-50' : ''}`}
                    onClick={props.files?.length === 0 ? () => { } : handleDownload}
                >
                    <span className="text-xl">Dowload All</span>
                    <i className="fa fa-download" aria-hidden="true"></i>
                </button>
                <button
                    disabled={props.files?.length === 0}
                    className={`w-full px-4 py-2 bg-blue-700  text-white my-2 flex gap-2 rounded-lg justify-center items-center ${props.files?.length === 0 ? 'opacity-50' : ''}`}
                    onClick={props.files?.length === 0 ? () => { } : handleDelete}
                >
                    <span className="text-xl">Delete All</span>
                    <i className="fa fa-trash" aria-hidden="true"></i>
                </button>
            </div>
        </div>
    );
}