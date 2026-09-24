'use client'

import React from "react";
import { Col, Row, Button } from "antd";
import { useRouter } from "next/navigation";

const EmployeeDepositsStatsFragment = () => {
    const router = useRouter();

    // Dummy data
    const stats = [
        { id: 1, employeeName: "John Mwangi", totalDeposits: 2450000 },
        { id: 2, employeeName: "Grace Wanjiku", totalDeposits: 1985000 },
        { id: 3, employeeName: "Peter Otieno", totalDeposits: 1760000 },
        { id: 4, employeeName: "Amina Hassan", totalDeposits: 1525000 },
    ];

    const handleShowMore = () => {
        router.push('/performances/employees');
    };

    return (
        <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-800">
                    Top Employees by Deposits
                </h2>
                <Button type="primary" onClick={handleShowMore}>
                    Show More
                </Button>
            </div>

            <Row gutter={[16, 16]}>
                {stats.map((employee) => (
                    <Col
                        xs={24}
                        sm={12}
                        md={12}
                        lg={6}
                        xl={6}
                        xxl={6}
                        key={employee.id}
                    >
                        <div className="h-48 border border-gray-300 rounded-lg shadow-md p-4 bg-white">
                            <div className="h-full flex flex-col justify-center items-center gap-3">
                                <p className="text-lg font-semibold text-gray-700 text-center line-clamp-2">
                                    {employee.employeeName}
                                </p>
                                <p className="text-3xl font-bold text-center text-gray-900">
                                    {employee.totalDeposits.toLocaleString()}
                                </p>
                                <p className="text-sm text-gray-500 text-center">
                                    Amount Deposited
                                </p>
                            </div>
                        </div>
                    </Col>
                ))}
            </Row>
        </div>
    );
};

export default EmployeeDepositsStatsFragment;