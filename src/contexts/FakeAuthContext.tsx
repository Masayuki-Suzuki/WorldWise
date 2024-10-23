import { createContext, useContext, useEffect, useReducer } from 'react'
import { Nullable, OnlyChildren } from '../types/utilities'
import { AuthAction, AuthContext, AuthState, User } from '../types/auth'
import { sleep } from '../libs/utilities'

const FakeAuthContext = createContext<Nullable<AuthContext>>(null)

const FAKE_USERS: User = {
    name: 'John',
    email: 'john.doe@example.com',
    password: 'johndoe123',
    avatar: 'https://i.pravatar.cc/100?u=johndoe'
}

const AuthInitialState: AuthState = {
    user: null,
    isAuthenticated: false,
    authError: false,
    isLoading: false
}

function isUserType(value: unknown): asserts value is User {
    if (!value || typeof value !== 'object' || !('email' in value) || !('password' in value)) {
        throw new Error('Not User type')
    }
}

const checkAuthUser = ({ email, password }: { email: string; password: string }): boolean => {
    return email === FAKE_USERS.email && password === FAKE_USERS.password
}

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
    switch (action.type) {
        case 'LOGIN':
            isUserType(action.payload)
            if (checkAuthUser(action.payload)) {
                return { user: FAKE_USERS, isAuthenticated: true, authError: false, isLoading: false }
            }
            return {
                user: null,
                isAuthenticated: false,
                isLoading: false,
                authError: 'Email or password is incorrect. Please try again.'
            }
        case 'LOGOUT':
            return { user: null, isAuthenticated: false, authError: null, isLoading: false }

        case 'LOADING':
            return { ...state, isLoading: true }

        default:
            throw new Error('Unhandled action type')
    }
}

const FakeAuthProvider = ({ children }: OnlyChildren) => {
    const [{ user, isAuthenticated, authError, isLoading }, dispatch] = useReducer(authReducer, AuthInitialState)

    const loginHandler = async (email: string, password: string) => {
        dispatch({ type: 'LOADING' })
        await sleep(1000)
        dispatch({ type: 'LOGIN', payload: { email, password } })
        sessionStorage.setItem('authenticated', 'true')
        sessionStorage.setItem('user', JSON.stringify(FAKE_USERS))
    }

    const logoutHandler = () => {
        dispatch({ type: 'LOGOUT' })
        sessionStorage.removeItem('authenticated')
        sessionStorage.removeItem('user')
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

        if (prevAuth === 'true') {
            const prevUser = JSON.parse(sessionStorage.getItem('user')!)
            dispatch({ type: 'LOGIN', payload: prevUser })
        }
    }, [])

    return <FakeAuthContext.Provider value={value}>{children}</FakeAuthContext.Provider>
}

const useAuth = (): AuthContext => {
    const context = useContext(FakeAuthContext)
    if (!context || context === undefined) {
        throw new Error('useAuth must be used within a FakeAuthProvider')
    }
    return context
}

export { FakeAuthProvider, useAuth }
