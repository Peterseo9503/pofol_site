import { useState, useEffect } from 'react';
import styles from "./ScrollTopBtn.module.scss"
const ScrollTopBtn = () => {
    const [isVisible, setIsVisible] = useState(false);
    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        // 컴포넌트가 언마운트 될 때 이벤트 리스너 제거
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    // 스크롤 맨 위로 이동
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    const handleScroll = () => {
        if (window.scrollY > 100) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    };

    return <img
        style={isVisible ? {display:"block"} : {display:"none"}}
        className={styles.scroll_top_btn}
        src="/assets/images/upside.png" alt="up"
        onClick={scrollToTop}></img>
}
export default ScrollTopBtn;
