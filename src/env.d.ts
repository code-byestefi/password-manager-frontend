interface ImportMetaEnv {
    readonly VITE_API_URL: string
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv
  }
  
  declare const __API_URL__: string