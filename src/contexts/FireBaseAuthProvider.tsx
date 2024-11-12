import { createContext, useContext, useEffect, useReducer } from 'react'
import { Nullable, OnlyChildren } from '../types/utilities'
import { AuthAction, AuthContext, AuthState, FirebaseAuthResponse, RespondedUser, User } from '../types/auth'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../libs/firebase'
import { getAvatarURL } from '../libs/utilities'

type TokenValidationResponse = {
    message: string
    user: RespondedUser
}

const FirebaseAuthContext = createContext<Nullable<AuthContext>>(null)

const AuthInitialState: AuthState = {
    user: null,
    isAuthenticated: false,
    authError: false,
    isLoading: false
}

function isUserType(value: unknown): asserts value is User {
    if (!value || typeof value !== 'object' || !('email' in value) || !('name' in value) || !('id' in value)) {
        throw new Error('Not User type')
    }
}

const firebaseAuth = async ({
    email,
    password
}: {
    email: string
    password: string
}): Promise<FirebaseAuthResponse> => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password)
        const { user } = userCredential

        if (user) {
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
                        error: error
                    }
                } else {
                    return {
                        user: null,
                        error: 'An unknown error occurred while logging in. Please try again.'
                    }
                }
            }
        }
    } catch (error) {
        if (error instanceof Error) {
            return {
                user: null,
                error: error
            }
        } else {
            return {
                user: null,
                error: 'An unknown error occurred while logging in. Please try again.'
            }
        }
    }
    return {
        user: null,
        error: 'An unknown error occurred while logging in. Please try again.'
    }
}

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
    switch (action.type) {
        case 'LOGIN': {
            isUserType(action.payload)
            return { user: action.payload, isAuthenticated: true, authError: null, isLoading: false }
        }

        case 'LOGIN_ERROR':
            if (typeof action.payload === 'string') {
                return { user: null, isAuthenticated: false, authError: action.payload, isLoading: false }
            }
            return { user: null, isAuthenticated: false, authError: 'Unknown error occurred.', isLoading: false }

        case 'LOGOUT':
            return { user: null, isAuthenticated: false, authError: null, isLoading: false }

        case 'LOADING':
            return { ...state, isLoading: true }

        default:
            throw new Error('Unhandled action type')
    }
}

const FirebaseAuthProvider = ({ children }: OnlyChildren) => {
    const [{ user, isAuthenticated, authError, isLoading }, dispatch] = useReducer(authReducer, AuthInitialState)

    const loginHandler = async (email: string, password: string) => {
        dispatch({ type: 'LOADING' })
        const res = await firebaseAuth({ email, password })

        if (res.error) {
            let errorMsg = 'Unknown error occurred.'
            if (res.error instanceof Error) {
                errorMsg = res.error.message
            } else if (typeof res.error === 'string') {
                errorMsg = res.error
            }
            dispatch({ type: 'LOGIN_ERROR', payload: errorMsg })
        } else {
            if (res.user) {
                dispatch({ type: 'LOGIN', payload: res.user })
                sessionStorage.setItem('authenticated', 'true')
                sessionStorage.setItem('token', res.user.token)
            } else {
                dispatch({ type: 'LOGIN_ERROR', payload: 'Cannot find user.' })
            }
        }
    }

    const logoutHandler = () => {
        dispatch({ type: 'LOGOUT' })
        sessionStorage.removeItem('authenticated')
        sessionStorage.removeItem('token')
    }

    const validateToken = async (token: string) => {
        console.log('Validating token...')
        if (token) {
            try {
                const res = await fetch(`${process.env.API_URL}api/auth/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': 'http://localhost:3000'
                    },
                    body: JSON.stringify({ token })
                })

                const { user } = (await res.json()) as TokenValidationResponse
                const avatar = getAvatarURL(user.displayName)
                const validatedUser: User = {
                    id: user.uid,
                    name: user.displayName,
                    email: user.email,
                    avatar,
                    token
                }

                if (res.ok && user) {
                    dispatch({ type: 'LOGIN', payload: validatedUser })
                } else {
                    dispatch({ type: 'LOGIN_ERROR', payload: 'Cannot find user.' })
                }
            } catch (error) {
                if (error instanceof Error) {
                    dispatch({ type: 'LOGIN_ERROR', payload: error.message })
                } else {
                    dispatch({ type: 'LOGIN_ERROR', payload: 'Cannot find user.' })
                }
            }
        } else {
            dispatch({ type: 'LOGIN_ERROR', payload: 'Cannot find token.' })
        }
    }

    const value = {
        user,
        isAuthenticated,
        loginHandler,
        logoutHandler,
        isLoading,
        authError
    }

    useEffect(() => {
        const prevAuth = sessionStorage.getItem('authenticated')
        const prevToken = sessionStorage.getItem('token')

        if (prevAuth === 'true' && prevToken) {
            void validateToken(prevToken)
        }
    }, [])

    return <FirebaseAuthContext.Provider value={value}>{children}</FirebaseAuthContext.Provider>
}

const useAuth = (): AuthContext => {
    const context = useContext(FirebaseAuthContext)
    if (!context || context === undefined) {
        throw new Error('useAuth must be used within a FirebaseAuthProvider')
    }
    return context
}

export { FirebaseAuthProvider, useAuth }
