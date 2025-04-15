import styles from "./Modal.module.scss"
const Modal = ({ imageSrc, onClose }) => {
    if (!imageSrc) return null;

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <img src={imageSrc} alt="Modal" className={styles.modalImage} onClick={onClose} />
            </div>
        </div>
    );
};

export default Modal;