export const ErrorScreen = ({ error }: { error: string }) => (
    <div className="fixed z-40 inset-0 w-dvw h-dvh bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-10 grid grid-cols-1 justify-items-center items-center">
        <div className="rounded-lg p-8 bg-red-100 border-4 border-red-800 text-red-800 text-xl font-black hover:scale-110 flex flex-wrap gap-4 items-center">
            <i className="fa fa-exclamation-circle text-4xl" aria-hidden="true"></i>
            {
                error
            }
        </div>
    </div>
)