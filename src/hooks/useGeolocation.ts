import { useState } from 'react'
import { Nullable } from '../types/utilities'
import { Position } from '../types/apps'

const useGeolocation = (defaultPosition: Nullable<Position> = null) => {
    const [isLoading, setIsLoading] = useState(false)
    const [position, setPosition] = useState<Nullable<Position>>(defaultPosition)
    const [error, setError] = useState<Nullable<string>>(null)

    const getPosition = () => {
        if (!navigator.geolocation) return setError('Your browser does not support geolocation')

        setIsLoading(true)
        navigator.geolocation.getCurrentPosition(
            pos => {
                setPosition({
                    lat: pos.coords.latitude,
                    lng: pos.coords.longitude
                })
                setIsLoading(false)
            },
            error => {
                console.error('Error getting geolocation:', error.message)
                setError(error.message)

                setIsLoading(false)
            }
        )
    }

    return { isLoading, position, error, getPosition }
}

export { useGeolocation }
