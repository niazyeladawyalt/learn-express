import { promises as fs } from 'fs';
import path from 'path';

export const deleteFile = async (relativePath: string) => {
  try {
    const absolutePath = path.join(__dirname, '..', '..', relativePath.replace(/^\//, ''));
    await fs.unlink(absolutePath);
  } catch (err) {
    console.error(`Failed to delete file: ${relativePath}`, err);
  }
};
