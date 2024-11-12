import styles from './AppLayout.module.sass'
import Sidebar from '../organisms/App/Sidebar'
import Map from '../organisms/App/Map'
import User from '../molecues/Apps/User'
import { useAuth } from '../contexts/FireBaseAuthProvider'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

const AppLayout = () => {
    const navigate = useNavigate()
    const { isAuthenticated } = useAuth()

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login', { replace: true })
        }
    }, [isAuthenticated])

    return (
        <div className={styles.app}>
            <Sidebar />
            <Map />
            <User />
        </div>
    )
}

export default AppLayout
