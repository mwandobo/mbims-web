"use client"

import {
    Book,
    FolderKanban,
    FolderOpenDot,
    HardDrive,
    LayoutDashboard,
    LucideIcon,
    NotebookPen,
    RollerCoaster,
    Settings,
    Table,
    User,
    Users,
    UserCheck,
    Calculator,
    FileIcon,
    FileSliders,
    FileSpreadsheet,
    FilePenLine,
    FileDiff,
    FileBox,
    FileClock,
    ReceiptPoundSterling,
    ShoppingCart,
    BadgeDollarSign,
    SquareDashedKanban,
    Store,
    BookKey,
    ShieldEllipsis,
    CalendarDays, Calendar, Proportions, BookOpenCheck
} from 'lucide-react'
import React from 'react'
import SidebarItem from './item'
import {useGlobalContextHook} from "@/hooks/useGlobalContextHook";
import {checkPermissions} from "@/utils/check-permissions";

interface ISidebarItem {
    name: string
    path: string
    icon: LucideIcon
    items?: ISubItem[]
    group?: string
    permission?: string
}

interface ISubItem {
    name: string
    path: string
    icon: LucideIcon
    group?: string
    permission?: string
}

const items: ISidebarItem[] = [
    {
        name: 'Dashboard',
        path: '/dashboard',
        icon: LayoutDashboard,
        permission: 'dashboard_read'
    },
    {
        name: 'Contracts',
        path: '/contracts',
        icon: FolderOpenDot,
        permission: 'contract_read',
    },
    {
        name: 'Licences',
        path: '/licences',
        permission: 'licence_read',
        icon: Book,
    },
    {
        name: 'Policies',
        path: '/policy',
        permission: 'policy_read',
        icon: Book,
    },
    {
        name: 'Reports',
        path: '/report',
        icon: FolderKanban,
        permission: 'report_read',
    },
    {
        name: 'Administration',
        path: '/administration',
        permission: 'administration_read',
        icon: ShieldEllipsis ,
        items: [
            {
                name: 'Departments',
                path: '/administration/departments',
                permission: 'department_read',
                icon: Table
            },
            {
                name: 'Employees',
                path: '/administration/employees',
                permission: 'employee_read',
                icon: User
            },

            {
                name: 'Parties',
                path: '/administration/parties',
                permission: 'party_read',
                icon: RollerCoaster
            },
            // {
            //     name: 'Suppliers',
            //     path: '/administration/suppliers',
            //     permission: 'supplier_read',
            //     icon: Users,
            // },
            // {
            //     name: 'Clients',
            //     path: '/administration/clients',
            //     permission: 'client_read',
            //     icon: Users,
            // },
            {
                name: 'Roles',
                path: '/administration/roles',
                permission: 'role_read',
                icon: RollerCoaster
            },
        ]
    },
    // {
    //     name: 'Settings',
    //     path: '/settings',
    //     permission: 'settings_read',
    //     icon: Settings ,
    // },
]

function Sidebar() {
    const {state} = useGlobalContextHook()
    const { isSideBarHidden} = state;

    return (
            <div className={`${isSideBarHidden ? 'hidden': 'block'} md:flex w-full md:w-1/4 md:border-e border-gray-200 h-[86vh]`}>
            <div className='h-full w-full'>
                <div className='bg-white px-2 h-full w-full'>
                    <hr className='bg-gray-200'/>
                    <div className="flex-col h-full w-full pt-10 pb-4 pe-4 overflow-auto scrollbar-thin">
                        {
                            items.map(item =>
                                    checkPermissions(item?.permission) && (
                                        <SidebarItem key={item.path} item={item}/>
                                    )
                            )
                        }
                    </div>
                 </div>
            </div>
        </div>
    )
}

export default Sidebar