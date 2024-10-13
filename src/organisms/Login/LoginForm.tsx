import { SyntheticEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import FormInput from '../../molecues/Forms/FormInput'
import styles from './LoginForm.module.sass'
import Button from '../../atoms/Button'

const LoginForm = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate()

    const handleButtonClick = (e: SyntheticEvent<HTMLButtonElement>) => {
        e.preventDefault()
        e.stopPropagation()

        if (email && password) {
            navigate('/app/cities')
        }
    }

    return (
        <form className={styles.loginForm}>
            <h2>Login</h2>
            <FormInput
                label="Email Address"
                inputID="email"
                inputType="email"
                action={e => setEmail(e.target.value)}
                value={email}
                placeholder="example@example.com"
                required
            />
            <FormInput
                label="Password"
                inputID="password"
                inputType="password"
                action={e => setPassword(e.target.value)}
                value={password}
                placeholder="*********"
                hasPasswordToggle
                required
            />
            <div>
                <Button action={handleButtonClick} type="primary">
                    Login
                </Button>
            </div>
        </form>
    )
}

export default LoginForm
