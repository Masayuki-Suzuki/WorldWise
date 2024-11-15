import { createContext, Dispatch, useCallback, useContext, useEffect, useReducer } from 'react'
import { City as CityType, PostCity } from '../types/apps'

import {
    APIResponseJSON,
    Nullable,
    OnlyChildren,
    PromiseVoidFunction,
    PromiseVoidFunctionHasOptions,
    VoidFunction,
    VoidPromise
} from '../types/utilities'
import { useAuth } from './FireBaseAuthProvider'

const CitiesContext = createContext({})

type CitiesContextType = {
    cities: CityType[]
    currentCity: Nullable<CityType>
    isLoading: boolean
    fetchCities: PromiseVoidFunction
    getCityById: PromiseVoidFunctionHasOptions<string>
    clearCurrentCity: VoidFunction
    createCity: (newCity: PostCity) => VoidPromise
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

function isCityArray(value: unknown): value is CityType[] {
    if (!Array.isArray(value)) {
        return false
    } else if (!('cityName' in value[0]) || !('country' in value[0])) {
        return false
    }
    return true
}

function isCityType(value: unknown): value is CityType {
    if (
        value === null ||
        value === undefined ||
        typeof value !== 'object' ||
        !('cityName' in value) ||
        !('country' in value)
    ) {
        return false
    }
    return true
}

const citiesReducer = (state: CitiesStateType, action: CitiesReducerAction): CitiesStateType => {
    switch (action.type) {
        case 'loading':
            return { ...state, isLoading: true }

        case 'fetched':
            return { ...state, isLoading: false }

        case 'cities/loaded':
            if (action.payload) {
                if (Array.isArray(action.payload)) {
                    if (action.payload.length === 0) {
                        return {
                            ...state,
                            isLoading: false,
                            cities: []
                        }
                    } else {
                        if (isCityArray(action.payload)) {
                            return { ...state, isLoading: false, cities: action.payload }
                        } else {
                            return { ...state, isLoading: false }
                        }
                    }
                }
                throw new Error('Invalid city data found. Please try again.')
            }
            throw new Error(`Could not load cities. Please try again or contact support.`)

        case 'city/created':
            if (action.payload) {
                if (isCityType(action.payload)) {
                    return {
                        ...state,
                        isLoading: false,
                        cities: [...state.cities, action.payload],
                        currentCity: action.payload
                    }
                }
                throw new Error('Invalid city data found. Please try again.')
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
                if (isCityType(action.payload)) {
                    return { ...state, isLoading: false, currentCity: action.payload }
                }
                throw new Error('Invalid city data found. Please try again.')
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
    const { user } = useAuth()

    const fetchCities = useCallback(async () => {
        dispatch({ type: 'loading' })
        if (user && user.token) {
            try {
                const res = await fetch(`${process.env.API_URL}api/cities`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': 'http://localhost:3000',
                        Authorization: `Bearer ${user.token}`,
                        UUID: user.id
                    }
                })

                if (!res.ok) {
                    const msg = await res.json()
                    throw new Error(`Error fetching cities: ${msg.message}`)
                } else {
                    const data = await res.json()

                    if (data && 'cities' in data) {
                        dispatch({ type: 'cities/loaded', payload: data.cities })
                    } else {
                        dispatch({ type: 'cities/loaded' })
                        throw new Error('No cities found')
                    }
                }
            } catch (error) {
                citiesContextErrorHandler(error, dispatch)
            }
        }
    }, [user])

    const getCityById = useCallback(
        async (id: string) => {
            if (currentCity && currentCity.id === id) return

            if (user && user.token) {
                try {
                    dispatch({ type: 'loading' })
                    const res = await fetch(`${process.env.API_URL}api/cities/${id}`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': 'http://localhost:3000',
                            Authorization: `Bearer ${user.token}`
                        }
                    })
                    if (!res.ok) {
                        throw new Error(`Error fetching city: ${res.status}`)
                    }
                    const data = (await res.json()) as { city: Nullable<CityType> }
                    if (data && 'city' in data && data.city) {
                        dispatch({ type: 'currentCity/loaded', payload: data.city })
                    } else {
                        dispatch({ type: 'currentCity/loaded' })
                        throw new Error('No city found')
                    }
                } catch (error) {
                    citiesContextErrorHandler(error, dispatch)
                }
            } else {
                citiesContextErrorHandler('User not found', dispatch)
            }
        },
        [currentCity, user]
    )

    const createCity = async (newCity: PostCity) => {
        try {
            dispatch({ type: 'loading' })
            if (!user || !user.token) {
                citiesContextErrorHandler('User not found', dispatch)
            } else {
                const res = await fetch(`${process.env.API_URL}api/city`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ city: newCity, token: user.token })
                })
                if (!res.ok) {
                    throw new Error(`Error creating city: ${res.status}`)
                }

                const data = (await res.json()) as APIResponseJSON<{ city: CityType }>
                if (data && 'city' in data && data.city) {
                    dispatch({ type: 'city/created', payload: data.city })
                } else {
                    citiesContextErrorHandler('Failed to create new city. Please try again later.', dispatch)
                }
            }
        } catch (error) {
            citiesContextErrorHandler(error, dispatch)
        }
    }

    const deleteCity = async (id: string) => {
        if (user && user.token) {
            try {
                dispatch({ type: 'loading' })
                const res = await fetch(`${process.env.API_URL}api/cities/${id}`, {
                    method: 'DELETE',
                    headers: {
                        Authorization: `Bearer ${user.token}`
                    }
                })

                if (!res.ok) {
                    throw new Error(`Error deleting city: ${res.status}`)
                }
                dispatch({ type: 'city/deleted', payload: id })
            } catch (error) {
                citiesContextErrorHandler(error, dispatch)
            }
        }
    }

    const clearCurrentCity = () => {
        dispatch({ type: 'currentCity/cleared' })
    }

    useEffect(() => {
        void fetchCities()
    }, [fetchCities])

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
