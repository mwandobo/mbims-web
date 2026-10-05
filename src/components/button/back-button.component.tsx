
"use client"

import { ArrowLeftSquare } from "lucide-react";
import { useRouter } from "next/navigation";
import { ButtonComponent } from "./button.component";

const BackButtonComponent = () => {
    const router = useRouter();
    const handleNavigateBack = () => {
        router.back(); // Navigate back in history
    };

    return (
        <div>
            <ButtonComponent
                name="Back"
                onClick={handleNavigateBack}
                rounded={'md'}
                padding={'p-1'}
            >
                <ArrowLeftSquare size={18} />
            </ButtonComponent>
        </div>
    )
}

export default BackButtonComponent