import { MainLayout } from "../components/layout/main-layout.component"
import { TripleLayout } from "../components/layout/triple-layout.component";

export const AnonymizerPage = () => {
    return (
        <MainLayout>
            <TripleLayout 
                sidebarTop={<>FILE UPLOADER</>}
                sidebarBottom={<>ACTIONS</>}
                mainContent={<>CONFIGURE ANONYMIZATION PROFILE</>}
            />
        </MainLayout>
    );
}