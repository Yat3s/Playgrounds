import * as crypto from 'crypto';
const ALGORITHM = 'aes-256-cbc';
const IV_LENGTH = 16; // For AES, this is always 16

export function encrypt(plaintext: string, key: string): string {
    // Generate a random initialization vector
    const iv = crypto.randomBytes(IV_LENGTH);

    const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(key, 'hex'), iv);
    let encrypted = cipher.update(plaintext, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    // The output is the IV followed by the encrypted message
    return iv.toString('hex') + encrypted;
}

export function decrypt(encryptedData: string, key: string): string {
    // Extract the IV from the beginning of the encrypted message
    const iv = Buffer.from(encryptedData.slice(0, IV_LENGTH * 2), 'hex');
    const encryptedText = encryptedData.slice(IV_LENGTH * 2);

    const decipher = crypto.createDecipheriv(ALGORITHM, Buffer.from(key, 'hex'), iv);
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
}

export function testEncrypt() {
    // Example usage:
    const key = crypto.randomBytes(32).toString('hex'); // AES-256 requires a 32-byte key
    console.log('Key:', key);
    const plaintext = "This is a secret message";

    console.time('encrypt');
    const encrypted = encrypt(plaintext, key);
    console.log('Encrypted:', encrypted);
    console.timeEnd('encrypt');
    console.time('decrypt');

    const decrypted = decrypt(encrypted, key);
    console.log('Decrypted:', decrypted);
    console.timeEnd('decrypt');
}
