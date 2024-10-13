import Button from './Button'
import { useNavigate } from 'react-router-dom'

const BackButton = () => {
    const navigate = useNavigate()
    return (
        <Button action={() => navigate(-1)} type="back">
            &larr; Back
        </Button>
    )
}

export default BackButton
