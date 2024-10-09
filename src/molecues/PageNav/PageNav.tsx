import { NavLink } from 'react-router-dom'
import styles from './PageNav.module.sass'
import CommonLink from '../../atoms/CommonLink'

const routes = [
    // {
    //     title: 'Home',
    //     url: '/'
    // },
    { title: 'pricing', url: '/pricing' },
    { title: 'product', url: '/product' },
    { title: 'login', url: '/login' }
    // { title: 'dashboard', url: '/app' }
]

const PageNav = () => {
    return (
        <ul className={styles.pageNav}>
            {routes.map(route => (
                <li className={styles.pageNav__item} key={route.title}>
                    {route.title === 'login' ? (
                        <CommonLink to={route.url}>{route.title}</CommonLink>
                    ) : (
                        <NavLink to={route.url}>{route.title}</NavLink>
                    )}
                </li>
            ))}
        </ul>
    )
}

export default PageNav
