import React, {useEffect, useState} from "react";
import {useGlobalContextHook} from "@/hooks/useGlobalContextHook";
import {getRequest} from "@/utils/api-calls.util";

interface Props {
    entityId: string;
    entityName: string;
}

const TreeList = ({entityId, entityName}: Props) => {
    const [data, setData] = useState<any>([]);
    const [loading, setLoading] = useState(false);
    const {state} = useGlobalContextHook();
    const {viewItemRefreshAfterApproval} = state;

    const url = `approval-actions?entityName=${entityName}&entityId=${entityId}`;

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const res = await getRequest(url);

                if (res.status === 200) {
                    const _data = res.data as any;
                    console.log(_data);
                    setData(_data?.data);
                }
            } catch (error: any) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [viewItemRefreshAfterApproval]);

    return (
        <>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <div className="ml-5 text-xl relative">
                    {/* Continuous vertical line */}
                    <div className="absolute left-2 top-0 bottom-0 w-[2px] bg-gray-300"></div>
                    <ul className="space-y-6 relative z-10">
                        {data.map((item: any, index: number) => (
                            <li key={index} className="relative flex flex-col">
                                {/* --- Approval Level Header --- */}
                                <div className="flex items-center space-x-2">
                                    <div
                                        className={`w-4 h-4 rounded-full border-2 ${
                                            item?.action === "APPROVED"
                                                ? "border-green-500 bg-green-100"
                                                : "border-red-500 bg-red-100"
                                        }`}
                                    ></div>
                                    <span className="text-gray-700 font-medium">Approval Level: </span>
                                    <span className="font-bold">{item.approvalLevelName}</span>
                                    {item.type === "AUTOMATIC" && (
                                        <span
                                            className="ml-3 text-xs uppercase bg-blue-100 text-blue-700 font-semibold px-2 py-0.5 rounded-full">   Automatic  </span>
                                    )}
                                </div>

                                {/* --- Child details --- */}
                                <ul className="ml-8 mt-2 space-y-1">
                                    <li>
                                        <span className="text-gray-700 font-medium">Status:</span>{" "}
                                        {item.action === "APPROVED" ? (
                                            <span
                                                className="text-green-700 font-semibold bg-green-50 px-2 py-0.5 rounded"> Approved </span>
                                        ) : (
                                            <span
                                                className="text-red-700 font-semibold bg-red-50 px-2 py-0.5 rounded">Disapproved </span>
                                        )}
                                    </li>
                                    <li>
                                        <span className="text-gray-700 font-medium">  Approved By:    </span>{" "}
                                        <span className="font-semibold">{item.createdByName}</span>
                                    </li>
                                    <li>
                                        <span className="text-gray-700 font-medium">Remark:</span>{" "}
                                        <span className="font-semibold">{item.description}</span>
                                    </li>
                                    <li>
                                        <span className="text-gray-700 font-medium">Date:</span>{" "}
                                        <span className="font-semibold"> {item.createdAt}</span>
                                    </li>

                                    {item.type === "AUTOMATIC" && (
                                        <li>
                                            <span className="text-gray-700 font-medium"> Trigger Type:  </span>{" "}
                                            <span className="font-semibold text-blue-700"> System-Generated </span>
                                        </li>
                                    )}
                                </ul>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </>
    );
};

export default TreeList;
