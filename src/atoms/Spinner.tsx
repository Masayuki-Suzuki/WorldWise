import styles from './Spinner.module.sass'

function Spinner() {
    return (
        <div className={styles.spinnerContainer}>
            <div className={styles.spinner}></div>
        </div>
    )
}

export default Spinner
