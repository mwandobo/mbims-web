"use client"

import ProtectedRoute from '@/components/authentication/protected-route'
import PageHeader from '@/components/header/page-header'
import React from 'react'
import NotificationSettings from "@/app/settings/components/notification-settings.component";

function Settings() {
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

        </ProtectedRoute>
    )
}

export default Settings