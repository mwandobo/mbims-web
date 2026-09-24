'use client';

import { Typography, Card, Row, Col, Statistic, Avatar } from 'antd';
import {
    UserAddOutlined,
    BankOutlined,
    DollarOutlined,
    UserOutlined,
} from '@ant-design/icons';
import React from 'react';
import ProtectedRoute from '@/components/authentication/protected-route';
import { checkPermissions } from '@/utils/check-permissions';
import AccessDeniedComponent from '@/components/status/access-denied.component';

const { Title, Text } = Typography;

// ====================== SAMPLE DATA ======================
const employeePerformanceData = [
    {
        name: 'Amina Juma',
        role: 'Relationship Manager',
        unit: 'HQ - Corporate',
        customerOnboarding: 48,
        deposits: 12_450_000,
        loans: 5_820_000,
    },
    {
        name: 'John Mwangi',
        role: 'Branch Manager',
        unit: 'Branch - Dar es Salaam',
        customerOnboarding: 67,
        deposits: 18_320_000,
        loans: 9_150_000,
    },
    {
        name: 'Fatma Hassan',
        role: 'Sales Officer',
        unit: 'Branch - Arusha',
        customerOnboarding: 39,
        deposits: 8_760_000,
        loans: 3_940_000,
    },
    {
        name: 'David Kimaro',
        role: 'Relationship Manager',
        unit: 'Branch - Mwanza',
        customerOnboarding: 28,
        deposits: 6_890_000,
        loans: 2_780_000,
    },
    {
        name: 'Grace Mwakasege',
        role: 'Sales Officer',
        unit: 'Branch - Mbeya',
        customerOnboarding: 22,
        deposits: 4_560_000,
        loans: 1_920_000,
    },
    {
        name: 'Peter Ochieng',
        role: 'Digital Banking Officer',
        unit: 'Digital / Agency',
        customerOnboarding: 89,
        deposits: 9_340_000,
        loans: 3_120_000,
    },
];

// Format currency
const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-TZ', {
        style: 'currency',
        currency: 'TZS',
        maximumFractionDigits: 0,
    }).format(value);

// ====================== COMPONENT ======================
const IndividualPerformancePage = () => {
    if (!checkPermissions('performance_read')) {
        return <AccessDeniedComponent />;
    }

    return (
        <ProtectedRoute permission="performance_read">
            <div className="dashboard-container px-4 py-6  mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <Title level={2} className="!mb-1">
                        MCB Deposits Performance Dashboard
                    </Title>
                    <Text type="secondary">
                        Individual performance • Customer onboarding, deposits & loans
                    </Text>
                </div>

                {/* Employee Cards Grid */}
                <Row gutter={[20, 20]}>
                    {employeePerformanceData.map((employee) => (
                        <Col xs={24} sm={12} lg={6} key={employee.name}>
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
                                            {employee.role} • {employee.unit}
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
                                        value={employee.customerOnboarding}
                                        valueStyle={{ fontSize: '20px', fontWeight: 600 }}
                                    />

                                    <Statistic
                                        title={
                                            <span className="text-xs text-gray-500 flex items-center gap-1.5">
                        <BankOutlined /> Total Deposits
                      </span>
                                        }
                                        value={formatCurrency(employee.deposits)}
                                        valueStyle={{ fontSize: '18px', fontWeight: 600, color: '#1677ff' }}
                                    />

                                    <Statistic
                                        title={
                                            <span className="text-xs text-gray-500 flex items-center gap-1.5">
                        <DollarOutlined /> Total Loans
                      </span>
                                        }
                                        value={formatCurrency(employee.loans)}
                                        valueStyle={{ fontSize: '18px', fontWeight: 600, color: '#52c41a' }}
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

export default IndividualPerformancePage;