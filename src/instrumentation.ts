export async function register() {
  if (process.env.HTTPS_PROXY) {
    const { ProxyAgent, setGlobalDispatcher } = await import("undici");
    setGlobalDispatcher(new ProxyAgent(process.env.HTTPS_PROXY));
  }
}

