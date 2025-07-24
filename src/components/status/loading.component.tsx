
const Loading = () => {
    return (
        <div className="w-full h-[70vh] flex flex-col items-center justify-center text-center px-4">
            <div className="animate-pulse p-2">
                <div className="flex flex-col space-y-10">
                    <img className='h-10 w-fit' src="/logo.png" alt="logo" />

                </div>
            </div>
        </div>
    )
}

export default Loading