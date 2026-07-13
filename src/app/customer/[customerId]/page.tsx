import CustomerShowPage from "../components/customer-show-page";

export default async function Page({ params }: { params: Promise <{ customerId: string } >}) {
    const { customerId } = await params;

    return <CustomerShowPage customerId={customerId} />;
}