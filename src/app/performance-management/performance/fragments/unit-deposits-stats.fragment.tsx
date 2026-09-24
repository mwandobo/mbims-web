'use client'

import React from "react";
import { Col, Row, Button } from "antd";
import { useRouter } from "next/navigation";

const UnitDepositsStatsFragment = () => {
    const router = useRouter();

    // Dummy data
    const stats = [
        { id: 1, unitName: "Mlimani Branch", totalDeposits: 12500000 },
        { id: 2, unitName: "Samora Branch", totalDeposits: 9800000 }
    ];

    const handleShowMore = () => {
        router.push('/performances/units');
    };

    return (
        <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-800">
                    Top Units by Deposits
                </h2>
                <Button type="primary" onClick={handleShowMore}>
                    Show More
                </Button>
            </div>

            <Row gutter={[16, 16]}>
                {stats.map((unit) => (
                    <Col
                        xs={24}
                        sm={12}
                        md={12}
                        lg={6}
                        xl={6}
                        xxl={6}
                        key={unit.id}
                    >
                        <div className="h-48 border border-gray-300 rounded-lg shadow-md p-4 bg-white">
                            <div className="h-full flex flex-col justify-center items-center gap-3">
                                <p className="text-lg font-semibold text-gray-700 text-center line-clamp-2">
                                    {unit.unitName}
                                </p>
                                <p className="text-3xl font-bold text-center text-gray-900">
                                    {unit.totalDeposits.toLocaleString()}
                                </p>
                                <p className="text-sm text-gray-500 text-center">
                                    Total Deposits
                                </p>
                            </div>
                        </div>
                    </Col>
                ))}
            </Row>
        </div>
    );
};

export default UnitDepositsStatsFragment;