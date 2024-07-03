import { useMemo, useRef, useState } from "react";
import { FileAnonymizer } from "@components/file-anonymizer.component";
import { FileUploader } from "@components/file-uploader.component";
import { MainLayout } from "@components/layout/main-layout.component"
import { TripleLayout } from "@components/layout/triple-layout.component";
import { ProfileConfiguration, controlInputsRefType } from "@components/profile-configuration.component";
import { fileStatus, useFiles } from "@hooks/useFiles.hook";
import { v4 as uuidv4 } from 'uuid';
import { downloadFileToBrowser } from "@utils/file-download.util";
import JSZip from 'jszip';
import { useDicom } from "@hooks/useDicom/useDicom.hook";
import { AnonymizationAction, DicomTag, DicomTagKey } from "@hooks/useDictionary/dictionary/dicom.dictionary";
import { useDictionary } from "@hooks/useDictionary/useDictionary.hook";
import { LoadingScreen } from "@components/loading-screen.component";

export const AnonymizerPage = () => {
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
    const defaultData: controlInputsRefType = useMemo(() => {
        let data: any = {};
        for (const tag of dummyAction) {
            data = {
                ...data,
                [tag.name]: {
                    checked: true,
                    input: tag.dummy
                }
            }
        }
        for (const tag of zeroOrDummyAction) {
            data = {
                ...data,
                [tag.name]: {
                    checked: true,
                    input: tag.dummy
                }
            }
        }
        for (const tag of removeAction) {
            data = {
                ...data,
                [tag.name]: {
                    checked: true,
                    input: undefined
                }
            }
        }
        return data;
    }, [dummyAction, zeroOrDummyAction, removeAction]);

    const controlInputsRef = useRef<controlInputsRefType>(defaultData);
    const { handleRemoveUpdateTags, handleGetTags } = useDicom();
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

    const actions = Object.keys(defaultData)?.map((tag) => ({
        key: tag as DicomTagKey,
        value: defaultData[tag]?.input,
    }));

    const anonymizeFilesHandler = async (ids: string[]) => {
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
                    const data = await handleGetTags(anonymizedFile, [
                        DicomTagKey.PatientName,
                    ]);
                    console.log('data:', data);
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
                        controlInputsRef={controlInputsRef}
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