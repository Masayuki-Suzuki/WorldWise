import { Link } from 'react-router-dom'
import { ReactElementAllowString } from '../types/utilities'

type CommonLinkProps = {
    to: string
    children: ReactElementAllowString
}

const CommonLink = ({ to, children }: CommonLinkProps) => (
    <Link className="cta" to={to}>
        {children}
    </Link>
)

export default CommonLink
