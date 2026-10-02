"use client"

import ProtectedRoute from '@/components/authentication/protected-route'
import PageHeader from '@/components/header/page-header'
import React from 'react'
import NotificationSettings from "@/app/settings/components/notification-settings.component";
import {ButtonComponent} from "@/components/button/button.component";
import {CheckCircle2, Moon} from "lucide-react";

function Settings() {

    const toggle = () => {
        document.documentElement.classList.toggle('dark');
        localStorage.setItem(
            'theme',
            document.documentElement.classList.contains('dark') ? 'dark' : 'light'
        );
    };

    return (
        <ProtectedRoute
            isLoading={false}
        >
            <PageHeader
                handleClick={() => {}}
                links={[{name: 'Settings ', linkTo: '/Settings', permission: ''}]}
                isHideAdd={true}
            />

            <NotificationSettings />
            <div className={'mt-4'}>
                <ButtonComponent
                    name={'Toggle Theme'}
                    rounded={'md'}
                    padding={'p-3'}
                    onClick={toggle}
                    shadow={'shadow-md'}
                    bg_color={'bg-gray-50'}
                    hover={'hover:bg-gray-200 hover:border-gray-400'}
                    hover_text={'hover:text-gray-900 hover:font-semibold'}
                    border={'border border-gray-300'}
                    text_color={'text-gray-700'}
                >
                    <Moon size={13}/>
                </ButtonComponent>
            </div>

        </ProtectedRoute>
    )
}

export default Settings