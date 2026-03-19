/// <reference types="vite/client" />

declare module "*.txt?raw" {
  const content: string;
  export default content;
}

interface ImportMetaEnv {
  // add Vite env vars here
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
