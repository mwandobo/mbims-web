'use client';

import React, {useEffect, useMemo, useState} from 'react';
import {Bell, Circle, MailOpen, SquareArrowOutUpRight, Trash} from 'lucide-react';
import DropdownComponent from '@/components/dropdown/dropdown.component';
import {useGlobalContextHook} from '@/hooks/useGlobalContextHook';
import {useRouter} from "next/navigation";
import ToastComponent from "@/components/popup/toast";
import {getValueFromLocalStorage, setValueLocalStorage} from "@/utils/local-storage.util";
import {deleteRequest, getRequest} from "@/utils/api-calls.util";
import LoadingComponent from "@/components/status/loading.component";
import {showConfirmationModal} from "@/utils/show-alert-dialog";

const NotificationComponent = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(false)
    const [expandedNotification, setExpandedNotification] = useState<number | null>(null); // Track expanded notification
    const {state, dispatch} = useGlobalContextHook();
    const router = useRouter()
    const token = getValueFromLocalStorage("token");

    const {refreshNotification, currentUser} = state;

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
                try {
                    const res = await getRequest('notifications')
                    if ( res.status === 200) {
                        // @ts-ignore
                        setNotes(res.data?.data);
                        setLoading(false)
                    }

                } catch (error: any) {
                    if (error?.code === "ERR_NETWORK") {
                        console.log('error')
                    }
                }
        };
        fetchData()
    }, [refreshNotification, token,currentUser ]);

    console.log('notes', notes)

    const toggleIsDropdownOpen = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const toggleExpand = async (index: number) => {
        setExpandedNotification(expandedNotification === index ? null : index);
        const note = notes[index];

        if (!note?.isRead) {
            try {
                const updatedNotification = await getRequest(`notifications/${note?.id}/read`);
                if (updatedNotification.status === 200) {
                    // Create a new array so React detects the change
                    const updatedNotes = notes.map((n, i) =>
                        i === index ? { ...n, isRead: true } : n
                    );
                    setNotes(updatedNotes);
                }
            } catch (error) {
                console.error("Error updating notification:", error);
            }
        }
    };

    const handleDelete = async (index: number, event: any) => {
        event.stopPropagation();
        const note = notes[index]// Toggle expanded state
        try {
            const response = await deleteRequest(`notifications/${note?.id}`);
            if (response.status === 200) {
                const newNotes = notes.filter((note, _index) => Number(_index) !== Number(index))
                setNotes(newNotes)
                ToastComponent({text:'Deleted Successfully'})
            }
        } catch (error) {
            console.error("Error fetching notifications:", error);
        }
    };

    const handleDeleteAll = () => {
        if (notes.length === 0) {
            return ToastComponent({ type: 'info', text: 'No notifications to delete' });
        }

        showConfirmationModal({
            title: 'Are you sure?',
            text: 'This will permanently delete all notifications. Do you want to continue?',
            onConfirm: async () => {
                try {
                    const response = await getRequest(`notifications/delete-all`);
                    if (response.status === 200) {
                        setNotes([]);
                        ToastComponent({ text: 'All notifications deleted successfully' });
                    }
                } catch (error) {
                    console.error('Error deleting all notifications:', error);
                }
            },
            onCancel: () => console.log('User canceled delete-all'),
        });
    };


    const handleReadAll = async () => {
        try {
            const updatedNotificationResult = await getRequest(`notifications/read-all`);
            if (updatedNotificationResult.status === 200) {
                const newNotes = notes.map(note => {
                    return {...note, isRead: true}
                })
                setNotes(newNotes)
            }
        } catch (error) {
            console.error("Error fetching notifications:", error);
        }
    };
    //
    // const handleDeleteAll = async () => {
    //     try {
    //         const updatedNotificationResult = await getRequest(`notifications/delete-all`);
    //         if (updatedNotificationResult.status === 200) {
    //             setNotes([])
    //         }
    //     } catch (error) {
    //         console.error("Error fetching notifications:", error);
    //     }
    // };

    const unreadCount = useMemo(
        () => notes.filter(note => !note.isRead).length,
        [notes]
    );

    const handleViewClick = (notificationBody: any) => {
        const {redirectUrl, group, state_redirect_url, for_id} = notificationBody
        if (!redirectUrl) {
            return ToastComponent({
                type: 'error',
                text: 'Something went Wrong. Data not Available'
            })
        }

        if (group) {
            let body = null;

            switch (group) {
                case 'plan':
                    const redirect_body = {id: for_id, from: state_redirect_url}
                    dispatch({type: 'SET_PLANNING_ITEM', payload: redirect_body})
                    break;
                case 'procurement':
                    body = {id: for_id, from: state_redirect_url}
                    dispatch({type: "SET_SUB_VIEW_ITEM", payload: body});
                    break;
                case 'finance':
                    body = {id: for_id, from: state_redirect_url}
                    dispatch({type: "SET_SUB_VIEW_ITEM", payload: body});
                    break;
                case 'sales':
                    body = {id: for_id, from: state_redirect_url}
                    dispatch({type: "SET_SUB_VIEW_ITEM", payload: body});
                    break;
                case 'inventory':
                    body = {id: for_id, from: state_redirect_url}
                    dispatch({type: "SET_SUB_VIEW_ITEM", payload: body});
                    break;
                case 'workshop':
                    body = {id: for_id, from: state_redirect_url}
                    dispatch({type: "SET_SUB_VIEW_ITEM", payload: body});
                    break;
            }
        }
        router.push(redirectUrl)
        setIsDropdownOpen(false);
    }

    if(loading){
        return  <LoadingComponent />
    }

    return (
        <div className={''}>
            <button
                onClick={toggleIsDropdownOpen}
                className={`flex flex-col items-center space-x-2 focus:outline-none p-2 rounded-full ${
                    unreadCount> 0 && 'animate-pulse border border-gray-200'
                }`}
            >
                <Bell className={'text-gray-800 '}/>
                <span
                    className={
                        'ps-4 -mt-2 text-xs text-red-400 font-semibold'
                    }
                >
                    {unreadCount > 0 ? unreadCount : ''}
                </span>
            </button>
            <div className={'bg-red-200'}>
                <DropdownComponent name={'Notifications'} toggleOpen={toggleIsDropdownOpen} isOpen={isDropdownOpen}>
                    <div className={'w-full flex flex-col text-xs text-gray-800'}>
                        <div className={'flex justify-between items-center mb-2'}>
                            <h3 className={'font-medium text-sm'}>Notifications</h3>

                            <div className={'flex gap-2'}>
                                <button
                                    onClick={handleDeleteAll}
                                >
                                    <Trash size={14} strokeWidth={3} className={'text-red-400'}/>
                                </button>
                                <button
                                    onClick={handleReadAll}
                                >
                                    <MailOpen size={14} strokeWidth={3} className={'text-gray-600'}/>
                                </button>
                            </div>
                        </div>
                        <div className={'w-full flex flex-col'}>
                            {notes && notes?.map((note, index) => (
                                <div
                                    key={index}
                                    className={`flex flex-col ${index % 2 === 0 ? 'bg-white ' : 'bg-gray-100'} p-2 mb-1 ${!note.isRead && 'text-xs font-semibold'}`}
                                    onClick={() => toggleExpand(index)} // Expand row on click
                                >
                                    {/* Main row */}
                                    <div className={'flex justify-between'}>
                                        <div className="flex items-center">
                                            {!note.isRead ?
                                                <Circle size={6} className={'text-red-500 me-1'} strokeWidth={6}/> :
                                                <p className={'ms-2'}></p>
                                            }
                                            <p className="me-1">{index + 1}</p>
                                            <p>{note.title}</p>
                                        </div>
                                        <div className={'flex gap-2 items-center'}>
                                            <button
                                                onClick={(event) => handleDelete(index, event)}
                                                className={'z-10'}
                                            >
                                                <Trash size={10} strokeWidth={4} className={'text-red-400'}/>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Expanded details */}
                                    {expandedNotification === index && (
                                        <div className="mt-2 text-gray-700 ps-4">
                                            <p className={`border  ${index % 2 === 0 ? 'border-gray-200' : 'border-gray-300'} p-1 ps-2 rounded-md`}>{note?.description}</p>
                                            <div className={'flex gap-3 justify-between'}>
                                                <button onClick={() => handleViewClick(note)} style={{fontSize: '9px'}}
                                                        className={'text-blue-500 flex gap-1 items-center'}>view <SquareArrowOutUpRight
                                                    size={10}/></button>
                                                <div className={'flex gap-3 justify-end'}>
                                                    <p style={{fontSize: '9px'}}>Sender: {note?.user_name || 'Unknown'}</p>
                                                    <p style={{fontSize: '9px'}}>Sent
                                                        On: {note?.formatted_date || 'Unknown'}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </DropdownComponent>
            </div>
        </div>
    );
};

export default NotificationComponent;
