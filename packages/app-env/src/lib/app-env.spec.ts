import { getCurrentVersion } from './app-env';
import * as fs from 'fs';
import * as path from 'path';

jest.mock('fs');
jest.mock('path');

describe('appEnv', () => {
  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
  });

  it('should return the current version of the package- mock example', () => {
    const version = '1.0.0';
    const packageJsonPath = 'package.json';
    const packageJsonContent = JSON.stringify({ version });
    const cwd = process.cwd();

    (fs.readFileSync as jest.Mock).mockReturnValue(packageJsonContent);
    (path.resolve as jest.Mock).mockReturnValue(packageJsonPath);

    const result = getCurrentVersion();
    expect(result).toEqual(version);
    expect(path.resolve).toHaveBeenCalledWith(cwd, 'package.json');
    expect(fs.readFileSync).toHaveBeenCalledWith(packageJsonPath, 'utf8');
  });

  it('should return the current version of the package- spy example', () => {
    const version = '1.0.0';
    const packageJsonPath = 'package.json';
    const packageJsonContent = JSON.stringify({ version });
    const cwd = process.cwd();

    const pathResolveSpy = jest
      .spyOn(path, 'resolve')
      .mockReturnValue(packageJsonPath);

    const fsReadFileSyncSpy = jest
      .spyOn(fs, 'readFileSync')
      .mockReturnValue(packageJsonContent);

    const result = getCurrentVersion();

    expect(result).toEqual(version);
    expect(pathResolveSpy).toHaveBeenCalledWith(cwd, 'package.json');
    expect(fsReadFileSyncSpy).toHaveBeenCalledWith(packageJsonPath, 'utf8');
  });

  it("should return an error if the package.json file doesn't exist", () => {
    const packageJsonPath = 'package.json';

    jest.spyOn(path, 'resolve').mockReturnValue(packageJsonPath);
    jest.spyOn(fs, 'readFileSync').mockImplementationOnce(() => {
      throw new Error('File not found');
    });

    expect(() => getCurrentVersion()).toThrow('File not found');
  });
});
