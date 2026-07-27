import UnitShowPage from "../components/unit-show-page";

export default async function Page({ params }: { params: Promise <{ unitId: string } >}) {
    const { unitId } = await params;

    return <UnitShowPage unitId={unitId} />;
}