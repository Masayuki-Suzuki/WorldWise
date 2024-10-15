import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet'

import styles from './Map.module.sass'
import { LatLngExpression } from 'leaflet'
import { useCities } from '../../contexts/CitiesContext'
import { useGeolocation } from '../../hooks/useGeolocation'
import Button from '../../atoms/Button'
import useURLPosition from '../../hooks/useURLPosition'

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
            navigate(`form?lat=${e.latlng.lat}&lng=${e.latlng.lng}`)
        }
    })

    return null
}

const Map = () => {
    const { cities } = useCities()
    const [mapPosition, setMapPosition] = useState<LatLngExpression>([40, 0])
    const { isLoading: isLoadingPosition, position: geolocationPosition, getPosition } = useGeolocation()
    const [lat, lng] = useURLPosition()

    useEffect(() => {
        const coordinates: LatLngExpression = [Number(lat), Number(lng)]
        if (lat && lng) {
            setMapPosition(coordinates)
        }
    }, [lat, lng])

    useEffect(() => {
        if (geolocationPosition) {
            setMapPosition([geolocationPosition.lat, geolocationPosition.lng])
        }
    }, [geolocationPosition])

    return (
        <div className={styles.mapContainer}>
            {!geolocationPosition && (
                <Button type="position" action={getPosition}>
                    {isLoadingPosition ? 'loading...' : 'Use Your Position'}
                </Button>
            )}
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
