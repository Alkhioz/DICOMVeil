import { Link } from "@tanstack/react-router";
import { PropsWithChildren } from "react";

export const MainLayout: React.FC<PropsWithChildren<unknown>> = ({ children }) => {

    return (
        <div className="w-dvw h-dvh dark:bg-black dark:text-white flex flex-col">
            <nav className="bg-blue-700 p-2 text-white">
                <ul>
                    <li>
                        <Link to="/">DICOMViel</Link>
                    </li>
                </ul>
            </nav>
            <main className="flex-grow">
                {children}
            </main>
        </div>
    );
}