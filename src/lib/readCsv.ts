import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';

export interface Row {
  [key: string]: string;
}

export async function readCsv(filename: string): Promise<Row[]> {
  const filePath = path.join(process.cwd(), 'data', filename);
  
  return new Promise((resolve, reject) => {
    const results: Row[] = [];

    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data: Row) => results.push(data))
      .on('end', () => resolve(results))
      .on('error', (error: Error) => reject(error));
  });
}
