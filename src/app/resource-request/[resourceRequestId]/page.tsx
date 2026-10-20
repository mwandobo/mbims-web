import AssetRequestShowPageComponent from "@/app/resource-request/components/asset-request-show-page";

export default async function ResourceRequestShowPage({ params }: { params: Promise <{ resourceRequestId: string } >}) {
    const { resourceRequestId } = await params;

    return <AssetRequestShowPageComponent resourceRequestId={resourceRequestId} />;
}