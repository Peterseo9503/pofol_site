import { useState, useEffect } from 'react';

import styles from './FixedHeader.module.scss'
const FixedHeader = ({ headerRef, aboutmeRef, skillsRef, certificationRef, projectRef, careerRef }) => {
    // Scroll CSS제어부분분
    const [yScroll, setYScroll] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        const handleScrll = () => {
            setYScroll(window.scrollY);
        }
        window.addEventListener('scroll', handleScrll);
        return () => {
            window.removeEventListener("scroll", handleScrll);
        }
    }, []);

    //Scroll To Section
    const scrolltoSection = (ref) => {
        if (ref.current) {
            ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    }
    //ToggleMenu
    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    }


    return <>
        <div className={yScroll === 0 ? styles.container : styles.containerScrolled}>
            <div onClick={() => scrolltoSection(headerRef)} style={{ cursor: "pointer", whiteSpace: "nowrap" }}>SDH's Portfolio</div>
            <div className={styles.button_container}>
                <button onClick={() => scrolltoSection(aboutmeRef)} >About me</button>
                <button onClick={() => scrolltoSection(certificationRef)}>Certifications</button>
                <button onClick={() => scrolltoSection(skillsRef)}>Skills</button>
                <button onClick={() => scrolltoSection(projectRef)}>Projects</button>
                <button onClick={() => scrolltoSection(careerRef)}>Career</button>
            </div>
            <div className={styles.menu_icon} onClick={toggleMenu}>
                <img src="/assets/images/hamburger.png" alt="ham" />
            </div>
            {/* toggle Button Area */}
            {isMenuOpen && (
                <div className={styles.mobile_menu}>
                    <button onClick={() => { scrolltoSection(aboutmeRef); toggleMenu(); }}>About me</button>
                    <button onClick={() => { scrolltoSection(certificationRef); toggleMenu(); }}>Certifications</button>
                    <button onClick={() => { scrolltoSection(skillsRef); toggleMenu(); }}>Skills</button>
                    <button onClick={() => { scrolltoSection(projectRef); toggleMenu(); }}>Projects</button>
                    <button onClick={() => { scrolltoSection(careerRef); toggleMenu(); }}>Career</button>
                </div>
            )}
        </div>
    </>
}

export default FixedHeader;