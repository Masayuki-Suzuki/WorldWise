import styles from './AppLayout.module.sass'
import Sidebar from '../organisms/App/Sidebar'
import Map from '../organisms/App/Map'

const AppLayout = () => {
    return (
        <div className={styles.app}>
            <Sidebar />
            <Map />
        </div>
    )
}

export default AppLayout
