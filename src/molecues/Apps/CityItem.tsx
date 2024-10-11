import styles from './CityItem.module.sass'
import { City } from '../../types/apps'
import { format } from 'date-fns'
import { Link } from 'react-router-dom'

type CityItemPropsType = {
    city: City
}

const CityItem = ({ city }: CityItemPropsType) => {
    const { cityName, emoji, date, id, position } = city

    return (
        <li>
            <Link className={styles.cityItem} to={`${id}?lat=${position.lat}&lng=${position.lng}`}>
                <span className={styles.emoji}>{emoji}</span>
                <h3 className={styles.name}>{cityName}</h3>
                <time className={styles.date}>({format(date, 'PPP')})</time>
                <button className={styles.deleteBtn}>&times;</button>
            </Link>
        </li>
    )
}

export default CityItem
