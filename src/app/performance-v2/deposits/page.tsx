'use client'


import { Typography } from 'antd';
import React from 'react';
import ProtectedRoute from "@/components/authentication/protected-route";
import { checkPermissions } from "@/utils/check-permissions";
import AccessDeniedComponent from "@/components/status/access-denied.component";
import UnitPerformanceStatsFragment from "@/app/performance-management/deposits/fragments/unit-deposits-stats.fragment";
import EmployeeDepositsStatsFragment from "./fragments/employee-deposits-stats.fragment";

const { Title, Text } = Typography;

const DepositsPage = () => {

    if (!checkPermissions('performance_read')) {
        return <AccessDeniedComponent />
    }

    return (
        <ProtectedRoute
            permission={'performance_read'}
        >
            <div className="dashboard-container">
                <Title level={2}>MCB Deposits Performance Dashboard</Title>
                {checkPermissions('performance_customer_stats') &&
                  <>
                      <div className="flex flex-col gap-4 mb-4 border border-gray-300 rounded-lg shadow-md p-4">
                          <h3 className='text-3xl font-semibold'>Units status</h3>
                          <UnitPerformanceStatsFragment />
                      </div>
                      <div className="flex flex-col gap-4 mb-4 border border-gray-300 rounded-lg shadow-md p-4">
                          <h3 className='text-3xl font-semibold'>Customers status</h3>
                          <EmployeeDepositsStatsFragment />
                      </div>

                  </>
                }
                {/*{checkPermissions('dashboard_activities_read') && <DashboardActivityFragment /> }*/}

            </div>
        </ProtectedRoute>
    );
};

export default DepositsPage;