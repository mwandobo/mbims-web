import React, {useEffect, useState} from 'react';
import {useGlobalContextHook} from "@/hooks/useGlobalContextHook";
import {getRequest} from "@/utils/api-calls.util";

interface Props {
    searchKey: string,
}

const TreeList = ({
                      searchKey,
                  }: Props) => {
    const [data, setData] = useState<any>([])
    const [loading, setLoading] = useState(false)
    const { state } = useGlobalContextHook()
    const { viewItemRefreshAfterApproval} = state

    const url= `approval-actions?q=${searchKey}`

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true)
                const res = await getRequest(url)

                if (res.status === 200) {
                    const _data = res.data as any
                    setData(_data?.data)
                    setLoading(false)
                }

            } catch (error: any) {
                console.log(error)
            }
        };
        fetchData()
    }, [viewItemRefreshAfterApproval])

    return (
        <>
            {
                loading ? <p>Loading...</p>
                    :
                    // <div className="ml-5 text-xl">
                    //     <ul className="space-y-4 relative ">
                    //         {data.map((item, index) => (
                    //             <li key={index} className="relative">
                    //                 {/* Line connecting the parents */}
                    //                 <div className={`absolute w-1 h-full ${item?.action === 'APPROVED' ? 'bg-green-100' : "bg-red-100"} bg-gray-300 left-0 top-0`}></div>
                    //                 <div className="flex items-center space-x-2">
                    //                     <div className="flex items-center">
                    //                         <div className={`w-5 h-1 ${item?.action === 'APPROVED' ? 'bg-green-100' : "bg-red-100"}`}></div>
                    //                         <span className="ml-2 text-gray-700 font-medium ">Approval Level:</span>
                    //                     </div>
                    //                     <span className="font-bold">{item.approvalLevelName}</span>
                    //                 </div>
                    //                 {/* Child list */}
                    //                 <ul className={`ml-3 mt-1 transition-all duration-300 ease-in-out block`}>
                    //                     <li className="relative p-1">
                    //                         <div className="absolute w-px h-full bg-gray-300 left-0 top-0"></div>
                    //                         <div className="flex items-center space-x-2">
                    //                             <div className="flex items-center">
                    //                                 <div className="w-1 h-px bg-gray-400"></div>
                    //                                 <span
                    //                                     className="ml-2 text-gray-700 font-medium">Status:</span>
                    //                             </div>
                    //                             <span className='font-semibold'>
                    //                                 {item.action === "APPROVED" ? (
                    //                                     <span className='bg-green-50 p-1'>Approved</span>
                    //                                 ) : (
                    //                                     <span className='bg-red-50 p-1'>Disapproved</span>
                    //                                 )}
                    //                             </span>
                    //                         </div>
                    //                     </li>
                    //                     <li className="relative p-1">
                    //                         <div className="absolute w-px h-full bg-gray-300 left-0 top-0"></div>
                    //                         <div className="flex items-center space-x-2">
                    //                             <div className="flex items-center">
                    //                                 <div className="w-1 h-px bg-gray-400"></div>
                    //                                 <span className="ml-2 text-gray-700 font-medium ">Approved By:</span>
                    //                             </div>
                    //                             <span className="ml-2 font-semibold">{item.approvedBy}</span>
                    //                         </div>
                    //                     </li>
                    //                     <li className="relative p-1">
                    //                         <div className="absolute w-px h-full bg-gray-300 left-0 top-0"></div>
                    //                         <div className="flex items-center space-x-2">
                    //                             <div className="flex items-center">
                    //                                 <div className="w-1 h-px bg-gray-400"></div>
                    //                                 <span
                    //                                     className="ml-2 text-gray-700 font-medium ">Remark:</span>
                    //                             </div>
                    //                             <span className="ml-2 font-semibold">{item.remark}</span>
                    //                         </div>
                    //                     </li>
                    //                     <li className="relative p-1">
                    //                         <div className="absolute w-px h-full bg-gray-300 left-0 top-0"></div>
                    //                         <div className="flex items-center space-x-2">
                    //                             <div className="flex items-center">
                    //                                 <div className="w-1 h-px bg-gray-400"></div>
                    //                                 <span
                    //                                     className="ml-2 text-gray-700 font-medium">Date:</span>
                    //                             </div>
                    //                             <span className="ml-2 font-semibold">{item.formattedCreatedAt}</span>
                    //                         </div>
                    //                     </li>
                    //                 </ul>
                    //             </li>
                    //         ))}
                    //     </ul>
                    // </div>


                    <div className="ml-5 text-xl relative">
                        {/* Continuous vertical line */}
                        <div className="absolute left-2 top-0 bottom-0 w-[2px] bg-gray-300"></div>

                        <ul className="space-y-6 relative z-10">
                            {data.map((item, index) => (
                                <li key={index} className="relative flex flex-col">
                                    <div className="flex items-center space-x-2">
                                        <div
                                            className={`w-4 h-4 rounded-full border-2 ${
                                                item?.action === 'APPROVED'
                                                    ? 'border-green-500 bg-green-100'
                                                    : 'border-red-500 bg-red-100'
                                            }`}
                                        ></div>
                                        <span className="text-gray-700 font-medium">Approval Level:</span>
                                        <span className="font-bold">{item.approvalLevelName}</span>
                                    </div>

                                    {/* Child details */}
                                    <ul className="ml-8 mt-2 space-y-1">
                                        <li>
                                            <span className="text-gray-700 font-medium">Status:</span>{' '}
                                            {item.action === 'APPROVED' ? (
                                                <span className="text-green-700 font-semibold bg-green-50 px-2 py-0.5 rounded">
                Approved
              </span>
                                            ) : (
                                                <span className="text-red-700 font-semibold bg-red-50 px-2 py-0.5 rounded">
                Disapproved
              </span>
                                            )}
                                        </li>
                                        <li>
                                            <span className="text-gray-700 font-medium">Approved By:</span>{' '}
                                            <span className="font-semibold">{item.approvedBy}</span>
                                        </li>
                                        <li>
                                            <span className="text-gray-700 font-medium">Remark:</span>{' '}
                                            <span className="font-semibold">{item.remark}</span>
                                        </li>
                                        <li>
                                            <span className="text-gray-700 font-medium">Date:</span>{' '}
                                            <span className="font-semibold">{item.formattedCreatedAt}</span>
                                        </li>
                                    </ul>
                                </li>
                            ))}
                        </ul>
                    </div>

            }
        </>
    );
};

export default TreeList;