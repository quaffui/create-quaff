import { mkdir } from "fs/promises";

export default async function mkdirp(dirPath: string) {
  return await mkdir(dirPath, { recursive: true });
}
