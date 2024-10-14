import { useState } from 'react'
import { Nullable } from '../types/utilities'
import { Position } from '../types/apps'

const useGeolocation = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [position, setPosition] = useState<Position>({
        lat: 0,
        lng: 0
    })
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
                if (error instanceof Error) {
                    setError(error.message)
                } else {
                    setError('An unknown error occurred')
                }
                setIsLoading(false)
            }
        )
    }

    return { isLoading, position, error, getPosition }
}

export default useGeolocation
