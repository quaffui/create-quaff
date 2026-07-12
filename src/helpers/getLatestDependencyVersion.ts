import fetch from "./fetch.js";

type PackageData = {
  version: string;
};

export default async function getLatestDependencyVersion(packageName: string): Promise<string> {
  const response = await fetch(`https://registry.npmjs.org/${packageName}/latest`);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const { version } = (await response.json()) as PackageData;

  if (!version || typeof version !== "string") {
    throw new Error(`could not find a valid version for dependency "${packageName}"`);
  }

  return version;
}
