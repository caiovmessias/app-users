import * as fs from 'fs';
import { promisify } from 'util';

export const checkIfFileOrDirectoryExists = (path: string): boolean => {
  return fs.existsSync(path);
};

export const getFile = async (path: string): Promise<string | Buffer> => {
  const readFile = promisify(fs.readFile);

  const fileData = await readFile(path, {});

  const base64Data = fileData.toString('base64');

  return base64Data;
};

export const createFile = async (
  path: string,
  fileName: string,
  data: Buffer,
): Promise<void> => {
  if (!checkIfFileOrDirectoryExists(path)) {
    fs.mkdirSync(path);
  }

  const writeFile = promisify(fs.writeFile);

  return await writeFile(`${path}/${fileName}`, data);
};

export const deleteFile = async (path: string): Promise<void> => {
  const unlink = promisify(fs.unlink);

  return await unlink(path);
};
