import { promises as fs } from 'fs';
import path from 'path';

const removeFolder = async (folderPath) => {
  try {
    await fs.rm(folderPath, { recursive: true, force: true });
    console.log(`Folder ${folderPath} removed successfully`);
  } catch (error) {
    console.error(`Error removing folder ${folderPath}:`, error);
  }
};

removeFolder('dist');
