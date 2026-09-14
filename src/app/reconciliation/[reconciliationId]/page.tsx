
import ReconciliationShowPage from "@/app/reconciliation/components/reconciliation-show-page";

export default async function Page({ params }: { params: Promise <{ employeeId: string } >}) {
    const { employeeId } = await params;

    return <ReconciliationShowPage employeeId={employeeId} />;
}