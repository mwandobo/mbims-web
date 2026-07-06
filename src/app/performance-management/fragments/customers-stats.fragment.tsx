'use client'

import React, { useEffect, useState } from "react";
import { Card, Col, Row, Statistic } from "antd";
import { getRequest } from "@/utils/api-calls.util";

const CustomerStatsFragment = () => {
  const [stats, setStats] = useState<any>(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await getRequest<any>('performances/customer-stats')

        console.log('Customer stats response:', response)
        if (response.status === 200) {
console.log('Customer stats data:', response.data)
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
    { title: "Total Customers", value: stats?.totalAllCustomers, attrs: stats?.allCustomersAttrs  },
    { title: "Total Individual Customers", value: stats?.totalIndividualCustomers, attrs: stats?.individualCustomersAttrs },
    { title: "Total Corporate Customers", value: stats?.totalCorporateCustomers, attrs: stats?.corporateCustomersAttrs },
  ]

  return (
    <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
      {cards.map((card, index) => (
        <Col
          xs={24}   // 1 per row on mobile
          sm={12}   // 2 per row on small screens
          md={8}    // 3 per row
          lg={8}    // 3 per row
          xl={8}    // 3 per row
          xxl={8}   // 3 per row
          key={index}              >
          {/*<Card>*/}
          {/*    <Statistic title={card.title} value={card.value} />*/}
          {/*</Card>*/}

          {/* <div className="h-48  border border-gray-300 rounded-lg shadow-md p-2">
                        <div className="h-full flex">
                            <div className="flex flex-col justify-center gap-8 h-full w-full">
                                <p className="text-2xl font-semibold">{card.title}</p>
                                <p className="text-3xl font-bold">{card.value?.toLocaleString() || 0}</p>
                            </div>
                            <div className="flex flex-col justify-start h-full w-full bg-gray-100 p-2 rounded-lg">
                                <div className="flex bg-green-100 ">
                                    <p className="font-semibold">Active</p>
                                    <p className="font-bold">{card.value?.toLocaleString() || 0}</p>
                                </div>
                                <div className="flex bg-red-100 ">
                                    <p className="font-semibold">Closed</p>
                                    <p className="font-bold">{card.value?.toLocaleString() || 0}</p>
                                </div>
                                 <div className="flex bg-yellow-100 ">
                                    <p className="font-semibold">Dormant</p>
                                    <p className="font-bold">{card.value?.toLocaleString() || 0}</p>
                                </div>
                            </div>
                        </div>
                    </div> */}



          <div className="h-48 border border-gray-300 rounded-lg shadow-md p-2">
            <div className="h-full flex">

              {/* LEFT SIDE */}
              <div className="flex flex-col justify-center gap-2 h-full w-full">
                <p className="text-2xl font-semibold">{card.title}</p>
                <p className="text-3xl font-bold w-full text-center -ml-8">
                  {card.value?.toLocaleString() || 0}
                </p>
              </div>

              {/* RIGHT SIDE */}
              <div className="flex flex-col justify-start h-full w-full bg-gray-100 p-2 rounded-lg gap-2">

                {/* ACTIVE */}
                <div className="flex items-center justify-between bg-green-100 px-2 py-1 rounded-md">
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full bg-green-600 flex items-center justify-center">
                      <span className="w-2 h-2 bg-white rounded-full"></span>
                    </span>
                    <p className="font-semibold text-green-800">Active</p>
                  </div>
                  <p className="font-bold text-green-900">
                    {card.attrs?.active?.toLocaleString() || 0}
                  </p>
                </div>

                {/* CLOSED */}
                <div className="flex items-center justify-between bg-red-100 px-2 py-1 rounded-md">
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full bg-red-600 flex items-center justify-center">
                      <span className="w-2 h-2 bg-white rounded-full"></span>
                    </span>
                    <p className="font-semibold text-red-800">Closed</p>
                  </div>
                  <p className="font-bold text-red-900">
                    {card.attrs?.closed?.toLocaleString() || 0}
                  </p>
                </div>

                {/* DORMANT */}
                <div className="flex items-center justify-between bg-yellow-100 px-2 py-1 rounded-md">
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full bg-yellow-500 flex items-center justify-center">
                      <span className="w-2 h-2 bg-white rounded-full"></span>
                    </span>
                    <p className="font-semibold text-yellow-800">Dormant</p>
                  </div>
                  <p className="font-bold text-yellow-900">
                    {card.attrs?.dormant?.toLocaleString() || 0}
                  </p>
                </div>

              </div>
            </div>
          </div>
        </Col>
      ))}
    </Row>
  )
}

export default CustomerStatsFragment;
