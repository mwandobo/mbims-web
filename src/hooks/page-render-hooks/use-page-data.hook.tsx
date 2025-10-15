"use client"

import * as React from "react";
import {ReactNode, useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {useCrudOperatorHook} from "@/hooks/page-render-hooks/use-crud-operator.hook";
import {usePopulateTableHook} from "@/hooks/page-render-hooks/use-populate-table.hook";
import {baseURL, getRequest} from "@/utils/api-calls.util";

interface Props {
    columns?: any[]
    formInputs?: any[]
    isShowAddPriceButton?: boolean
    addPriceFormInputData?: any[]
    url?: string
    modalTitle?: string
    viewUrl?: string
    isFormLoading?: boolean
    state_properties?: any[]
    callBackFunction?: (selectedCard: string, id?: string) => void
    show_assign?: boolean
    permission?: string;
    isHideShow?: boolean;
    isHideDelete?: boolean;
    isHideEdit?: boolean;
    isCreateAndSend?: string;
    emailNotificationBody?: any,
    isHideActions?: boolean
    tableData?: any[]
    from?: string
    approval_slug?: string
    isApiV2?: boolean
    isMaintainViewNavigationForV1?: boolean
    itHasCustomForm?: boolean
    customForm?: ReactNode;
    isFormData?: boolean,
    sliderComponent?: any,
    tablePaginationType?: 'front-end' | 'back-end'
}

export const usePageDataHook = ({
                                columns,
                                formInputs,
                                url,
                                modalTitle,
                                viewUrl,
                                state_properties,
                                callBackFunction,
                                addPriceFormInputData,
                                itHasCustomForm,
                                customForm,
                                isFormData,
                                show_assign,
                                permission,
                                isHideShow,
                                isHideDelete,
                                isHideEdit,
                                isShowAddPriceButton,
                                emailNotificationBody,
                                isHideActions,
                                tableData,
                                from,
                                isApiV2,
                                isMaintainViewNavigationForV1,
                                approval_slug,
                                sliderComponent,
                                tablePaginationType = 'back-end'
                            }: Props
) => {
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState<any[]>([])
    const [page, setPage] = React.useState(1);
    const [totalRecords, setTotalRecords] = React.useState(0);
    const [filterKey, setFilterKey] = useState('');
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    const router = useRouter()
    const navigateToLogin = () => {
        return router.push('/login')
    }

    const updatePage = (page: number) => {
        setPage(page)
    }

    const updateRowsPerPage = (rowsPerPage: number) => {
        setRowsPerPage(rowsPerPage);
        setPage(0);
    };

    const updateFilterKey = (filterKey: string) => {
        setFilterKey(filterKey);
    };

    const {
        handleClick,
        createdForm,
        isStateChanged,
        isModalOpen,
        setIsModalOpen
    } = useCrudOperatorHook({
        formInputData: isShowAddPriceButton ? addPriceFormInputData : formInputs,
        isShowAddPriceButton,
        incomingUrl: url,
        incomingModalTitle: modalTitle,
        viewUrl,
        state_properties,
        callBackFunction,
        emailNotificationBody,
        from,
        isApiV2,
        isMaintainViewNavigationForV1,
        itHasCustomForm: itHasCustomForm,
        customForm: customForm,
        isFormData,
        sliderComponent
    })

    const {tabular} = usePopulateTableHook({
        columns: columns,
        data: data,
        handleClick: handleClick,
        show_assign: show_assign,
        permission,
        isHideShow,
        isHideDelete,
        isHideEdit,
        isHideActions,
        isShowAddPriceButton,
        from,
        approval_slug,
        page,
        rowsPerPage,
        filterKey,
        updateRowsPerPage,
        updatePage,
        updateFilterKey,
        totalRecords,
        tablePaginationType
    })

    const ensureURL = (url: string, baseURL: string) => {
        try {
            // If `url` is absolute, this will work directly
            return new URL(url);
        } catch {
            // Else it's a relative URL, make sure baseURL ends with `/`
            const safeBase = baseURL.endsWith('/') ? baseURL : baseURL + '/';
            const safePath = url.startsWith('/') ? url.slice(1) : url;
            return new URL(safePath, safeBase);
        }
    };

    // ⬇️ Move fetchData OUTSIDE useEffect
    const fetchData = async () => {
        try {
            setLoading(true);

            const parsedUrl = ensureURL(url, baseURL);
            parsedUrl.searchParams.set('page', page.toString());
            parsedUrl.searchParams.set('limit', rowsPerPage.toString());

            if (filterKey) {
                parsedUrl.searchParams.set('q', filterKey);
            } else {
                parsedUrl.searchParams.delete('q');
            }

            const finalUrl = parsedUrl.toString();
            const res = await getRequest(finalUrl);

            if (res.status === 200) {
                // @ts-ignore
                setData(res.data?.data);
                // @ts-ignore
                if (res.data?.pagination?.total) {
                    // @ts-ignore
                    setTotalRecords(res.data?.pagination?.total);
                }
            }

            setLoading(false);
        } catch (error: any) {
            if (error?.code === "ERR_NETWORK") {
                navigateToLogin();
            } else {
                console.error("❌ Fetch error:", error);
                setLoading(false);
            }
        }
    };

// ⬇️ useEffect now just calls fetchData()
    useEffect(() => {
        if (tableData?.length > 0) {
            setData(tableData);
        } else {
            fetchData();
        }
    }, [rowsPerPage, filterKey, page, url, isStateChanged]);

    return {
        loading,
        tabular,
        createdForm,
        handleClick,
        data,
        totalRecords,
        isStateChanged,
        page,
        rowsPerPage,
        updatePage,
        updateRowsPerPage,
        isModalOpen,
        setIsModalOpen,
        refresh: fetchData // ✅ add this line
    }
}