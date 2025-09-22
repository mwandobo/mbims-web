"use client"

import React from 'react'
import Loading from "@/components/status/loading.component";

type Props = {
    children: React.ReactNode;
    loading?: boolean
    subtitle?: string
    title?: string
};

function AuthSkeletonComponent({children, loading, subtitle, title}: Props) {
    return (

        <div
            className="fixed top-0 left-0 w-full h-[100vh] flex items-center justify-center z-50"
            style={{
                backgroundImage: "url('/bg-1.jpg')",
                backgroundRepeat: "repeat",
                backgroundSize: "1000px 1000px"

            }}
        >
            <div className="absolute inset-0 bg-black opacity-60 z-[-1]"></div>
            {/* Middle Gray Layer */}
            <div className="p-2 px-4 bg-gray-200 rounded-2xl">
                {/* Inner White Card */}
                <div className="grid grid-cols-1 md:grid-cols-2 p-3 h-[90vh] w-[90vw] bg-white rounded-2xl shadow-xl overflow-hidden">

                    {/* Left Section */}
                    <div className="relative h-full ps-4 pt-4 pb-4 flex flex-col">
                        {/* Logo - top left */}
                        <img src="/logo1.png" alt="Logo" className="h-16 w-24 object-contain absolute top-4 left-4"/>

                        {/* Centered Content */}
                        <div className="flex flex-1 flex-col justify-center items-center mt-16">
                            <div className="w-full max-w-md px-4">
                                {loading ? (
                                    <div className="w-full">
                                        <Loading/>
                                    </div>
                                ) : (
                                    <div className="w-full">
                                        <div className="flex flex-col items-center gap-8">
                                            <h4 className="text-4xl text-black font-semibold">{title ?? subtitle}</h4>
                                            <h4 className="text-sm font-semibold text-black">{subtitle}</h4>
                                            <div className="w-full">{children}</div>
                                        </div>

                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Footer */}
                        <p className="text-sm text-gray-500 mt-4">
                            &copy; {new Date().getFullYear()} EMASUITE. All rights reserved.
                        </p>
                    </div>

                    {/* Right Section */}
                    <div className=" hidden md:flex justify-center items-center py-2">
                        <div className="h-full bg-[#0c55d7] flex flex-col gap-8 justify-center px-8 rounded-2xl">
                            <h4 className="text-start w-full text-4xl text-white">
                                Effortlessly manage your Contracts.
                            </h4>
                            <p className="text-start w-full text-white">
                                Carry out Contracts Management, Licences , and Notifications Activities as you Accomplish your
                                Purchase.
                            </p>
                            <div className="flex">
                                <div className="rounded-md p-2 bg-white">
                                    <img src="/login_background_1.png" alt="Logo" className="object-contain"/>
                                </div>
                                <div
                                    className="z-10 -ms-28 mt-[68px] border shadow-md border-gray-200 h-fit rounded-md p-1 bg-white">
                                    <img src="/login_sub_background_3.png" alt="Logo" className="object-contain"/>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default AuthSkeletonComponent;