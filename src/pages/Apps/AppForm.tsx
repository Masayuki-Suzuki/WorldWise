import { useState } from 'react'
import styles from './AppForm.module.sass'
import { DateString } from '../../types/utilities'
import { format } from 'date-fns'

const AppForm = () => {
    const [cityName, setCityName] = useState('')
    // const [country, setCountry] = useState('')
    const [date, setDate] = useState<DateString>(new Date())
    const [notes, setNotes] = useState('')

    return (
        <form className={styles.form}>
            <div className={styles.row}>
                <label htmlFor="cityName">City name</label>
                <input id="cityName" onChange={e => setCityName(e.target.value)} value={cityName} />
                {/* <span className={styles.flag}>{emoji}</span> */}
            </div>

            <div className={styles.row}>
                <label htmlFor="date">When did you go to {cityName}?</label>
                <input id="date" onChange={e => setDate(e.target.value)} value={format(date, 'PPP')} />
            </div>

            <div className={styles.row}>
                <label htmlFor="notes">Notes about your trip to {cityName}</label>
                <textarea id="notes" onChange={e => setNotes(e.target.value)} value={notes} />
            </div>

            <div className={styles.buttons}>
                <button>Add</button>
                <button>&larr; Back</button>
            </div>
        </form>
    )
}

export default AppForm
