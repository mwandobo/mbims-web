'use client'

import React, { useEffect, useState } from "react";
import { Card, Col, Row, Statistic } from "antd";
import { getRequest } from "@/utils/api-calls.util";

const DashboardStatsFragment = () => {
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

    const cards = [
        { title: "Total Contracts", value: stats?.total_contracts },
        { title: "Active Contracts", value: stats?.activeContracts },
        { title: "Expiring Soon", value: stats?.expiringSoon },
        { title: "Total Licenses", value: stats?.totalLicenses },
        { title: "Active Licenses", value: stats?.activeLicenses },
        { title: "Expired Licenses", value: stats?.expiredLicenses },
        { title: "Total Policies", value: stats?.totalPolicies },
        { title: "Active Policies", value: stats?.activePolicies },
        { title: "Expired Policies", value: stats?.expiredPolicies },
    ]

    return (
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
            {cards.map((card, index) => (
                <Col
                    key={index}
                    xs={24}
                    sm={12}
                    md={8}
                    lg={6}
                    xl={6}
                    xxl={3} // On very large screens, fit all in one row
                >
                    {/*<Card>*/}
                    {/*    <Statistic title={card.title} value={card.value} />*/}
                    {/*</Card>*/}

                    <Card className="h-full">
                        <div className="min-h-[80px] flex flex-col justify-center">
                            <Statistic
                                title={<span className="whitespace-nowrap overflow-hidden text-ellipsis">{card.title}</span>}
                                value={card.value}
                            />
                        </div>
                    </Card>
                </Col>
            ))}
        </Row>
    )
}

export default DashboardStatsFragment;
