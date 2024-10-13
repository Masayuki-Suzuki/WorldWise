import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

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

const App = () => (
    <div>
        <BrowserRouter>
            <Routes>
                <Route index element={<Homepage />} />
                <Route path="/product" element={<Product />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/login" element={<Login />} />
                <Route path="/app" element={<AppLayout />}>
                    <Route index element={<Navigate replace to="cities" />} />
                    <Route path="cities" element={<Cities />} />
                    <Route path="cities/:id" element={<City />} />
                    <Route path="countries" element={<Countries />} />
                    <Route path="form" element={<AppForm />} />
                </Route>
                <Route path="*" element={<PageNotFound />} />
            </Routes>
        </BrowserRouter>
    </div>
)

export default App
