import { SyntheticEvent, useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './AppForm.module.sass'
import BackButton from '../../atoms/BackButton'
import Button from '../../atoms/Button'
import useURLPosition from '../../hooks/useURLPosition'
import { DecodedLocationData, PostCity } from '../../types/apps'
import { convertToEmoji } from '../../libs/utilities'
import Message from '../../molecues/Apps/Message'
import Spinner from '../../atoms/Spinner'
import DatePicker from 'react-datepicker'

import 'react-datepicker/dist/react-datepicker.css'
import { useCities } from '../../contexts/CitiesContext'
import { useAuth } from '../../contexts/FireBaseAuthProvider'

const AppForm = () => {
    const navigate = useNavigate()

    const [cityName, setCityName] = useState('')
    const [country, setCountry] = useState('')
    const [emoji, setEmoji] = useState('')
    const [date, setDate] = useState<Date | null | undefined>(new Date())
    const [notes, setNotes] = useState('')
    const [isLoadingGeocoding, setIsLoadingGeocoding] = useState(false)
    const [geocodingError, setGeocodingError] = useState<string | null>(null)
    const { createCity, isLoading } = useCities()
    const { user } = useAuth()

    const [mapLat, mapLng] = useURLPosition()

    const decodeGeolocation = useCallback(async () => {
        try {
            setIsLoadingGeocoding(true)
            const res = await fetch(`${process.env.GEO_API}?latitude=${mapLat}&longitude=${mapLng}`)
            const data = (await res.json()) as DecodedLocationData

            if (data) {
                if (!data.countryCode) {
                    console.error('No country code found in geolocation data.')
                    throw new Error(`That doesn't seem to be a city. Click somewhere else 😉`)
                } else {
                    let cityName = data.city

                    if (data.countryName === 'canada') {
                        cityName = data.locality
                    }

                    setGeocodingError(null)
                    setCityName(cityName || '')
                    setCountry(data.countryName || '')
                    setEmoji(convertToEmoji(data.countryCode))
                }
            }
        } catch (error) {
            if (error instanceof Error) {
                console.error('Error decoding geolocation:', error.message)
                setGeocodingError(error.message)
            } else {
                console.error('Error decoding geolocation:', error)
                setGeocodingError('An unknown error occurred while decoding geolocation. Please try again.')
            }
        } finally {
            setIsLoadingGeocoding(false)
        }
    }, [mapLng, mapLat])

    const handleSubmit = (e: SyntheticEvent<HTMLButtonElement>) => {
        e.preventDefault()
        e.stopPropagation()

        if (!cityName || !date || !user || !user.id) {
            return
        } else {
            const locationData: PostCity = {
                cityName,
                country,
                emoji,
                date,
                notes,
                position: {
                    lat: Number(mapLat),
                    lng: Number(mapLng)
                },
                userId: user.id
            }
            void createCity(locationData)
            setNotes('')
            setCityName('')
            setDate(null)
            navigate('/app/cities')
        }
    }

    useEffect(() => {
        void decodeGeolocation()
    }, [mapLat, mapLng, decodeGeolocation])

    if (isLoadingGeocoding) {
        return <Spinner />
    }

    if (!mapLat || !mapLng) {
        return <Message message="Please click somewhere on the map to get the city's name." />
    }

    if (geocodingError) {
        return <Message message={geocodingError} />
    }

    return (
        <form className={`${styles.form} ${isLoading ? styles.loading : ''}`}>
            <div className={styles.row}>
                <label htmlFor="cityName">City name</label>
                <input id="cityName" onChange={e => setCityName(e.target.value)} value={cityName} />
                <span className={styles.flag}>{emoji}</span>
            </div>

            <div className={styles.row}>
                <label htmlFor="date">When did you go to {cityName}?</label>
                {/*<input id="date" onChange={e => setDate(e.target.value)} value={format(date, 'PPP')} />*/}
                <DatePicker onChange={date => setDate(date)} selected={date} dateFormat="PPP" />
            </div>

            <div className={styles.row}>
                <label htmlFor="notes">Notes about your trip to {cityName}</label>
                <textarea id="notes" onChange={e => setNotes(e.target.value)} value={notes} />
            </div>

            <div className={styles.buttons}>
                <Button action={handleSubmit}>Add</Button>
                <BackButton />
            </div>
        </form>
    )
}

export default AppForm
