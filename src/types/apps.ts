import { DateString } from './utilities'

export type Position = {
    lat: number
    lng: number
}

export type City = {
    id: number
    cityName: string
    country: string
    emoji: string
    date: DateString
    notes: string
    position: Position
}

export type Country = {
    emoji: string
    countryName: string
}
