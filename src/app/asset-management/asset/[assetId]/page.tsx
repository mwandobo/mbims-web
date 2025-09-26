import AssetShowPage from "@/app/asset-management/asset/components/asset-show-page";

export default async function Page({ params }: { params: Promise <{ assetId: string } >}) {
    const { assetId } = await params;

    return <AssetShowPage assetId={assetId} />;
}