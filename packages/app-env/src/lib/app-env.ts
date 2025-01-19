import * as fs from 'fs';
import * as path from 'path';

export const getCurrentVersion = (): string => {
  const packageJsonPath = path.resolve(process.cwd(), 'package.json');
  const packageJsonContent = fs.readFileSync(packageJsonPath, 'utf8');
  const packageJson = JSON.parse(packageJsonContent);
  return packageJson.version;
};
