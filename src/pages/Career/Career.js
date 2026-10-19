import { forwardRef } from 'react';
import styles from './Career.module.scss';
import datainfo from '../../json/career.json';

const Career = forwardRef((props, ref) => {
    const { data } = datainfo;
    return <div ref={ref} className={styles.container}>
        <h3>CAREER</h3>
        <div className={styles.career_container}>
            {
                data.map(info => {
                    const { imgName, title, department, duration, responsibility, certLink, tasks } = info;
                    return <div className={styles.career_img_container} key={imgName + title}>
                        <div className={styles.circle}>
                            <img className={styles.circleImg} src={`/assets/images/${imgName}`} alt={title} />
                        </div>
                        <div className={styles.career_explain_container}>
                            <p className={styles.career_title}>{title}</p>
                            {department && (
                                <p className={styles.career_department}>{department}</p>
                            )}
                            <p className={styles.career_duration}>{duration}</p>
                            {certLink && (
                                <a
                                    className={styles.cert_link}
                                    href={certLink}
                                    target="_blank"
                                    rel="noreferrer noopener"
                                >
                                    📄 경력기술서
                                </a>
                            )}
                            <div className={styles.career_responsibility}>{responsibility}</div>
                            <ul>
                                {tasks.map(task => {
                                    return <li key={task}>{task}</li>
                                })}
                            </ul>
                        </div>
                    </div>
                })
            }
        </div>
    </div>;
});

export default Career;