import styles from './Spinner.module.sass'

type SpinnerProps = {
    size?: 'x-small' | 'small' | 'medium' | 'large'
}

function Spinner({ size = 'medium' }: SpinnerProps) {
    let spinnerSize = '6rem'

    if (size === 'x-small') {
        spinnerSize = '3rem'
    } else if (size === 'small') {
        spinnerSize = '4rem'
    } else if (size === 'large') {
        spinnerSize = '8rem'
    }

    return (
        <div className={styles.spinnerContainer}>
            <div className={styles.spinner} style={{ height: spinnerSize, width: spinnerSize }}></div>
        </div>
    )
}

export default Spinner
