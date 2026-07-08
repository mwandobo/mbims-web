import DepartmentShowPage from "@/app/administration/departments/components/department-show-page";

export default async function Page({ params }: { params: Promise <{ departmentId: string } >}) {
    const { departmentId } = await params;

    return <DepartmentShowPage departmentId={departmentId} />;
}