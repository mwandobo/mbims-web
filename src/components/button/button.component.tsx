import {Button, CircularProgress,} from "@mui/material"
import {ReactNode} from "react"

interface Props {
    name?: string,
    onClick?: () => void
    children?: ReactNode
    bg_color?: string
    text_color?: string
    hover?: string
    hover_text?: string
    type?: "button" | "submit" | "reset"
    variant?: "contained" | "text" | "outlined" | undefined
    isDisabled?: boolean
    isLoading?: boolean
    disabled?: boolean
    isClickable?: boolean
    isEndIcon?: boolean
    width?: string
    rounded?: string
    padding?: string
    border?: string
    shadow?: string
    isSmallButton?: boolean

}


export function ButtonComponent({
                                   name,
                                   onClick,
                                   children,
                                   bg_color = 'bg-gray-500',
                                   text_color = 'text-white',
                                   hover = 'hover:bg-gray-900',
                                   hover_text = 'white',
                                   variant = 'contained',
                                   isDisabled =false,
                                   isLoading,
                                   type = 'button',
                                   isClickable = true,
                                   disabled=false,
                                   isEndIcon,
                                   width,
                                   rounded,
                                   shadow,
                                   padding,
                                   border,
                                   isSmallButton,

                               }: Props) {


    const buttonStateRender =() => {
        if(isLoading) return <CircularProgress size={20}/>

        return (
            <div className={`flex gap-1 ${text_color} ${!isDisabled && hover_text} px-1 h-5 items-center`}>
                {isEndIcon ?
                    <>
                        {name}
                        {children}

                    </> :
                    <>
                        {children}
                        {name}
                    </>
                }

            </div>
        )
    }

    return (
        <button
            type={type}
            className={`${bg_color} ${text_color} ${border} text-xs ${!isDisabled && hover}  ${shadow}  ${padding && padding} ${rounded && `rounded-${rounded}`}`}
            onClick={onClick}
            style={{
                fontSize: isSmallButton && "8px"
            }}
            disabled={isDisabled}
        >
            {buttonStateRender() }
        </button>
    )
}




