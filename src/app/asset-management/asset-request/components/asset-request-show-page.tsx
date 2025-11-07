"use client";

import ProtectedRoute from "@/components/authentication/protected-route";
import MuiCardComponent from "@/components/card/mui-card.component";
import ViewCardComponent from "@/components/card/view.card.component";
import PageHeader from "@/components/header/page-header";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getRequest } from "@/utils/api-calls.util";
import RequestedItems from "@/app/asset-management/asset-request/components/requested-items";
import {ButtonComponent} from "@/components/button/button.component";
import {CheckCircle2} from "lucide-react";
import {useApprovalsAndButtonsHook} from "@/hooks/useApprovalAndButtons.hook";
import {ASSET_REQUEST_APPROVAL} from "@/utils/constants";
import ToastComponent from "@/components/popup/toast";
import {showConfirmationModal} from "@/utils/show-alert-dialog";

export default function AssetRequestShowPage({ assetId }: { assetId: string }) {
    const permission = "position";
    const router = useRouter();
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const id = assetId;
    const url = `asset-requests/${id}`;
    const navigateToLogin = () => {
        return router.push("/login");
    };

    const onSave = async () => {
        try {
            setLoading(true);
            const res = await getRequest(`${url}/submit`);
            if (res && res.status === 200) {
                ToastComponent({ type: 'success', text: 'Asset Request submitted successfully' });
                await fetchData(); // refresh data
                router.refresh(); // refresh Next.js route data (if using App Router)
            }
        } catch (error: any) {
            const text = error?.response?.data?.message ?? error?.response?.data?.error;
            ToastComponent({ type: 'error', text: text ?? 'Something went wrong' });
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = () => {
        showConfirmationModal({
            title: 'Are You Sure?',
            text: `Are You Sure You Want To Submit Asset Request name: ${data?.name}?`,
            onConfirm: onSave,  // Action to perform on confirmation
            onCancel: () => console.log('User canceled the action'), // Optional cancel action
        });
    };

    const fetchData = async () => {
        setLoading(true);
        if (id) {
            try {
                const res = await getRequest(url);
                if (res && res.status === 200) {
                    setData(res.data);
                }
            } catch (error: any) {
                if (error?.code === "ERR_NETWORK") {
                    navigateToLogin();
                }
            } finally {
                setLoading(false);
            }
        }
    };

    const {
        approvalsAndButtonsWrapper,
    } = useApprovalsAndButtonsHook({
        approval_slug: ASSET_REQUEST_APPROVAL,
        from: ASSET_REQUEST_APPROVAL,
        from_id: id,
        approvalStatus: data?.approvalStatus,
        hasApprovalMode: data?.hasApprovalMode,
        shouldApprove: data?.shouldApprove,
        isMyLevelApproved: data?.isMyLevelApproved,
        currentLevelId: data?.currentLevelId,
        entityCreatorId: data?.user?.id,
        entityId:id,
        entityName: data?.name,
        extraData1: data?.items ,

    onAfterApprove: fetchData,
        redirectUrl: `asset-management/asset-request/${id}`
    })

    useEffect(() => {
        fetchData();
    }, []);

    const buttonsBody = () => {
        return <>
            {data?.status === 'pending' &&
                <ButtonComponent
                    name={'Send Asset'}
                    onClick={handleSubmit}
                    rounded={'md'}
                    padding={'p-3'}
                    shadow={'shadow-md'}
                    bg_color={'bg-gray-50'}
                    hover={'hover:bg-gray-200 hover:border-gray-400'}
                    hover_text={'hover:text-gray-900 hover:font-semibold'}
                    border={'border border-gray-300'}
                    text_color={'text-gray-700'}
                >
                    <CheckCircle2 size={13}/>
                </ButtonComponent>
            }
        </>
    }

    return (
        <ProtectedRoute permission={`${permission}_read`} isLoading={loading}>
            <PageHeader
                links={[
                    {
                        name: "Asset Management / Asset Request",
                        linkTo: "/asset-management/asset",
                        permission: "asset",
                        isClickable: true,
                    },
                    { name: "Show", linkTo: "/asset-management/asset/show", permission: "" },
                ]}
                isShowPage={true}
            />

            <MuiCardComponent>
                <ViewCardComponent
                    data={[
                        { label: "Request Name", value: data?.name },
                        { label: "Status", value: data?.status },
                        { label: "Description", value: data?.description },
                    ]}
                    titleA="Asset Request"
                    titleB={data?.name}
                    OptionalElement={approvalsAndButtonsWrapper({buttonBody: buttonsBody()})}
                />

            </MuiCardComponent>

            <div className={'border border-gray-200 my-4'}>
                <RequestedItems id={id} permission={permission} />
            </div>
        </ProtectedRoute>
    );
}
