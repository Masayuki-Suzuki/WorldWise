import { ChangeEvent, useState } from 'react'
import styles from './FormInput.module.sass'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash, IconDefinition } from '@fortawesome/free-solid-svg-icons'

type FormInputPropsType = {
    label: string
    inputID: string
    inputType: 'text' | 'number' | 'email' | 'password'
    action: (e: ChangeEvent<HTMLInputElement>) => void
    placeholder?: string
    value?: string
    hasPasswordToggle?: boolean
    required?: boolean
}

const FormInput = ({
    inputID,
    inputType,
    action,
    label,
    value = '',
    placeholder = '',
    hasPasswordToggle = false,
    required = false
}: FormInputPropsType) => {
    const [type, setType] = useState(inputType)
    const [icon, setIcon] = useState<IconDefinition>(faEye)

    const handleTogglePasswordType = () => {
        setType(type === 'password' ? 'text' : 'password')
        if (icon.iconName === 'eye') {
            setIcon(faEyeSlash)
        } else {
            setIcon(faEye)
        }
    }

    return (
        <div className={styles.formInputContainer}>
            <label htmlFor={inputID}>{label}</label>
            <span className={styles.inputWrapper}>
                <input
                    type={type}
                    id={inputID}
                    onChange={action}
                    value={value}
                    placeholder={placeholder}
                    required={required}
                />
                {hasPasswordToggle && (
                    <FontAwesomeIcon className={styles.passwordToggle} icon={icon} onClick={handleTogglePasswordType} />
                )}
            </span>
        </div>
    )
}

export default FormInput
