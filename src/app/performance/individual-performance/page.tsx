'use client';

import { Typography, Card, Row, Col, Statistic, Avatar, Spin, Alert, Empty } from 'antd';
import {
    UserAddOutlined,
    BankOutlined,
    DollarOutlined,
    UserOutlined,
} from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import ProtectedRoute from '@/components/authentication/protected-route';
import { checkPermissions } from '@/utils/check-permissions';
import AccessDeniedComponent from '@/components/status/access-denied.component';
import {getRequest} from "@/utils/api-calls.util";

const { Title, Text } = Typography;

interface IndividualPerformance {
    employeeId?: number;
    staffNo?: string;
    name: string;
    role: string;
    unit: string;
    customerOnboarding: number;
    deposits: number;
    loans: number;
}

const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-TZ', {
        style: 'currency',
        currency: 'TZS',
        maximumFractionDigits: 0,
    }).format(value ?? 0);

const IndividualPerformancePage = () => {
    const [data, setData] = useState<IndividualPerformance[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchIndividualStats = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await getRequest<IndividualPerformance[]>(
                    'performances/individual-stats?limit=6'
                );

                const list = Array.isArray(response.data)
                    ? response.data
                    : (response.data as any)?.data ?? [];

                setData(list);
            } catch (err: any) {
                console.error('Failed to load individual performance', err);
                setError(err?.message || 'Failed to load individual performance data');
            } finally {
                setLoading(false);
            }
        };

        fetchIndividualStats();
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
                        Individual performance • Customer onboarding, deposits & loans
                    </Text>
                </div>

                {loading && (
                    <div className="flex justify-center py-20">
                        <Spin size="large" tip="Loading individual performance..." />
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
                    <Empty description="No individual performance data available" />
                )}

                {!loading && !error && data.length > 0 && (
                    <Row gutter={[20, 20]}>
                        {data.map((employee) => (
                            <Col
                                xs={24}
                                sm={12}
                                lg={6}
                                key={employee.employeeId ?? employee.staffNo ?? employee.name}
                            >
                                <Card
                                    className="h-full shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100"
                                    styles={{
                                        body: { padding: '20px 22px' },
                                    }}
                                >
                                    {/* Employee Header */}
                                    <div className="flex items-center gap-3 mb-5 pb-3 border-b border-gray-100">
                                        <Avatar
                                            size={42}
                                            icon={<UserOutlined />}
                                            className="bg-blue-500"
                                        />
                                        <div>
                                            <Text strong className="text-base text-gray-800 block">
                                                {employee.name}
                                            </Text>
                                            <Text type="secondary" className="text-xs">
                                                {employee.role || '—'} • {employee.unit || '—'}
                                            </Text>
                                        </div>
                                    </div>

                                    {/* Metrics */}
                                    <div className="space-y-4">
                                        <Statistic
                                            title={
                                                <span className="text-xs text-gray-500 flex items-center gap-1.5">
                                                    <UserAddOutlined /> Customer Onboarding
                                                </span>
                                            }
                                            value={employee.customerOnboarding ?? 0}
                                            valueStyle={{ fontSize: '20px', fontWeight: 600 }}
                                        />

                                        <Statistic
                                            title={
                                                <span className="text-xs text-gray-500 flex items-center gap-1.5">
                                                    <BankOutlined /> Total Deposits
                                                </span>
                                            }
                                            value={formatCurrency(Number(employee.deposits ?? 0))}
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
                                            value={formatCurrency(Number(employee.loans ?? 0))}
                                            valueStyle={{
                                                fontSize: '18px',
                                                fontWeight: 600,
                                                color: '#52c41a',
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

export default IndividualPerformancePage;