import ContractShowPage from "@/app/contracts/components/contract-show-page";

export default async function Page({ params }: { params: Promise <{ contractId: string } >}) {
    const { contractId } = await params;

    return <ContractShowPage contractId={contractId} />;
}