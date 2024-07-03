import { MaximizedElementEnum } from '@pages/anonymizer.page';
import React, { ReactElement, useEffect } from 'react';

interface LayoutProps {
    sidebarTop: ReactElement;
    sidebarBottom: ReactElement;
    mainContent: ReactElement;
    maximized: MaximizedElementEnum | null;
    setMaximized: React.Dispatch<React.SetStateAction<MaximizedElementEnum | null>>
}

interface CoverSmallProps {
    text: string;
    onClick: () => void;
    hide: boolean;
}

const CoverSmall = ({ text, onClick, hide }: CoverSmallProps) => (
    hide ? null :
        <button
            type='button'
            onClick={onClick}
            className='md:hidden absolute top-0 w-full h-full grid grid-cols-1 justify-items-center items-center bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-30 text-4xl border border-black p-4'
        >
            <div className='font-black flex flex-wrap gap-4 justify-center'>
                <span>{text}</span>
                <i className="fa fa-eye" aria-hidden="true"></i>
            </div>
        </button>
);

interface CloseFullScreenProps {
    onClick: () => void;
    hide: boolean;
}

const CloseFullScreen = ({ onClick, hide }: CloseFullScreenProps) => (
    hide ? null :
        <button
            type='button'
            onClick={onClick}
            className='fixed bottom-0 right-0 text-4xl m-4 bg-blue-700 p-4 rounded-full grid grid-cols-1 justify-items-center items-center w-20 h-20 border border-white'
        >
            <i className="fa fa-eye-slash" aria-hidden="true"></i>
        </button>
)



export const TripleLayout: React.FC<LayoutProps> = ({ sidebarTop, sidebarBottom, mainContent, maximized, setMaximized }) => {
    
    useEffect(() => {
        const handleResize = () => {
          if (maximized !== null) {
            setMaximized(null);
          }
        };
        window.addEventListener('resize', handleResize);
        return () => {
          window.removeEventListener('resize', handleResize);
        };
      }, [maximized]);
    return (
        <div className="h-full w-full grid grid-cols-1 grid-rows-[auto,1fr,1fr] md:grid-cols-[auto,1fr] md:grid-rows-[auto,1fr] border border-blue-700">
            <div
                className={`w-full h-28 md:w-80 ${maximized === MaximizedElementEnum.SIDEBARTOP ? 'fixed top-0 left-0 w-full h-full z-40 py-10 px-2 pb-20 bg-white text-black dark:bg-black dark:text-white' : 'relative'
                    }`}
            >
                {sidebarTop}
                <CoverSmall
                    text={'File Uploader'}
                    onClick={() => {
                        setMaximized(MaximizedElementEnum.SIDEBARTOP);
                    }}
                    hide={maximized === MaximizedElementEnum.SIDEBARTOP}
                />
                <CloseFullScreen
                    onClick={() => {
                        setMaximized(null);
                    }}
                    hide={maximized !== MaximizedElementEnum.SIDEBARTOP}
                />
            </div>
            <div
                className={`w-full h-full md:row-span-2 ${maximized === MaximizedElementEnum.MAINCONTENT ? 'fixed top-0 left-0 w-full h-full z-40 py-10 px-2 pb-20 bg-white text-black dark:bg-black dark:text-white' : 'relative'
                    }`}
            >
                {mainContent}
                <CoverSmall
                    text={'Profile configuration'}
                    onClick={() => {
                        setMaximized(MaximizedElementEnum.MAINCONTENT);
                    }}
                    hide={maximized === MaximizedElementEnum.MAINCONTENT}
                />
                <CloseFullScreen
                    onClick={() => {
                        setMaximized(null);
                    }}
                    hide={maximized !== MaximizedElementEnum.MAINCONTENT}
                />
            </div>
            <div
                className={`w-full h-full md:w-80 ${maximized === MaximizedElementEnum.SIDEBARBOTTOM ? 'fixed top-0 left-0 w-full h-full z-40 py-10 px-2 pb-20 bg-white text-black dark:bg-black dark:text-white' : 'relative'
                    }`}
            >
                {sidebarBottom}
                <CoverSmall
                    text={'File Anonymizer'}
                    onClick={() => {
                        setMaximized(MaximizedElementEnum.SIDEBARBOTTOM);
                    }}
                    hide={maximized === MaximizedElementEnum.SIDEBARBOTTOM}
                />
                <CloseFullScreen
                    onClick={() => {
                        setMaximized(null);
                    }}
                    hide={maximized !== MaximizedElementEnum.SIDEBARBOTTOM}
                />
            </div>
        </div>
    );
};