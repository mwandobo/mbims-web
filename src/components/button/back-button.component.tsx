
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
                shadow={'shadow-md'}
                bg_color={'bg-gray-50'}
                hover={'hover:bg-gray-200 hover:border-gray-400'}
                hover_text={'hover:text-gray-900 hover:font-semibold'}
                border={'border border-gray-300'}
                text_color={'text-gray-700'}
            >
                <ArrowLeftSquare size={18} />
            </ButtonComponent>
        </div>
    )
}

export default BackButtonComponent