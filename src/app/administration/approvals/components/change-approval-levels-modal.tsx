"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import PopupModal from "@/components/modal/popup-modal";
import { ButtonComponent } from "@/components/button/button.component";
import { postRequest, getRequest } from "@/utils/api-calls.util";
import LoadingComponent from "@/components/status/loading.component";
import { PlusCircle, Trash2, GripVertical, Search, ChevronDown, Check } from "lucide-react";
import RoleSelect from "@/app/administration/approvals/components/role-select-in-approval.component";

interface ApproverFromBackend {
    position: string;
    users?: string[];
}

interface LevelItem {
    roleId?: number;
    position: string;
    users: string[];
}

interface RoleOption {
    id: number;
    name: string;
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
    const [availableRoles, setAvailableRoles] = useState<RoleOption[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (!isOpen) return;

        const loadData = async () => {
            setIsLoading(true);
            try {
                const res = await getRequest("roles");
                let roles: RoleOption[] = [];

                if (res.status === 200) {
                    const data = (res.data as any)?.data ?? res.data ?? [];
                    roles = (Array.isArray(data) ? data : []).map((r: any) => ({
                        id: Number(r.id),
                        name: String(r.name ?? "").trim(),
                    }));
                    setAvailableRoles(roles);
                }

                // position = role/position name; users = people in that role
                const mapped: LevelItem[] = (currentApprovers || []).map((approver) => {
                    const pos = (approver.position ?? "").trim();
                    const matched = roles.find(
                        (r) => r.name.toLowerCase() === pos.toLowerCase()
                    );

                    return {
                        roleId: matched?.id,
                        position: pos,
                        users: approver.users || [],
                    };
                });

                setLevels(mapped);
            } catch (err) {
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, [isOpen, currentApprovers]);

    const getOptionsForLevel = (index: number) => {
        const taken = new Set(
            levels
                .map((l, i) => (i === index ? undefined : l.roleId))
                .filter((id): id is number => id != null)
        );
        return availableRoles.filter((r) => !taken.has(r.id));
    };

    const handleAddLevel = () => {
        setLevels((prev) => [...prev, { roleId: undefined, position: "", users: [] }]);
    };

    const handleRemoveLevel = (index: number) => {
        setLevels((prev) => prev.filter((_, i) => i !== index));
    };

    const handleRoleChange = (index: number, roleId: number) => {
        const role = availableRoles.find((r) => r.id === roleId);
        if (!role) return;

        setLevels((prev) => {
            const next = [...prev];
            next[index] = {
                ...next[index],
                roleId: role.id,
                position: role.name,
                users: next[index].users || [],
            };
            return next;
        });
    };

    const handleSubmit = async () => {
        if (!entityId || !entityName) return;

        if (levels.some((l) => !l.roleId)) {
            alert("Please select a role for every level");
            return;
        }

        setIsSaving(true);
        try {
            const payload = {
                entityId: Number(entityId),
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

    const canAddMore =
        levels.filter((l) => l.roleId).length < availableRoles.length;

    return (
        <PopupModal
            isOpen={isOpen}
            onClose={onClose}
            title="Change Approval Levels"
            size="xs"
            onSaveButtonName="Save Changes"
        >
            {isLoading ? (
                <LoadingComponent />
            ) : (
                <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                        Override the default chain for this record only. Order is the
                        approval sequence.
                    </p>

                    <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
                        {levels.length === 0 && (
                            <p className="py-6 text-center text-sm text-muted-foreground">
                                No levels yet. Add one to get started.
                            </p>
                        )}

                        {levels.map((level, index) => (
                            <div
                                key={index}
                                className="rounded-lg border border-border bg-muted/20 p-3"
                            >
                                <div className="flex items-center gap-2">
                                    <GripVertical
                                        size={14}
                                        className="shrink-0 text-muted-foreground"
                                    />
                                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[11px] font-medium text-primary">
                                        {index + 1}
                                    </span>

                                    <RoleSelect
                                        value={level.roleId}
                                        label={level.position}
                                        options={getOptionsForLevel(index)}
                                        onChange={(id) => handleRoleChange(index, id)}
                                    />

                                    <button
                                        type="button"
                                        onClick={() => handleRemoveLevel(index)}
                                        className="rounded p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                                        title="Remove level"
                                    >
                                        <Trash2 size={15} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <ButtonComponent
                        name="Add Level"
                        onClick={handleAddLevel}
                        rounded="md"
                        padding="p-2"
                        isDisabled={!canAddMore}
                    >
                        <PlusCircle size={15} className="mr-1" />
                    </ButtonComponent>

                    <div className="flex justify-end gap-2 border-t border-border pt-3">
                        <ButtonComponent name="Cancel" onClick={onClose} rounded="md" padding="p-2" />
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