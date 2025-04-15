import styles from './Certification.module.scss';
import { useState, useEffect } from 'react';
import { forwardRef } from 'react';
import cerInfo from '../../json/certification.json';
import Modal from "../Modal/Modal";

const Certification = forwardRef((props, ref) => {
    const { data } = cerInfo;
    const [selectedImage, setSelectedImage] = useState(null);
    return <div ref={ref} className={styles.container}>
        <h3>CERTIFICATIONS</h3>
        <div className={styles.about_moto}>"Progress, not perfection."</div>

        <div className={styles.cer_container}>
            {/*  */}
            {data.map(info => {
                return <div className={styles.cer_item_container} key={info.title}>
                    <img src={`/assets/images/${info.imgName}`} alt="name" />
                    <div className={styles.item_container}>
                        <div className={styles.item_info_container}>
                            <div className={styles.title_info}>
                                {info.title}
                                <img onClick={() => {
                                    setSelectedImage(`/assets/images/certifications/${info.imgPath}`)
                                }
                                } src="/assets/images/check.png" alt="check" />
                            </div>
                            <div className={styles.from_info}>{info.from}</div>
                            <div className={styles.duration_info}>{info.duration}</div>
                            {/* <div className={styles.pdf} onClick={() => {
                                window.open(info.pdf, '_blank');
                            }}>🔭</div> */}
                        </div>
                    </div>
                </div>

            })}
            {selectedImage && <Modal imageSrc={selectedImage} onClose={() => setSelectedImage(null)} />}
            {/*  */}

        </div>
    </div>
});

export default Certification;