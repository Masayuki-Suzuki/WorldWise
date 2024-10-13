export const sleep = (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms))

export function convertToEmoji(countryCode: string) {
    const codePoints = countryCode
        .toUpperCase()
        .split('')
        .map(char => 127397 + char.charCodeAt(1))

    return String.fromCodePoint(...codePoints)
}
