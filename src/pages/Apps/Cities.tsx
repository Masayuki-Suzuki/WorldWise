import { City } from '../../types/apps'
import CityItem from '../../molecues/Apps/CityItem'
import Spinner from '../../atoms/Spinner'

import styles from './Cities.module.sass'
import Message from '../../molecues/Apps/Message'

type CitiesProps = {
    cities: City[]
    isLoading: boolean
}

const Cities = ({ cities, isLoading }: CitiesProps) => {
    return (
        <div>
            {isLoading && <Spinner />}
            {!isLoading && !cities.length && (
                <Message message="Add your first city by clicking on a city on the map." />
            )}
            {!isLoading && (
                <ul className={styles.cities}>
                    {cities.map(city => (
                        <CityItem key={city.id} city={city} />
                    ))}
                </ul>
            )}
        </div>
    )
}

export default Cities
