'use client';

import {Card, Row, Col, Statistic, Avatar, Spin, Alert, Empty, Typography, Button} from 'antd';
import {
    UserAddOutlined,
    BankOutlined,
    DollarOutlined,
    UserOutlined, ArrowRightOutlined,
} from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import { getRequest } from '@/utils/api-calls.util';
import {AxiosResponse} from "axios";
import Link from "next/link";

const { Text } = Typography;

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

const IndividualPerformanceComponent = () => {
    const [data, setData] = useState<IndividualPerformance[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchIndividualStats = async () => {
            try {
                setLoading(true);
                setError(null);

                const response: AxiosResponse<IndividualPerformance[]>  = await getRequest(
                    'performances/individual-stats'
                );
                console.log('individual-stats response', response);

                const body = response?.data;
                const list: IndividualPerformance[] = Array.isArray(body) ? body    :  [];

                setData(list);
            } catch (err: any) {
                console.error('Failed to load individual performance', err);
                setError(
                    err?.response?.data?.message ||
                    err?.message ||
                    'Failed to load individual performance data'
                );
            } finally {
                setLoading(false);
            }
        };

        fetchIndividualStats();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center py-10">
                <Spin size="large" tip="Loading individual performance..." />
            </div>
        );
    }

    if (error) {
        return <Alert type="error" message="Error" description={error} showIcon />;
    }

    if (data.length === 0) {
        return <Empty description="No individual performance data available" />;
    }

    return (
        <div>
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
                        styles={{ body: { padding: '20px 22px' } }}
                    >
                        <div className="flex items-center gap-3 mb-5 pb-3 border-b border-gray-100">
                            <Avatar size={42} icon={<UserOutlined />} className="bg-blue-500" />
                            <div>
                                <Text strong className="text-base text-gray-800 block">
                                    {employee.name}
                                </Text>
                                <Text type="secondary" className="text-xs">
                                    {employee.role || '—'} • {employee.unit || '—'}
                                </Text>
                            </div>
                        </div>

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
                                valueStyle={{ fontSize: '18px', fontWeight: 600, color: '#1677ff' }}
                            />
                            <Statistic
                                title={
                                    <span className="text-xs text-gray-500 flex items-center gap-1.5">
                                        <DollarOutlined /> Total Loans
                                    </span>
                                }
                                value={formatCurrency(Number(employee.loans ?? 0))}
                                valueStyle={{ fontSize: '18px', fontWeight: 600, color: '#52c41a' }}
                            />
                        </div>
                    </Card>
                </Col>
            ))}
        </Row>

            {/* View more */}
            <div className="flex justify-end">
                <Link href="/performance-management/individual">
                    <Button
                        type="link"
                        size="large"
                        icon={<ArrowRightOutlined />}
                        iconPosition="end"
                        className="!px-0 font-medium"
                    >
                        View all units
                    </Button>
                </Link>
            </div>
        </div>
    );
};

export default IndividualPerformanceComponent;