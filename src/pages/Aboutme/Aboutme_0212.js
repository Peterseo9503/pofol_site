import { forwardRef } from 'react';

import styles from "./Aboutme.module.scss";
import aboutmeInfo from "../../json/aboutme.json";

const Aboutme = forwardRef((props, ref) => {
    const { data } = aboutmeInfo;
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
                                <div className={styles.content_info}>{info.content}</div>
                            </div>
                        </div>
                    </div>
                })}
            </div>
        </div>
    </>
});
export default Aboutme;