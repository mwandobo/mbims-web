import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { GlobalContextProvider } from "@/context/GlobalContext";
import React from "react";
import HydrationZustand from "@/app/Hydrated";
import MainComponentWrapper from "@/components/sidebar/main-component-wrapper";
import { ToastContainer } from "react-toastify";
import SlideOverRender from "@/components/slide-over/slide-over-render.component";
import Footer from "@/components/footer/footer.component";
import Header from "@/components/header/header.component";
import Sidebar from "@/components/sidebar/sidebar";
import AuthenticatedApp from "@/components/authentication/authenticated-app";
import ThemeProvider from "@/components/theme/theme-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "MCB Internal Management System",
    description: "The Software System to Manage Projects",
    icons: {
        icon: [
            { rel: "icon", url: "/favicon.ico" },
            { rel: "icon", type: "image/png", sizes: "32x32", url: "/favicon-32x32.png" },
            { rel: "icon", type: "image/png", sizes: "16x16", url: "/favicon-16x16.png" },
        ],
        apple: "/apple-touch-icon.png",
    },
};

interface Props {
    children: React.ReactNode;
}

export default function RootLayout({ children }: Props) {
    return (
        <html lang="en" suppressHydrationWarning>
        <head>
            <script
                dangerouslySetInnerHTML={{
                    __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme') || 'brand';
                  var root = document.documentElement;
                  root.classList.remove('light', 'dark');
                  if (theme === 'light') root.classList.add('light');
                  if (theme === 'dark') root.classList.add('dark');
                } catch (e) {}
              })();
            `,
                }}
            />
        </head>
        <body>
        <div className="bg-background min-h-screen">
            <ThemeProvider>
                <AuthenticatedApp>
                    <HydrationZustand>
                        <GlobalContextProvider>
                            <div className="flex flex-col min-h-screen">
                                <Header />
                                <div className="flex flex-1 flex-col md:flex-row w-full text-foreground">
                                    <Sidebar />
                                    <MainComponentWrapper>{children}</MainComponentWrapper>
                                </div>
                                <Footer />
                                <SlideOverRender />
                                <ToastContainer />
                            </div>
                        </GlobalContextProvider>
                    </HydrationZustand>
                </AuthenticatedApp>
            </ThemeProvider>
        </div>
        </body>
        </html>
    );
}