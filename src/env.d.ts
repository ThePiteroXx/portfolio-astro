/// <reference path="../.astro/types.d.ts" />

interface ImportMetaEnv {
  readonly EMAIL_SERVICE_ID: string;
  readonly EMAIL_TEMPLATE_ID: string;
  readonly EMAIL_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
