// Basic Types
import { SyntheticEvent } from 'react'

export type Nullable<T> = T | null
export type NullableString = Nullable<string>
export type NullableNumber = Nullable<number>
export type VoidFunction = () => void
export type VoidPromise = Promise<void>
export type PromiseVoidFunction = () => VoidPromise
export type PromiseVoidFunctionHasOptions<T> = (options: T) => VoidPromise
export type DateString = string | Date | null | undefined

// React Element
export type ReactElement = JSX.Element | JSX.Element[]
export type ReactElementAllowString = ReactElement | string
export type NullableReactElement = Nullable<ReactElement>

// Props Types
export type OnlyChildren = { children: NullableReactElement }
export type OnlyChildrenAllowStrings = { children: ReactElementAllowString }
export type NullableOnlyChildren = Nullable<OnlyChildren>
export type NullableOnlyChildrenAllowStrings = Nullable<OnlyChildrenAllowStrings>

export type OnClickEventWithEvent<T, R = void> = (e: SyntheticEvent<T>) => R
