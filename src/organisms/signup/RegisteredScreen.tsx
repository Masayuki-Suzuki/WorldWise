import styles from './SignUpForm.module.sass'
import { Link } from 'react-router-dom'

const RegisteredScreen = () => (
    <div className={styles.signupForm}>
        <h2>Registered!</h2>
        <p className={styles.signupText}>
            You have successfully registered. Please check your email for a verification link.
        </p>
        <p className={styles.signupText}>
            <Link to="/login">Click here to login</Link>
        </p>
    </div>
)

export default RegisteredScreen
