import { useState, useEffect, forwardRef } from 'react';
import styles from './Header.module.scss';
// 개별 이미지 import
import sdh1 from "../../assets/images/sdh/sdh1.jpg";
import sdh2 from "../../assets/images/sdh/sdh2.jpg";
import sdh3 from "../../assets/images/sdh/sdh3.jpg";
import sdh4 from "../../assets/images/sdh/sdh4.jpg";
import sdh5 from "../../assets/images/sdh/sdh5.jpg";
import sdh6 from "../../assets/images/sdh/sdh6.jpg";
import sdh7 from "../../assets/images/sdh/sdh7.jpg";
import sdh8 from "../../assets/images/sdh/sdh8.jpg";
// import sdh9 from "../../assets/images/sdh/sdh9.jpg";
import sdh10 from "../../assets/images/sdh/sdh10.jpg";

// 배열에 담아서 사용
const Header = forwardRef(({ aboutmeRef }, ref) => {
    const images = [sdh1, sdh2, sdh3, sdh4, sdh5, sdh6, sdh7, sdh8, sdh10];

    const [currentImgNumber, setCurrentImgNumber] = useState(0);
    useEffect(() => {
        const interval = setTimeout(() => {
            setCurrentImgNumber(currentImgNumber ===
                (images.length - 1) ? 0
                :
                currentImgNumber + 1);
        }, 3000)
        return () => clearInterval(interval);
    }, [currentImgNumber])

    return <div ref={ref} className={`${styles.container}`}
        style={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${images[currentImgNumber]})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            transition: "background-image 1s ease-in-out",
        }}
    >
        <div className={styles.contents}>
            <div className={styles.textConatiner}>
                <div className={styles.bottomP}>
                    <p>안녕하세요.<br />
                        열정과 경험을 겸비한 개발자<br />
                        서동현 입니다.</p>
                </div>
                <div className={styles.topP}>
                    {/* <h1>풀스택 개발자 포트폴리오 </h1> */}
                    {/* <h1>서동현</h1> */}

                </div>
            </div>
        </div>
    </div>
});

export default Header;