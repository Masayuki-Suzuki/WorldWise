import { createContext, useContext, useEffect, useState } from 'react'
import { City as CityType } from '../types/apps'
import { sleep } from '../libs/utilities'
import { Nullable, OnlyChildren, VoidFunction } from '../types/utilities'

const CitiesContext = createContext({})

type CitiesContextType = {
    cities: CityType[]
    currentCity: Nullable<CityType>
    setCities: (cities: CityType[]) => void
    isLoading: boolean
    setIsLoading: (isLoading: boolean) => void
    fetchCities: () => Promise<void>
    getCityById: (id: number) => CityType | undefined | null
    clearCurrentCity: VoidFunction
}

const CitiesProvider = ({ children }: OnlyChildren) => {
    const [cities, setCities] = useState<CityType[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [currentCity, setCurrentCity] = useState<Nullable<CityType>>(null)

    const fetchCities = async () => {
        setIsLoading(true)
        try {
            const res = await fetch(`${process.env.API_URL}cities`)
            const data = await res.json()
            if (data) {
                setCities(data)
            } else {
                setCities([])
                throw new Error('No cities found')
            }
        } catch (error) {
            if (error instanceof Error) {
                console.error('Error fetching cities:', error.message)
            } else {
                console.error('Error:', error)
            }
        } finally {
            await sleep(2000)
            setIsLoading(false)
        }
    }

    const getCityById = async (id: number) => {
        try {
            setIsLoading(true)
            const res = await fetch(`${process.env.API_URL}cities/${id}`)
            if (!res.ok) {
                throw new Error(`Error fetching city: ${res.status}`)
            }
            const data = (await res.json()) as Nullable<CityType>
            setCurrentCity(data)
        } catch (error) {
            if (error instanceof Error) {
                console.error('Error fetching city:', error.message)
            } else {
                console.error('Error fetching city:', error)
            }
            return null
        } finally {
            await sleep(2000)
            setIsLoading(false)
        }
    }

    const clearCurrentCity = () => {
        setCurrentCity(null)
    }

    useEffect(() => {
        void fetchCities()
    }, [])

    const value = {
        cities,
        setCities,
        isLoading,
        setIsLoading,
        fetchCities,
        getCityById,
        currentCity,
        clearCurrentCity
    }

    return <CitiesContext.Provider value={value}>{children}</CitiesContext.Provider>
}

const useCities = (): CitiesContextType => {
    const context = (useContext(CitiesContext) as CitiesContextType) || undefined
    if (!context || context === undefined) {
        throw new Error('useCities must be used within a CitiesProvider')
    }

    return context
}

export { CitiesProvider, useCities }
