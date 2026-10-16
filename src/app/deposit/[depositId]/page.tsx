import DepositShowPageComponent from "../components/deposit-show-page.component";

export default async function DepositShowPage({ params }: { params: Promise <{ depositId: string } >}) {
    const { depositId } = await params;

    return <DepositShowPageComponent depositId={depositId} />;
}