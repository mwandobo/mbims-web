import React from "react"

const Footer = () => {
    return (
        <div className=" w-full flex flex-col  justify-center items-center bg-footer-bg text-footer-text text-sm p-2">
            <p >&copy; {new Date().getFullYear()} Mwalimu Commercial Bank. All rights reserved.</p>
        </div>
    )
}

export default Footer