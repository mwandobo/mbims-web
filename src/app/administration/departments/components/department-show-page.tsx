"use client";

import ProtectedRoute from "@/components/authentication/protected-route";
import MuiCardComponent from "@/components/card/mui-card.component";
import ViewCardComponent from "@/components/card/view.card.component";
import PageHeader from "@/components/header/page-header";
import {usePageShow} from "@/hooks/page-render-hooks/use-page-show";

export default function DepartmentShowPage({
                                               departmentId,
                                           }: {
    departmentId: string;
}) {
    const permission = "department";
    const { data, loading } = usePageShow(`departments/${departmentId}`);

    return (
        <ProtectedRoute permission={`${permission}_read`} isLoading={loading}>
            <PageHeader
                links={[
                    {
                        name: "Department",
                        linkTo: "/administration/departments",
                        permission: "departments",
                        isClickable: true,
                    },
                    { name: "Show", linkTo: "", permission: "" },
                ]}
                isShowPage
            />
            <MuiCardComponent>
                <ViewCardComponent
                    data={[
                        { label: "Department Name", value: data?.name },
                        { label: "Description", value: data?.description },
                    ]}
                    titleA="Department"
                    titleB={data?.name}
                />
            </MuiCardComponent>
        </ProtectedRoute>
    );
}