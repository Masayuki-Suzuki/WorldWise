import DefaultLayout from '../layouts/DefaultLayout'
import styles from './Pricing.module.sass'
import PricingMainSection from '../organisms/Pricing/PricingMainSection'

const Pricing = () => {
    return (
        <DefaultLayout>
            <main className={styles.pricing}>
                <PricingMainSection />
            </main>
        </DefaultLayout>
    )
}

export default Pricing
