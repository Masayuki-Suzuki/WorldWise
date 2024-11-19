import { createContext, useCallback, useContext, useEffect, useReducer } from 'react'
import { Nullable, OnlyChildren } from '../types/utilities'
import {
    AuthAction,
    AuthContext,
    AuthState,
    FirebaseAuthResponse,
    LoginUser,
    SignUpUser,
    TokenValidationResponse,
    User
} from '../types/auth'
import {
    createUserWithEmailAndPassword,
    sendEmailVerification,
    signInWithEmailAndPassword,
    updateProfile,
    UserCredential
} from 'firebase/auth'
import { auth } from '../libs/firebase'
import { getAvatarURL } from '../libs/utilities'
import apiLoginVerification from '../libs/apiLoginVerificator'

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

const firebaseSignUp = async ({ email, password, firstName, lastName }: SignUpUser): Promise<FirebaseAuthResponse> => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password)
        const { user } = userCredential

        if (user) {
            if (auth.currentUser) {
                await updateProfile(user, {
                    displayName: `${firstName} ${lastName}`
                })
                await sendEmailVerification(auth.currentUser)

                return await apiLoginVerification(user, false)
            } else {
                console.error(`Couldn't get firebase auth.`)
                return {
                    user: null,
                    error: `Couldn't get firebase auth. Please try again.`
                }
            }
        } else {
            console.error('Creating user failed')
            return {
                user: null,
                error: `Couldn't create user. Please try again or contact support.`
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
                error: 'An unknown error occurred while signing up. Please try again.'
            }
        }
    }
}

const firebaseLogin = async ({ email, password }: LoginUser): Promise<FirebaseAuthResponse> => {
    try {
        const userCredential: UserCredential = await signInWithEmailAndPassword(auth, email, password)
        const { user } = userCredential

        if (user) {
            const needEmailVerified = user.email !== 'test1@example.com'
            return await apiLoginVerification(user, needEmailVerified)
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

        case 'COMPLETED':
            return { ...state, isLoading: false }

        default:
            throw new Error('Unhandled action type')
    }
}

const FirebaseAuthProvider = ({ children }: OnlyChildren) => {
    const [{ user, isAuthenticated, authError, isLoading }, dispatch] = useReducer(authReducer, AuthInitialState)

    const signUpHandler = async ({ email, password, firstName, lastName }: SignUpUser) => {
        dispatch({ type: 'LOADING' })
        await firebaseSignUp({ email, password, firstName, lastName })
        dispatch({ type: 'COMPLETED' })
    }

    const loginHandler = async (email: string, password: string) => {
        dispatch({ type: 'LOADING' })
        const res = await firebaseLogin({ email, password })

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

    const logoutHandler = useCallback(() => {
        dispatch({ type: 'LOGOUT' })
        sessionStorage.removeItem('authenticated')
        sessionStorage.removeItem('token')
    }, [])

    const validateToken = async (token: string) => {
        if (token) {
            try {
                if (!process.env.ORIGIN_URL) {
                    throw new Error('Cannot find origin.')
                }

                const res = await fetch(`${process.env.API_URL}api/auth/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': process.env.ORIGIN_URL
                    },
                    body: JSON.stringify({ token })
                })

                const { user } = (await res.json()) as TokenValidationResponse

                if (res.ok && user) {
                    const avatar = getAvatarURL(user.displayName)
                    const validatedUser: User = {
                        id: user.uid,
                        name: user.displayName,
                        email: user.email,
                        avatar,
                        token
                    }
                    dispatch({ type: 'LOGIN', payload: validatedUser })
                } else {
                    dispatch({ type: 'LOGIN_ERROR', payload: 'Cannot find user.' })
                }
            } catch (error) {
                if (error instanceof Error) {
                    dispatch({ type: 'LOGIN_ERROR', payload: error.message })
                    //eslint-disable-next-line
                    // @ts-ignore
                } else if ('message' in error && typeof error.message === 'string') {
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
        signUpHandler,
        loginHandler,
        logoutHandler,
        isLoading,
        authError
    }

    useEffect(() => {
        //For refreshing the page and re-authenticating the user
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
