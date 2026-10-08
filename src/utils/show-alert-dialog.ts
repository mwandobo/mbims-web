import Swal from "sweetalert2";

interface ConfirmationModalProps {
    title: string;
    text: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onCancel?: () => void;
}

export function showConfirmationModal({
                                          title,
                                          text,
                                          confirmText = "Yes",
                                          cancelText = "No",
                                          onConfirm,
                                          onCancel,
                                      }: ConfirmationModalProps) {
    Swal.fire({
        title,
        text,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: confirmText,
        cancelButtonText: cancelText,
        reverseButtons: true,
        buttonsStyling: false,
        background: "var(--card-bg)",
        color: "var(--foreground)",
        customClass: {
            popup: "bg-card-bg text-foreground border border-card-border rounded-lg",
            title: "text-foreground",
            htmlContainer: "text-muted",
            actions: "flex justify-between w-full gap-2",
            confirmButton:
                "mx-2 px-4 py-2 rounded bg-success text-white hover:opacity-90",
            cancelButton:
                "mx-2 px-4 py-2 rounded bg-error text-white hover:opacity-90",
        },
    }).then((result) => {
        if (result.isConfirmed) {
            onConfirm();
        } else if (result.dismiss === Swal.DismissReason.cancel && onCancel) {
            onCancel();
        }
    });
}