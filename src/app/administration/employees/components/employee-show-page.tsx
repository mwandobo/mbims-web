"use client";

import ProtectedRoute from "@/components/authentication/protected-route";
import MuiCardComponent from "@/components/card/mui-card.component";
import ViewCardComponent from "@/components/card/view.card.component";
import PageHeader from "@/components/header/page-header";
import { ButtonComponent } from "@/components/button/button.component";
import { checkPermissions } from "@/utils/check-permissions";
import { showConfirmationModal } from "@/utils/show-alert-dialog";
import { postRequest } from "@/utils/api-calls.util";
import { CheckCircle2 } from "lucide-react";
import { useState } from "react";
import {usePageShow} from "@/hooks/page-render-hooks/use-page-show";

export default function EmployeeShowPage({
                                             employeeId,
                                         }: {
    employeeId: string;
}) {
    const permission = "employee";
    const url = `administration/employees/${employeeId}`;
    const { data, loading, refresh } = usePageShow(url);
    const [buttonLoading, setButtonLoading] = useState(false);

    const onSave = async () => {
        try {
            const res = await postRequest(`${url}/share-credential`, {});
            if (res?.status === 200) {
                refresh();
            }
        } catch (err: any) {
            // optional: Swal here
            console.error(err);
        } finally {
            setButtonLoading(false);
        }
    };

    const handleSubmit = () => {
        setButtonLoading(true);
        showConfirmationModal({
            title: "Are You Sure?",
            text: `Share credentials with ${data?.name}?`,
            onConfirm: onSave,
            onCancel: () => setButtonLoading(false),
        });
    };

    return (
        <ProtectedRoute permission={`${permission}_read`} isLoading={loading}>
            <PageHeader
                links={[
                    {
                        name: "Employee",
                        linkTo: "/administration/employees",
                        permission: "employee",
                        isClickable: true,
                    },
                    { name: "Show", linkTo: "", permission: "" },
                ]}
                isShowPage
            />
            <MuiCardComponent>
                {data?.email &&
                    checkPermissions(`${permission}_share_credential`) && (
                        <ButtonComponent
                            name={
                                data.isCredentialShared
                                    ? "Resend Credentials"
                                    : "Share Credentials"
                            }
                            onClick={handleSubmit}
                            rounded="md"
                            padding="p-3"
                            isLoading={buttonLoading}
                            isDisabled={buttonLoading}
                        >
                            <CheckCircle2 size={13} />
                        </ButtonComponent>
                    )}

                <ViewCardComponent
                    data={[
                        { label: "Employee Name", value: data?.name },
                        { label: "Staff No", value: data?.staffNo },
                        { label: "Email", value: data?.email },
                        { label: "Phone", value: data?.mobilePhone },
                        { label: "Date Joined", value: data?.createdAt },
                        { label: "Gender", value: data?.gender },
                        { label: "Unit", value: data?.unitName ?? "---" },
                        { label: "Department", value: data?.departmentName ?? "---" },
                        { label: "Position", value: data?.positionName ?? "---" },
                    ]}
                    titleA="Employee"
                    titleB={data?.name}
                />
            </MuiCardComponent>
        </ProtectedRoute>
    );
}