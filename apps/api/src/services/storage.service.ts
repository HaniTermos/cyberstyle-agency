import fs from 'fs/promises';
import path from 'path';

export interface StorageProvider {
  uploadFile(fileBuffer: Buffer, fileName: string, mimeType: string): Promise<{ url: string; key: string }>;
  deleteFile(key: string): Promise<boolean>;
  getSignedDownloadUrl(key: string, expiresInSeconds?: number): Promise<string>;
}

export class LocalStorageProvider implements StorageProvider {
  private baseDir: string;
  private publicBaseUrl: string;

  constructor() {
    this.baseDir = path.resolve(process.cwd(), 'uploads');
    this.publicBaseUrl = process.env.API_URL || 'http://localhost:4000';
  }

  async uploadFile(fileBuffer: Buffer, fileName: string, _mimeType: string): Promise<{ url: string; key: string }> {
    await fs.mkdir(this.baseDir, { recursive: true });
    const key = `${Date.now()}-${fileName.replace(/\s+/g, '_')}`;
    const filePath = path.join(this.baseDir, key);
    await fs.writeFile(filePath, fileBuffer);

    return {
      key,
      url: `${this.publicBaseUrl}/uploads/${key}`,
    };
  }

  async deleteFile(key: string): Promise<boolean> {
    try {
      const filePath = path.join(this.baseDir, key);
      await fs.unlink(filePath);
      return true;
    } catch {
      return false;
    }
  }

  async getSignedDownloadUrl(key: string): Promise<string> {
    // In local dev, returns direct URL
    return `${this.publicBaseUrl}/uploads/${key}`;
  }
}

export const storageService = new LocalStorageProvider();
