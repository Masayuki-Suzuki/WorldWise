import { VoidFunction, ReactElementAllowString, OnClickEventWithEvent } from '../types/utilities'
import styles from './Button.module.sass'

type ButtonPropsType = {
    action: VoidFunction | OnClickEventWithEvent<HTMLButtonElement>
    children: ReactElementAllowString
    type?: 'primary' | 'back' | 'position'
}

const Button = ({ action, children, type = 'primary' }: ButtonPropsType) => (
    <button className={`${styles.btn} ${styles[type]}`} onClick={action}>
        {children}
    </button>
)

export default Button
