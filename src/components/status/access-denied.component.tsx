'use client'

import React from 'react'
import { Lock } from 'lucide-react'

const AccessDeniedComponent = () => {
    return (
        <div className="w-full h-[70vh] flex flex-col items-center justify-center text-center px-4">
            <Lock size={48} className="text-red-600 mb-4" />
            <h2 className="text-2xl font-semibold text-gray-800">Access Denied</h2>
            <p className="text-gray-600 mt-2 max-w-md">
                You do not have permission to view this page. Please contact your administrator if you believe this is a mistake.
            </p>
        </div>
    )
}

export default AccessDeniedComponent
