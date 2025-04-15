import { forwardRef } from 'react';
import styles from './Career.module.scss';
import datainfo from '../../json/career.json';

const Career = forwardRef((props, ref) => {
    const { data } = datainfo;
    return <div ref={ref} className={styles.container}>
        <h3>CAREER</h3>
        <div className={styles.career_container}>
            {/* start */}
            {
                data.map(info => {
                    const {imgName, title, duration, responsibility, tasks} = info;
                    return <div className={styles.career_img_container} key={imgName}>
                        <div className={styles.circle}>
                            <img className={styles.circleImg} src={`/assets/images/${imgName}`} alt="testImg" />
                        </div>
                        <div className={styles.career_explain_container}>
                            <p className={styles.career_title}>{title}</p>
                            <p className={styles.career_duration}>{duration}</p>
                            <div className={styles.career_responsibility}>{responsibility}</div>
                            <ul>
                                {tasks.map( task=>{
                                    return <li key={task}>{task}</li>
                                } )}
                            </ul>
                        </div>
                    </div>
                })
            }
            {/* <div className={styles.career_img_container}>

                <div className={styles.circle}>
                    <img className={styles.circleImg} src="/assets/images/dgbupay.svg" alt="testImg" />
                </div>
                <div className={styles.career_explain_container}>
                    <p className={styles.career_title}>DGB유페이</p>
                    <p className={styles.career_duration}>2018.02 - 2022.02</p>
                    <div className={styles.career_responsibility}>데이터 관리, 네트워크 부담당</div>
                    <ul>
                        <li>교통카드 BL/PL관리 및 원장 변경 처리</li>
                        <li>PL/SQL을 활용한 월별 데이터 처리 및 정산 데이터 검증</li>
                        <li>관공서 제공용 정산 데이터 생성 및 검증</li>
                        <li>네트워크 및 보안 프로그램 운영 부담당</li>
                    </ul>
                </div>
            </div> */}
            {/* end */}

        </div>
    </div>
});

export default Career;