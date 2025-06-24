import SupplierShowPage from "@/app/administration/suppliers/components/supplier-show-page";

export default async function Page({ params }: { params: Promise <{ supplierId: string } >}) {
    const { supplierId } = await params;

    return <SupplierShowPage supplierId={supplierId} />;
}