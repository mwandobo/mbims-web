import AssetCategoryShowPage from "@/app/asset-management/asset-category/components/asset-category-show-page";

export default async function Page({ params }: { params: Promise <{ assetCategoryId: string } >}) {
    const { assetCategoryId } = await params;

    return <AssetCategoryShowPage assetCategoryId={assetCategoryId} />;
}