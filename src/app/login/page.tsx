 "use client"

import React, {useState} from 'react'
import {useRouter} from 'next/navigation'
import TextFieldComponent from '@/components/inputs/text-field'
import {useGlobalContextHook} from '@/hooks/useGlobalContextHook'
import Swal from "sweetalert2"
import {Ellipsis, LogIn} from "lucide-react";
 import {setValueLocalStorage} from "@/utils/local-storage.util";
 import AuthSkeletonComponent from "@/components/auth-skeleton-component";
 import {postRequest} from "@/utils/api-calls.util";

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [password, setPassword] = useState('')
    const {dispatch} = useGlobalContextHook()
    const router = useRouter()

    const handleChange = (event: any, from: string) => {
        if (from === 'email') {
            setEmail(event.target.value)
        }
        if (from === 'password') {
            setPassword(event.target.value)
        }
    }

    async function handleSubmit() {
        try {
            setLoading(!loading)

            if (!email) {
                throw ('Email Not Found')
            }

            if (!password || password.length < 6) {
                throw ('Password Required and Must be Correct')
            }

            try {
                const response = await postRequest<any>('auth/login', {email, password})

                console.log('response', response)

                if (response.status === 200) {
                    const token = response?.data?.access_token
                    const user = response?.data?.user
                    const role = user?.role
                    const permissions = role?.permissions
                    const notifications = response.data.notifications

                    if (setValueLocalStorage('token', token) &&
                        setValueLocalStorage('user', JSON.stringify(user)) &&
                        setValueLocalStorage('system_permissions', JSON.stringify(permissions))
                    ) {
                        setLoading(!loading)
                        dispatch({ type: "SET_CURRENT_USER", payload: user })

                        console.log(' notifications.filter((note: any) => !note.isRead).length',  notifications.filter((note: any) => !note.isRead).length)

                        const notificationPayload = {
                            count: notifications.filter((note: any) => !note.isRead).length,
                            notifications: notifications,
                        };

                        // 👈 this is the key fix
                        dispatch({type: "UPDATE_NOTIFICATION_BODY", payload: notificationPayload});

                        router.push('/')
                    } else {
                        alert('error setting value to local storage')
                    }
                } else {
                    Swal.fire({
                        title: 'Error Occured!',
                        text: 'error',
                        icon: 'error',
                    }).then(() => setLoading(false))

                }

            } catch (error) {
                throw error.message
            }
        } catch (error) {

            Swal.fire({
                title: 'Error Occured!',
                text: error,
                icon: 'error',
            }).then(() => setLoading(false))

            console.log(error);
        }
    }

    async function handleForgotPassword() {
        try {
            router.push('/forgot-password')
        } catch (error) {
            console.error('Error storing data in localStorage:', error);
        }
    }

    return (
        <AuthSkeletonComponent
            loading={loading}
            title={'Welcome Back'}
            subtitle={'Enter your Email and Password to Access your Account'}
        >
            <>
                <TextFieldComponent
                    placeholder={'email'}
                    from={'email'}
                    label={'Email'}
                    value={email}
                    onChange={handleChange}
                    isError={false}
                    errorMessage={''}
                    layout={'column'}
                />
                <TextFieldComponent
                    placeholder={'password'}
                    from={'password'}
                    label={"Password"}
                    value={password}
                    onChange={handleChange}
                    isError={false}
                    type='password'
                    errorMessage={''}
                    layout={'column'}
                />
                <div className="flex flex-col items-end gap-2 mb-6 text-white">
                    <button className="text-xs hover:underline py-2" onClick={handleForgotPassword}>
                        Forgot Password?
                    </button>
                    <div className="w-full flex justify-center">
                        <button
                            onClick={handleSubmit}
                            className="flex w-full border justify-center border-blue-800 p-2 rounded-2xl shadow-lg items-center bg-[#0c55d7] hover:bg-[#0a4bc2] text-white gap-3">
                            Login <LogIn/>
                        </button>
                    </div>
                </div>

            </>

        </AuthSkeletonComponent>
    )
}