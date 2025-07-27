'use client'

import React, {useEffect, useState} from 'react'
import {FormControl, InputLabel, MenuItem, Select} from '@mui/material'
import {getRequest, postRequest} from '@/utils/api-calls.util'
import {ButtonComponent} from "@/components/button/button.component";
import {PlusCircle} from "lucide-react";
import ToastComponent from "@/components/popup/toast";
import {checkPermissions} from "@/utils/check-permissions";

const cronOptions = [
    {label: 'Every 5 seconds', value: '*/5 * * * * *'},  // every 5 seconds
    {label: 'Every 10 seconds', value: '*/10 * * * * *'}, // every 10 seconds
    {label: 'Every 30 seconds', value: '*/30 * * * * *'}, // every 30 seconds
    {label: 'Every minute', value: '* * * * *'}, // every minute
    {label: 'Every 5 minutes', value: '*/5 * * * *'}, // every 5 minutes
    {label: 'Every day at midnight', value: '0 0 * * *'},
    {label: 'Every day at 8am', value: '0 8 * * *'},
    {label: 'Every Monday at 9am', value: '0 9 * * 1'},
    {label: 'Every hour', value: '0 * * * *'},
];

export default function NotificationSettings() {
    const [cron, setCron] = useState('')
    const [savedCron, setSavedCron] = useState('')
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        getRequest('settings/cron')
            .then((res) => setSavedCron(res.data.cron))
            .catch(() => {
            })
    }, [])

    const save = async () => {
        setLoading(true)
        await postRequest('settings/cron', {cron})
        setSavedCron(cron)
        setLoading(false)
        ToastComponent({text: "Schedule Changed Successfully"})
    }

    const handleChange = (e: any) => {
        setCron(e.target.value)
    }

    return (
        <div className="w-1/2 p-6 border rounded text-gray-800">
            <h2 className="text-xl font-semibold mb-4 ">Contract Notification Schedule</h2>
            <div className="mb-2">
                <p className="inline-block bg-gray-100 px-2 py-2 rounded text-xl">
                    Current Schedule: {cronOptions.find(item => item.value === savedCron)?.label}
                </p>
            </div>

            {checkPermissions('settings_set_cron_schedule') &&
                <div className={'ps-24 mt-4'}>
                    <FormControl fullWidth sx={{
                        // This margin pushes the whole component down to make space for the label
                        marginTop: '16px',
                        // This prevents the label from being cut off
                        '& .MuiInputLabel-root': {
                            position: 'absolute',
                            top: '-8px', // This lifts the label up
                            left: '8px',
                            backgroundColor: 'white', // Prevents text overlap
                            padding: '0 4px', // Gives the label some breathing room
                            fontSize: '1.5rem' // Makes the label smaller when not focused
                        },
                        // Styles for the select itself
                        '& .MuiOutlinedInput-root': {
                            paddingTop: '10px',
                            paddingBottom: '10px',
                            fontSize: '0.875rem'
                        }
                    }}>
                        <InputLabel id="cron-select-label">Notification Frequency</InputLabel>
                        <Select
                            labelId="cron-select-label"
                            value={cron}
                            onChange={(e) => setCron(e.target.value)}
                            sx={{
                                '& .MuiSelect-select': {
                                    padding: '8px 32px 8px 14px' // top right bottom left
                                }
                            }}
                        >
                            {cronOptions.map((opt) => (
                                <MenuItem key={opt.value} value={opt.value}>
                                    {opt.label}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </div>
            }

            <div className={'flex justify-end mt-2'}>
                <ButtonComponent
                    name='Save'
                    onClick={save}
                    rounded={'md'}
                    padding={'p-1'}
                    shadow={'shadow-md'}
                    bg_color={'bg-gray-50'}
                    hover={'hover:bg-gray-200 hover:border-gray-400'}
                    hover_text={'hover:text-gray-900 hover:font-semibold'}
                    border={'border border-gray-300'}
                    text_color={'text-gray-700'}
                >
                    <PlusCircle size={18}/>
                </ButtonComponent>
            </div>


        </div>
    )
}
