'use client'


import { Card, Col, Row, Statistic, Table, Typography } from 'antd';
import { Bar, Pie, Line } from '@ant-design/charts';
import React from 'react';
import ProtectedRoute from "@/components/authentication/protected-route";
import {checkPermissions} from "@/utils/check-permissions";
import AccessDeniedComponent from "@/components/status/access-denied.component";
import DashboardStatsFragment from "@/app/dashboard/fragments/dashboard-stats.fragment";

const { Title, Text } = Typography;

const DashboardPage = () => {
    // Dummy data - replace with real API calls


    const contractTypes = [
        { type: 'Supplier Contracts', value: 68 },
        { type: 'Client Contracts', value: 56 },
    ];

    const licenseStatus = [
        { status: 'Active', value: 62 },
        { status: 'Expired', value: 8 },
        { status: 'Pending Renewal', value: 6 },
    ];

    const expirationData = [
        { month: 'Jan', contracts: 3, licenses: 2 },
        { month: 'Feb', contracts: 5, licenses: 1 },
        { month: 'Mar', contracts: 7, licenses: 4 },
        { month: 'Apr', contracts: 2, licenses: 3 },
        { month: 'May', contracts: 4, licenses: 2 },
        { month: 'Jun', contracts: 6, licenses: 5 },
    ];

    const recentActivities = [
        { id: 1, type: 'Contract', action: 'Renewed', entity: 'ABC Corp', date: '2023-06-15', user: 'John Doe' },
        { id: 2, type: 'License', action: 'Approved', entity: 'XYZ Ltd', date: '2023-06-14', user: 'Jane Smith' },
        { id: 3, type: 'Contract', action: 'Created', entity: 'Global Inc', date: '2023-06-12', user: 'Mike Johnson' },
        { id: 4, type: 'License', action: 'Expired', entity: 'Tech Solutions', date: '2023-06-10', user: 'System' },
    ];

    const departmentDistribution = [
        { department: 'Finance', contracts: 28, licenses: 12 },
        { department: 'IT', contracts: 32, licenses: 24 },
        { department: 'Operations', contracts: 45, licenses: 18 },
        { department: 'HR', contracts: 19, licenses: 22 },
    ];

    if(!checkPermissions('dashboard_read')) {
        return <AccessDeniedComponent />
    }

    return (
        <ProtectedRoute
            permission={'dashboard_read'}
        >

        <div className="dashboard-container">
            <Title level={2}>Contract & License Management Dashboard</Title>

            <DashboardStatsFragment />



            {/* Main Content Row */}
            {/*<Row gutter={16}>*/}
            {/*    /!* Left Column *!/*/}
            {/*    <Col span={12}>*/}
            {/*        <Card title="Contract Types" style={{ marginBottom: 16 }}>*/}
            {/*            <Pie*/}
            {/*                data={contractTypes}*/}
            {/*                angleField="value"*/}
            {/*                colorField="type"*/}
            {/*                radius={0.8}*/}
            {/*                label={{*/}
            {/*                    type: 'inner',*/}
            {/*                    content: '{name}',*/}
            {/*                }}*/}
            {/*            />*/}
            {/*        </Card>*/}

            {/*        <Card title="License Status">*/}
            {/*            <Pie*/}
            {/*                data={licenseStatus}*/}
            {/*                angleField="value"*/}
            {/*                colorField="status"*/}
            {/*                radius={0.8}*/}
            {/*                label={{*/}
            {/*                    type: 'inner',*/}
            {/*                    content: '{name}',*/}
            {/*                }}*/}
            {/*            />*/}
            {/*        </Card>*/}
            {/*    </Col>*/}

            {/*    /!* Right Column *!/*/}
            {/*    <Col span={12}>*/}
            {/*        <Card title="Upcoming Expirations" style={{ marginBottom: 16 }}>*/}
            {/*            <Line*/}
            {/*                data={expirationData}*/}
            {/*                xField="month"*/}
            {/*                yField="contracts"*/}
            {/*                seriesField="type"*/}
            {/*                color={['#1890ff', '#13c2c2']}*/}
            {/*                yAxis={{*/}
            {/*                    label: {*/}
            {/*                        formatter: (v) => `${v} documents`,*/}
            {/*                    },*/}
            {/*                }}*/}
            {/*                legend={{*/}
            {/*                    position: 'top',*/}
            {/*                }}*/}
            {/*                smooth*/}
            {/*            />*/}
            {/*        </Card>*/}

            {/*        <Card title="By Department">*/}
            {/*            <Bar*/}
            {/*                data={departmentDistribution}*/}
            {/*                xField="department"*/}
            {/*                yField={['contracts', 'licenses']}*/}
            {/*                isStack*/}
            {/*                seriesField="type"*/}
            {/*                marginRatio={0}*/}
            {/*                label={{*/}
            {/*                    position: 'middle',*/}
            {/*                }}*/}
            {/*            />*/}
            {/*        </Card>*/}
            {/*    </Col>*/}
            {/*</Row>*/}

            {/* Recent Activities */}
            <Card title="Recent Activities" style={{ marginTop: 16 }}>
                <Table
                    columns={[
                        { title: 'Type', dataIndex: 'type', key: 'type' },
                        { title: 'Action', dataIndex: 'action', key: 'action' },
                        { title: 'Entity', dataIndex: 'entity', key: 'entity' },
                        { title: 'Date', dataIndex: 'date', key: 'date' },
                        { title: 'User', dataIndex: 'user', key: 'user' },
                    ]}
                    dataSource={recentActivities}
                    size="small"
                    pagination={false}
                />
            </Card>
        </div>
        </ProtectedRoute>



    );
};

export default DashboardPage;