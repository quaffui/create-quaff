const proxy = process.env.HTTPS_PROXY || process.env.HTTP_PROXY;
const hasProxy = !!proxy;
const isBun = !!process.versions.bun;
import { ProxyAgent, setGlobalDispatcher, fetch as fetchUndici } from "undici";

if (hasProxy && !isBun) {
  const proxyAgent = new ProxyAgent(proxy);
  setGlobalDispatcher(proxyAgent);
}

export default async function fetchWrapper(url: string) {
  if (!hasProxy) {
    return await fetch(url);
  }

  console.log(`Using detected proxy: ${proxy}`);

  // we need a workaround for bun: https://github.com/oven-sh/bun/issues/4474
  return await (isBun ? fetch(url, { proxy } as RequestInit) : fetchUndici(url));
}
