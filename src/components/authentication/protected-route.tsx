"use client"

import { useRouter } from 'next/navigation';
import { Suspense, useEffect } from 'react';
import {getValueFromLocalStorage} from "@/utils/local-storage.util";
import {checkPermissions} from "@/utils/check-permissions";

interface Props {
  children: React.ReactNode
  permission?: string
}

const ProtectedRoute = ({
  children,
  permission
}: Props) => {
  const router = useRouter();
  const token = getValueFromLocalStorage('token');


  useEffect(() => {
    if (!token) {
      router.push('/login'); // Redirect to login page if token is not present
    }
  }, [token]);

  return <>

    <Suspense fallback={<div>Loading...</div>}>
      <>
        {
          checkPermissions(permission) && <>{children}</>
        }
      </>
    </Suspense></>;
};

export default ProtectedRoute;