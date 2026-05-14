const DEFAULT_SITE_URL = "https://agentmux.reviate0.com";

export const getInstallScriptUrl = () => {
  const origin = typeof window !== "undefined" ? window.location.origin : DEFAULT_SITE_URL;
  return `${origin}/install.sh`;
};

export const getInstallCommand = () => `curl -fsSL ${getInstallScriptUrl()} | bash`;
