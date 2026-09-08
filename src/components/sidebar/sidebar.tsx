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
    CalendarDays, Calendar, Proportions, BookOpenCheck, ArrowLeftRight, Terminal,
    Scale
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
        name: 'Compare Excel',
        path: '/compare-excel',
        icon: ArrowLeftRight,
        permission: 'compare_excel_read',
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
                name: 'Positions',
                path: '/administration/positions',
                permission: 'position_read',
                icon: Table
            },
            {
                name: 'Employees',
                path: '/administration/employees',
                permission: 'employee_read',
                icon: User
            },
              {
                name: 'Units',
                path: '/administration/units',
                permission: 'unit_read',
                icon: User
            },
            {
                name: 'Roles',
                path: '/administration/roles',
                permission: 'role_read',
                icon: RollerCoaster
            },
            {
                name: 'Approvals',
                path: '/administration/approvals',
                permission: 'approval_read',
                icon: Terminal
            },
        ]
    },
    {
        name: 'Asset Management',
        path: '/asset-management',
        permission: 'asset_management_read',
        icon: ShieldEllipsis ,
        items: [
            {
                name: 'Asset Categories',
                path: '/asset-management/asset-category',
                permission: 'asset_category_read',
                icon: Table
            },
            {
                name: 'Assets',
                path: '/asset-management/asset',
                permission: 'asset_read',
                icon: Table
            },
            {
                name: 'Asset Request',
                path: '/asset-management/asset-request',
                permission: 'asset_request_read',
                icon: User
            },
        ]
    },

     {
        name: 'Performance Management',
        path: '/performance-management',
        permission: 'performance_read',
        icon: Scale 
    },

        {
        name: 'Customers',
        path: '/customer',
        permission: 'customer_read',
        icon: Users 
    },
          {
        name: 'Transactions',
        path: '/transaction',
        permission: 'transaction_read',
        icon: Users 
    },
    {
        name: 'Reconciliation',
        path: '/reconciliation',
        icon: ArrowLeftRight,
        permission: 'reconciliation_read',
    },
]

// function Sidebar() {
//     const {state} = useGlobalContextHook()
//     const { isSideBarHidden} = state;
//
//     return (
//             <div className={`${isSideBarHidden ? 'hidden': 'block'} md:flex w-full md:w-1/4 lg:w-1/8 md:border-e border-gray-200 h-[86vh]`}>
//             <div className='h-full w-full'>
//                 <div className='bg-white px-2 h-full w-full'>
//                     <hr className='bg-gray-200'/>
//                     <div className="flex-col h-full w-full pt-10 pb-4 pe-4 overflow-auto scrollbar-thin">
//                         {
//                             items.map(item =>
//                                     checkPermissions(item?.permission) && (
//                                         <SidebarItem key={item.path} item={item}/>
//                                     )
//                             )
//                         }
//                     </div>
//                  </div>
//             </div>
//         </div>
//     )
// }



function Sidebar() {
    const { state } = useGlobalContextHook();
    const { isSideBarHidden } = state;

    return (
        <div
            className={`
                fixed inset-y-0 left-0 z-40
                w-64                          /* fixed width on mobile */
                md:w-56 lg:w-64               /* fixed widths instead of 1/4 or 1/8 */
                bg-white border-e border-gray-200
                h-[86vh]
                transform transition-transform duration-300 ease-in-out
                ${isSideBarHidden ? '-translate-x-full' : 'translate-x-0'}
                md:relative md:translate-x-0 md:flex-shrink-0
            `}
        >
            <div className="h-full w-full">
                <div className="bg-white px-2 h-full w-full">
                    <hr className="bg-gray-200" />
                    <div className="flex flex-col h-full w-full pt-10 pb-4 pe-4 overflow-y-auto overflow-x-hidden scrollbar-thin">
                        {items.map(
                            (item) =>
                                checkPermissions(item?.permission) && (
                                    <SidebarItem key={item.path} item={item} />
                                )
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
export default Sidebar