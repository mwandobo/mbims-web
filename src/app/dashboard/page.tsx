"use client"

import ProtectedRoute from '@/components/authentication/protected-route'
import React, {useEffect, useState} from 'react'
import BarChartComponent from "@/components/graphs/bar-chart";
import AreaChartComponent from "@/components/graphs/area-chart";
import {useRouter} from "next/navigation";
import PieChartComponent from "@/components/graphs/pie-chart";
import {Filter} from "lucide-react";
import SlideOverV1 from "@/components/slide-over/slide-over-v1.component";
import LoadingComponent from "@/components/status/loading.component";
import MultiColorCircularProgress from "@/components/graphs/multi-color-circular-chart";
import {getRequest} from "@/utils/api-calls.util";

function Dashboard() {
    const [data, setData] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [budgetData, setBudgetData] = useState([]);
    const [totalBudget, setTotalBudget] = useState(0);
    const [refresh, setRefresh] = useState(false)
    const [selectedYears, setSelectedYears] = useState<number[]>([]);
    const [isSideOverOpened, setIsSideOverOpen] = useState(false)
    const [isSubmitted, setIsSubmitted] = useState(false)
    const router = useRouter()

    const toggleYearSelection = (year: number) => {
        setSelectedYears(prevSelectedYears =>
            prevSelectedYears.includes(year)
                ? prevSelectedYears.filter(selectedYear => selectedYear !== year)
                : [...prevSelectedYears, year]
        );
    };

    const checkIfDisabled = () => selectedYears?.length <= 0

    useEffect(() => {

        const fetchAllData = async () => {
            try {
                setIsLoading(true)
                const queryParams = selectedYears.length
                    ? `?years=${selectedYears.join(',')}`
                    : '';

                const [
                    projectStatsRes,
                    projectExpenseStatsRes,
                    projectPieChartStatsRes,
                    assignedTasksRes,
                    salesPurchaseStats,
                    salesVsPurchase,
                    projectBudgetSummary,
                ] = await Promise.all([
                    getRequest(`dashboard/project-stats${queryParams}`),
                    getRequest(`dashboard/project-expenses-stats${queryParams}`),
                    getRequest(`dashboard/project-pie-chart-stats${queryParams}`),
                    getRequest(`dashboard/assigned-tasks${queryParams}`),
                    getRequest(`dashboard/sales-purchase-stats${queryParams}`),
                    getRequest(`dashboard/sales-vs-purchase${queryParams}`),
                    getRequest(`dashboard/project-budget-summary${queryParams}`)
                ]);

                if (
                    projectStatsRes.status === 200 &&
                    projectExpenseStatsRes.status === 200 &&
                    projectPieChartStatsRes.status === 200 &&
                    assignedTasksRes.status === 200 &&
                    salesPurchaseStats.status === 200 &&
                    salesVsPurchase.status === 200 &&
                    projectBudgetSummary.status === 200
                ) {
                    const _projectBudgetSummary = projectBudgetSummary.data.data;
                    setData({
                        projectStats: projectStatsRes.data.data,
                        projectExpenseStats: projectExpenseStatsRes.data.data,
                        projectPieChartStatsRes: projectPieChartStatsRes.data.data,
                        assignedTasks: assignedTasksRes.data.data,
                        salesPurchaseStats: salesPurchaseStats.data.data,
                        salesVsPurchase: salesVsPurchase.data.data,
                        projectBudgetSummary: _projectBudgetSummary
                    });

                    const total = _projectBudgetSummary.reduce((sum, item) => sum + item.grandTotal, 0);

                    setTotalBudget(total);
                    const calculatedBudgetData = _projectBudgetSummary.map(item => ({
                        ...item,
                        percentage: ((item.grandTotal / total) * 100).toFixed(2),
                        color: `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`
                    }));

                    setBudgetData(calculatedBudgetData);

                    setIsLoading(false)
                }
            } catch (error) {
                if (error?.code === "ERR_NETWORK") {
                    navigateToLogin();
                }
            }
        };

        fetchAllData();
    }, [refresh]);

    const navigateToLogin = () => {
        return router.push('/login')
    }

    const handleOpenFilters = () => {
        setIsSideOverOpen(!isSideOverOpened)
    }

    const handleClearFilters = () => {
        setSelectedYears([])
        setRefresh(!refresh)
        setIsSubmitted(false)
    }

    const handleCloseSlideOver = () => {
        setIsSideOverOpen(!isSideOverOpened)
        setSelectedYears([])
    }

    const onSubmit = () => {
        setIsSubmitted(true)
        setIsSideOverOpen(!isSideOverOpened)
        setRefresh(!refresh)
    }

    const projectStats = data?.projectStats
    const items = [
        {name: "Total Projects", quantity: projectStats?.all_projects},
        {name: "Pending Projects", quantity: projectStats?.pending_projects},
        {name: "Ongoing Projects", quantity: projectStats?.ongoing_projects},
        {name: "Completed Projects", quantity: projectStats?.completed_projects},
        {name: "Closed Projects", quantity: projectStats?.closed_projects},
    ]

    const salesPurchaseStats = data?.salesPurchaseStats
    const salesStats = [
        {name: "Total Sales", quantity: salesPurchaseStats?.total_sales},
        {name: "Total Purchase", quantity: salesPurchaseStats?.total_purchases},
        {name: "Total Complete Purchase", quantity: salesPurchaseStats?.total_in_payments},
        {name: "Total Complete Sale", quantity: salesPurchaseStats?.total_out_payments},
        {name: "Total Pending Purchase", quantity: salesPurchaseStats?.total_pending_in_payments},
        {name: "Total Pending Sale", quantity: salesPurchaseStats?.total_pending_out_payments},
    ]

    const years = [2021, 2022, 2023, 2024, 2025]

    return (
        <ProtectedRoute>
            {isLoading ? (
                <LoadingComponent/>
            ) : (
                <>
                    <div className='flex flex-col text-xs'>
                        <div className={'w-full flex justify-between font-medium'}>
                            <div>
                                {selectedYears?.length > 0 && (
                                    <div className={'flex flex-col bg-gray-100 mb-2 p-2 rounded-md'}>
                                        <p className={'me-2'}>Selected Filters:</p>
                                        <div className={'flex'}>
                                            <p className={'me-2'}>Years:</p>
                                            {selectedYears.map((year, index) => (
                                                <p key={year} className="me-1">
                                                    {year}{index < selectedYears.length - 1 ? ',' : ''}
                                                </p>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                            <button
                                className={' flex justify-center items-center p-2 border border-gray-200 shadow-sm rounded-md hover:bg-gray-50 mb-2 gap-1'}
                                onClick={handleOpenFilters}
                            >
                                <Filter size={12}/>Filters
                            </button>
                        </div>

                        <div className='flex flex-col lg:flex-row gap-2'>
                            <div className={'lg:w-2/3'}>
                                <div className={'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 '}>
                                    {items.map((item, index) => (
                                        <div key={index}
                                             className={'bg-white h-20 flex flex-col justify-center items-center shadow-md rounded-md border border-gray-200'}>
                                            <p>{item.name}</p>
                                            <p>{item.quantity}</p>
                                        </div>
                                    ))}
                                </div>

                                {data?.projectPieChartStatsRes && (
                                    <div className={'mt-2 bg-white shadow-md rounded-md p-2 border border-gray-200'}>
                                        <div className={'mb-2'}>
                                            <h3 className={'font-semibold'}>Project Stats Pie Chart</h3>
                                        </div>
                                        <div className={'w-1/4'}>
                                            <PieChartComponent data={data?.projectPieChartStatsRes}/>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {data?.assignedTasks && (
                                <div className="lg:w-1/3 bg-white p-2 border border-gray-200 shadow-md rounded-md">
                                    <div className="flex flex-col border-b border-gray-100">
                                        <h3 className="mb-2 font-semibold">Assigned Tasks</h3>
                                        {data?.assignedTasks.map((task, index) => (
                                            <div
                                                key={index}
                                                className={`flex items-center justify-between p-2 ${index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}`}
                                            >
                                                <p className="w-[20px] text-center">{`${index + 1}.`}</p>
                                                <p className="flex-1 text-start">{task.name}</p>
                                                <p className="ml-4">{task.status}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className={'flex bg-white flex-col mt-2 p-2 border border-gray-200 shadow-md rounded-md'}>
                            <h3 className={'mb-2 font-semibold'}>Sales Dashboard</h3>

                            <div className={'bg-white p-2'}>
                                <div className={'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 '}>
                                    {salesStats.map((item, index) => (
                                        <div key={index}
                                             className={'bg-white h-20 flex flex-col justify-center items-center border border-gray-200 shadow-md rounded-md'}>
                                            <p>{item.name}</p>
                                            <p>{item.quantity}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className={'flex flex-col lg:flex-row mt-2 gap-2 w-full'}>
                                {data?.salesVsPurchase && (
                                    <div className={'bg-white lg:w-2/5 shadow-md rounded-md p-2 border border-gray-200'}>
                                        <h3 className={'mb-2 mt-2 font-semibold'}>Sales Vs Purchase</h3>
                                        <div className={'flex justify-center items-center w-full h-full'}>
                                            <AreaChartComponent data={data?.salesVsPurchase}/>
                                        </div>
                                    </div>
                                )}

                                {data?.projectExpenseStats && (
                                    <div className={'lg:w-2/5 border border-gray-200 p-2 shadow-md rounded-md'}>
                                        <h3 className={'mb-2 font-semibold'}>Project Expenses </h3>
                                        <BarChartComponent data={data?.projectExpenseStats}/>
                                    </div>
                                )}

                                {budgetData?.length > 0 && (
                                    <div className="flex lg:w-1/5 flex-col bg-white shadow-md rounded-md border border-gray-200 p-4">
                                        <h3 className={'font-medium'}>Budget Summary for All Projects:</h3>
                                        <div className="flex w-full justify-center">
                                            <MultiColorCircularProgress segments={budgetData}/>
                                        </div>
                                        <div className={'flex flex-col w-full text-xs'}>
                                            <p className="flex gap-1 mb-1 font-medium">Total Budget: {totalBudget}</p>
                                            <div className="">
                                                {budgetData.map((item, index) => (
                                                    <div key={index} className={'flex mb-1 gap-1'}>
                                                        <span className={'w-4'} style={{backgroundColor: item.color}}></span>
                                                        <p className="flex items-center ">{item.name} - {item.grandTotal}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <SlideOverV1
                        isShowSlideOver={isSideOverOpened}
                        title="Apply Filters"
                        onClose={handleCloseSlideOver}
                        width={'15rem'}
                        onSubmit={onSubmit}
                        onClear={handleClearFilters}
                        isSubmitDisabled={checkIfDisabled()}
                        isClearDisabled={!isSubmitted}
                    >
                        <div>
                            <div className={'mb-2 shadow-md rounded-md border border-gray-200 p-2'}>
                                <h3 className={'mb-2 font-semibold'}>Years</h3>
                                <div className={'grid grid-cols-2 gap-1'}>
                                    {years.map(item => (
                                        <button
                                            key={item}
                                            onClick={() => toggleYearSelection(item)}
                                            className={`h-10 gap-2 shadow-md rounded-md mb-1 border hover:bg-gray-100 ${
                                                selectedYears.includes(item)
                                                    ? 'bg-gray-300 border-gray-100'
                                                    : 'bg-white border-gray-200'
                                            }`}
                                        >
                                            {item}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </SlideOverV1>
                </>
            )}
        </ProtectedRoute>
    )
}

export default Dashboard
