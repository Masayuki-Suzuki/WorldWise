import PageNav from '../molecues/PageNav/PageNav'
import Logo from '../atoms/Logo'
import styles from './Header.module.sass'

const Header = () => {
    return (
        <header className={styles.header}>
            <Logo />
            <PageNav />
        </header>
    )
}

export default Header
