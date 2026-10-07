

import React, { ReactNode } from 'react';
import { Ellipsis } from 'lucide-react';
import {ButtonComponent} from "@/components/button/button.component";

type Props = {
    data: any[];
    titleA?: string
    OptionalElement?: React.ReactNode
    titleB?: string
    onClick?: (key?: any) => void
    buttonName?: string
    buttonAction?: string
    isExtraButton?: boolean
    isExtraButtonDisabled?: boolean
    buttonKey?: string
}

const ViewCardItemApartComponent = ({
    data,
    titleA,
    titleB,
    buttonName = "progress",
    isExtraButton,
    isExtraButtonDisabled,
    buttonKey,
    OptionalElement,
    onClick
}: Props) => {
    return (
        <div className="flex flex-col bg-card-bg text-text-primary p-2">
            <div className='flex justify-between mb-2'>
                <h3 className='py-2 text-left text-lg '>
                    {titleA && <span className='mr-1 text-sm'>{titleA} :</span>}
                    <span className='font-semibold  mr-1 text-sm'>{titleB}</span>
                </h3>
                <div className=''>
                    {isExtraButton && (
                        buttonName === 'Task Completed' ? <p className='bg-gray-200 p-1'>{buttonName}</p> :
                            <ButtonComponent
                                name={buttonName}
                                onClick={() => onClick(buttonKey)}
                            >
                                <Ellipsis />
                            </ButtonComponent >)

                    }
                </div>
            </div>

            <div className='flex flex-col w-full '>
                {data && data.map((item, index) => (
                    <div key={index} className="flex justify-between  p-2 mb-1 bg-main-content-bg">
                        <h3 className="text-left border-r border-gray-700 pr-2 w-1/2 text-sm">{item.label}</h3>
                        <p className="font-semibold text-right pl-2  w-1/2 text-sm">{item.value}</p>
                    </div>
                ))}
            </div>
            <div className='flex justify-end w-full'>
                {OptionalElement && OptionalElement}
            </div>

        </div>
    );
};

export default ViewCardItemApartComponent;