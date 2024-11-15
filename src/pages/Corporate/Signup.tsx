import DefaultLayout from '../../layouts/DefaultLayout'
import styles from './Login.module.sass'
import SignUpForm from '../../organisms/signup/SignUpForm'
import RegisteredScreen from '../../organisms/signup/RegisteredScreen'
import { useState } from 'react'

const SignUp = () => {
    const [registered, setRegistered] = useState(false)

    return (
        <DefaultLayout>
            <main className={styles.login}>
                {registered ? <RegisteredScreen /> : <SignUpForm handleRegistered={setRegistered} />}
            </main>
        </DefaultLayout>
    )
}

export default SignUp
