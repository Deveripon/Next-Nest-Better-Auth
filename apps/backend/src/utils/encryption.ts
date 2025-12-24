import * as crypto from 'crypto';
export class Encryption {
  private static readonly algorithm = 'aes-256-cbc';
  private static readonly secretKey = Buffer.from(
    process.env.ENCRYPTION_SECRET ||
      '923b4f9f9e043ce2e766c5792b01d57cadc6b4dfc0a461eca59c27e3ef7e8653',
    'hex',
  );

  // Encrypt Method
  static encrypt(text: string): string {
    if (!text) return text;
    console.log(`secret key `, this.secretKey);

    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(this.algorithm, this.secretKey, iv);
    const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
    return `${iv.toString('hex')}:${encrypted.toString('hex')}`;
  }

  // Decrypt Method
  static decrypt(encryptedText: string): string {
    if (!encryptedText) return encryptedText;

    try {
      const [ivHex, encryptedHex] = encryptedText.split(':');
      const iv = Buffer.from(ivHex, 'hex');
      const encrypted = Buffer.from(encryptedHex, 'hex');
      const decipher = crypto.createDecipheriv(
        this.algorithm,
        this.secretKey,
        iv,
      );
      const decrypted = Buffer.concat([
        decipher.update(encrypted),
        decipher.final(),
      ]);
      return decrypted.toString();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return encryptedText;
    }
  }
}

export const encrypt = (text: string) => Encryption.encrypt(text);
export const decrypt = (encryptedText: string) =>
  Encryption.decrypt(encryptedText);
