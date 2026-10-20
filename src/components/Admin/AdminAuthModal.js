import React, { useState } from 'react';
import styles from './AdminAuthModal.module.scss';

const AdminAuthModal = ({ isOpen, onClose, onSuccess }) => {
    const [password, setPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        const correctPassword = process.env.REACT_APP_ADMIN_PASSWORD || 'admin1234';

        if (password === correctPassword) {
            setErrorMsg('');
            setPassword('');
            onSuccess();
        } else {
            setErrorMsg('비밀번호가 올바르지 않습니다.');
        }
    };

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <div className={styles.header}>
                    <h3>🔐 관리자 인증</h3>
                    <button className={styles.closeBtn} onClick={onClose}>✕</button>
                </div>
                <form onSubmit={handleSubmit} className={styles.body}>
                    <p className={styles.desc}>관리자 페이지 접근을 위해 비밀번호를 입력해주세요.</p>
                    <input
                        type="password"
                        placeholder="비밀번호 입력"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoFocus
                    />
                    {errorMsg && <p className={styles.error}>{errorMsg}</p>}
                    <div className={styles.btnGroup}>
                        <button type="button" className={styles.cancelBtn} onClick={onClose}>
                            취소
                        </button>
                        <button type="submit" className={styles.submitBtn}>
                            확인
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminAuthModal;
