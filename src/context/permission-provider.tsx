// context/PermissionsProvider.tsx
"use client";
import { createContext, useEffect, useState, useContext } from "react";
import {getRequest} from "@/utils/api-calls.util";
import {setValueLocalStorage} from "@/utils/local-storage.util";

const PermissionsContext = createContext<any>(null);

export const PermissionsProvider = ({ children }: { children: React.ReactNode }) => {
    const [permissions, setPermissions] = useState<any>([]);

    useEffect(() => {
        const getPermissions = async () => {
            try {
                const response = await getRequest('permissions');
                if (response.status === 200) {
                    setValueLocalStorage('system_permissions', JSON.stringify(response.data));
                    setPermissions(response);
                }

            } catch (e) {
                console.error(e);
            }
        };
        getPermissions();
    }, []);

    return (
        <PermissionsContext.Provider value={{ permissions }}>
            {children}
        </PermissionsContext.Provider>
    );
};

export const usePermissions = () => useContext(PermissionsContext);
