import PolicyShowPage from "@/app/policy/components/policy-show-page";

export default async function Page({ params }: { params: Promise <{ policyId: string } >}) {
    const { policyId } = await params;

    return <PolicyShowPage policyId={policyId} />;
}