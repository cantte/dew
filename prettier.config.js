/** @type {import('prettier').Config & import('prettier-plugin-tailwindcss').PluginOptions} */
const config = {
  plugins: ["prettier-plugin-tailwindcss"],
  ignorePatterns: ["package.json", "pnpm-lock.yaml"],
};

export default config;
