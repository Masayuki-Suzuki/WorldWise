import { SyntheticEvent, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import FormInput from '../../molecues/Forms/FormInput'
import styles from './LoginForm.module.sass'
import Button from '../../atoms/Button'
import { useAuth } from '../../contexts/FakeAuthContext'
import { Nullable } from '../../types/utilities'
import Spinner from '../../atoms/Spinner'

const LoginForm = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [errorMessage, setErrorMessage] = useState<Nullable<string>>(null)
    const navigate = useNavigate()
    const { loginHandler, isAuthenticated, authError, isLoading } = useAuth()

    const handleButtonClick = (e: SyntheticEvent<HTMLButtonElement>) => {
        e.preventDefault()
        e.stopPropagation()

        if (email && password) {
            loginHandler(email, password)
        } else {
            setErrorMessage('Please fill out all fields.')
        }
    }

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/app')
        } else {
            if (authError && typeof authError === 'string') {
                setErrorMessage(authError)
            } else if (authError) {
                setErrorMessage('Email or password is incorrect. Please try again.')
            }
        }
    }, [isAuthenticated, authError])

    return (
        <form className={styles.loginForm}>
            <h2>Login</h2>
            {errorMessage && <p className={styles.error}>{errorMessage}</p>}
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
                {isLoading ? (
                    <Spinner size="small" />
                ) : (
                    <Button action={handleButtonClick} type="primary">
                        Login
                    </Button>
                )}
            </div>
        </form>
    )
}

export default LoginForm
