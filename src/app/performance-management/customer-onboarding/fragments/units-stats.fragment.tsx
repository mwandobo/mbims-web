'use client'

import React, { useEffect, useState } from "react";
import { Col, Row, Button } from "antd";
import { getRequest } from "@/utils/api-calls.util";
import { useRouter } from "next/navigation";

const UnitPerformanceStatsFragment = () => {
    const [stats, setStats] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setLoading(true);
                // Backend should return only the top 4 units by customer count
                const response = await getRequest<any>('performances/unit-stats?limit=4');

                if (response.status === 200) {
                    setStats(response.data || []);
                } else {
                    console.error('Failed to load unit performance stats');
                }
            } catch (error) {
                console.error('Error loading unit performance stats:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    const handleShowMore = () => {
        router.push('/performances/units'); // adjust route as needed
    };

    return (
        <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-800">
                    Top Performing Units
                </h2>
                <Button type="primary" onClick={handleShowMore}>
                    Show More
                </Button>
            </div>

            <Row gutter={[16, 16]}>
                {stats.map((unit, index) => (
                    <Col
                        xs={24}
                        sm={12}
                        md={12}
                        lg={6}
                        xl={6}
                        xxl={6}
                        key={unit.id || index}
                    >
                        <div className="h-48 border border-gray-300 rounded-lg shadow-md p-2 bg-white">
                            <div className="h-full flex">

                                {/* LEFT SIDE – Unit name + total customers */}
                                <div className="flex flex-col justify-center gap-2 h-full w-full pr-2">
                                    <p className="text-lg font-semibold text-gray-700 line-clamp-2">
                                        {unit.unitName || unit.name || '—'}
                                    </p>
                                    <p className="text-3xl font-bold text-center">
                                        {unit.totalCustomers?.toLocaleString() || 0}
                                    </p>
                                    <p className="text-sm text-gray-500 text-center">
                                        Total Customers
                                    </p>
                                </div>

                                {/* RIGHT SIDE – Status breakdown */}
                                <div className="flex flex-col justify-start h-full w-full bg-gray-100 p-2 rounded-lg gap-2">

                                    {/* ACTIVE */}
                                    <div className="flex items-center justify-between bg-green-100 px-2 py-1 rounded-md">
                                        <div className="flex items-center gap-2">
                      <span className="w-4 h-4 rounded-full bg-green-600 flex items-center justify-center">
                        <span className="w-2 h-2 bg-white rounded-full"></span>
                      </span>
                                            <p className="font-semibold text-green-800 text-sm">Active</p>
                                        </div>
                                        <p className="font-bold text-green-900 text-sm">
                                            {unit.active?.toLocaleString() || 0}
                                        </p>
                                    </div>

                                    {/* CLOSED */}
                                    <div className="flex items-center justify-between bg-red-100 px-2 py-1 rounded-md">
                                        <div className="flex items-center gap-2">
                      <span className="w-4 h-4 rounded-full bg-red-600 flex items-center justify-center">
                        <span className="w-2 h-2 bg-white rounded-full"></span>
                      </span>
                                            <p className="font-semibold text-red-800 text-sm">Closed</p>
                                        </div>
                                        <p className="font-bold text-red-900 text-sm">
                                            {unit.closed?.toLocaleString() || 0}
                                        </p>
                                    </div>

                                    {/* DORMANT */}
                                    <div className="flex items-center justify-between bg-yellow-100 px-2 py-1 rounded-md">
                                        <div className="flex items-center gap-2">
                      <span className="w-4 h-4 rounded-full bg-yellow-500 flex items-center justify-center">
                        <span className="w-2 h-2 bg-white rounded-full"></span>
                      </span>
                                            <p className="font-semibold text-yellow-800 text-sm">Dormant</p>
                                        </div>
                                        <p className="font-bold text-yellow-900 text-sm">
                                            {unit.dormant?.toLocaleString() || 0}
                                        </p>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </Col>
                ))}
            </Row>

            {!loading && stats.length === 0 && (
                <div className="text-center py-10 text-gray-500">
                    No unit performance data available
                </div>
            )}
        </div>
    );
};

export default UnitPerformanceStatsFragment;