import LicenceShowPage from "@/app/licences/components/licence-show-page";

export default async function Page({ params }: { params: Promise <{ licenceId: string } >}) {
    const { licenceId } = await params;

    return <LicenceShowPage licenceId={licenceId} />;
}