import Spinner from '../../atoms/Spinner'
import Message from '../../molecues/Apps/Message'
import CountryItem from '../../molecues/Apps/CountryItem'

import { City, Country } from '../../types/apps'

import styles from './Countries.module.sass'

type CountriesProps = {
    cities: City[]
    isLoading: boolean
}

const Countries = ({ cities, isLoading }: CountriesProps) => {
    const countries: Country[] = cities.reduce((acc: Country[], city: City) => {
        if (!acc.some(country => country.countryName === city.country)) {
            return [...acc, { emoji: city.emoji, countryName: city.country }]
        }
        return acc
    }, [])

    return (
        <div>
            {isLoading && <Spinner />}
            {!isLoading && !cities.length && (
                <Message message="Add your first city by clicking on a city on the map." />
            )}
            {!isLoading && (
                <ul className={styles.countries}>
                    {countries.map(country => (
                        <CountryItem key={country.countryName} country={country} />
                    ))}
                </ul>
            )}
        </div>
    )
}

export default Countries
