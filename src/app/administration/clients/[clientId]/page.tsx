import ClientShowPage from "@/app/administration/clients/components/client-show-page";

export default async function Page({ params }: { params: Promise <{ clientId: string } >}) {
    const { clientId } = await params;

    return <ClientShowPage clientId={clientId} />;
}