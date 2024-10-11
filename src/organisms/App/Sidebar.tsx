import { Outlet } from 'react-router-dom'
import styles from './Sidebar.module.sass'
import Logo from '../../atoms/Logo'
import AppNav from '../../molecues/Apps/AppNav'

const Sidebar = () => {
    return (
        <div className={styles.sidebar}>
            <Logo />
            <AppNav />

            <Outlet />

            <footer className={styles.footer}>
                <p className={styles.copyright}>&copy; Copyright {new Date().getFullYear()} by WorldWise Inc.</p>
            </footer>
        </div>
    )
}

export default Sidebar
