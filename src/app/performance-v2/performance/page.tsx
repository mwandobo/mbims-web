'use client';

import { Typography, Card, Row, Col, Statistic } from 'antd';
import {
    UserAddOutlined,
    BankOutlined,
    DollarOutlined,
    AccountBookOutlined,
} from '@ant-design/icons';
import React from 'react';
import ProtectedRoute from '@/components/authentication/protected-route';
import { checkPermissions } from '@/utils/check-permissions';
import AccessDeniedComponent from '@/components/status/access-denied.component';

const { Title, Text } = Typography;

// ====================== SAMPLE DATA ======================
const unitPerformanceData = [
    {
        unit: 'HQ - Corporate',
        customerOnboarding: 148,
        deposits: 42_850_000,
        loans: 18_320_000,
        expenses: 2_145_000,
    },
    {
        unit: 'Branch - Dar es Salaam',
        customerOnboarding: 312,
        deposits: 67_420_000,
        loans: 29_870_000,
        expenses: 3_890_000,
    },
    {
        unit: 'Branch - Arusha',
        customerOnboarding: 186,
        deposits: 31_150_000,
        loans: 14_560_000,
        expenses: 1_980_000,
    },
    {
        unit: 'Branch - Mwanza',
        customerOnboarding: 94,
        deposits: 19_780_000,
        loans: 8_940_000,
        expenses: 1_120_000,
    },
    {
        unit: 'Branch - Mbeya',
        customerOnboarding: 67,
        deposits: 12_340_000,
        loans: 5_670_000,
        expenses: 890_000,
    },
    {
        unit: 'Digital / Agency',
        customerOnboarding: 421,
        deposits: 28_960_000,
        loans: 9_450_000,
        expenses: 1_450_000,
    },
];

// Format currency nicely
const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-TZ', {
        style: 'currency',
        currency: 'TZS',
        maximumFractionDigits: 0,
    }).format(value);

// ====================== COMPONENT ======================
const PerformancePage = () => {
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

                {/* Unit Cards Grid */}
                <Row gutter={[20, 20]}>
                    {unitPerformanceData.map((unit) => (
                        <Col xs={24} sm={12} lg={6} key={unit.unit}>
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
                                </div>

                                {/* Metrics */}
                                <div className="space-y-4">
                                    <Statistic
                                        title={
                                            <span className="text-xs text-gray-500 flex items-center gap-1.5">
                        <UserAddOutlined /> Customer Onboarding
                      </span>
                                        }
                                        value={unit.customerOnboarding}
                                        valueStyle={{ fontSize: '20px', fontWeight: 600 }}
                                    />

                                    <Statistic
                                        title={
                                            <span className="text-xs text-gray-500 flex items-center gap-1.5">
                        <BankOutlined /> Total Deposits
                      </span>
                                        }
                                        value={formatCurrency(unit.deposits)}
                                        valueStyle={{ fontSize: '18px', fontWeight: 600, color: '#1677ff' }}
                                    />

                                    <Statistic
                                        title={
                                            <span className="text-xs text-gray-500 flex items-center gap-1.5">
                        <DollarOutlined /> Total Loans
                      </span>
                                        }
                                        value={formatCurrency(unit.loans)}
                                        valueStyle={{ fontSize: '18px', fontWeight: 600, color: '#52c41a' }}
                                    />

                                    <Statistic
                                        title={
                                            <span className="text-xs text-gray-500 flex items-center gap-1.5">
                        <AccountBookOutlined /> Expenses
                      </span>
                                        }
                                        value={formatCurrency(unit.expenses)}
                                        valueStyle={{ fontSize: '18px', fontWeight: 600, color: '#ff4d4f' }}
                                    />
                                </div>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </div>
        </ProtectedRoute>
    );
};

export default PerformancePage;