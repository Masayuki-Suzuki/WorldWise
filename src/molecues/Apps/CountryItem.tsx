import styles from './CountryItem.module.sass'
import { Country } from '../../types/apps'

type CountryItemPropsType = {
    country: Country
}

const CountryItem = ({ country }: CountryItemPropsType) => {
    return (
        <li className={styles.countryItem}>
            <span>{country.emoji}</span>
            <span>{country.countryName}</span>
        </li>
    )
}

export default CountryItem
