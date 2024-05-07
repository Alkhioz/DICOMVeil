import { FileAnonymizer } from "../components/file-anonymizer.component";
import { FileUploader } from "../components/file-uploader.component";
import { MainLayout } from "../components/layout/main-layout.component"
import { TripleLayout } from "../components/layout/triple-layout.component";
import { ProfileConfiguration } from "../components/profile-configuration.component";
import { fileStatus, useFiles } from "../hooks/useFiles.hook";
import { v4 as uuidv4 } from 'uuid';

export const AnonymizerPage = () => {
    const { files, addFile, removeFile, anonymizeFile, downloadFile, clearFiles } = useFiles();
    const addNewFile = (file: File) => {
        addFile({
            file,
            index: uuidv4(),
            status: fileStatus.UPLOADED
        });
    }
    return (
        <MainLayout>
            <TripleLayout
                sidebarTop={<FileUploader addFile={addNewFile} />}
                sidebarBottom={<FileAnonymizer files={files} />}
                mainContent={<ProfileConfiguration />}
            />
        </MainLayout>
    );
}