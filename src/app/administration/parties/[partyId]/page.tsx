import PartyShowPage from "@/app/administration/parties/components/party-show-page";

export default async function Page({ params }: { params: Promise <{ partyId: string } >}) {
    const { partyId } = await params;

    return <PartyShowPage partyId={partyId} />;
}