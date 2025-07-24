'use client'

import { useEffect, useState } from 'react'
import { Button, MenuItem, Select, InputLabel, FormControl } from '@mui/material'
import { getRequest, postRequest } from '@/utils/api-calls.util'

const cronOptions = [
    { label: 'Every 5 seconds', value: '*/5 * * * * *' },  // every 5 seconds
    { label: 'Every 10 seconds', value: '*/10 * * * * *' }, // every 10 seconds
    { label: 'Every 30 seconds', value: '*/30 * * * * *' }, // every 30 seconds
    { label: 'Every minute', value: '* * * * *' }, // every minute
    { label: 'Every 5 minutes', value: '*/5 * * * *' }, // every 5 minutes
    { label: 'Every day at midnight', value: '0 0 * * *' },
    { label: 'Every day at 8am', value: '0 8 * * *' },
    { label: 'Every Monday at 9am', value: '0 9 * * 1' },
    { label: 'Every hour', value: '0 * * * *' },
];

export default function NotificationSettings() {
    const [cron, setCron] = useState('')
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        getRequest('settings/cron')
            .then((res) => setCron(res.data.cron))
            .catch(() => {})
    }, [])

    const save = async () => {
        setLoading(true)
        await postRequest('settings/cron', { cron })
        setLoading(false)
    }

    return (
        <div className="max-w-xl mx-auto p-6 border rounded">
            <h2 className="text-xl font-semibold mb-4">Contract Notification Schedule</h2>

            <FormControl fullWidth>
                <InputLabel id="cron-select-label">Notification Frequency</InputLabel>
                <Select
                    labelId="cron-select-label"
                    value={cron}
                    onChange={(e) => setCron(e.target.value)}
                >
                    {cronOptions.map((opt) => (
                        <MenuItem key={opt.value} value={opt.value}>
                            {opt.label}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            <Button
                className="mt-4"
                variant="contained"
                color="primary"
                onClick={save}
                disabled={loading}
            >
                Save
            </Button>
        </div>
    )
}
