"use client"

import ProtectedRoute from "@/components/authentication/protected-route";
import MuiCardComponent from "@/components/card/mui-card.component";
import ViewCardComponent from "@/components/card/view.card.component";
import PageHeader from "@/components/header/page-header";
import {useEffect, useState} from "react";
import {useRouter} from "next/navigation"
import MuiCheckbox from "@/components/inputs/mui-checkbox";
import {CheckCircle2} from "lucide-react";
import {getRequest, postRequest} from "@/utils/api-calls.util";
import {ButtonComponent} from "@/components/button/button.component";

const groupPermissions = (permissions: any[]) => {
    const grouped = permissions.reduce((acc: any, permission: any) => {
        if (!acc[permission.group]) {
            acc[permission.group] = [];
        }
        acc[permission.group].push({
            ...permission,
            checked: false, // default unchecked
        });
        return acc;
    }, {});

    return Object.keys(grouped).map(groupName => ({
        name: groupName,
        checked: false,
        permissions: grouped[groupName]
    }));
};


const createPermissionCheckData = (permissions: any[], rolePermissions: any[]) => {

    console.log('permissions', permissions)
    const groupedPermissions = groupPermissions(permissions);


    // return groupedPermissions.map(group => ({
    //     ...group,
    //     checked: group.permissions.every((perm: any) =>
    //         rolePermissions.some((assignedPerm: any) => Number(assignedPerm.id) === Number(perm.id))
    //     ),
    //     permissions: group.permissions.map(perm => ({
    //         ...perm,
    //         checked: !!rolePermissions.find((assignedPerm: any) => Number(assignedPerm.id) === Number(perm.id))
    //     }))
    // }));

    return groupedPermissions
};


