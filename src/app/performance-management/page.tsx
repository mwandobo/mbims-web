'use client'


import {  Typography } from 'antd';
import React from 'react';
import ProtectedRoute from "@/components/authentication/protected-route";
import {checkPermissions} from "@/utils/check-permissions";
import AccessDeniedComponent from "@/components/status/access-denied.component";
import CustomerStatsFragment from './fragments/customers-stats.fragment';

const { Title, Text } = Typography;

const PerformanceManagementPage = () => {

    if(!checkPermissions('performance_read')) {
        return <AccessDeniedComponent />
    }

    return (
        <ProtectedRoute
            permission={'performance_read'}
        >
        <div className="dashboard-container">
            <Title level={2}>MCB Perfomance Management System Dashboard</Title>
            {checkPermissions('performance_customer_stats') && <CustomerStatsFragment /> }
            {/*{checkPermissions('dashboard_activities_read') && <DashboardActivityFragment /> }*/}

        </div>
        </ProtectedRoute>
    );
};

export default PerformanceManagementPage;