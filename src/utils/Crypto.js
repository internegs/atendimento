class Crypto {
    #cryptoKey = null

    constructor(cryptoKey) {
        this.#cryptoKey = cryptoKey
    }

    async decode(cypher) {
        const buffer = Uint8Array.from(atob(cypher), c => c.charCodeAt(0))
        const iv = buffer.slice(0, 12)
        const data = buffer.slice(12)

        const dataDecrypted = await window.crypto.subtle.decrypt(
            { name: 'AES-GCM', iv },
            this.#cryptoKey,
            data
        )

        return new TextDecoder().decode(dataDecrypted)
    }
}

export default Crypto
