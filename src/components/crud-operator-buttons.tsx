import Link from "next/link";
import { EyeIcon, Pen, Trash2 } from "lucide-react";
import { ButtonComponent } from "@/components/button/button.component";
import { checkPermissions } from "@/utils/check-permissions";

interface Props {
    permission?: string;
    approval_name?: string;
    input?: any;
    handleClick?: (type: string, payload?: any) => void;
    hide_edit?: boolean;
    hide_approve?: boolean;
    hide_delete?: boolean;
    hide_view?: boolean;
    show_assign?: boolean;
    isShowAddPriceButton?: boolean;
    /** Real URL for View — enables Ctrl/Cmd+click new tab */
    viewHref?: string;
}

const CrudButtonsComponent = ({
                                  permission,
                                  input,
                                  handleClick,
                                  hide_delete,
                                  hide_view,
                                  hide_edit,
                                  viewHref,
                              }: Props) => {
    const onViewClick = (e: React.MouseEvent) => {
        // Let browser handle new-tab / modified clicks
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) {
            return;
        }
        e.preventDefault();
        handleClick?.("show", input);
    };

    return (
        <div className="p-0 m-0 inline-flex w-full gap-1">
            {checkPermissions(permission ? `${permission}_read` : "") && !hide_view && (
                viewHref ? (
                    <Link href={viewHref} onClick={onViewClick} className="inline-flex">
                        <ButtonComponent
                            name="View"
                            onClick={() => {}} // click handled by Link
                            isSmallButton={true}
                            rounded="md"
                        >
                            <EyeIcon size={16} color="black" />
                        </ButtonComponent>
                    </Link>
                ) : (
                    <ButtonComponent
                        name="View"
                        onClick={() => handleClick?.("show", input)}
                        isSmallButton={true}
                        rounded="md"
                    >
                        <EyeIcon size={16} color="black" />
                    </ButtonComponent>
                )
            )}

            {/* Delete / Edit unchanged */}
            {checkPermissions(permission ? `${permission}_delete` : "") && !hide_delete && (
                <ButtonComponent
                    name="Delete"
                    onClick={() => handleClick?.("delete", input)}
                    isSmallButton={true}
                    rounded="md"
                >
                    <Trash2 size={16} color="red" />
                </ButtonComponent>
            )}

            {checkPermissions(permission ? `${permission}_update` : "") && !hide_edit && (
                <ButtonComponent
                    name="Edit"
                    onClick={() => handleClick?.("edit", input)}
                    isSmallButton={true}
                    rounded="md"
                >
                    <Pen size={16} color="black" />
                </ButtonComponent>
            )}
        </div>
    );
};

export default CrudButtonsComponent;