import { VoidFunction, ReactElementAllowString } from '../types/utilities'

type ButtonPropsType = {
    action: VoidFunction
    children: ReactElementAllowString
}

const Button = ({ action, children }: ButtonPropsType) => <button onClick={action}>{children}</button>

export default Button
