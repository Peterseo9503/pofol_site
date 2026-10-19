import {forwardRef} from 'react';

import styles from "./Skills.module.scss";
import skillsInfo from "../../json/skills.json"

// 스킬명 → 배지 색상 매핑 (CSS Modules 동적 조회 대신 인라인 스타일 사용)
const BADGE_COLORS = {
    // ── Web Development ──────────────────────────────────
    'JavaScript':        { bg: '#F7DF1E', color: '#1a1a1a' },
    'TypeScript':        { bg: '#2F74C0', color: '#ffffff' },
    'Java':              { bg: '#E76F00', color: '#ffffff' },
    'React':             { bg: '#61DAFB', color: '#1a1a1a' },
    'Sass':              { bg: '#CD6799', color: '#ffffff' },
    'Express':           { bg: '#404040', color: '#ffffff' },
    'Django':            { bg: '#0C4B33', color: '#ffffff' },
    'MySQL':             { bg: '#00758F', color: '#ffffff' },
    'SpringBoot':        { bg: '#6DB33F', color: '#ffffff' },
    'AWS':               { bg: '#FF9900', color: '#1a1a1a' },
    'Docker':            { bg: '#2496ED', color: '#ffffff' },
    // ── Security Operations ──────────────────────────────
    'VPN':               { bg: '#7C3AED', color: '#ffffff' },
    'NAC':               { bg: '#0891B2', color: '#ffffff' },
    'DLP':               { bg: '#DC2626', color: '#ffffff' },
    'DRM':               { bg: '#DB2777', color: '#ffffff' },
    // ── ERP Development ──────────────────────────────────
    '영림원 ERP':        { bg: '#0284C7', color: '#ffffff' },
    'MS-SQL':            { bg: '#E53935', color: '#ffffff' },
    'Stored Procedure':  { bg: '#6366F1', color: '#ffffff' },
};

const DEFAULT_BADGE = { bg: '#94A3B8', color: '#ffffff' };

const Skills = forwardRef((props, ref) => {
    const { domains } = skillsInfo;
    return <>
        <div ref={ref} className={styles.container}>
            <h3>SKILLS</h3>
            <div className={styles.about_moto}>"What you do today defines your tomorrow."
            </div>

            <div className={styles.skills_total_container}>
                {
                    domains.map(domain => {
                        return (
                            <div key={domain.id} className={styles.domain_section}>
                                <div className={styles.domain_header}>
                                    <span className={styles.domain_label}>{domain.label}</span>
                                </div>
                                <div className={styles.domain_skills}>
                                    {domain.skills.map(info => {
                                        return (
                                            <div className={styles.skills_container} key={`${domain.id}-${info.title}`}>
                                                <div className={styles.title_skills}>
                                                    <img src={`/assets/images/${info.imgName}`} alt={info.title}></img>
                                                    <span>{info.title}</span>
                                                </div>
                                                <div className={styles.content_skills}>
                                                    {info.content.map(contentInfo => {
                                                        const badge = BADGE_COLORS[contentInfo] || DEFAULT_BADGE;
                                                        return (
                                                            <div
                                                                key={contentInfo}
                                                                className={styles.item_skills}
                                                                style={{
                                                                    backgroundColor: badge.bg,
                                                                    color: badge.color,
                                                                }}
                                                            >
                                                                {contentInfo}
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })
                }
            </div>
        </div>
    </>;
});
export default Skills;