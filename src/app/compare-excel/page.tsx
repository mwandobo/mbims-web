"use client";

import React, { useState, useRef, useEffect } from "react";
import { usePageDataHook } from "@/hooks/page-render-hooks/use-page-data.hook";
import ProtectedRoute from '@/components/authentication/protected-route'
import PageHeader from '@/components/header/page-header'
import { baseURL } from "@/utils/api-calls.util";
import { getValueFromLocalStorage } from "@/utils/local-storage.util";
import { ButtonComponent } from "@/components/button/button.component";
import { CircleEqual, Upload } from "lucide-react";

function ExcelCompare() {
    const permission = 'contract'
    const [file1, setFile1] = useState<File | null>(null);
    const [file2, setFile2] = useState<File | null>(null);
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'summary' | 'matches' | 'missing1' | 'missing2'>('summary');

    const projectInputs = [
        // ... your existing form inputs
    ];

    const _columns = [
        // ... your existing columns
    ];

    const {
        loading: pageLoading,
        handleClick,
    } = usePageDataHook({
        columns: _columns,
        formInputs: projectInputs,
        url: 'contracts',
        modalTitle: 'Contract',
        viewUrl: '/contracts/',
        state_properties: [],
        permission: permission,
        from: "contracts",
        isApiV2: true,
        isFormData: true,
        isMaintainViewNavigationForV1: true
    });

    const handleCompare = async () => {
        if (!file1 || !file2) {
            setError("Please upload two Excel files");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const token = getValueFromLocalStorage('token');

            if (!token) {
                throw new Error("Authentication token not found. Please login again.");
            }

            const formData = new FormData();
            formData.append("files", file1);
            formData.append("files", file2);

            const response = await fetch(`${baseURL}compare-excel`, {
                method: "POST",
                body: formData,
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const resultData = await response.json();
            setResult(resultData);
            setActiveTab('summary');
        } catch (err: any) {
            setError(err.message || "Failed to compare files");
            console.error("Comparison error:", err);
        } finally {
            setLoading(false);
        }
    };

    // Custom File Input Component - CORRECTED VERSION
    const FileInput = ({
                           label,
                           file,
                           onChange,
                       }: {
        label: string;
        file: File | null;
        onChange: (file: File | null) => void;
    }) => {
        const fileInputRef = useRef<HTMLInputElement>(null);
        const [fileName, setFileName] = useState<string>("");

        // Sync with parent file state
        useEffect(() => {
            if (file) {
                setFileName(file.name);
            } else {
                setFileName("");
            }
        }, [file]);

        const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const selectedFile = e.target.files?.[0] || null;
            onChange(selectedFile);
        };

        const handleClick = () => {
            fileInputRef.current?.click();
        };

        return (
            <div className="space-y-3">
                <label className="block text-sm font-semibold text-gray-700">
                    {label}:
                </label>

                <div className="relative">
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".xlsx, .xls, .csv"
                        onChange={handleFileChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />

                    <div
                        onClick={handleClick}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-700
                                 hover:bg-gray-50 transition-colors cursor-pointer flex items-center justify-between"
                    >
                        <div className="flex items-center">
                            <Upload size={18} className="mr-3 text-gray-500" />
                            <span className="text-sm">
                                {fileName || `Choose ${label.toLowerCase()}...`}
                            </span>
                        </div>

                        {file && (
                            <span className="text-sm text-green-600 font-medium">
                                ✓ Selected
                            </span>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    // Result Card Component
    const ResultCard = ({
                            count,
                            title,
                            description,
                            borderColor,
                            textColor
                        }: {
        count: number;
        title: string;
        description: string;
        borderColor: string;
        textColor: string;
    }) => (
        <div className={`bg-white rounded-lg shadow-md p-6 text-center border-l-4 ${borderColor}`}>
            <div className={`text-3xl font-bold ${textColor} mb-2`}>
                {count}
            </div>
            <div className="text-gray-700 font-semibold">{title}</div>
            <div className="text-sm text-gray-500 mt-2">{description}</div>
        </div>
    );

    // Data Grid Component
    const DataGrid = ({
                          items,
                          title,
                          count,
                          bgColor,
                          borderColor,
                          textColor
                      }: {
        items: string[];
        title: string;
        count: number;
        bgColor: string;
        borderColor: string;
        textColor: string;
    }) => (
        <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className={`text-lg font-semibold mb-4 ${textColor}`}>
                {title} ({count})
            </h3>
            <div className="max-h-96 overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                    {items.map((item: string, index: number) => (
                        <div key={index} className={`${bgColor} p-3 rounded border ${borderColor}`}>
                            <span className={`${textColor} font-mono text-sm`}>{item}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    const renderTabContent = () => {
        if (!result) return null;

        const missing1 = result.missing[file1?.name || ''] || [];
        const missing2 = result.missing[file2?.name || ''] || [];

        switch (activeTab) {
            case 'summary':
                return (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-gray-700">
                        <ResultCard
                            count={result.matches.length}
                            title="Matching Records"
                            description="Values present in both files"
                            borderColor="border-green-500"
                            textColor="text-green-600"
                        />
                        <ResultCard
                            count={missing1.length}
                            title={`Missing in ${file1?.name}`}
                            description="Values only in first file"
                            borderColor="border-red-500"
                            textColor="text-red-600"
                        />
                        <ResultCard
                            count={missing2.length}
                            title={`Missing in ${file2?.name}`}
                            description="Values only in second file"
                            borderColor="border-red-500"
                            textColor="text-red-600"
                        />
                    </div>
                );

            case 'matches':
                return (
                    <DataGrid
                        items={result.matches}
                        title="Matching Records"
                        count={result.matches.length}
                        bgColor="bg-green-50"
                        borderColor="border-green-200"
                        textColor="text-green-700"
                    />
                );

            case 'missing1':
                return (
                    <DataGrid
                        items={missing1}
                        title={`Missing in ${file1?.name}`}
                        count={missing1.length}
                        bgColor="bg-red-50"
                        borderColor="border-red-200"
                        textColor="text-red-700"
                    />
                );

            case 'missing2':
                return (
                    <DataGrid
                        items={missing2}
                        title={`Missing in ${file2?.name}`}
                        count={missing2.length}
                        bgColor="bg-red-50"
                        borderColor="border-red-200"
                        textColor="text-red-700"
                    />
                );
        }
    };

    return (
        <ProtectedRoute
            permission={`${permission}_read`}
            isLoading={pageLoading}
        >
            <PageHeader
                handleClick={handleClick}
                subHeader={"Excel Compare"}
                permission={`${permission}_create`}
                isHideAdd={true}
            />

            <div className="p-6 space-y-6 text-gray-700">
                {/* Header */}
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Excel File Comparison</h1>
                    <p className="text-gray-600">Compare two Excel files and identify matching and missing records</p>
                </div>

                {/* File Upload Section */}
                <div className="bg-white rounded-xl shadow-md p-6">
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                            <strong>Error:</strong> {error}
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <FileInput
                            label="First Excel File"
                            file={file1}
                            onChange={setFile1}
                        />
                        <FileInput
                            label="Second Excel File"
                            file={file2}
                            onChange={setFile2}
                        />
                    </div>

                    <div className="text-center">
                        <ButtonComponent
                            name='Compare Files'
                            onClick={handleCompare}
                            disabled={loading || !file1 || !file2}
                            text_color='text-gray-700'
                            bg_color='bg-gray-50'
                            hover='hover:bg-gray-100 hover:border-gray-400'
                            hover_text='hover:text-gray-900'
                            rounded='md'
                            border='border border-gray-300'
                            padding='px-6 py-3'
                        >
                            <CircleEqual size={18} className="mr-2" />
                        </ButtonComponent>
                    </div>
                </div>

                {/* Results Section */}
                {result && (
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">Comparison Results</h2>

                        {/* Tabs */}
                        <div className="border-b border-gray-200 mb-6">
                            <nav className="-mb-px flex space-x-8">
                                <button
                                    onClick={() => setActiveTab('summary')}
                                    className={`py-2 px-4 border-b-2 font-medium text-sm ${
                                        activeTab === 'summary'
                                            ? 'border-blue-500 text-blue-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                                >
                                    Summary
                                </button>
                                <button
                                    onClick={() => setActiveTab('matches')}
                                    className={`py-2 px-4 border-b-2 font-medium text-sm ${
                                        activeTab === 'matches'
                                            ? 'border-green-500 text-green-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                                >
                                    Matches ({result.matches.length})
                                </button>
                                <button
                                    onClick={() => setActiveTab('missing1')}
                                    className={`py-2 px-4 border-b-2 font-medium text-sm ${
                                        activeTab === 'missing1'
                                            ? 'border-red-500 text-red-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                                >
                                    Missing in {file1?.name} ({result.missing[file1?.name || '']?.length || 0})
                                </button>
                                <button
                                    onClick={() => setActiveTab('missing2')}
                                    className={`py-2 px-4 border-b-2 font-medium text-sm ${
                                        activeTab === 'missing2'
                                            ? 'border-red-500 text-red-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                                >
                                    Missing in {file2?.name} ({result.missing[file2?.name || '']?.length || 0})
                                </button>
                            </nav>
                        </div>

                        {/* Tab Content */}
                        {renderTabContent()}
                    </div>
                )}
            </div>
        </ProtectedRoute>
    );
}

export default ExcelCompare;