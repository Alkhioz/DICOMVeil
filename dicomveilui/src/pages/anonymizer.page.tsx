import { useMemo } from "react";
import { FileAnonymizer } from "../components/file-anonymizer.component";
import { FileUploader } from "../components/file-uploader.component";
import { MainLayout } from "../components/layout/main-layout.component"
import { TripleLayout } from "../components/layout/triple-layout.component";
import { ProfileConfiguration } from "../components/profile-configuration.component";
import { fileStatus, useFiles } from "../hooks/useFiles.hook";
import { v4 as uuidv4 } from 'uuid';
import { downloadFileToBrowser } from "../utils/file-download.util";
import JSZip from 'jszip';
import { useDicom } from "../hooks/useDicom/useDicom.hook";

export const AnonymizerPage = () => {
    const { handleSetTagValue, handleGetTagValue } = useDicom();
    const { files, addFile, removeFile, anonymizeFile, downloadFile, clearFiles } = useFiles();
    const newFiles = useMemo(() =>
        files?.filter(file => file.status === fileStatus.UPLOADED)
        , [files, files?.length]);
    const anonymizedFiles = useMemo(() =>
        files?.filter(file => file.status === fileStatus.ANONYMIZED)
        , [files, files?.length]);

    const addNewFile = (file: File) => {
        addFile({
            file,
            index: uuidv4(),
            status: fileStatus.UPLOADED
        });
    }

    const anonymizeFilesHandler = async (ids: string[]) => {
        const filesToAnonymize = newFiles?.filter(file => ids?.includes(file.index));
        if (!filesToAnonymize || filesToAnonymize?.length === 0) return false;
        for (const current of filesToAnonymize) {
            const anonymizedBuffer = await handleSetTagValue(current.file, [
                {
                    "group": 16,
                    "element": 16,
                    "value": "Anonymized^Test"
                }
            ]);
            if(anonymizedBuffer){
                const anonymizedFile = new Blob([anonymizedBuffer]);
                anonymizeFile({
                    index: current.index,
                    anonymizedFile,
                });
                const name = await handleGetTagValue(anonymizedFile, 'PatientName');
                console.log('PatientName', name);
            }
        }
    }

    const donwloadFilesHandler = (ids: string[]) => {
        const filesToDownload = anonymizedFiles?.filter(file => ids?.includes(file.index));
        if (!filesToDownload || filesToDownload?.length === 0) return false;
        if(filesToDownload?.length === 1) {
            const current = filesToDownload[0];
            const anonymizedFile = current.anonymizedFile;
            if(anonymizedFile){
                downloadFileToBrowser(anonymizedFile, current.file.name);
                downloadFile(current.index);
            }
            return false;
        }
        const zip = new JSZip();
        for (const current of filesToDownload) {
            zip.file(current.file.name, current.file);
            downloadFile(current.index);
        }
        zip.generateAsync({ type: "blob" }).then((content) => {
            downloadFileToBrowser(content, `anonymized_dicom_${Date.now()}.zip`);
        });
    }

    return (
        <MainLayout>
            <TripleLayout
                sidebarTop={<FileUploader addFile={addNewFile} />}
                sidebarBottom={
                    <FileAnonymizer
                        files={files}
                        removeFile={removeFile}
                        anonymizeFiles={anonymizeFilesHandler}
                        downloadFiles={donwloadFilesHandler}
                        clearFiles={clearFiles}
                    />
                }
                mainContent={<ProfileConfiguration />}
            />
        </MainLayout>
    );
}