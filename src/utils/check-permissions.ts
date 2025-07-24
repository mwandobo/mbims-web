import { getValueFromLocalStorage } from "@/utils/local-storage.util";

export const checkPermissions = (permission: string) => {

    if (!permission) {
        // If no permission string is provided, allow access by default
        return false;
    }

    const permissionsJson = getValueFromLocalStorage('system_permissions');
    if (!permissionsJson) {
        // If permissions are not collected or not found, allow access by default
        return false;
    }

    let permissions: any[] = [];
    try {
        permissions = JSON.parse(permissionsJson);
    } catch (error) {
        // In case JSON parsing fails, allow access by default
        return false;
    }

    if (!Array.isArray(permissions) || permissions.length === 0) {
        // If permissions is not an array or is empty, allow access by default
        return false;
    }

    // Check if the permission exists
    return permissions.some((perm) => perm.name === permission);
};
