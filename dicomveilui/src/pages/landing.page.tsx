import { Link } from "@tanstack/react-router";

export const LandingPage = () => {
    return (
        <main className="m-4 grid gap-4 place-items-center dark:bg-black dark:text-white">
            <header className="max-w-lg w-full">
                <h1 className="text-3xl font-black">Welcome to <span className="text-blue-700">DICOMVeil</span></h1>
                <h2 className="text-xl">Secure, Efficient, and Reliable DICOM Anonymization.</h2>
            </header>
            <section className="max-w-lg w-full">
                <h3 className="text-xl font-black">Protect Patient Privacy with Advanced Anonymization</h3>
                <p>In the realm of medical imaging, protecting patient privacy is paramount. DICOMVeil offers a robust solution for anonymizing DICOM (Digital Imaging and Communications in Medicine) files, ensuring that sensitive patient information is securely removed to uphold privacy standards and comply with health information privacy laws.</p>
                <div className="my-8">
                    <h3 className="text-xl font-black">Features</h3>
                    <ul>
                        <li><span className="font-black">Batch Processing:</span> Effortlessly handle large volumes of DICOM files with our powerful batch processing capabilities.</li>
                        <li><span className="font-black">Customizable Anonymization Options:</span> Tailor the anonymization process to meet specific regulatory requirements or personal preferences.</li>
                        <li><span className="font-black">Real-Time Feedback:</span> Get instant insights into the anonymization process with a progress dashboard that keeps you informed every step of the way.</li>
                    </ul>
                </div>
                <Link
                    className="bg-blue-700 text-white font-black p-4 rounded-xl hover:scale-105"
                    to="/anonymizer"
                >
                    Anonymize Files!
                </Link>
            </section>
            <footer className="my-8 w-full max-w-lg text-sm">
                ©2024 <a className="text-blue-500 underline" href="https://github.com/Alkhioz">Ale Mendoza</a>
            </footer>
        </main>
    );
}