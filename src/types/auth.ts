import { Nullable, VoidPromise } from './utilities'

export type User = {
    id: string
    name: string
    email: string
    avatar: string
    token: string
}

export type LoginUser = {
    email: string
    password: string
}

export type SignUpUser = {
    email: string
    password: string
    firstName: string
    lastName: string
}

export type RespondedUser = {
    uid: string
    email: string
    displayName: string
}

export type AuthState = {
    user: Nullable<User>
    isAuthenticated: boolean
    authError: Nullable<string | boolean>
    isLoading: boolean
}

export type FirebaseAuthResponse = {
    user: Nullable<User>
    error: Nullable<string | Error>
}

export type AuthAction = {
    type: string
    payload?: User | boolean | string
}

export type AuthContext = {
    user: Nullable<User>
    isAuthenticated: boolean
    isLoading: boolean
    authError: Nullable<string | boolean>
    signUpHandler: (userData: SignUpUser) => VoidPromise
    loginHandler: (email: string, password: string) => VoidPromise
    logoutHandler: () => void
}

export type TokenValidationResponse = {
    message: string
    user: RespondedUser
}
