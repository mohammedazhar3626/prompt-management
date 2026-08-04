import "./ConfirmModal.scss"


type Props = {
    open: boolean
    title: string
    message: string
    confirmText?: string
    cancelText?: string
    type?: "default" | "danger" | "warning"
    loading?: boolean
    onConfirm: () => void
    onCancel: () => void
}


const ConfirmModal = ({ open, title, message, confirmText, cancelText, type, loading, onConfirm, onCancel }: Props) => {
    if (!open) return null

    return (
        <div className="confirm-modal">
            <div className="confirm-modal__card">
                <h3 className="confirm-modal__title">{title}</h3>
                <p className="confirm-modal__message">{message}</p>
                <div className="confirm-modal__actions">
                    <button className="secondary" onClick={onCancel}>
                        {cancelText || "Cancel"}
                    </button>
                    <button className={`default ${type === "danger" ? "danger" : ""}`} onClick={onConfirm} disabled={loading}>
                        {confirmText || "Confirm"}
                    </button>
                </div>
            </div>
        </div>
    )
}


export default ConfirmModal