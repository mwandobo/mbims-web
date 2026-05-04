"use client"

import { useRouter } from 'next/navigation';
import { Suspense, useEffect } from 'react';
import {getValueFromLocalStorage} from "@/utils/local-storage.util";
import {checkPermissions} from "@/utils/check-permissions";
import AccessDeniedComponent from "@/components/status/access-denied.component";
import LoadingComponent from "@/components/status/loading.component";

interface Props {
  children: React.ReactNode
  permission?: string
  isLoading?: boolean
}

const isTokenExpired = (token: string) => {
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.exp * 1000 < Date.now();
    } catch (e) {
        return true; // treat invalid token as expired
    }
};


const AuthenticatedApp = ({ children }: { children: React.ReactNode }) => {
    const router = useRouter();
    const token = getValueFromLocalStorage('token');

    useEffect(() => {
        if (!token || isTokenExpired(token)) {
            localStorage.removeItem('token'); // cleanup
            router.push('/login');
        }
    }, [token]);

    return <>{children}</>;
};

export default AuthenticatedApp;