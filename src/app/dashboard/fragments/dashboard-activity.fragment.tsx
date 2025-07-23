'use client'

import React, {useEffect, useState} from "react";
import {Card, Col, Row, Statistic, Table} from "antd";
import {getRequest} from "@/utils/api-calls.util";

const DashboardActivityFragment = () =>{
    const [activities, setActivities] = useState<any>(null)



    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await getRequest<any>('activity-logs')
                if (response.status === 200) {

                    setActivities(response.data)
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
        <Card title="Recent Activities" style={{ marginTop: 16 }}>
            <Table
                columns={[
                    { title: 'Action', dataIndex: 'activity', key: 'activity' },
                    { title: 'Date', dataIndex: 'createdAt', key: 'createdAt' },
                    { title: 'User', dataIndex: 'user', key: 'user' },
                ]}
                dataSource={activities}
                size="small"
                pagination={false}
            />
        </Card>
    )

}

export default DashboardActivityFragment;