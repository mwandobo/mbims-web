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

const createPermissionCheckData = (allPermissions: any[], rolePermissions: any[]) => {
    const assignedIds = rolePermissions.map((perm: any) => perm.id);

    const grouped = allPermissions.reduce((acc: any, permission: any) => {
        if (!acc[permission.group]) acc[permission.group] = [];
        acc[permission.group].push({
            ...permission,
            checked: assignedIds.includes(permission.id)  // Mark as checked if user has it
        });
        return acc;
    }, {});

    const groups = Object.keys(grouped).map(groupName => {
        const groupPermissions = grouped[groupName];
        const allChecked = groupPermissions.every((perm: any) => perm.checked);
        return {
            name: groupName,
            checked: allChecked,
            permissions: groupPermissions
        };
    });

    return groups;
};

const createPermissionCheckAll = (allPermissions: any[], rolePermissions: any[]): boolean => {
    const rolePermissionIds = rolePermissions.map((perm: any) => perm.id);
    return allPermissions.every((perm: any) => rolePermissionIds.includes(perm.id));
};

export default function RolesAssignPage({roleAssignId}: { roleAssignId: string }) {
    const id = roleAssignId
    const permission = 'role'
    const [data, setData] = useState<any>([])
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const [checkAll, setCheckAll] = useState(false);
    const [groups, setGroups] = useState<any[]>([]);

    const handleCheck = (event: any, from?: string) => {
        if (!from) return;

        let updatedGroups: any[] = [];

        if (from === 'all') {
            const next = !checkAll;
            setCheckAll(next);

            updatedGroups = groups.map((group: any) => ({
                ...group,
                checked: next,
                permissions: group.permissions.map((perm: any) => ({
                    ...perm,
                    checked: next,
                })),
            }));
        } else {
            const [type, id] = from.split('::');

            if (type === 'group') {
                updatedGroups = groups.map((group: any) => {
                    if (group.name !== id) return group;

                    const next = !group.checked;
                    return {
                        ...group,
                        checked: next,
                        permissions: group.permissions.map((perm: any) => ({
                            ...perm,
                            checked: next,
                        })),
                    };
                });
                setCheckAll(updatedGroups.every((g: any) => g.checked));
            }

            if (type === 'perm') {
                updatedGroups = groups.map((group: any) => {
                    const updatedPerms = group.permissions.map((perm: any) => {
                        if (String(perm.id) !== String(id)) return perm;
                        return { ...perm, checked: !perm.checked };
                    });
                    return {
                        ...group,
                        checked: updatedPerms.every((p: any) => p.checked),
                        permissions: updatedPerms,
                    };
                });
                setCheckAll(updatedGroups.every((g: any) => g.checked));
            }
        }

        setGroups(updatedGroups);
    };



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
            // const res = await getRequest(`roles/permissions/${id}`)

            const res: any = await getRequest(`roles/permissions/${id}`)

            if ([200, 201].includes(res.status)) {
                setData(res.data)
                setGroups(createPermissionCheckData(res?.data?.allPermissions, res?.data?.rolePermissions))
                setCheckAll(createPermissionCheckAll(res?.data?.allPermissions,res?.data?.rolePermissions ))
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
                            <hr className="border-card-border" />

                            <div className="mt-3 px-3">
                                <div className="border border-solid border-card-border p-4 text-xs">
                                    <h4 className="text-sm font-semibold text-foreground">Permissions</h4>

                                    <div className="flex w-full mb-2 border border-card-border shadow-md rounded-sm p-2 bg-card-bg">
                                        <MuiCheckbox
                                            handleChange={handleCheck}
                                            label="All Permissions"
                                            from="all"
                                            checked={checkAll}
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-2">
                                        {groups &&
                                            groups.map((group) => (
                                                <div
                                                    key={group.name}
                                                    className="flex w-full border border-card-border shadow-md rounded-sm bg-muted-bg p-2"
                                                >
                                                    <div className="w-1/4">
                                                        <MuiCheckbox
                                                            handleChange={handleCheck}
                                                            label={group.name}
                                                            from={`group::${group.name}`}
                                                            checked={group.checked}
                                                        />
                                                    </div>

                                                    <hr className="border-card-border" />

                                                    <div className="flex flex-col items-start ps-20 w-3/4">
                                                        {group.permissions?.map((permission: any) => (
                                                            <MuiCheckbox
                                                                key={permission.id}
                                                                handleChange={handleCheck}
                                                                label={permission.name}
                                                                from={`perm::${permission.id}`}
                                                                checked={permission.checked}
                                                            />
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                    </div>

                                    <div className="flex justify-end mt-2">
                                        <ButtonComponent
                                            name="save"
                                            onClick={handleSave}
                                            rounded="md"
                                            padding="p-3"
                                        >
                                            <CheckCircle2 />
                                        </ButtonComponent>
                                    </div>
                                </div>
                            </div>
                        </MuiCardComponent>
        </ProtectedRoute>
    );
};

