import FormInput from '../../molecues/Forms/FormInput'
import { useState } from 'react'
import styles from './LoginForm.module.sass'
import Button from '../../atoms/Button'

const LoginForm = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

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
                <Button action={() => console.log('Login clicked')}>Login</Button>
            </div>
        </form>
    )
}

export default LoginForm
