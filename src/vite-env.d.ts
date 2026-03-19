/// <reference types="vite/client" />

declare module "*.txt?raw" {
  const content: string;
  export default content;
}

interface ImportMetaEnv {
  readonly VITE_CONTACT_API_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
