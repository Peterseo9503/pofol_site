import { forwardRef, useState } from 'react';
import styles from "./Projects.module.scss";
import projectInfo from '../../json/project.json';
import { trackClick } from '../../services/tracker';

const Projects = forwardRef((props, ref) => {
    const { personal_project, team_project } = projectInfo;
    const [personalCopiedData, setPersonalCopiedData] = useState(JSON.parse(JSON.stringify(personal_project)));
    const [teamCopiedData, setTeamCopiedData] = useState(JSON.parse(JSON.stringify(team_project)));

    const [personalOrderBtn, setPersonalOrderBtn] = useState("latest");
    const [teamOrderBtn, setTeamOrderBtn] = useState("latest");

    const displayItems = (arrayData) => {
        return arrayData.map(info => {
            const { css, title, duration, explain_title, explain_detail, skills, site_link, pdf_link, git_link } = info;
            return <div className={styles.project_item} key={css}>
                <h4 className={`${styles.project_title} ${styles[css]}`} >{title}</h4>
                <div className={styles.project_duration}>{duration}</div>
                <div>
                    <h5 className={styles.project_explain}>{explain_title}</h5>
                    <ul>
                        {explain_detail.map(detailInfo => <li key={css + detailInfo}>{detailInfo}</li>)}
                    </ul>
                </div>
                <div className={styles.project_skills}>
                    <div className={styles.skills_image_container}>
                        {skills.map(skill => <img key={skill} src={`/assets/images/icons/${skill.toLowerCase()}.png`} alt="skill" />)}
                    </div>
                </div>
                <div className={styles.button_area}>
                    {site_link ? <button onClick={() => {
                        window.open(site_link, '_blank');
                        trackClick('Project', 'Site Link', title);
                    }}>🌐SITE</button>
                        : ""}
                    {pdf_link ? <button onClick={() => {
                        window.open(pdf_link, '_blank');
                        trackClick('Project', 'PDF View', title);
                    }}>📜PDF</button>
                        : ""}
                    {git_link ? <button onClick={() => {
                        window.open(git_link, '_blank');
                        trackClick('Project', 'GitHub Link', title);
                    }}>🐈‍⬛GIT</button>
                        : ""}
                </div>
            </div>
        });
    };

    const changeButtonState = (state, flag) => {
        switch (flag) {
            case "personal":
                if (state === "latest") {
                    setPersonalOrderBtn("past");
                    setPersonalCopiedData(personalCopiedData.reverse());
                    trackClick('Interaction', 'Sort Projects', 'Personal (과거순)');
                } else if (state === "past") {
                    setPersonalOrderBtn("latest");
                    setPersonalCopiedData(personalCopiedData.reverse());
                    trackClick('Interaction', 'Sort Projects', 'Personal (최신순)');
                }
                break;
            case "team":
                if (state === "latest") {
                    setTeamOrderBtn("past");
                    setTeamCopiedData(teamCopiedData.reverse());
                    trackClick('Interaction', 'Sort Projects', 'Team (과거순)');
                } else if (state === "past") {
                    setTeamOrderBtn("latest");
                    setTeamCopiedData(teamCopiedData.reverse());
                    trackClick('Interaction', 'Sort Projects', 'Team (최신순)');
                }
                break;
            default:
                console.log("Error changeButtonEvent");
        }
    };

    return <>
        <div ref={ref} className={styles.container}>
            <h3>PROJECTS</h3>
            <div className={styles.button_container}>
                <span>Personal Project</span>
                {personalOrderBtn === "latest" ?
                    <button onClick={() => {
                        changeButtonState(personalOrderBtn, "personal");
                    }}>최신순⬆️</button> :
                    <button onClick={() => {
                        changeButtonState(personalOrderBtn, "personal");
                    }}>과거순⬇️</button>}
            </div>
            <div className={styles.project_container}>
                {displayItems(personalCopiedData)}
            </div>
            <hr>
            </hr>
            <div className={styles.button_container}>
                <span>Team Project</span>
                {teamOrderBtn === "latest" ?
                    <button onClick={() => {
                        changeButtonState(teamOrderBtn, "team");
                    }}>최신순⬆️</button> :
                    <button onClick={() => {
                        changeButtonState(teamOrderBtn, "team");
                    }}>과거순⬇️</button>}
            </div>
            <div className={styles.project_container}>
                {displayItems(teamCopiedData)}
            </div>
        </div>
    </>;
});

export default Projects;