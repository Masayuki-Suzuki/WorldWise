import { useEffect, useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'

import Homepage from './pages/Corporate/Homepage'
import Product from './pages/Corporate/Product'
import Pricing from './pages/Corporate/Pricing'
import PageNotFound from './pages/404'
import Login from './pages/Corporate/Login'
import Cities from './pages/Apps/Cities'
import AppLayout from './templates/AppLayout'
import Countries from './pages/Apps/Countries'
import AppForm from './pages/Apps/AppForm'
import City from './pages/Apps/CityDetail'

import { sleep } from './libs/utilities'
import { City as CityType } from './types/apps'

function App() {
    const [cities, setCities] = useState<CityType[]>([])
    const [isLoading, setIsLoading] = useState(false)

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

    useEffect(() => {
        void fetchCities()
    }, [])

    return (
        <div>
            <BrowserRouter>
                <Routes>
                    <Route index element={<Homepage />} />
                    <Route path="/product" element={<Product />} />
                    <Route path="/pricing" element={<Pricing />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/app" element={<AppLayout />}>
                        <Route index element={<Navigate replace to="cities" />} />
                        <Route path="cities" element={<Cities cities={cities} isLoading={isLoading} />} />
                        <Route path="cities/:id" element={<City />} />
                        <Route path="countries" element={<Countries cities={cities} isLoading={isLoading} />} />
                        <Route path="form" element={<AppForm />} />
                    </Route>
                    <Route path="*" element={<PageNotFound />} />
                </Routes>
            </BrowserRouter>
        </div>
    )
}

export default App
