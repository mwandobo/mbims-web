import SupplierShowPage from "@/app/administration/suppliers/components/supplier-show-page";
import RolesAssignPage from "@/app/administration/roles/components/role-assign-page";

export default async function Page({ params }: { params: Promise <{ roleAssignId: string } >}) {
    const { roleAssignId } = await params;

    return <RolesAssignPage roleAssignId={roleAssignId} />;
}