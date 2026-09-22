"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { postRequest } from "@/utils/api-calls.util"
import ToastComponent from "@/components/popup/toast"
import Swal from "sweetalert2"
import AuthSkeletonComponent from "@/components/auth-skeleton-component"
import TextFieldComponent from "@/components/inputs/text-field"
import { CheckCircle2 } from "lucide-react"

export default function RecoverPasswordPage() {
    const [loading, setLoading] = useState(false)
    const [email, setEmail] = useState("")
    const router = useRouter()

    const handleChange = (event: any, from: string) => {
        if (from === "email") {
            setEmail(event.target.value)
        }
    }

    async function handleSubmit() {
        try {
            setLoading(true)

            if (!email) {
                throw "Email is required"
            }

            const response = await postRequest<any>("auth/recover-password", { email })

            if (response.status !== 200) {
                throw "Failed to send recover password request"
            }

            ToastComponent({
                text: "Password recovery request sent successfully. Please check your email.",
                duration: 3000,
            })

            router.push("/login")
        } catch (error: any) {
            const message =
                error?.response?.data?.message ?? error?.message ?? error

            Swal.fire({
                title: "Error Occurred!",
                text: message,
                icon: "error",
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <AuthSkeletonComponent
            loading={loading}
            title="Password Recovery"
            subtitle="Enter your Email to Recover your Password"
        >
            <>
                <TextFieldComponent
                    placeholder="email"
                    from="email"
                    label="Email"
                    value={email}
                    onChange={handleChange}
                    isError={false}
                    errorMessage=""
                    layout="column"
                />

                <div className="w-full flex justify-center mt-4 mb-6">
                    <button
                        onClick={handleSubmit}
                        className="flex w-full border justify-center border-blue-800 p-2 rounded-2xl shadow-lg items-center bg-[#0c55d7] hover:bg-[#0a4bc2] text-white gap-3"
                    >
                        Recover Password <CheckCircle2 size={18} />
                    </button>
                </div>
            </>
        </AuthSkeletonComponent>
    )
}