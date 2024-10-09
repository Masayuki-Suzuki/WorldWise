import { Link } from 'react-router-dom'
import styles from './Logo.module.sass'

const Logo = () => (
    <div>
        <Link to="/">
            <img className={styles.logo} src="/images/logo.png" alt="WorldWise" />
        </Link>
    </div>
)

export default Logo
