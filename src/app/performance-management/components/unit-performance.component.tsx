'use client';

import { Card, Row, Col, Statistic, Spin, Alert, Empty, Typography } from 'antd';
import {
    UserAddOutlined,
    BankOutlined,
    DollarOutlined,
    AccountBookOutlined,
} from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import { getRequest } from '@/utils/api-calls.util';
import {AxiosResponse} from "axios";

const { Text } = Typography;

interface UnitPerformance {
    unitId?: number;
    unitCode?: string;
    unit?: string;
    unitName?: string; // in case backend still sends unitName
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

const UnitPerformanceComponent = () => {
    const [data, setData] = useState<UnitPerformance[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUnitStats = async () => {
            try {
                setLoading(true);
                setError(null);

                const response: AxiosResponse<UnitPerformance[]> = await getRequest('performances/unit-stats');
                console.log('unit-stats response', response);

                const body = response?.data;
                const list: UnitPerformance[] = Array.isArray(body) ? body : [];

                setData(list);
            } catch (err: any) {
                console.error('Failed to load unit performance', err);
                setError(
                    err?.response?.data?.message ||
                    err?.message ||
                    'Failed to load unit performance data'
                );
            } finally {
                setLoading(false);
            }
        };

        fetchUnitStats();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center py-10">
                <Spin size="large" tip="Loading unit performance..." />
            </div>
        );
    }

    if (error) {
        return <Alert type="error" message="Error" description={error} showIcon />;
    }

    if (data.length === 0) {
        return <Empty description="No unit performance data available" />;
    }

    return (
        <Row gutter={[20, 20]}>
            {data.map((unit) => {
                const title = unit.unit || unit.unitName || '—';
                return (
                    <Col xs={24} sm={12} lg={6} key={unit.unitId ?? unit.unitCode ?? title}>
                        <Card
                            className="h-full shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100"
                            styles={{ body: { padding: '20px 22px' } }}
                        >
                            <div className="mb-5 pb-3 border-b border-gray-100">
                                <Text strong className="text-base text-gray-800">
                                    {title}
                                </Text>
                                {unit.unitCode && (
                                    <div>
                                        <Text type="secondary" className="text-xs">
                                            Code: {unit.unitCode}
                                        </Text>
                                    </div>
                                )}
                            </div>

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
                                    valueStyle={{ fontSize: '18px', fontWeight: 600, color: '#1677ff' }}
                                />
                                <Statistic
                                    title={
                                        <span className="text-xs text-gray-500 flex items-center gap-1.5">
                                            <DollarOutlined /> Total Loans
                                        </span>
                                    }
                                    value={formatCurrency(Number(unit.loans ?? 0))}
                                    valueStyle={{ fontSize: '18px', fontWeight: 600, color: '#52c41a' }}
                                />
                                <Statistic
                                    title={
                                        <span className="text-xs text-gray-500 flex items-center gap-1.5">
                                            <AccountBookOutlined /> Expenses
                                        </span>
                                    }
                                    value={formatCurrency(Number(unit.expenses ?? 0))}
                                    valueStyle={{ fontSize: '18px', fontWeight: 600, color: '#ff4d4f' }}
                                />
                            </div>
                        </Card>
                    </Col>
                );
            })}
        </Row>
    );
};

export default UnitPerformanceComponent;