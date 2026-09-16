"use client";

import React, { useState, useEffect } from "react";
import ProtectedRoute from '@/components/authentication/protected-route';
import { getRequest } from "@/utils/api-calls.util";
import { useRouter } from "next/navigation";

interface ReconciliationItemsData {
    id: number;
    name: string;
    fileAName: string;
    fileBName: string;
    matchCount: number;
    missingInACount: number;
    missingInBCount: number;
    matches: string[];
    missingInA: string[];
    missingInB: string[];
}

function ReconciliationItems({id}:{id:any}) {
    const permission = 'reconciliation_item';
    const router = useRouter();

    const [data, setData] = useState<ReconciliationItemsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'summary' | 'matches' | 'missingInA' | 'missingInB'>('summary');

    const navigateToLogin = () => router.push('/login');

    useEffect(() => {
        if (!id) return;

        const fetchData = async () => {
            setLoading(true);
            try {
                const res = await getRequest(`reconciliations/${id}/items`);
                if (res?.status === 200) {
                    setData(res.data as ReconciliationItemsData);   // ← add the cast
                }
            } catch (error: any) {
                if (error?.code === "ERR_NETWORK") {
                    navigateToLogin();
                }
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    // ---------- UI helpers ----------
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
            <div className={`text-3xl font-bold ${textColor} mb-2`}>{count}</div>
            <div className="text-gray-700 font-semibold">{title}</div>
            <div className="text-sm text-gray-500 mt-2">{description}</div>
        </div>
    );

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
                    {items.map((item, index) => (
                        <div key={index} className={`${bgColor} p-3 rounded border ${borderColor}`}>
                            <span className={`${textColor} font-mono text-sm`}>{item}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    const renderTabContent = () => {
        if (!data) return null;

        switch (activeTab) {
            case 'summary':
                return (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-gray-700">
                        <ResultCard
                            count={data.matchCount}
                            title="Matching Records"
                            description="Values present in both files"
                            borderColor="border-green-500"
                            textColor="text-green-600"
                        />
                        <ResultCard
                            count={data.missingInBCount}
                            title={`Missing in ${data.fileBName}`}
                            description={`Values only in ${data.fileAName}`}
                            borderColor="border-red-500"
                            textColor="text-red-600"
                        />
                        <ResultCard
                            count={data.missingInACount}
                            title={`Missing in ${data.fileAName}`}
                            description={`Values only in ${data.fileBName}`}
                            borderColor="border-red-500"
                            textColor="text-red-600"
                        />
                    </div>
                );

            case 'matches':
                return (
                    <DataGrid
                        items={data.matches}
                        title="Matching Records"
                        count={data.matches.length}
                        bgColor="bg-green-50"
                        borderColor="border-green-200"
                        textColor="text-green-700"
                    />
                );

            case 'missingInB':
                return (
                    <DataGrid
                        items={data.missingInB}
                        title={`Missing in ${data.fileBName}`}
                        count={data.missingInB.length}
                        bgColor="bg-red-50"
                        borderColor="border-red-200"
                        textColor="text-red-700"
                    />
                );

            case 'missingInA':
                return (
                    <DataGrid
                        items={data.missingInA}
                        title={`Missing in ${data.fileAName}`}
                        count={data.missingInA.length}
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
            isLoading={loading}
        >
            <div className="px-6 space-y-6 text-gray-700">
                {data && (
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">
                            {data.name}
                        </h2>
                        <p className="text-sm text-gray-500 mb-6">
                            {data.fileAName} vs {data.fileBName}
                        </p>

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
                                    Matches ({data.matchCount})
                                </button>
                                <button
                                    onClick={() => setActiveTab('missingInB')}
                                    className={`py-2 px-4 border-b-2 font-medium text-sm ${
                                        activeTab === 'missingInB'
                                            ? 'border-red-500 text-red-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                                >
                                    Missing in {data.fileBName} ({data.missingInBCount})
                                </button>
                                <button
                                    onClick={() => setActiveTab('missingInA')}
                                    className={`py-2 px-4 border-b-2 font-medium text-sm ${
                                        activeTab === 'missingInA'
                                            ? 'border-red-500 text-red-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                                >
                                    Missing in {data.fileAName} ({data.missingInACount})
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

export default ReconciliationItems;