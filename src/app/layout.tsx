import type {Metadata} from "next";
import {Inter} from "next/font/google";
import "./globals.css";
import {GlobalContextProvider} from "@/context/GlobalContext";
import React from "react";
import HydrationZustand from "@/app/Hydrated";
import Header from "@/components/header";
import {Sidebar} from "lucide-react";
import MainComponentWrapper from "@/components/sidebar/main-component-wrapper";
import Footer from "@/components/footer";
import {ToastContainer} from "react-toastify";
import SlideOverRender from "@/components/slide-over/slide-over-render.component";
const inter = Inter({subsets: ["latin"]});

export const metadata: Metadata = {
    title: "Project Management System",
    description: "The Software System to Manage Projects",
    icons: {
        icon: [
            {rel: "icon", url: "/favicon.ico"}, // Standard favicon
            {rel: "icon", type: "image/png", sizes: "32x32", url: "/favicon-32x32.png"},
            {rel: "icon", type: "image/png", sizes: "16x16", url: "/favicon-16x16.png"},
        ],
        apple: "/apple-touch-icon.png",
    },
};

interface Props {
    children: React.ReactNode
}


export default function RootLayout({children}: Props) {

    return (
        <html lang="en">
        <body className={`${inter.className} `}>
        <div className="bg-gray-200 ">
            <HydrationZustand>
                <GlobalContextProvider>
                    <div className={'flex flex-col'}>
                        <div className={'flex w-full flex-col'}>
                            <Header/>
                            <div className={'flex flex-col md:flex-row w-full'}>
                                <Sidebar/>
                                <MainComponentWrapper>
                                    {children}
                                </MainComponentWrapper>
                            </div>
                        </div>
                        <Footer/>
                        <SlideOverRender/>
                        <ToastContainer />
                    </div>
                </GlobalContextProvider>
            </HydrationZustand>
        </div>
        {/* </div> */}
        </body>
        </html>
    );
}
