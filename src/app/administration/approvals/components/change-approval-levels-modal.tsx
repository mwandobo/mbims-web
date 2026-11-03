"use client";

import React, { useState, useEffect } from "react";
import PopupModal from "@/components/modal/popup-modal";
import { ButtonComponent } from "@/components/button/button.component";
import { postRequest, getRequest } from "@/utils/api-calls.util";
import LoadingComponent from "@/components/status/loading.component";
import { PlusCircle, Trash2, GripVertical } from "lucide-react";

// New shape coming from backend
interface ApproverFromBackend {
    position: string;
    users?: string[];
}

// Internal shape used inside the modal
interface LevelItem {
    roleId?: number;
    position: string;
    users: string[];
}

interface Props {
    isOpen: boolean;
    onClose: () => void;
    entityId?: string | number;
    entityName?: string;
    currentApprovers: ApproverFromBackend[];
    onSuccess: () => void;
}

const ChangeApprovalLevelsModal: React.FC<Props> = ({
                                                        isOpen,
                                                        onClose,
                                                        entityId,
                                                        entityName,
                                                        currentApprovers,
                                                        onSuccess,
                                                    }) => {
    const [levels, setLevels] = useState<LevelItem[]>([]);
    const [availableRoles, setAvailableRoles] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (!isOpen) return;

        const loadData = async () => {
            setIsLoading(true);
            try {
                // 1. Load available roles
                const res = await getRequest("roles");
                let roles: any[] = [];

                if (res.status === 200) {
                    const data = (res.data as any)?.data ?? res.data ?? [];
                    roles = Array.isArray(data) ? data : [];
                    setAvailableRoles(roles);
                }

                // 2. Map currentApprovers → levels (match by position name)
                const mappedLevels: LevelItem[] = (currentApprovers || []).map((approver) => {
                    const matchedRole = roles.find(
                        (r) => r.name?.trim() === approver.position?.trim()
                    );

                    return {
                        roleId: matchedRole?.id,
                        position: approver.position,
                        users: approver.users || [],
                    };
                });

                setLevels(mappedLevels);
            } catch (err) {
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, [isOpen, currentApprovers]);

    const handleAddLevel = () => {
        setLevels((prev) => [
            ...prev,
            { roleId: undefined, position: "", users: [] },
        ]);
    };

    const handleRemoveLevel = (index: number) => {
        setLevels((prev) => prev.filter((_, i) => i !== index));
    };

    const handleRoleChange = (index: number, roleId: number) => {
        const role = availableRoles.find((r) => r.id === roleId);
        if (!role) return;

        setLevels((prev) => {
            const updated = [...prev];
            updated[index] = {
                ...updated[index],
                roleId: role.id,
                position: role.name,
                // users stay empty until backend refreshes after save
                users: updated[index].users || [],
            };
            return updated;
        });
    };

    const handleSubmit = async () => {
        if (!entityId || !entityName) return;

        // Basic validation
        const hasInvalid = levels.some((l) => !l.roleId);
        if (hasInvalid) {
            alert("Please select a role for every level");
            return;
        }

        setIsSaving(true);
        try {
            const payload = {
                entityId,
                entityName,
                levels: levels.map((l, idx) => ({
                    order: idx + 1,
                    roleId: l.roleId,
                })),
            };

            const res = await postRequest("approval-levels/override", payload);

            if ([200, 201].includes(res.status)) {
                onSuccess();
            } else {
                throw new Error("Failed to update approval levels");
            }
        } catch (err: any) {
            console.error(err);
            alert(err.message || "Failed to save changes");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <PopupModal
            isOpen={isOpen}
            onClose={onClose}
            title="Change Approval Levels"
            size="md"
            onSaveButtonName="Save Changes"
        >
            {isLoading ? (
                <LoadingComponent />
            ) : (
                <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                        You can override the default approval chain for this specific record.
                        Levels will be applied in the order shown below.
                    </p>

                    <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
                        {levels.map((level, index) => (
                            <div
                                key={index}
                                className="rounded-lg border bg-muted/20 p-3 space-y-2"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="text-muted-foreground">
                                        <GripVertical size={16} />
                                    </div>

                                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-xs font-medium">
                                        {index + 1}
                                    </div>

                                    <select
                                        className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm"
                                        value={level.roleId || ""}
                                        onChange={(e) =>
                                            handleRoleChange(index, Number(e.target.value))
                                        }
                                    >
                                        <option value="">Select Role / Position</option>
                                        {availableRoles.map((role) => (
                                            <option key={role.id} value={role.id}>
                                                {role.name}
                                            </option>
                                        ))}
                                    </select>

                                    <button
                                        onClick={() => handleRemoveLevel(index)}
                                        className="text-destructive hover:text-destructive/80 p-1"
                                        title="Remove level"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>

                                {/* Show current users under this position */}
                                {level.users && level.users.length > 0 && (
                                    <div className="ml-12 text-xs text-muted-foreground space-y-0.5">
                                        {level.users.map((user, i) => (
                                            <div key={i}>• {user}</div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    <ButtonComponent
                        name="Add Level"
                        onClick={handleAddLevel}
                        rounded="md"
                        padding="p-2"
                    >
                        <PlusCircle size={16} className="mr-1" />
                    </ButtonComponent>

                    <div className="flex justify-end gap-3 pt-4 border-t">
                        <ButtonComponent
                            name="Cancel"
                            onClick={onClose}
                            rounded="md"
                            padding="p-2"
                        />
                        <ButtonComponent
                            name={isSaving ? "Saving..." : "Save Changes"}
                            onClick={handleSubmit}
                            isDisabled={isSaving || levels.length === 0}
                            rounded="md"
                            padding="p-2"
                        />
                    </div>
                </div>
            )}
        </PopupModal>
    );
};

export default ChangeApprovalLevelsModal;