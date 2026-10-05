     {/*<div className={'flex justify-between ml-2 w-36'}>*/}
                        {/*    <SlideOver*/}
                        {/*        showButton={isNeedApprove}*/}
                        {/*        title="Approval Trail">*/}
                        {/*        <TreeList*/}
                        {/*            url={approval_url}*/}
                        {/*        />*/}
                        {/*    </SlideOver>*/}
                        {/*</div>*/}


MAIL_MAILER=smtp
MAIL_HOST=smtp.googlemail.com
MAIL_PORT=465
MAIL_USERNAME=bonifacemwandobo@gmail.com
MAIL_PASSWORD=jmaqmbgzmyqqgfkm
MAIL_ENCRYPTION=ssl
MAIL_FROM_ADDRESS="flex@projects.com"
MAIL_FROM_NAME="Flex Projects"
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_DEFAULT_REGION=us-east-1
AWS_BUCKET=
AWS_USE_PATH_STYLE_ENDPOINT=false


"use client"

import React from "react"
import { useGlobalContextHook } from "@/hooks/useGlobalContextHook"
import { ArrowLeftFromLine, ArrowRightFromLine } from "lucide-react"

interface Props {
children: React.ReactNode
}

function MainComponentWrapper({ children }: Props) {
const { state, dispatch } = useGlobalContextHook()
const { isSideBarHidden } = state

    const toggleSideBar = () => {
        dispatch({ type: "UPDATE_HIDE_SIDEBAR" })
    }

    return (
        <div className="md:flex w-full flex-col relative">
            {/* Toggle button - only on md and larger screens */}
            <button
                onClick={toggleSideBar}
                className="hidden md:flex absolute top-3 left-3 z-10 p-1.5 rounded-md bg-white border shadow-sm hover:bg-gray-100 transition"
                aria-label={isSideBarHidden ? "Show sidebar" : "Hide sidebar"}
            >
                {isSideBarHidden ? (
                    <ArrowRightFromLine size={20} strokeWidth={2} className="text-gray-600" />
                ) : (
                    <ArrowLeftFromLine size={20} strokeWidth={2} className="text-gray-600" />
                )}
            </button>

            <div className="bg-gray-200 pt-6 pb-2 px-4 md:w-[75vw] lg:w-full">
                <div className="bg-white p-3 w-full h-[85vh] overflow-auto rounded-md">
                    {children}
                </div>
            </div>
        </div>
    )
}

export default MainComponentWrapper
