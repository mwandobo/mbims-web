import {getValueFromLocalStorage} from "@/utils/local-storage.util";

export const checkPermissions = (permission: string) => {
    const permissionsJson = getValueFromLocalStorage('permissions');

    let permissions: any[] = [];
    let allowAccess = false;
    if (permissionsJson) {
        permissions = JSON.parse(permissionsJson);
    }

    if (!permission) {
        allowAccess = true;
    }else   if (!permissions || permissions.length <= 0 ) {
        allowAccess = true;
    }

    else {
        const foundIndex = permissions && permissions.findIndex((perm => perm.mapped_name === permission));
        allowAccess = foundIndex >= 0;
    }

    return allowAccess;
};