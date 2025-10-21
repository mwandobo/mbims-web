This is the tree list for previous approval trail    




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