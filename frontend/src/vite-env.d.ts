interface ImportMetaEnv {
  readonly VITE_REACT_APP_REACT_BASE_URL: string;
  readonly VITE_REACT_APP_BASE_URL: string;
  readonly VITE_REACT_APP_CONTAINERIZED_REACT_BASE_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}