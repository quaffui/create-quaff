export default async function getLatestDependencyVersion(packageName: string): Promise<string> {
  const response = await fetch(`https://registry.npmjs.org/${packageName}/latest`);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const packageData = await response.json();
  let { version } = packageData;

  if (!version || typeof version !== "string") {
    throw new Error(`could not find a valid version for dependency "${packageName}"`);
  }

  if (!version.startsWith("^")) {
    version = "^" + version;
  }

  return version;
}
