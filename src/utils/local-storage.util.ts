export function getValueFromLocalStorage(
    key: string,
    defaultValue: any = null
) {
    if (typeof localStorage === 'undefined') {
        console.warn('localStorage is not available.');
        return defaultValue;
    }

    if (!key) {
        console.warn('Key is required.');
        return defaultValue;
    }

    return localStorage.getItem(key);
}

export function setValueLocalStorage(
    key: string,
    value: any = null
) {
    if (typeof localStorage === 'undefined') {
        console.warn('localStorage is not available.');
        return 0;
    }

    if (!key) {
        console.warn('Key is required.');
        return 0;
    }

    localStorage.setItem(key, value);
    return 1;
}

export function removeValueFromLocalStorage(
    key: string
) {
    if (typeof localStorage === 'undefined') {
        console.warn('localStorage is not available.');
        return;
    }

    if (!key) {
        console.warn('Key is required.');
        return;
    }

    localStorage.removeItem(key);
}
