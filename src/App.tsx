import { lazy, Suspense } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import SpinnerFullPage from './molecues/common/SpinnerFullPage'

import Cities from './pages/Apps/Cities'
import Countries from './pages/Apps/Countries'
import AppForm from './pages/Apps/AppForm'
import City from './pages/Apps/CityDetail'

const Homepage = lazy(() => import('./pages/Corporate/Homepage'))
const Product = lazy(() => import('./pages/Corporate/Product'))
const Pricing = lazy(() => import('./pages/Corporate/Pricing'))
const PageNotFound = lazy(() => import('./pages/404'))
const Login = lazy(() => import('./pages/Corporate/Login'))
const AppLayout = lazy(() => import('./templates/AppLayout'))

const App = () => (
    <div>
        <BrowserRouter>
            <Suspense fallback={<SpinnerFullPage />}>
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
            </Suspense>
        </BrowserRouter>
    </div>
)

export default App
