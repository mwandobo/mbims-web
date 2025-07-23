'use client'

import React, {useEffect, useState} from "react";
import {Card, Col, Row, Statistic} from "antd";
import {getRequest} from "@/utils/api-calls.util";

const DashboardStatsFragment = () =>{
    const [stats, setStats] = useState<any>(null)

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await getRequest<any>('dashboard/contracts-stats')
                if (response.status === 200) {

                    console.log('response', response.data)
                    setStats(response.data)
                } else {
                    console.error('Failed to load stats')
                }
            } catch (error) {
                console.error('Error loading stats:', error)
            }
        }

        fetchStats()
    }, [])


    return (
        <Row gutter={16} style={{ marginBottom: 24 }}>
            <Col span={3}>
                <Card>
                    <Statistic title="Total Contracts" value={stats?.total_contracts} />
                </Card>
            </Col>
            <Col span={3}>
                <Card>
                    <Statistic title="Active Contracts" value={stats?.activeContracts} />
                </Card>
            </Col>
            <Col span={3}>
                <Card>
                    <Statistic title="Expiring Soon" value={stats?.expiringSoon} />
                </Card>
            </Col>
            <Col span={3}>
                <Card>
                    <Statistic title="Total Licenses" value={stats?.totalLicenses} />
                </Card>
            </Col>
            <Col span={3}>
                <Card>
                    <Statistic title="Active Licenses" value={stats?.activeLicenses} />
                </Card>
            </Col>
            <Col span={3}>
                <Card>
                    <Statistic title="Expired Licenses" value={stats?.expiredLicenses} />
                </Card>
            </Col>

            <Col span={3}>
                <Card>
                    <Statistic title="Total Policies" value={stats?.totalPolicies} />
                </Card>
            </Col>
            <Col span={3}>
                <Card>
                    <Statistic title="Active Policies" value={stats?.activePolicies} />
                </Card>
            </Col>
            <Col span={3}>
                <Card>
                    <Statistic title="Expired Policies" value={stats?.expiredPolicies} />
                </Card>
            </Col>
        </Row>

    )



}

export default DashboardStatsFragment;