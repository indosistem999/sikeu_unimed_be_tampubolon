import fs from 'fs';
import path from 'path';

const createSwaggerPath = (): object => {
  const directory: string = path.join(__dirname, '../path');
  const readFile: string[] = fs.readdirSync(directory, {
    encoding: null,
    recursive: true,
  });
  const paths: any[] = readFile
    .filter((file) => path.extname(file) === '.json')
    .map((r: string) => {
      const replaceFile: string = r.replace('.json', '');
      const req: any = require(`./${replaceFile}`);
      return req;
    });

  return Object.assign({}, ...paths);
};

export default createSwaggerPath;
