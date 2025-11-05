'use client'

import React, { useEffect, useState } from "react";
import { Card, Col, Row, Statistic } from "antd";
import { getRequest } from "@/utils/api-calls.util";

const DashboardStatsFragment = () => {
    const [stats, setStats] = useState<any>(null)

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await getRequest<any>('dashboard/overall-stats')
                if (response.status === 200) {
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
        { title: "Total Asset Categories", value: stats?.totalAssetCategories },
        { title: "Total Assets", value: stats?.totalAssets},
        { title: "Total Asset Request", value: stats?.totalAssetRequests },
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
