import fs from 'fs';
import path from 'path';

const createSwaggerSchema = (): object => {
  const directory: string = path.join(__dirname, '../schema');
  const readFile: string[] = fs.readdirSync(directory);

  const schema: any[] = readFile
    .filter((file) => path.extname(file) === '.json')
    .map((r: string) => {
      const replaceFile: string = r.replace('.json', '');
      const req: any = require(`./${replaceFile}`);
      return req;
    });

  return Object.assign({}, ...schema);
};

export default createSwaggerSchema;
