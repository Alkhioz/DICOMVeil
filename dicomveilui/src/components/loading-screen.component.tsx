export const LoadingScreen = () => (
    <div className="fixed z-40 inset-0 w-dvw h-dvh bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-10 grid grid-cols-1 justify-items-center items-center">
        <div className="w-32 h-32 rounded-full bg-blue-700 grid grid-cols-1 justify-items-center items-center hover:scale-110">
            <div className="lds-spinner"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
        </div>
    </div>
)