import styles from './Homepage.module.sass'
import DefaultLayout from '../../layouts/DefaultLayout'
import MainSection from '../../organisms/Homepage/MainSection'

const Homepage = () => {
    return (
        <DefaultLayout>
            <main className={styles.homepage}>
                <MainSection />
            </main>
        </DefaultLayout>
    )
}

export default Homepage
