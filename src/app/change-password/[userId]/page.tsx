import ClientShowPage from "@/app/administration/clients/components/client-show-page";
import EmployeeShowPage from "@/app/administration/employees/components/employee-show-page";
import ChangePasswordComponent from "@/app/change-password/component/change-password-component";

export default async function ChangePasswordPage({ params }: { params: Promise <{ userId: string } >}) {
    const { userId } = await params;

    return <ChangePasswordComponent userId={userId} />;
}