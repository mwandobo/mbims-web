"use client"

import ProtectedRoute from '@/components/authentication/protected-route'
import PageHeader from '@/components/header/page-header'
import React, { useState, useEffect } from 'react'
import { usePageDataHook } from "@/hooks/page-render-hooks/use-page-data.hook"
import MuiSelect from "@/components/inputs/mui-select";
import MuiMultiSelectSelect from "@/components/inputs/mui-multiselect.component";
import { ButtonComponent } from "@/components/button/button.component";
import { PlusCircle, X } from "lucide-react";
import PopupModal from "@/components/modal/popup-modal";
import {getRequest, postRequest} from "@/utils/api-calls.util";
import MuiSelectLocal from "@/components/inputs/mui-select-local"; // ✅ import your modal

interface Props {
    parent_id?: string
    subHeader?: string
}

function AssetRequest({ parent_id, subHeader }: Props) {
    const permission = 'asset_request'
    const url = `/asset-requests`


    const columns = [
        {
            id: 'name',
            numeric: false,
            disablePadding: false,
            label: 'Request Name',

        },
        {
            id: 'formattedCreatedAt',
            numeric: false,
            disablePadding: false,
            label: 'Date',
        },
    ]

    const {
        loading,
        tabular,
        isModalOpen,
        setIsModalOpen,
        refresh
    } = usePageDataHook({
        columns: columns,
        formInputs: [],
        url: url,
        modalTitle: 'Asset Request',
        viewUrl: '/asset-management/asset-request/',
        state_properties: [],
        permission: permission,
        isApiV2: true,
        isMaintainViewNavigationForV1: true,
        isHideEdit: true,
    })

    // local state
    const [categories, setCategories] = useState<any[]>([])
    const [items, setItems] = useState<any[]>([])
    const [assetOptionsUrl, setAssetOptionsUrl] = useState<string>("fetch-data/assets-by-categories");

    useEffect(() => {
   getRequest('/fetch-data/asset-categories')
            .then((res) => res.data as any)
            .then((data ) => {
                const formatted = data.map((cat: any) => ({
                    value: cat.id,
                    label: cat.name,
                }));
                setCategories(formatted);
            });
    }, []);

    // ✅ Get filtered category options for each row
    const getFilteredCategories = (index: number) => {
        const selectedCategoryIds = items.map((i) => i.category_id).filter(Boolean);
        return categories.filter(
            (cat) => !selectedCategoryIds.includes(cat.value) || cat.value === items[index].category_id
        );
    };

    const addItem = () => {
        setItems([...items, { category_id: '', asset_id: '', quantity: 1 }])
    }

    const handleChange = (event: any, from?: string, control_for?: string, index?: number) => {
        const value = event?.target ? event.target.value : event
        const updated = [...items]

        if (from === "Asset Category" && index !== undefined) {
            updated[index].category_id = value
            // 👇 dynamically update URL for assets
            setAssetOptionsUrl(`fetch-data/assets-by-categories?categoryId=${value}`)
        }

        if (from === "Asset" && index !== undefined) {
            updated[index].asset_id = value
        }

        setItems(updated)
    }

    const removeItem = (index: number) => {
        setItems(items.filter((_, i) => i !== index))
    }

    const handleClose = () => {
        setItems([]);
        setIsModalOpen(false);
    }

    // useEffect(() => {
    //     if (isModalOpen) {
    //         // When modal opens, show one initial row
    //         if (items.length === 0) {
    //             setItems([{ category_id: '', asset_id: '', quantity: 1 }]);
    //         }
    //     } else {
    //         // When modal closes, clear items
    //         setItems([]);
    //     }
    // }, [isModalOpen]);

    const handleOpenModal = () =>{
        setIsModalOpen(true);
        if (items.length === 0) {
            setItems([{ category_id: '', asset_id: '', quantity: 1 }]);
        }
    }

    const handleSubmit = async () => {
        const payload = {
            name: "Main Request",
            description: "Main Request Description",
            asset_ids: items.flatMap(i => i.asset_id),
        };

        const response = await postRequest('asset-requests', payload)

        if([200, 201].includes(response.status)) {
            await refresh();
            handleClose();
            setTimeout(() => setItems([]), 300);
        }
    };

    return (
        <ProtectedRoute
            permission={`${permission}_read`}
            isLoading={loading}
        >
            <PageHeader
                handleClick={handleOpenModal}
                links={[{ name: 'Asset Requests / List', linkTo: '/asset-management/asset-request', permission: '' }]}
                subHeader={subHeader}
                permission={`${permission}_create`}
            />

            {tabular()}

            {/* ✅ Use PopupModal */}
            <PopupModal
                isOpen={isModalOpen}
                onClose={handleClose}
                title="Create Asset Request"
                size="sm"
                onSaveButtonName="Save"
            >
                {/* Dynamic items */}
                {items.map((item, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                        {/* Category */}
                        {/*<MuiSelect*/}
                        {/*    handleChange={(e, from, control_for) => handleChange(e, "Asset Category", control_for, index)}*/}
                        {/*    from="Asset Category"*/}
                        {/*    label="Asset Category"*/}
                        {/*    optionsUrlData="fetch-data/asset-categories"*/}
                        {/*    optionDataKey="name"*/}
                        {/*    value={item.category_id}*/}
                        {/*    isDisabled={false}*/}
                        {/*    isRequired*/}
                        {/*/>*/}

                        <MuiSelectLocal
                            handleChange={(e, from, control_for) => handleChange(e, "Asset Category", control_for, index)}
                            from="Asset Category"
                            label="Asset Category"
                            optionsUrlData={getFilteredCategories(index)}
                            optionDataKey="name"
                            value={item.category_id}
                            isDisabled={false}
                            isRequired
                        />

                        {/* Asset */}
                        <MuiMultiSelectSelect
                            handleChange={(e, from, control_for) => handleChange(e, "Asset", control_for, index)}
                            from="Asset"
                            label="Asset"
                            optionsUrlData={assetOptionsUrl}  // 👈 dynamic URL here
                            optionDataKey="name"
                            value={item.asset_id}
                            isDisabled={false}
                            isRequired
                        />

                        {/* Remove */}
                        <button
                            type="button"
                            className="text-red-600 text-sm"
                            onClick={() => removeItem(index)}
                        >
                            Remove
                        </button>
                    </div>
                ))}

                <button
                    type="button"
                    onClick={addItem}
                    className="flex items-center gap-1 text-blue-600 mt-2"
                >
                    <PlusCircle size={16} /> Add Asset
                </button>

                <div className="mt-4 flex justify-end">
                    <button
                        type="button"
                        onClick={handleSubmit}
                        className="px-4 py-2 bg-blue-600 text-white rounded"
                    >
                        Submit Request
                    </button>
                </div>
            </PopupModal>
        </ProtectedRoute>
    )
}

export default AssetRequest
