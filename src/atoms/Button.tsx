import { VoidFunction, ReactElementAllowString, OnClickEventWithEvent } from '../types/utilities'
import styles from './Button.module.sass'

type ButtonPropsType = {
    action: VoidFunction | OnClickEventWithEvent<HTMLButtonElement>
    children: ReactElementAllowString
    type: string
}

const Button = ({ action, children, type }: ButtonPropsType) => (
    <button className={`${styles.btn} ${styles[type]}`} onClick={action}>
        {children}
    </button>
)

export default Button
