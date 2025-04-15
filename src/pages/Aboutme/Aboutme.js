import { forwardRef } from 'react';

import styles from "./Aboutme.module.scss";
import aboutmeInfo from "../../json/aboutme.json";

const Aboutme = forwardRef((props, ref) => {
    const { data } = aboutmeInfo;
    const getContent = (info, content) => {
        switch (content) {
            case "kakao":
                return (
                    <div onClick={() => {
                        window.open(info.link, "_blank")
                    }}
                        style={{ cursor: "pointer" }}
                        className={styles.content_info}>{info.content}</div>
                );
            case "tel":
                return (
                    <div
                        className={styles.content_info}
                        onClick={() => (window.location.href = `tel:${info.content}`)}
                        style={{ cursor: "pointer" }}
                    >
                        {info.content}
                    </div>
                );
            default:
                return <div className={styles.content_info}>{info.content}</div>;
        }
    };
    return <>
        <div ref={ref} className={styles.container}>
            <h3>ABOUT ME</h3>
            <div className={styles.about_moto}>"Keep failing, keep learning, keep growing."</div>
            <div className={styles.about_container}>
                {data.map(info => {
                    return <div className={styles.about_item_conatiner} key={info.title}>
                        <img src={`/assets/images/${info.imgName}.png`} alt="name" />
                        <div className={styles.item_container}>
                            <div className={styles.item_info_container}>
                                <div className={styles.title_info}>{info.title}</div>
                                {getContent(info, info.imgName)}
                            </div>
                        </div>
                    </div>
                })}
            </div>
        </div>
    </>
});
export default Aboutme;