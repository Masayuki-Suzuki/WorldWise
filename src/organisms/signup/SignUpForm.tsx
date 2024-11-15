import { FormEvent, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import FormInput from '../../molecues/Forms/FormInput'
import styles from './SignUpForm.module.sass'
import Button from '../../atoms/Button'
import { useAuth } from '../../contexts/FireBaseAuthProvider'
import { Nullable } from '../../types/utilities'
import Spinner from '../../atoms/Spinner'

type SignUpFormProps = {
    handleRegistered: (registered: boolean) => void
}

const SignUpForm = ({ handleRegistered }: SignUpFormProps) => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [errorMessage, setErrorMessage] = useState<Nullable<string>>(null)
    const { signUpHandler, authError, logoutHandler, isLoading } = useAuth()

    const handleButtonClick = async (e: FormEvent) => {
        e.preventDefault()
        e.stopPropagation()

        if (email && password && firstName && lastName) {
            await signUpHandler({ email, password, firstName, lastName })
            handleRegistered(true)
        } else {
            setErrorMessage('Please fill out all fields.')
        }
    }

    useEffect(() => {
        return () => {
            if (authError) {
                logoutHandler()
            }
        }
    }, [authError, logoutHandler])

    return (
        <form className={styles.signupForm} onSubmit={handleButtonClick}>
            <h2>Sign Up</h2>
            {errorMessage && <p className={styles.error}>{errorMessage}</p>}
            <div className={styles.userNames}>
                <FormInput
                    label="First Name"
                    inputID="firstname"
                    inputType="text"
                    action={e => setFirstName(e.target.value)}
                    value={firstName}
                    placeholder="John"
                    required
                />
                <FormInput
                    label="Last Name"
                    inputID="lastname"
                    inputType="text"
                    action={e => setLastName(e.target.value)}
                    value={lastName}
                    placeholder="Doe"
                    required
                />
            </div>
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
                {isLoading ? <Spinner size="small" /> : <Button type="primary">Register</Button>}
            </div>
            <p className={styles.signupText}>
                Already have an account?&nbsp;&nbsp;<Link to="/login">Login Now.</Link>
            </p>
        </form>
    )
}

export default SignUpForm
