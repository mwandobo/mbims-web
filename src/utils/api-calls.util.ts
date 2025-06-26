import axios from 'axios';
import {getValueFromLocalStorage} from "@/utils/local-storage.util";

export const baseURL = 'http://127.0.0.1:8001/api/';
// export const baseURL = 'https://sportpesa.ema.co.tz/backend/api/';

export const nextBaseURL = 'http://localhost:3000';

// const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

console.log('base url',process.env.NEXT_PUBLIC_BASE_URL);



// Axios instance
const index = axios.create({
    baseURL,
});

// Function to get headers for authenticated requests
export const config = ( isFormData?: boolean) => {
    const _token = getValueFromLocalStorage('token');

    return {
        headers: {
            "Content-Type": isFormData ? 'multipart/form-data' : "application/json",
            "Accept": "*",
            "Access-Control-Allow-Origin": "*",
            "Authorization": `${_token ? `Bearer ${_token}` : ''}`,
        }
    };
};

// Request method implementations
const getRequest = async <T>(url: string, token?: string | null): Promise<any> => {
    return index.get(url, config());
};

const postRequest = async <T>(url: string, data: any, token?: string | null, isFormData?: boolean): Promise<any> => {
    return index.post(url, data, config( isFormData));
};

const putRequest = async <T>(url: string, data: any, token?: string | null): Promise<any> => {
    return index.patch(url, data, config());
};

const deleteRequest = async <T>(url: string, token?: string | null): Promise<any> => {
    return index.delete(url, config());
};

export { getRequest, postRequest, putRequest, deleteRequest };
