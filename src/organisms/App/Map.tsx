import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet'

import styles from './Map.module.sass'
import { LatLngExpression } from 'leaflet'
import { useCities } from '../../contexts/CitiesContext'

type ChangeCenterProps = {
    position: LatLngExpression
}

const ChangeCenter = ({ position }: ChangeCenterProps) => {
    const map = useMap()
    map.setView(position)
    return null
}

const DetectClick = () => {
    const navigate = useNavigate()

    useMapEvents({
        click: e => {
            console.log(e)
            // navigate(`form?lat=${e.latlng.lat}&lng=${e.latlng.lng}`)
        }
    })

    return null
}

const Map = () => {
    const { cities } = useCities()
    const [searchParams] = useSearchParams()
    const [mapPosition, setMapPosition] = useState<LatLngExpression>([40, 0])

    const lat = searchParams.get('lat')
    const lng = searchParams.get('lng')

    useEffect(() => {
        const coordinates: LatLngExpression = [Number(lat), Number(lng)]
        if (lat && lng) {
            setMapPosition(coordinates)
        }
    }, [lat, lng])

    return (
        <div className={styles.mapContainer}>
            <MapContainer center={mapPosition} zoom={6} scrollWheelZoom className={styles.map}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {cities.map(city => (
                    <Marker position={[city.position.lat, city.position.lng]} key={city.id}>
                        <Popup>
                            A pretty CSS3 popup. <br /> Easily customizable.
                        </Popup>
                    </Marker>
                ))}
                <ChangeCenter position={mapPosition} />
                <DetectClick />
            </MapContainer>
        </div>
    )
}

export default Map
