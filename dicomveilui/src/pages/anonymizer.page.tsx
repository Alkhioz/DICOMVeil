import { FileAnonymizer } from "@components/file-anonymizer.component";
import { FileUploader } from "@components/file-uploader.component";
import { MainLayout } from "@components/layout/main-layout.component";
import { TripleLayout } from "@components/layout/triple-layout.component";
import { LoadingScreen } from "@components/loading-screen.component";
import { ProfileConfiguration } from "@components/profile-configuration.component";
import { useDicom } from "@hooks/useDicom/useDicom.hook";
import { AnonymizationAction, DicomTag, DicomTagKey } from "@hooks/useDictionary/dictionary/dicom.dictionary";
import { useDictionary } from "@hooks/useDictionary/useDictionary.hook";
import { fileStatus, useFiles } from "@hooks/useFiles.hook";
import { downloadFileToBrowser } from "@utils/file-download.util";
import JSZip from 'jszip';
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { v4 as uuidv4 } from 'uuid';

export const AnonymizerPage = () => {
    const {
        register,
        setValue,
        getValues,
    } = useForm();
    const [loading, setLoading] = useState<boolean>(false);
    const dictionary: Record<DicomTagKey, DicomTag> = useDictionary();
    const dictionaryArray: DicomTag[] = useMemo(() =>
        Object.keys(dictionary).map(key => dictionary[key as DicomTagKey]),
        [dictionary]
    );
    const dummyAction: (DicomTag & { dummy: string })[] = useMemo(() =>
        dictionaryArray.filter(
            (tag: DicomTag) => tag.action === AnonymizationAction.DUMMY
        ).map(tag =>
            ({ ...tag, dummy: uuidv4()?.split('-')?.[0] })
        ),
        [dictionaryArray]
    );
    const zeroOrDummyAction: (DicomTag & { dummy: string })[] = useMemo(() =>
        dictionaryArray.filter(
            (tag: DicomTag) => tag.action === AnonymizationAction.ZERO_OR_DUMMY
        ).map(tag =>
            ({ ...tag, dummy: uuidv4()?.split('-')?.[0] })
        ),
        [dictionaryArray]
    );
    const removeAction = useMemo(() =>
        dictionaryArray.filter(
            (tag: DicomTag) => tag.action === AnonymizationAction.REMOVE
        ),
        [dictionaryArray]
    );

    const { handleRemoveUpdateTags } = useDicom();
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
        const formValues = getValues();
        const allKeys = Object.keys(formValues)
            ?.filter(key =>
                key?.split('-')?.[1] === 'check'
            );
        const validKeys = allKeys?.filter(key=> formValues?.[key]);
        const actions = validKeys?.map((key)=>{
            const tag = key?.split('-')?.[0] as DicomTagKey;
            const value = formValues?.[`${tag}-input`];
            return {
                key: tag,
                value
            }
        });
        try {
            setLoading(true);
            const filesToAnonymize = newFiles?.filter(file => ids?.includes(file.index));
            if (!filesToAnonymize || filesToAnonymize?.length === 0) return false;
            for (const current of filesToAnonymize) {
                const anonymizedBuffer = await handleRemoveUpdateTags(current.file, actions);
                if (anonymizedBuffer) {
                    const anonymizedFile = new Blob([anonymizedBuffer]);
                    anonymizeFile({
                        index: current.index,
                        anonymizedFile: anonymizedFile,
                    });
                }
            }
            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.error(error);
        }
    }

    const donwloadFilesHandler = (ids: string[]) => {
        try {
            setLoading(true);
            const filesToDownload = anonymizedFiles?.filter(file => ids?.includes(file.index));
            if (!filesToDownload || filesToDownload?.length === 0) return false;
            if (filesToDownload?.length === 1) {
                const current = filesToDownload[0];
                const anonymizedFile = current.anonymizedFile;
                if (anonymizedFile) {
                    downloadFileToBrowser(anonymizedFile, current.file.name);
                    downloadFile(current.index);
                }
                setLoading(false);
                return false;
            }
            const zip = new JSZip();
            for (const current of filesToDownload) {
                const anonymizedFile = current.anonymizedFile;
                if (anonymizedFile) {
                    zip.file(current.file.name, anonymizedFile);
                    downloadFile(current.index);
                }
            }
            zip.generateAsync({ type: "blob" }).then((content) => {
                downloadFileToBrowser(content, `anonymized_dicom_${Date.now()}.zip`);
                setLoading(false);
            });
        } catch (error) {
            setLoading(false);
            console.error(error);
        }
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
                mainContent={
                    <ProfileConfiguration
                        register={register}
                        setValue={setValue}
                        actions={{
                            dummyAction,
                            zeroOrDummyAction,
                            removeAction,
                        }}
                    />
                }
            />
            {
                loading ? (
                    <LoadingScreen />
                ) : null
            }
        </MainLayout>
    );
}