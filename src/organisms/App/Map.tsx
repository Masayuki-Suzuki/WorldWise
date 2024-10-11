import { useNavigate, useSearchParams } from 'react-router-dom'
import styles from './Map.module.sass'

const Map = () => {
    const [searchParams, setSearchParams] = useSearchParams('')
    const lat = searchParams.get('lat')
    const lng = searchParams.get('lng')

    const navigate = useNavigate()

    return (
        <div className={styles.mapContainer} onClick={() => navigate('form')}>
            <h2>Map</h2>
            <h3>
                Position: {lat}, {lng}
            </h3>
        </div>
    )
}

export default Map
