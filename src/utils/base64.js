export class base64 {
    static decode(data) {
        const bytes = Uint8Array.from(atob(data), c => c.charCodeAt(0))

        return new TextDecoder().decode(bytes)
    }

    static encode(data) {
        return btoa(data)
    }
}
