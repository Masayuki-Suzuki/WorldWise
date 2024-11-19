import { User as FirebaseUser } from '@firebase/auth'
import { getAvatarURL } from './utilities'
import { TokenValidationResponse, User } from '../types/auth'

const apiLoginVerification = async (user: FirebaseUser, needEmailVerified: boolean) => {
    if (needEmailVerified && !user.emailVerified) {
        return {
            user: null,
            error: 'Please verify your email before logging in.'
        }
    }

    const idToken = await user.getIdToken()

    try {
        const res = await fetch(`${process.env.API_URL}api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': 'http://localhost:3000'
            },
            body: JSON.stringify({ token: idToken })
        })

        const avatar = getAvatarURL(user.displayName || '')

        const loginUserData: User = {
            id: user.uid,
            name: user.displayName || '',
            email: user.email || '',
            token: idToken,
            avatar
        }

        const { message } = (await res.json()) as TokenValidationResponse

        if (res.ok) {
            return {
                user: loginUserData,
                error: null
            }
        } else {
            return {
                user: null,
                error: message
            }
        }
    } catch (error) {
        if (error instanceof Error) {
            return {
                user: null,
                error: error.message
            }
        } else {
            return {
                user: null,
                error: 'An unknown error occurred while logging in. Please try again.'
            }
        }
    }
}

export default apiLoginVerification