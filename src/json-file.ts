import {readFile, writeFile} from 'fs/promises';

export const readJsonFile = async <T>(fileName: string): Promise<T> => {
  const data = await readFile(fileName, {encoding: 'utf8'});
  return JSON.parse(data) as T;
}

export const writeJsonFile = async <T>(fileName: string, data: T): Promise<void> => {
  await writeFile(
    fileName,
    JSON.stringify(data, null, 2),
  );
}
