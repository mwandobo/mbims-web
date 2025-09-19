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

const AuthenticatedApp = ({
  children,
}: Props) => {
  const router = useRouter();
  const token = getValueFromLocalStorage('token');

  useEffect(() => {
    if (!token) {
      router.push('/login'); // Redirect to login page if token is not present
    }
  }, [token]);

  return <>{children}</>
};

export default AuthenticatedApp;