import { useState, useEffect, useRef } from 'react';
import styles from './FixedHeader.module.scss';
import AdminAuthModal from '../../components/Admin/AdminAuthModal';
import AdminDashboard from '../../components/Admin/AdminDashboard';
import { trackClick } from '../../services/tracker';

const FixedHeader = ({ headerRef, aboutmeRef, skillsRef, certificationRef, projectRef, careerRef }) => {
    // Scroll CSS제어부분
    const [yScroll, setYScroll] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // 관리자 페이지 진입용 이스터에그 상태
    const clickCountRef = useRef(0);
    const lastClickTimeRef = useRef(0);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [isAdminDashboardOpen, setIsAdminDashboardOpen] = useState(false);

    useEffect(() => {
        const handleScrll = () => {
            setYScroll(window.scrollY);
        };
        window.addEventListener('scroll', handleScrll);
        return () => {
            window.removeEventListener("scroll", handleScrll);
        };
    }, []);

    // Scroll To Section & Click Tracking
    const handleNavClick = (ref, menuName) => {
        if (ref && ref.current) {
            ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
        }
        trackClick('Navigation', 'Menu Click', menuName);
    };

    // 로고 클릭 (3초 내 5회 연속 클릭 시 관리자 모달 트리거)
    const handleLogoClick = () => {
        if (headerRef && headerRef.current) {
            headerRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
        }
        trackClick('Navigation', 'Logo Click', "SDH's Portfolio");

        const now = Date.now();
        // 3초 이내의 연속 클릭인지 확인
        if (now - lastClickTimeRef.current < 3000) {
            clickCountRef.current += 1;
        } else {
            clickCountRef.current = 1;
        }
        lastClickTimeRef.current = now;

        // 5회 이상 클릭 시
        if (clickCountRef.current >= 5) {
            clickCountRef.current = 0;
            if (sessionStorage.getItem('admin_authenticated') === 'true') {
                setIsAdminDashboardOpen(true);
            } else {
                setIsAuthModalOpen(true);
            }
        }
    };

    const handleAuthSuccess = () => {
        setIsAuthModalOpen(false);
        sessionStorage.setItem('admin_authenticated', 'true');
        setIsAdminDashboardOpen(true);
    };

    // ToggleMenu
    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <>
            <div className={yScroll === 0 ? styles.container : styles.containerScrolled}>
                <div
                    onClick={handleLogoClick}
                    style={{ cursor: "pointer", whiteSpace: "nowrap", userSelect: "none" }}
                    title="SDH's Portfolio"
                >
                    SDH's Portfolio
                </div>
                <div className={styles.button_container}>
                    <button onClick={() => handleNavClick(aboutmeRef, 'About me')}>About me</button>
                    <button onClick={() => handleNavClick(certificationRef, 'Certifications')}>Certifications</button>
                    <button onClick={() => handleNavClick(skillsRef, 'Skills')}>Skills</button>
                    <button onClick={() => handleNavClick(projectRef, 'Projects')}>Projects</button>
                    <button onClick={() => handleNavClick(careerRef, 'Career')}>Career</button>
                </div>
                <div className={styles.menu_icon} onClick={toggleMenu}>
                    <img src="/assets/images/hamburger.png" alt="ham" />
                </div>
                {/* toggle Button Area */}
                {isMenuOpen && (
                    <div className={styles.mobile_menu}>
                        <button onClick={() => { handleNavClick(aboutmeRef, 'About me'); toggleMenu(); }}>About me</button>
                        <button onClick={() => { handleNavClick(certificationRef, 'Certifications'); toggleMenu(); }}>Certifications</button>
                        <button onClick={() => { handleNavClick(skillsRef, 'Skills'); toggleMenu(); }}>Skills</button>
                        <button onClick={() => { handleNavClick(projectRef, 'Projects'); toggleMenu(); }}>Projects</button>
                        <button onClick={() => { handleNavClick(careerRef, 'Career'); toggleMenu(); }}>Career</button>
                    </div>
                )}
            </div>

            {/* 관리자 인증 모달 */}
            <AdminAuthModal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
                onSuccess={handleAuthSuccess}
            />

            {/* 관리자 대시보드 */}
            <AdminDashboard
                isOpen={isAdminDashboardOpen}
                onClose={() => setIsAdminDashboardOpen(false)}
            />
        </>
    );
};

export default FixedHeader;