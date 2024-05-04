import React, { ReactElement } from 'react';

interface LayoutProps {
    sidebarTop: ReactElement;
    sidebarBottom: ReactElement;
    mainContent: ReactElement;
}

export const TripleLayout: React.FC<LayoutProps> = ({ sidebarTop, sidebarBottom, mainContent }) => {
    return (
        <div className="h-full w-full grid grid-cols-1 grid-rows-[auto,1fr,1fr] md:grid-cols-[auto,1fr] md:grid-rows-[auto,1fr]">
            <div className="w-full h-28 md:w-60">
                {sidebarTop}
            </div>
            <div className="w-full h-full md:row-span-2">
                {mainContent}
            </div>
            <div className="w-full h-full md:w-60">
                {sidebarBottom}
            </div>
        </div>
    );
};