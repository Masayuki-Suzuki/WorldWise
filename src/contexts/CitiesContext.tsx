import { createContext, Dispatch, useContext, useEffect, useReducer } from 'react'
import { City as CityType } from '../types/apps'
import { sleep } from '../libs/utilities'
import {
    Nullable,
    OnlyChildren,
    PromiseVoidFunction,
    PromiseVoidFunctionHasOptions,
    VoidFunction,
    VoidPromise
} from '../types/utilities'

const CitiesContext = createContext({})

type CitiesContextType = {
    cities: CityType[]
    currentCity: Nullable<CityType>
    isLoading: boolean
    fetchCities: PromiseVoidFunction
    getCityById: PromiseVoidFunctionHasOptions<string>
    clearCurrentCity: VoidFunction
    createCity: (newCity: CityType) => VoidPromise
    deleteCity: PromiseVoidFunctionHasOptions<string>
    error: Nullable<string>
}

type CitiesStateType = {
    cities: CityType[]
    isLoading: boolean
    currentCity: Nullable<CityType>
    error: Nullable<string>
}

type CityPayload = CityType | CityType[] | boolean | string

type CitiesReducerAction = {
    type: string
    payload?: CityPayload
}

const initialState: CitiesStateType = {
    cities: [],
    isLoading: false,
    currentCity: null,
    error: null
}

function isCityArray(value: unknown): asserts value is CityType[] {
    if (!Array.isArray(value)) {
        throw new Error('Not an array of cities.')
    } else if (!('cityName' in value[0]) || !('country' in value[0])) {
        throw new Error('Not an array of cities.')
    }
}

function isCityType(value: unknown): asserts value is CityType {
    if (
        value === null ||
        value === undefined ||
        typeof value !== 'object' ||
        !('cityName' in value) ||
        !('country' in value)
    ) {
        throw new Error('Not a city.')
    }
}

const citiesReducer = (state: CitiesStateType, action: CitiesReducerAction): CitiesStateType => {
    switch (action.type) {
        case 'loading':
            return { ...state, isLoading: true }

        case 'fetched':
            return { ...state, isLoading: false }

        case 'cities/loaded':
            if (action.payload) {
                isCityArray(action.payload)
                return { ...state, isLoading: false, cities: action.payload }
            }
            return { ...state, cities: [] }

        case 'city/created':
            if (action.payload) {
                isCityType(action.payload)
                return {
                    ...state,
                    isLoading: false,
                    cities: [...state.cities, action.payload],
                    currentCity: action.payload
                }
            }
            throw new Error('No city data found. Please try again.')

        case 'city/deleted':
            if (action.payload) {
                if (typeof action.payload === 'string') {
                    const newCities = state.cities.filter(city => city.id !== action.payload)
                    return { ...state, isLoading: false, cities: newCities, currentCity: null }
                }
                return { ...state, isLoading: false }
            }
            return { ...state, currentCity: null }

        case 'currentCity/loaded':
            if (action.payload) {
                isCityType(action.payload)
                return { ...state, isLoading: false, currentCity: action.payload }
            }
            throw new Error('No city data found. Please try again.')

        case 'currentCity/cleared':
            return { ...state, currentCity: null }

        case 'rejected':
            if (action.payload) {
                if (typeof action.payload === 'string') {
                    return {
                        ...state,
                        isLoading: false,
                        error: action.payload
                    }
                }
                throw new Error('Error data must be a string.')
            }

            throw new Error('No error data found. Please try again.')

        default:
            throw new Error(`Unhandled action type: ${action.type}`)
    }
}

const citiesContextErrorHandler = (error: unknown, dispatch: Dispatch<CitiesReducerAction>) => {
    if (error instanceof Error) {
        console.error('Error fetching city:', error.message)
        dispatch({ type: 'rejected', payload: error.message })
    } else {
        console.error('Error fetching city:', error)
        if (typeof error === 'string') {
            dispatch({ type: 'rejected', payload: error })
        } else {
            dispatch({ type: 'rejected', payload: 'An unknown error occurred' })
        }
    }
}

const CitiesProvider = ({ children }: OnlyChildren) => {
    const [{ cities, isLoading, currentCity, error }, dispatch] = useReducer(citiesReducer, initialState)

    const fetchCities = async () => {
        dispatch({ type: 'loading' })

        try {
            const res = await fetch(`${process.env.API_URL}cities`)
            const data = await res.json()
            await sleep(1000)
            if (data) {
                dispatch({ type: 'cities/loaded', payload: data })
            } else {
                dispatch({ type: 'cities/loaded' })
                throw new Error('No cities found')
            }
        } catch (error) {
            citiesContextErrorHandler(error, dispatch)
        }
    }

    const getCityById = async (id: string) => {
        if (currentCity && currentCity.id === id) return

        try {
            dispatch({ type: 'loading' })
            const res = await fetch(`${process.env.API_URL}cities/${id}`)
            if (!res.ok) {
                throw new Error(`Error fetching city: ${res.status}`)
            }
            const data = (await res.json()) as Nullable<CityType>
            await sleep(1000)
            if (data) {
                dispatch({ type: 'currentCity/loaded', payload: data })
            } else {
                dispatch({ type: 'currentCity/loaded' })
                throw new Error('No city found')
            }
        } catch (error) {
            citiesContextErrorHandler(error, dispatch)
        }
    }

    const createCity = async (newCity: CityType) => {
        try {
            dispatch({ type: 'loading' })
            const res = await fetch(`${process.env.API_URL}cities`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newCity)
            })
            if (!res.ok) {
                throw new Error(`Error creating city: ${res.status}`)
            }
            const data = (await res.json()) as CityType
            await sleep(1000)
            if (data) {
                dispatch({ type: 'city/created', payload: data })
            } else {
                citiesContextErrorHandler('Failed to create new city. Please try again later.', dispatch)
            }
        } catch (error) {
            citiesContextErrorHandler(error, dispatch)
        }
    }

    const deleteCity = async (id: string) => {
        try {
            dispatch({ type: 'loading' })
            const res = await fetch(`${process.env.API_URL}cities/${id}`, {
                method: 'DELETE'
            })
            await sleep(1000)
            if (!res.ok) {
                throw new Error(`Error deleting city: ${res.status}`)
            }
            dispatch({ type: 'city/deleted', payload: id })
        } catch (error) {
            citiesContextErrorHandler(error, dispatch)
        }
    }

    const clearCurrentCity = () => {
        dispatch({ type: 'currentCity/cleared' })
    }

    useEffect(() => {
        void fetchCities()
    }, [])

    const value: CitiesContextType = {
        cities,
        currentCity,
        error,
        isLoading,
        clearCurrentCity,
        createCity,
        deleteCity,
        fetchCities,
        getCityById
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
