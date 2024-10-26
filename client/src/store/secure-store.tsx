

export class SecureStorage {
    private encoder = new TextEncoder();
    private decoder = new TextDecoder();

    async generateKey(): Promise<CryptoKey> {
        return await window.crypto.subtle.generateKey(
            {
                name: 'AES-GCM',
                length: 256
            },
            true,
            ['encrypt', 'decrypt']
        );
    }

    private generateIV(): Uint8Array {
        return window.crypto.getRandomValues(new Uint8Array(12));
    }

    private async encrypt(data: any, key: CryptoKey): Promise<string> {
        const iv = this.generateIV();
        const encoded = this.encoder.encode(JSON.stringify(data));

        const encryptedData = await window.crypto.subtle.encrypt(
            {
                name: 'AES-GCM',
                iv: iv
            },
            key,
            encoded
        );

        const encryptedArray = new Uint8Array(iv.length + encryptedData.byteLength);
        encryptedArray.set(iv);
        encryptedArray.set(new Uint8Array(encryptedData), iv.length);

        return btoa(String.fromCharCode(...encryptedArray));
    }

    private async decrypt(encryptedData: string, key: CryptoKey): Promise<any> {
        const encryptedArray = new Uint8Array(
            atob(encryptedData).split('').map(char => char.charCodeAt(0))
        );

        const iv = encryptedArray.slice(0, 12);
        const data = encryptedArray.slice(12);

        const decryptedData = await window.crypto.subtle.decrypt(
            {
                name: 'AES-GCM',
                iv: iv
            },
            key,
            data
        );

        return JSON.parse(this.decoder.decode(decryptedData));
    }

    async setItem(key: string, value: any, encryptionKey: CryptoKey): Promise<void> {
        try {
            const encrypted = await this.encrypt(value, encryptionKey);
            localStorage.setItem(key, encrypted);
        } catch (error) {
            console.error('Error storing encrypted data:', error);
            throw error;
        }
    }

    async getItem(key: string, encryptionKey: CryptoKey): Promise<any> {
        try {
            const encrypted = localStorage.getItem(key);
            if (!encrypted) return null;
            return await this.decrypt(encrypted, encryptionKey);
        } catch (error) {
            console.error('Error retrieving encrypted data:', error);
            throw error;
        }
    }
}