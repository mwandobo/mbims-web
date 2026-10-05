import React from "react";
import { CheckCircle2, Ellipsis } from "lucide-react";
import { ButtonComponent } from "@/components/button/button.component";
import { checkPermissions } from "@/utils/check-permissions";

type Props = {
    data: any[];
    titleA?: string;
    OptionalElement?: React.ReactNode;
    titleB?: string;
    onClick?: (key?: any) => void;
    buttonName?: string;
    buttonAction?: string;
    isExtraButton?: boolean;
    isExtraButtonDisabled?: boolean;
    buttonKey?: string;
    showAssignButton?: boolean;
    assignButtonCallBack?: () => void;
};

const ViewCardComponent = ({
                               data,
                               titleA,
                               titleB,
                               buttonName = "progress",
                               isExtraButton,
                               buttonKey,
                               OptionalElement,
                               onClick,
                               showAssignButton,
                               assignButtonCallBack,
                           }: Props) => {
    return (
        <div className="flex flex-col w-full">
            <div className="flex justify-between w-full">
                <div className="w-full flex justify-between">
                    <h3 className="p-2 text-left text-lg text-muted flex items-center">
                        <span className="mr-1">{titleA} :</span>
                        <span className="font-semibold text-foreground mr-1">{titleB}</span>
                    </h3>

                    {showAssignButton && checkPermissions("role_assign") && (
                        <ButtonComponent
                            name="Assign"
                            onClick={assignButtonCallBack}
                            rounded="md"
                            padding="p-3"
                        >
                            <CheckCircle2 size={13} />
                        </ButtonComponent>
                    )}
                </div>

                <div>
                    {isExtraButton &&
                        (buttonName === "Task Completed" ? (
                            <p className="bg-muted-bg text-foreground p-1">{buttonName}</p>
                        ) : (
                            <ButtonComponent
                                name={buttonName}
                                onClick={() => onClick?.(buttonKey)}
                            >
                                <Ellipsis />
                            </ButtonComponent>
                        ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {data.map(
                    (item, index) =>
                        item.label && (
                            <div key={index}>
                                <div className="flex justify-center bg-muted-bg p-2 mb-1">
                                    <h3 className="text-right border-r border-card-border pr-2 w-1/2 text-sm text-muted">
                                        {item.label}
                                    </h3>
                                    <p className="font-semibold text-left pl-2 w-1/2 text-sm text-foreground">
                                        {item.value}
                                    </p>
                                </div>
                            </div>
                        )
                )}
            </div>

            <div className="w-full">{OptionalElement && OptionalElement}</div>
        </div>
    );
};

export default ViewCardComponent;