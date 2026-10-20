'use client';

import { Typography, Card, Row, Col, Statistic, Spin, Alert, Empty } from 'antd';
import {
    UserAddOutlined,
    BankOutlined,
    DollarOutlined,
    AccountBookOutlined,
} from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import ProtectedRoute from '@/components/authentication/protected-route';
import { checkPermissions } from '@/utils/check-permissions';
import AccessDeniedComponent from '@/components/status/access-denied.component';
import {getRequest} from "@/utils/api-calls.util";

const { Title, Text } = Typography;

interface UnitPerformance {
    unitId?: number;
    unitCode?: string;
    unit: string;                 // unit name
    customerOnboarding: number;
    deposits: number;
    loans: number;
    expenses: number;
}

const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-TZ', {
        style: 'currency',
        currency: 'TZS',
        maximumFractionDigits: 0,
    }).format(value ?? 0);

const PerformancePage = () => {
    const [data, setData] = useState<UnitPerformance[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUnitStats = async () => {
            try {
                setLoading(true);
                setError(null);

                // Top units (default limit=4). Change to '/unit-stats/all' for all units
                const response = await getRequest('performances/unit-stats');


                // Adapt to whatever shape getRequest returns
                const list = Array.isArray(response.data)
                    ? response.data
                    : (response.data as any)?.data ?? [];

                setData(list);
            } catch (err: any) {
                console.error('Failed to load unit performance', err);
                setError(err?.message || 'Failed to load unit performance data');
            } finally {
                setLoading(false);
            }
        };

        fetchUnitStats();
    }, []);

    if (!checkPermissions('performance_read')) {
        return <AccessDeniedComponent />;
    }

    return (
        <ProtectedRoute permission="performance_read">
            <div className="dashboard-container px-4 py-6 mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <Title level={2} className="!mb-1">
                        MCB Deposits Performance Dashboard
                    </Title>
                    <Text type="secondary">
                        Unit-level overview • Customer onboarding, deposits, loans & expenses
                    </Text>
                </div>

                {loading && (
                    <div className="flex justify-center py-20">
                        <Spin size="large" tip="Loading unit performance..." />
                    </div>
                )}

                {!loading && error && (
                    <Alert
                        type="error"
                        message="Error"
                        description={error}
                        showIcon
                        className="mb-6"
                    />
                )}

                {!loading && !error && data.length === 0 && (
                    <Empty description="No unit performance data available" />
                )}

                {!loading && !error && data.length > 0 && (
                    <Row gutter={[20, 20]}>
                        {data.map((unit) => (
                            <Col
                                xs={24}
                                sm={12}
                                lg={6}
                                key={unit.unitId ?? unit.unitCode ?? unit.unit}
                            >
                                <Card
                                    className="h-full shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100"
                                    styles={{
                                        body: { padding: '20px 22px' },
                                    }}
                                >
                                    {/* Unit Name */}
                                    <div className="mb-5 pb-3 border-b border-gray-100">
                                        <Text strong className="text-base text-gray-800">
                                            {unit.unit}
                                        </Text>
                                        {unit.unitCode && (
                                            <div>
                                                <Text type="secondary" className="text-xs">
                                                    Code: {unit.unitCode}
                                                </Text>
                                            </div>
                                        )}
                                    </div>

                                    {/* Metrics */}
                                    <div className="space-y-4">
                                        <Statistic
                                            title={
                                                <span className="text-xs text-gray-500 flex items-center gap-1.5">
                                                    <UserAddOutlined /> Customer Onboarding
                                                </span>
                                            }
                                            value={unit.customerOnboarding ?? 0}
                                            valueStyle={{ fontSize: '20px', fontWeight: 600 }}
                                        />

                                        <Statistic
                                            title={
                                                <span className="text-xs text-gray-500 flex items-center gap-1.5">
                                                    <BankOutlined /> Total Deposits
                                                </span>
                                            }
                                            value={formatCurrency(Number(unit.deposits ?? 0))}
                                            valueStyle={{
                                                fontSize: '18px',
                                                fontWeight: 600,
                                                color: '#1677ff',
                                            }}
                                        />

                                        <Statistic
                                            title={
                                                <span className="text-xs text-gray-500 flex items-center gap-1.5">
                                                    <DollarOutlined /> Total Loans
                                                </span>
                                            }
                                            value={formatCurrency(Number(unit.loans ?? 0))}
                                            valueStyle={{
                                                fontSize: '18px',
                                                fontWeight: 600,
                                                color: '#52c41a',
                                            }}
                                        />

                                        <Statistic
                                            title={
                                                <span className="text-xs text-gray-500 flex items-center gap-1.5">
                                                    <AccountBookOutlined /> Expenses
                                                </span>
                                            }
                                            value={formatCurrency(Number(unit.expenses ?? 0))}
                                            valueStyle={{
                                                fontSize: '18px',
                                                fontWeight: 600,
                                                color: '#ff4d4f',
                                            }}
                                        />
                                    </div>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                )}
            </div>
        </ProtectedRoute>
    );
};

export default PerformancePage;