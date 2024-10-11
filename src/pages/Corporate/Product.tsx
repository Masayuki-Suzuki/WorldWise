import DefaultLayout from '../../layouts/DefaultLayout'
import styles from './Product.module.sass'
import ProductMain from '../../organisms/Product/ProductMain'

const Product = () => {
    return (
        <DefaultLayout>
            <main className={styles.product}>
                <ProductMain />
            </main>
        </DefaultLayout>
    )
}

export default Product
