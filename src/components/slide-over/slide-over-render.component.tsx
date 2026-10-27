'use client'
import React, {useState} from "react";
import {useGlobalContextHook} from "@/hooks/useGlobalContextHook";
import SlideOver from "@/components/slide-over/slide-over.component";

const SlideOverRender = () => {
    const {state, dispatch} = useGlobalContextHook()
    const {slideOverContent} = state

    const handleCloseSlideOver = () => {

        dispatch({
            type: 'UPDATE_SLIDE_OVER_CONTENT',
            payload: {
                isOpen: false,
                sliderOverComponent: () => ''
            }
        })
    }

    return <SlideOver
        isShowSlideOver={slideOverContent?.isOpen}
        title="Apply Filters"
        onClose={handleCloseSlideOver}
        width={'25rem'}
    >

        {slideOverContent?.sliderOverComponent(slideOverContent.payload) ?? ''}
    </SlideOver>
};

export default SlideOverRender;
