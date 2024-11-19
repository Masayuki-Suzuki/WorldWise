import styles from './User.module.sass'
import { useAuth } from '../../contexts/FireBaseAuthProvider'
import { useCities } from '../../contexts/CitiesContext'

const User = () => {
    const { user, logoutHandler } = useAuth()
    const { clearCurrentCity } = useCities()

    if (!user) return null

    const handleLogout = () => {
        logoutHandler()
        clearCurrentCity()
    }

    return (
        <div className={styles.user}>
            <img src={user.avatar} alt={user.name} />
            <span>Welcome, {user.name}</span>
            <button onClick={handleLogout}>Logout</button>
        </div>
    )
}

export default User
