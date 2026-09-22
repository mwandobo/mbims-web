"use client"

import { useRouter } from "next/navigation"
import React, { useState } from "react"
import { postRequest } from "@/utils/api-calls.util"
import { CheckCircle2 } from "lucide-react"
import AuthSkeletonComponent from "@/components/auth-skeleton-component"
import TextFieldComponent from "@/components/inputs/text-field"
import Swal from "sweetalert2"
import ToastComponent from "@/components/popup/toast";
import {setValueLocalStorage} from "@/utils/local-storage.util";
import {useGlobalContextHook} from "@/hooks/useGlobalContextHook";

export default function ChangePasswordComponent({ userId }: { userId: string }) {
    const [loading, setLoading] = useState(false)
    const [newPassword, setNewPassword] = useState("")
    const {dispatch} = useGlobalContextHook()
    const [confirmPassword, setConfirmPassword] = useState("")
    const router = useRouter()

    const handleChange = (event: any, from: string) => {
        if (from === "newPassword") {
            setNewPassword(event.target.value)
        }
        if (from === "confirmPassword") {
            setConfirmPassword(event.target.value)
        }
    }

    async function handleSubmit() {
        try {
            setLoading(true)

            if (!newPassword || newPassword.length < 6) {
                throw "Password must be at least 6 characters"
            }

            if (newPassword !== confirmPassword) {
                throw "Passwords do not match"
            }

            const response = await postRequest<any>(
                `auth/change-password/${userId}`,
                { newPassword, confirmPassword }
            )

            if (response.status !== 200) {
                throw "Failed to change password"
            }

            const user = response?.data?.user
            const token = response?.data?.access_token
            const role = user?.role
            const permissions = role?.permissions
            const notifications = response.data.notifications

            if (setValueLocalStorage('token', token) &&
                setValueLocalStorage('user', JSON.stringify(user)) &&
                setValueLocalStorage('system_permissions', JSON.stringify(permissions))
            ) {
                setLoading(!loading)
                dispatch({ type: "SET_CURRENT_USER", payload: user })
                const notificationPayload = {
                    count: notifications?.filter((note: any) => !note.isRead).length,
                    notifications: notifications,
                };

                // 👈 this is the key fix
                // dispatch({type: "UPDATE_NOTIFICATION_BODY", payload: notificationPayload});
                dispatch({type: "UPDATE_NOTIFICATION", payload: true});

                router.push('/')
            } else {
                alert('error setting value to local storage')
            }

            ToastComponent({text: "Password changed successfully", duration: 1000})

            router.push("/")

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
            title="Change Password"
            subtitle="Enter your new password to continue"
        >
            <>
                <TextFieldComponent
                    placeholder="New password"
                    from="newPassword"
                    label="New Password"
                    value={newPassword}
                    onChange={handleChange}
                    isError={false}
                    type="password"
                    errorMessage=""
                    layout="column"
                />

                <TextFieldComponent
                    placeholder="Confirm password"
                    from="confirmPassword"
                    label="Confirm Password"
                    value={confirmPassword}
                    onChange={handleChange}
                    isError={false}
                    type="password"
                    errorMessage=""
                    layout="column"
                />

                <div className="w-full flex justify-center mt-4 mb-6">
                    <button
                        onClick={handleSubmit}
                        className="flex w-full border justify-center border-blue-800 p-2 rounded-2xl shadow-lg items-center bg-[#0c55d7] hover:bg-[#0a4bc2] text-white gap-3"
                    >
                        Change Password <CheckCircle2 size={18} />
                    </button>
                </div>
            </>
        </AuthSkeletonComponent>
    )
}