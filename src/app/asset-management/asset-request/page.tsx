"use client"

import ProtectedRoute from '@/components/authentication/protected-route'
import PageHeader from '@/components/header/page-header'
import React, { useState, useEffect } from 'react'
import { usePageDataHook } from "@/hooks/page-render-hooks/use-page-data.hook"
import MuiSelect from "@/components/inputs/mui-select";
import MuiMultiSelectSelect from "@/components/inputs/mui-multiselect.component";
import { ButtonComponent } from "@/components/button/button.component";
import { PlusCircle, X } from "lucide-react";
import PopupModal from "@/components/modal/popup-modal"; // ✅ import your modal


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
            // width: '30%',

        },
        {
            id: 'formattedCreatedAt',
            numeric: false,
            disablePadding: false,
            label: 'Date',
            // width: '64%',
        },
    ]

    const {
        loading,
        handleClick,
        tabular,
        isModalOpen,
        setIsModalOpen,
    } = usePageDataHook({
        columns: columns,
        formInputs: [],
        url: url,
        modalTitle: 'Asset Request',
        viewUrl: '/asset-management/asset-request/',
        state_properties: [],
        permission: permission,
        isApiV2: true,
        isMaintainViewNavigationForV1: true
    })

    // local state
    const [categories, setCategories] = useState<any[]>([])
    const [assets, setAssets] = useState<any[]>([])
    const [items, setItems] = useState<any[]>([])

    useEffect(() => {
        fetch('/fetch-data/asset-categories')
            .then(res => res.json())
            .then(data => setCategories(data))
    }, [])

    const fetchAssets = async (categoryId: string) => {
        const res = await fetch(`/fetch-data/assets-by-categories?category_id=${categoryId}`)
        const data = await res.json()
        setAssets(data)
    }

    const addItem = () => {
        setItems([...items, { category_id: '', asset_id: '', quantity: 1 }])
    }

    // 🔑 unified handleChange
    const handleChange = (event: any, from?: string, control_for?: string, index?: number) => {
        const value = event?.target ? event.target.value : event
        const updated = [...items]

        if (from === "Asset Category" && index !== undefined) {
            updated[index].category_id = value
            fetchAssets(value)
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
        setIsModalOpen(false)
        setItems([]) // optional: reset items when closing
    }

    const handleSubmit = async () => {
        const payload = {
            name: "Main Request",
            description: "Main Request Description",
            asset_ids: items.flatMap(i => i.asset_id), // 👈 flatten nested arrays
        }

        handleClose()
    }

    return (
        <ProtectedRoute
            permission={`${permission}_read`}
            isLoading={loading}
        >
            <PageHeader
                handleClick={handleClick}
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
                size="md"
                onSaveButtonName="Save"
            >
                {/* Dynamic items */}
                {items.map((item, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                        {/* Category */}
                        <MuiSelect
                            handleChange={(e, from, control_for) => handleChange(e, "Asset Category", control_for, index)}
                            from="Asset Category"
                            label="Asset Category"
                            optionsUrlData="fetch-data/asset-categories"
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
                            optionsUrlData="fetch-data/assets-by-categories"
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