export default function RolesAssignPage({roleAssignId}: { roleAssignId: string }) {

    const id = roleAssignId
    const permission = 'role'

    const [data, setData] = useState<any>([])
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const [checkAll, setCheckAll] = useState(false);
    // const [groups, setGroups] = useState<any[]>(createPermissionCheckData(data?.allPermissions, data?.rolePermissions));
    const [groups, setGroups] = useState<any[]>([]);


    const handleCheck = (event: any, from?: string) => {
        const value = event?.target?.value;
        let updatedGrops: any[] = [];

        if (from === 'all') {
            setCheckAll(!checkAll)

            updatedGrops = groups.map((group: any) => {
                let updatedPerms = group.permissions.map((perm: any) => {
                    return {...perm, checked: !checkAll}
                });
                return {...group, checked: !checkAll, permissions: updatedPerms}
            });
        } else {
            let array_strin: any | undefined[] = from?.split('_');
            const groupName = array_strin[0]
            const groupId = array_strin[1]

            if (groupName === 'group') {

                updatedGrops = groups.map((group: any) => {
                    if (group.name === groupId) {
                        let updatedPerms = group.permissions.map((perm: any) => {
                            return {...perm, checked: !group.checked}
                        });
                        return {...group, checked: !group.checked, permissions: updatedPerms}
                    }
                    return group
                });
                const checkA = updatedGrops.every((per: any) => per.checked === true)
                setCheckAll(checkA)
            }
            if (groupName === 'perm') {
                updatedGrops = groups.map((group: any) => {
                    let updatedPerms = group.permissions.map((perm: any) => {
                        if (perm.id === groupId) {
                            return {...perm, checked: !perm.checked}
                        }

                        return perm;
                    });

                    const checkg = updatedPerms.every((per: any) => per.checked === true)
                    return {...group, checked: checkg, permissions: updatedPerms}
                });
            }
        }

        setGroups(updatedGrops)
    }


    const createPermissionPayload = () => {
        const selectedPermissions: number[] = [];

        groups.forEach(group => {
            group.permissions.forEach(perm => {
                if (perm.checked) {
                    selectedPermissions.push(perm.id);
                }
            });
        });

        return selectedPermissions;
    };

    const handleSave = async () => {
        try {
            setLoading(true)
            const payload = {
                role_id: 1,
                permissions: createPermissionPayload()
            }

            const res = await postRequest(`roles/assign/${id}`, payload);

            if ([200, 201].includes(res.status)) {
                setLoading(false)
                router.push(`/administration/roles/${id}`)
            }
        } catch (error) {
            console.error('An error occurred:', error);
        }
    }


    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            const res = await getRequest(`roles/permissions/${id}`)

            if ([200, 201].includes(res.status)) {
                setData(res.data)
                setGroups(createPermissionCheckData(res?.data?.allPermissions, res.data?.routePermissions))
                setLoading(false)
            }
        };
        fetchData()
    }, [])

    return (

        <ProtectedRoute
            permission={`${permission}_assign`}
            isLoading={loading}
        >

                        <PageHeader
                            links={[
                                {name: 'Role', linkTo: '/roles', permission: 'roles', isClickable: true},
                                {name: 'Assign', linkTo: '/roles/show', permission: ''},
                            ]}
                            isShowPage={true}
                        />
                        <MuiCardComponent>
                            <div className="mb-3">
                                <ViewCardComponent
                                    data={[
                                        {label: 'Name', value: data?.roleName},
                                    ]}
                                    titleA={`Role`}
                                    titleB={` ${data?.roleName} `}
                                />
                            </div>
                            <hr className="bg-gray-100"/>

                            <div className="mt-3 px-3">
                                <div className="border border-solid border-gray-200 p-4 tetx-xs">
                                    <>
                                        <h4 className="text-sm font-semibold">Permissions</h4>
                                        <div
                                            className={'flex w-full mb-2 border border-gray-300 shadow-md rounded-sm  p-2'}
                                        >
                                            <MuiCheckbox
                                                handleChange={handleCheck}
                                                label="All Permissions"
                                                from='all'
                                                checked={checkAll}
                                            />
                                        </div>
                                        <div className={'grid grid-cols-2 gap-2'}>
                                            {
                                                groups && groups.map((group, index) => (
                                                    <div
                                                        key={group.id}
                                                        className={'flex w-full border border-gray-300 shadow-md rounded-sm bg-gray-50 p-2'}
                                                        // sx={{
                                                        //     marginBottom: '20px',
                                                        //     paddingLeft: '20px'
                                                        // }}
                                                    >
                                                        <div className={'w-1/4'}>
                                                            <MuiCheckbox
                                                                handleChange={handleCheck}
                                                                label={group.name}
                                                                from={`group_${group.name}`}
                                                                checked={group.checked}
                                                            />
                                                        </div>

                                                        <hr/>
                                                        <div className="flex flex-col item-start ps-20 w-3/4">
                                                            {group.permissions && group.permissions.map((permission: any) => (
                                                                <MuiCheckbox
                                                                    key={permission.id}
                                                                    handleChange={handleCheck}
                                                                    label={permission.name}
                                                                    from={`perm_${permission.id}`}
                                                                    checked={permission.checked}
                                                                />
                                                            ))}
                                                        </div>
                                                    </div>
                                                ))
                                            }


                                        </div>


                                        <div className="flex justify-end mt-2">
                                            <ButtonComponent name={'save'}
                                                             onClick={handleSave}
                                                             rounded={'md'}
                                                             padding={'p-3'}
                                                             shadow={'shadow-md'}
                                                             bg_color={'bg-gray-200'}
                                                             hover={'hover:bg-gray-300 hover:border-gray-400'}
                                                             hover_text={'hover:text-gray-900 hover:font-semibold'}
                                                             border={'border border-gray-300'}
                                                             text_color={'text-gray-900'}
                                            >
                                                <CheckCircle2/>
                                            </ButtonComponent>
                                        </div>
                                    </>
                                </div>
                            </div>
                        </MuiCardComponent>
        </ProtectedRoute>
    );
};

