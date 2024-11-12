export const sleep = (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms))

export function convertToEmoji(countryCode: string) {
    const codePoints = countryCode
        .toUpperCase()
        .split('')
        .map(char => 127397 + char.charCodeAt(0))

    return String.fromCodePoint(...codePoints)
}

export function getAvatarURL(name: string) {
    let avatarURL = 'https://i.pravatar.cc/100?u='

    if (name && name.length) {
        avatarURL += name.replace(' ', '')
    } else {
        avatarURL += 'johndoe'
    }

    return avatarURL
}
