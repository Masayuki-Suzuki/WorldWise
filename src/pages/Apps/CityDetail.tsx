import { useNavigate, useParams, useSearchParams } from 'react-router-dom'

import { format } from 'date-fns'

import styles from './City.module.sass'
import Button from '../../atoms/Button'

const CityDetail = () => {
    // TEMP DATA
    const currentCity = {
        cityName: 'Lisbon',
        emoji: '🇵🇹',
        date: '2027-10-31T15:59:59.138Z',
        notes: 'My favorite city so far!'
    }

    const { id } = useParams()
    const navigate = useNavigate()

    const [searchParams, setSearchParams] = useSearchParams()
    const lat = searchParams.get('lat')
    const lng = searchParams.get('lng')

    const { cityName, emoji, date, notes } = currentCity

    return (
        <div className={styles.city}>
            <div className={styles.row}>
                <h6>City name</h6>
                <h3>
                    <span>{emoji}</span> {cityName}
                </h3>
            </div>

            <div className={styles.row}>
                <h6>You went to {cityName} on</h6>
                <p>{format(date, 'PPP')}</p>
            </div>

            {notes && (
                <div className={styles.row}>
                    <h6>Your notes</h6>
                    <p>{notes}</p>
                </div>
            )}

            <div className={styles.row}>
                <h6>Learn more</h6>
                <a href={`https://en.wikipedia.org/wiki/${cityName}`} target="_blank" rel="noreferrer noopener">
                    Check out {cityName} on Wikipedia &rarr;
                </a>
            </div>

            <div>
                {
                    <Button action={() => navigate(-1)} type="back">
                        &larr; Back
                    </Button>
                }
            </div>
        </div>
    )
}

export default CityDetail
