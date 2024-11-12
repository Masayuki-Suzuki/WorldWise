import { useParams } from 'react-router-dom'

import { format } from 'date-fns'

import styles from './City.module.sass'
import { useCities } from '../../contexts/CitiesContext'
import { useEffect } from 'react'
import Spinner from '../../atoms/Spinner'
import Message from '../../molecues/Apps/Message'
import BackButton from '../../atoms/BackButton'

const CityDetail = () => {
    const { getCityById, isLoading, currentCity } = useCities()
    const { id } = useParams()

    useEffect(() => {
        if (id) {
            void getCityById(id)
        }
    }, [id, getCityById])

    return (
        <div className={styles.city}>
            {isLoading && <Spinner />}
            {!isLoading && !currentCity && <Message message={'City not found'} type="error" />}
            {!isLoading && currentCity && (
                <>
                    <div className={styles.row}>
                        <h6>City name</h6>
                        <h3>
                            <span>{currentCity.emoji}</span> {currentCity.cityName}
                        </h3>
                    </div>

                    <div className={styles.row}>
                        <h6>You went to {currentCity.cityName} on</h6>
                        <p>{!!currentCity.date && format(currentCity.date, 'PPP')}</p>
                    </div>

                    {currentCity.notes && (
                        <div className={styles.row}>
                            <h6>Your notes</h6>
                            <p>{currentCity.notes}</p>
                        </div>
                    )}

                    <div className={styles.row}>
                        <h6>Learn more</h6>
                        <a
                            href={`https://en.wikipedia.org/wiki/${currentCity.cityName}`}
                            target="_blank"
                            rel="noreferrer noopener"
                        >
                            Check out {currentCity.cityName} on Wikipedia &rarr;
                        </a>
                    </div>
                </>
            )}
            {!isLoading && (
                <div>
                    <BackButton />
                </div>
            )}
        </div>
    )
}

export default CityDetail
