// Copyright (c) Scott Doxey. All Rights Reserved. Licensed under the MIT License. See LICENSE in the project root for license information.

// GitHub: https://github.com/neogeek/fetch

import { join } from 'path';

import { readFile, stat, mkdir, writeFile } from 'fs/promises';

import crypto from 'crypto';

import fetch from 'node-fetch';

const MILLISECONDS = 1000;

export const fileExistsWithExpiry = async (
  path: string,
  ttl: number = 1800
): Promise<boolean> => {
  try {
    const stats = await stat(path);

    return new Date(stats.mtime).getTime() + ttl * MILLISECONDS > Date.now();
  } catch {
    return false;
  }
};

export const fetchWithCache = async (
  url: string,
  cacheDir: string = 'cache/',
  ttl: number = 1800
): Promise<string> => {
  const hash = crypto.createHash('sha256').update(url).digest('hex');

  const filePath = join(cacheDir, hash);

  if (await fileExistsWithExpiry(filePath, ttl)) {
    return await readFile(filePath, 'utf8');
  }

  const response = await fetch(url);

  const data = await response.text();

  await mkdir(cacheDir, { recursive: true });

  await writeFile(filePath, data);

  return data;
};

export default fetchWithCache;
