import { Nullable } from './utilities'

export type User = {
    name: string
    email: string
    password: string
    avatar: string
}

export type AuthUser = {
    email: string
    password: string
}

export type AuthState = {
    user: Nullable<User>
    isAuthenticated: boolean
    authError: Nullable<string | boolean>
    isLoading: boolean
}

export type AuthAction = {
    type: string
    payload?: AuthUser | boolean
}

export type AuthContext = {
    user: Nullable<User>
    isAuthenticated: boolean
    isLoading: boolean
    authError: Nullable<string | boolean>
    loginHandler: (email: string, password: string) => void
    logoutHandler: () => void
}
