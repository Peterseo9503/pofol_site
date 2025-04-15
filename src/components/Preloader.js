import styles from "./Preloader.module.scss";
import preloader from "../assets/images/loading.gif"
const Preloader = ()=>{

    return <div className={styles.container}><img src={preloader} alt="loader" ></img></div>
}

export default Preloader;