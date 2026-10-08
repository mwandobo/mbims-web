"use client";

import React, { useState, useRef, useEffect } from "react";
import ProtectedRoute from "@/components/authentication/protected-route";
import { baseURL } from "@/utils/api-calls.util";
import { getValueFromLocalStorage } from "@/utils/local-storage.util";
import { ButtonComponent } from "@/components/button/button.component";
import { CircleEqual, Upload } from "lucide-react";

interface ExcelCompareProps {
    onComparisonComplete?: (result: any) => void;
}

function ExcelCompare({ onComparisonComplete }: ExcelCompareProps) {
    const permission = "compare_excel";
    const [file1, setFile1] = useState<File | null>(null);
    const [file2, setFile2] = useState<File | null>(null);
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<
        "summary" | "matches" | "missing1" | "missing2"
    >("summary");

    const handleCompare = async () => {
        if (!file1 || !file2) {
            setError("Please upload two Excel files");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const token = getValueFromLocalStorage("token");

            if (!token) {
                throw new Error(
                    "Authentication token not found. Please login again."
                );
            }

            const formData = new FormData();
            formData.append("files", file1);
            formData.append("files", file2);

            const response = await fetch(`${baseURL}reconciliations/compare`, {
                method: "POST",
                body: formData,
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const resultData = await response.json();
            setResult(resultData);
            setActiveTab("summary");
            onComparisonComplete?.(resultData);
        } catch (err: any) {
            setError(err.message || "Failed to compare files");
            console.error("Comparison error:", err);
        } finally {
            setLoading(false);
        }
    };

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

        useEffect(() => {
            setFileName(file ? file.name : "");
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
                <label className="block text-sm font-semibold text-foreground">
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
                        className="w-full px-4 py-3 border border-input-border rounded-lg bg-card-bg text-foreground
                       hover:bg-muted-bg transition-colors cursor-pointer flex items-center justify-between"
                    >
                        <div className="flex items-center">
                            <Upload size={18} className="mr-3 text-muted" />
                            <span className="text-sm">
                {fileName || `Choose ${label.toLowerCase()}...`}
              </span>
                        </div>

                        {file && (
                            <span className="text-sm text-success font-medium">
                ✓ Selected
              </span>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    const ResultCard = ({
                            count,
                            title,
                            description,
                            borderColor,
                            textColor,
                        }: {
        count: number;
        title: string;
        description: string;
        borderColor: string;
        textColor: string;
    }) => (
        <div
            className={`bg-card-bg rounded-lg shadow-md p-6 text-center border-l-4 ${borderColor}`}
        >
            <div className={`text-3xl font-bold ${textColor} mb-2`}>{count}</div>
            <div className="text-foreground font-semibold">{title}</div>
            <div className="text-sm text-muted mt-2">{description}</div>
        </div>
    );

    const DataGrid = ({
                          items,
                          title,
                          count,
                          bgColor,
                          borderColor,
                          textColor,
                      }: {
        items: string[];
        title: string;
        count: number;
        bgColor: string;
        borderColor: string;
        textColor: string;
    }) => (
        <div className="bg-card-bg rounded-lg shadow-md p-6 border border-card-border">
            <h3 className={`text-lg font-semibold mb-4 ${textColor}`}>
                {title} ({count})
            </h3>
            <div className="max-h-96 overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                    {items.map((item: string, index: number) => (
                        <div
                            key={index}
                            className={`${bgColor} p-3 rounded border ${borderColor}`}
                        >
                            <span className={`${textColor} font-mono text-sm`}>{item}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    const tabClass = (active: boolean, activeTone: string) =>
        `py-2 px-4 border-b-2 font-medium text-sm ${
            active
                ? activeTone
                : "border-transparent text-muted hover:text-foreground hover:border-card-border"
        }`;

    const renderTabContent = () => {
        if (!result) return null;

        const missing1 = result.missing[file1?.name || ""] || [];
        const missing2 = result.missing[file2?.name || ""] || [];

        switch (activeTab) {
            case "summary":
                return (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-foreground">
                        <ResultCard
                            count={result.matches.length}
                            title="Matching Records"
                            description="Values present in both files"
                            borderColor="border-success"
                            textColor="text-success"
                        />
                        <ResultCard
                            count={missing1.length}
                            title={`Missing in ${file1?.name}`}
                            description="Values only in first file"
                            borderColor="border-error"
                            textColor="text-error"
                        />
                        <ResultCard
                            count={missing2.length}
                            title={`Missing in ${file2?.name}`}
                            description="Values only in second file"
                            borderColor="border-error"
                            textColor="text-error"
                        />
                    </div>
                );

            case "matches":
                return (
                    <DataGrid
                        items={result.matches}
                        title="Matching Records"
                        count={result.matches.length}
                        bgColor="bg-success/10"
                        borderColor="border-success/30"
                        textColor="text-success"
                    />
                );

            case "missing1":
                return (
                    <DataGrid
                        items={missing1}
                        title={`Missing in ${file1?.name}`}
                        count={missing1.length}
                        bgColor="bg-error/10"
                        borderColor="border-error/30"
                        textColor="text-error"
                    />
                );

            case "missing2":
                return (
                    <DataGrid
                        items={missing2}
                        title={`Missing in ${file2?.name}`}
                        count={missing2.length}
                        bgColor="bg-error/10"
                        borderColor="border-error/30"
                        textColor="text-error"
                    />
                );
        }
    };

    return (
        <ProtectedRoute permission={`${permission}_read`} isLoading={loading}>
            <div className="px-6 space-y-6 text-foreground">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-foreground mb-2">
                        Reconciliation By Comparing Two Files
                    </h1>
                    <p className="text-muted">
                        Compare two Excel files and identify matching and missing records
                    </p>
                </div>

                <div className="bg-card-bg rounded-xl shadow-md p-6 border border-card-border">
                    {error && (
                        <div className="mb-6 p-4 bg-error/10 border border-error/30 rounded-lg text-error">
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
                            name="Compare Files"
                            onClick={handleCompare}
                            rounded="md"
                            padding="px-6 py-3"
                        >
                            <CircleEqual size={18} className="mr-2" />
                        </ButtonComponent>
                    </div>
                </div>

                {result && (
                    <div className="bg-card-bg rounded-xl shadow-md p-6 border border-card-border">
                        <h2 className="text-2xl font-bold text-foreground mb-6">
                            Comparison Results
                        </h2>

                        <div className="border-b border-card-border mb-6">
                            <nav className="-mb-px flex space-x-8">
                                <button
                                    onClick={() => setActiveTab("summary")}
                                    className={tabClass(
                                        activeTab === "summary",
                                        "border-primary text-primary"
                                    )}
                                >
                                    Summary
                                </button>
                                <button
                                    onClick={() => setActiveTab("matches")}
                                    className={tabClass(
                                        activeTab === "matches",
                                        "border-success text-success"
                                    )}
                                >
                                    Matches ({result.matches.length})
                                </button>
                                <button
                                    onClick={() => setActiveTab("missing1")}
                                    className={tabClass(
                                        activeTab === "missing1",
                                        "border-error text-error"
                                    )}
                                >
                                    Missing in {file1?.name} (
                                    {result.missing[file1?.name || ""]?.length || 0})
                                </button>
                                <button
                                    onClick={() => setActiveTab("missing2")}
                                    className={tabClass(
                                        activeTab === "missing2",
                                        "border-error text-error"
                                    )}
                                >
                                    Missing in {file2?.name} (
                                    {result.missing[file2?.name || ""]?.length || 0})
                                </button>
                            </nav>
                        </div>

                        {renderTabContent()}
                    </div>
                )}
            </div>
        </ProtectedRoute>
    );
}

export default ExcelCompare;