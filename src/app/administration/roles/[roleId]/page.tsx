import RoleShowPage from "@/app/administration/roles/components/role-show-page";

export default async function Page({ params }: { params: Promise <{ roleId: string } >}) {
    const { roleId } = await params;

    return <RoleShowPage roleId={roleId} />;
}