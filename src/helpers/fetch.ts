const proxy = process.env.HTTPS_PROXY || process.env.HTTP_PROXY;
const hasProxy = !!proxy;
const isBun = !!process.versions.bun;
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
let undici: typeof import("undici") | undefined = undefined;

if (hasProxy && !isBun) {
  // importing this regularly would cause errors on bun
  undici = await import("undici");
  const proxyAgent = new undici.ProxyAgent(proxy);
  undici.setGlobalDispatcher(proxyAgent);
}

export default async function fetchWrapper(url: string) {
  if (!hasProxy) {
    return await fetch(url);
  }

  console.log(`Using detected proxy: ${proxy}`);

  // we need a workaround for bun: https://github.com/oven-sh/bun/issues/4474
  return await (isBun ? fetch(url, { proxy } as RequestInit) : undici.fetch(url));
}
