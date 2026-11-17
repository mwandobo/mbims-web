import axios from "axios";
import { getValueFromLocalStorage } from "@/utils/local-storage.util";

const baseURL = process.env.NEXT_PUBLIC_BASE_URL as string;


const index = axios.create({
    baseURL
});

export const config = (isFormData?: boolean) => {
    const _token = getValueFromLocalStorage("token");
    return {
        headers: {
            "Content-Type": isFormData ? "multipart/form-data" : "application/json",
            Accept: "*",
            Authorization: _token ? `Bearer ${_token}` : "",
        },
    };
};

const getRequest = <T>(url: string) => index.get<T>(url, config());
const postRequest = <T>(url: string, data: any, isFormData?: boolean) =>
    index.post<T>(url, data, config(isFormData));
const putRequest = <T>(url: string, data: any) => index.patch<T>(url, data, config());
const deleteRequest = <T>(url: string) => index.delete<T>(url, config());
const getBlobRequest = (url: string) => {
    const base = config();
    return index.get<Blob>(url, {
        ...base,
        responseType: "blob",
        headers: { ...base.headers, Accept: "*/*" }, // your default "*" isn't a valid media type
    });
};

export { getRequest, postRequest, putRequest, deleteRequest, getBlobRequest, baseURL };

