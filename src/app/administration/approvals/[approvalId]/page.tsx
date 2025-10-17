import ApprovalShowPage from "@/app/administration/approvals/components/approval-show-page";

export default async function ApprovalShow({ params }: { params: Promise <{ approvalId: string } >}) {
    const { approvalId } = await params;

    return <ApprovalShowPage approvalId={approvalId} />;
}