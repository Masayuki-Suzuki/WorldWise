// import { DateString } from './utilities'

export type Position = {
    lat: number
    lng: number
}

export type City = {
    id: string
    cityName: string
    country: string
    emoji: string
    date: Date
    notes: string
    position: Position
}

export type Country = {
    emoji: string
    countryName: string
}

export type Administrative = {
    [key: string]: string | number
}

export type Informative = {
    [key: string]: string | number
}

export type LocalityInfo = {
    administrative: Administrative[]
    informative: Informative[]
}

export type DecodedLocationData = {
    city: string
    continent: string
    continentCode: string
    countryCode: string
    countryName: string
    latitude: number
    locality: string
    localityInfo: LocalityInfo
    localityLanguageRequested: string
    longitude: number
    lookupSource: string
    plusCode: string
    postalcode: string
    principalSubdivision: string
    principalSubdivisionCode: string
}

export type PostCity = Omit<City, 'id'> & {
    userId: string
}
