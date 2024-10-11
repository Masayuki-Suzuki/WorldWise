import DefaultLayout from '../../layouts/DefaultLayout'
import LoginForm from '../../organisms/Login/LoginForm'
import styles from './Login.module.sass'

const Login = () => {
    return (
        <DefaultLayout>
            <main className={styles.login}>
                <LoginForm />
            </main>
        </DefaultLayout>
    )
}

export default Login
