import AssetShowPage from "@/app/asset-management/asset/components/asset-show-page";
import AssetRequestShowPage from "@/app/asset-management/asset-request/components/asset-request-show-page";

export default async function Page({ params }: { params: Promise <{ assetRequestId: string } >}) {
    const { assetRequestId } = await params;

    return <AssetRequestShowPage assetId={assetRequestId} />;
}