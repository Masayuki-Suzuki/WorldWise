// Basic Types
export type Nullable<T> = T | null
export type NullableString = Nullable<string>
export type NullableNumber = Nullable<number>
export type VoidFunction = () => void
export type PromiseVoidFunction = () => Promise<void>

// React Element
export type ReactElement = JSX.Element | JSX.Element[]
export type ReactElementAllowString = ReactElement | string
export type NullableReactElement = Nullable<ReactElement>

// Props Types
export type OnlyChildren = { children: NullableReactElement }
export type OnlyChildrenAllowStrings = { children: ReactElementAllowString }
export type NullableOnlyChildren = Nullable<OnlyChildren>
export type NullableOnlyChildrenAllowStrings = Nullable<OnlyChildrenAllowStrings>
