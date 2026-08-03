import "./ConfirmModal.scss"


type Props = {
    open: boolean
    title: string
    message: string
    onConfirm: () => void
    onCancel: () => void
}


const ConfirmModal = ({ open, title, message, onConfirm, onCancel }: Props) => {
    if (!open) return null

    return (
        <div className="confirm-modal">
            <div className="confirm-modal__card">
                <h3 className="confirm-modal__title">{title}</h3>
                <p className="confirm-modal__message">{message}</p>
                <div className="confirm-modal__actions">
                    <button className="secondary" onClick={onCancel}>Cancel</button>
                    <button className="primary" onClick={onConfirm}>Confirm</button>
                </div>
            </div>
        </div>
    )
}


export default ConfirmModal