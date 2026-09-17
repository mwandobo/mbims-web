'use client'

import { Typography } from 'antd';
import React from 'react';
import ProtectedRoute from "@/components/authentication/protected-route";
import { checkPermissions } from "@/utils/check-permissions";
import AccessDeniedComponent from "@/components/status/access-denied.component";
import EmployeeCustomerOnboardingStatsFragment from "./fragments/employee-customer-onboarding-stats.fragment";
import UnitCustomerOnboardingStatsFragment
    from "@/app/performance-management/customer-onboarding/fragments/unit-customer-onboarding-stats.fragment";

const { Title } = Typography;

const CustomerOnboardingPage = () => {

    if (!checkPermissions('performance_read')) {
        return <AccessDeniedComponent />
    }

    return (
        <ProtectedRoute
            permission={'performance_read'}
        >
            <div className="dashboard-container">
                <Title level={2}>MCB Customer Onboarding Performance Dashboard</Title>
                {checkPermissions('performance_customer_stats') &&
                  <>
                      <div className="flex flex-col gap-4 mb-4 border border-gray-300 rounded-lg shadow-md p-4">
                          <h3 className='text-3xl font-semibold'>Customers status</h3>
                          <EmployeeCustomerOnboardingStatsFragment />
                      </div>
                      <div className="flex flex-col gap-4 mb-4 border border-gray-300 rounded-lg shadow-md p-4">
                          <h3 className='text-3xl font-semibold'>Units status</h3>
                          <UnitCustomerOnboardingStatsFragment />
                      </div>
                  </>
                }
            </div>
        </ProtectedRoute>
    );
};

export default CustomerOnboardingPage;