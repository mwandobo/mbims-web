'use client'


import { Card, Col, Row, Statistic, Table, Typography } from 'antd';
import React from 'react';
import ProtectedRoute from "@/components/authentication/protected-route";
import {checkPermissions} from "@/utils/check-permissions";
import AccessDeniedComponent from "@/components/status/access-denied.component";
import DashboardStatsFragment from "@/app/dashboard/fragments/dashboard-stats.fragment";

const { Title, Text } = Typography;

const DashboardPage = () => {

    if(!checkPermissions('dashboard_read')) {
        return <AccessDeniedComponent />
    }

    return (
        <ProtectedRoute
            permission={'dashboard_read'}
        >
        <div className="dashboard-container">
            <Title level={2}>MCB Internal Management System Dashboard</Title>
            {checkPermissions('dashboard_stats_card_read') && <DashboardStatsFragment /> }
            {/*{checkPermissions('dashboard_activities_read') && <DashboardActivityFragment /> }*/}

        </div>
        </ProtectedRoute>
    );
};

export default DashboardPage;