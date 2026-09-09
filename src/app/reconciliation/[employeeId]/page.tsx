import ClientShowPage from "@/app/administration/clients/components/client-show-page";
import EmployeeShowPage from "@/app/administration/employees/components/employee-show-page";

export default async function Page({ params }: { params: Promise <{ employeeId: string } >}) {
    const { employeeId } = await params;

    return <EmployeeShowPage employeeId={employeeId} />;
}