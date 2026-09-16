
import ReconciliationShowPage from "@/app/reconciliation/components/reconciliation-show-page";

export default async function Page({ params }: { params: Promise <{ reconciliationId: string } >}) {
    const { reconciliationId } = await params;

    return <ReconciliationShowPage reconciliationId={reconciliationId} />;
}