import PositionShowPage from "@/app/administration/positions/components/position-show-page";

export default async function Page({ params }: { params: Promise <{ positionId: string } >}) {
    const { positionId } = await params;

    return <PositionShowPage positionId={positionId} />;
}