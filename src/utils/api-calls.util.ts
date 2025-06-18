import axios from 'axios';
import {getValueFromLocalStorage} from "@/utils/local-storage.util";

export const baseURL = 'http://127.0.0.1:8000/api';
export const nextBaseURL = 'http://localhost:3000';

// Axios instance
const index = axios.create({
    baseURL,
});

// Function to get headers for authenticated requests
export const config = (token?: string | null, isFormData?: boolean) => {
    const _token = getValueFromLocalStorage('token');
    const strippedToken = _token?.substring(1, _token.length - 1);

    return {
        headers: {
            "Content-Type": isFormData ? 'multipart/form-data' : "application/json",
            "Accept": "*",
            "Access-Control-Allow-Origin": "*",
            "Authorization": `${strippedToken ? `Bearer ${strippedToken}` : ''}`,
        }
    };
};

// Request method implementations
const getRequest = async <T>(url: string, token?: string | null): Promise<any> => {
    return index.get(url, config(token));
};

const postRequest = async <T>(url: string, data: any, token?: string | null, isFormData?: boolean): Promise<any> => {
    return index.post(url, data, config(token, isFormData));
};

const putRequest = async <T>(url: string, data: any, token?: string | null): Promise<any> => {
    return index.put(url, data, config(token));
};

const deleteRequest = async <T>(url: string, token?: string | null): Promise<any> => {
    return index.delete(url, config(token));
};

export { getRequest, postRequest, putRequest, deleteRequest };
