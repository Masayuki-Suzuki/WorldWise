import { FormEvent, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import FormInput from '../../molecues/Forms/FormInput'
import styles from './LoginForm.module.sass'
import Button from '../../atoms/Button'
import { useAuth } from '../../contexts/FireBaseAuthProvider'
import { Nullable } from '../../types/utilities'
import Spinner from '../../atoms/Spinner'

const LoginForm = () => {
    const [email, setEmail] = useState('test1@example.com')
    const [password, setPassword] = useState('test123')
    const [errorMessage, setErrorMessage] = useState<Nullable<string>>(null)
    const navigate = useNavigate()
    const { loginHandler, isAuthenticated, authError, logoutHandler, isLoading } = useAuth()

    const handleButtonClick = (e: FormEvent) => {
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

        return () => {
            if (authError) {
                logoutHandler()
            }
        }
    }, [isAuthenticated, authError, navigate, logoutHandler])

    return (
        <form className={styles.loginForm} onSubmit={handleButtonClick}>
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
            <div className={styles.loginBtn}>
                {isLoading ? <Spinner size="small" /> : <Button type="primary">Login</Button>}
            </div>
            <p className={styles.signupText}>
                Don't have an account?&nbsp;&nbsp;<Link to="/signup">Signup Now.</Link>
            </p>
        </form>
    )
}

export default LoginForm
