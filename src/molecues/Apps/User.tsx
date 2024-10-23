import styles from './User.module.sass'
import { useAuth } from '../../contexts/FakeAuthContext'

const User = () => {
    const { user, logoutHandler } = useAuth()

    if (!user) return null

    return (
        <div className={styles.user}>
            <img src={user.avatar} alt={user.name} />
            <span>Welcome, {user.name}</span>
            <button onClick={logoutHandler}>Logout</button>
        </div>
    )
}

export default User
