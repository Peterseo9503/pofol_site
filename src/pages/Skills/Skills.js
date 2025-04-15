import {forwardRef} from 'react';

import styles from "./Skills.module.scss";
import skillsInfo from "../../json/skills.json"
const Skills = forwardRef((props, ref) => {
    const { data } = skillsInfo;
    return <>
        <div ref={ref} className={styles.container}>
            <h3>SKILLS</h3>
            <div className={styles.about_moto}>"What you do today defines your tomorrow."
            </div>

            <div className={styles.skills_total_container}>
            {
                data.map(info => {
                    return <div className={styles.skills_container} key={info.imgName}>
                        <div className={styles.title_skills}><img src={`/assets/images/${info.imgName}.svg`} alt="language"></img><span>{info.title}</span></div>
                        <div className={styles.content_skills}>
                            {info.content.map( contentInfo=>{
                                return <div key={contentInfo}className={`${styles.item_skills} ${styles[contentInfo]}`}>{contentInfo}</div>
                            } )}
                            {/* <img src="/assets/images/readingGlasses.png" alt="readingGlasses"></img> */}
                        </div>
                    </div>

                })
            }
            </div>
            {/* <div className={styles.skills_container}>
                <div className={styles.title_skills}><img src="/assets/images/language.svg" alt="language"></img><span>Language</span></div>
                <div className={styles.content_skills}>
                    <div className={styles.item_skills}>TypeScript</div>
                    <div className={styles.item_skills}>TypeScript</div>
                </div>
            </div> */}
        </div>
    </>
});
export default Skills;