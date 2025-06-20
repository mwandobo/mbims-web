"use client"

import MuiTableFrontEndPagination from "@/components/tables/mui-table-front-end-pagination";

interface Props {
    data: any[]
}

const Columns = [
    {
        id: '',
        numeric: false,
        disablePadding: false,
        label: 'Name',
        width: '25%',

    },
    {
        id: 'Access',
        numeric: false,
        disablePadding: false,
        label: 'Access',
    },
]

export const PermTableComponent = ({ data }: Props) => {


    const createdRowData = (perm: any) => {
        return [
            perm.group,
            perm.name

        ]
    }

    const customFunction = () => {
        let payload: any[] = []

        data.forEach((perm_group: any) => {
            const row = createdRowData(perm_group)
            payload.push(row)
        })

        return payload
    }

    return (
        <div className="w-96" style={{ width: '100%' }}>
            {
                data && data.length > 0 ?
                    <MuiTableFrontEndPagination
                        columns={Columns}
                        data={customFunction()}
                    /> :
                    <p>No Permissions Assigned yet</p>
            }

        </div>
    )
}