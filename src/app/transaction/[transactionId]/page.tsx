import TransactionShowPage from "../components/transaction-show-page";

export default async function Page({ params }: { params: Promise <{ transactionId: string } >}) {
    const { transactionId } = await params;

    return <TransactionShowPage transactionId={transactionId} />;
}