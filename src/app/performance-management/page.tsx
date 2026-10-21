'use client';

import React from 'react';
import { Typography } from 'antd';
import ProtectedRoute from '@/components/authentication/protected-route';
import UnitPerformanceComponent from '@/app/performance-management/components/unit-performance.component';
import IndividualPerformanceComponent from '@/app/performance-management/components/individual-performance.component';

const { Title, Text } = Typography;

const PerformancePage = () => {
    return (
        <ProtectedRoute permission="performance_read">
            <div className="dashboard-container px-4 py-6 mx-auto">
                <div className="mb-8">
                    <Title level={2} className="!mb-1">
                        MCB Deposits Performance Dashboard
                    </Title>
                    <Text type="secondary">
                        Unit & individual overview • Customer onboarding, deposits, loans & expenses
                    </Text>
                </div>

                <section className="mb-12">
                    <Title level={4} className="!mb-4">
                        By Unit
                    </Title>
                    <UnitPerformanceComponent />
                </section>

                <section>
                    <Title level={4} className="!mb-4">
                        By Individual
                    </Title>
                    <IndividualPerformanceComponent />
                </section>
            </div>
        </ProtectedRoute>
    );
};

export default PerformancePage;