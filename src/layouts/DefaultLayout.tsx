import { OnlyChildren } from '../types/utilities'
import Header from '../organisms/Header'

const DefaultLayout = ({ children }: OnlyChildren) => {
    return (
        <div>
            <Header />
            {children}
        </div>
    )
}

export default DefaultLayout
