import styles from './CityItem.module.sass'
import { City } from '../../types/apps'
import { format } from 'date-fns'
import { Link } from 'react-router-dom'
import { useCities } from '../../contexts/CitiesContext'

type CityItemPropsType = {
    city: City
}

const CityItem = ({ city }: CityItemPropsType) => {
    const { currentCity } = useCities()
    const { cityName, emoji, date, id, position } = city
    const URL = `${id}?lat=${position.lat}&lng=${position.lng}`
    const className = `${styles.cityItem} ${currentCity && currentCity.id === id ? styles['cityItem--active'] : ''}`

    return (
        <li>
            <Link className={className.trim()} to={URL}>
                <span className={styles.emoji}>{emoji}</span>
                <h3 className={styles.name}>{cityName}</h3>
                <time className={styles.date}>({format(date, 'PPP')})</time>
                <button className={styles.deleteBtn}>&times;</button>
            </Link>
        </li>
    )
}

export default CityItem
