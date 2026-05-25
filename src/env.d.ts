declare namespace NodeJS {
  interface ProcessEnv {
    /** Preferred: API origin, e.g. https://pacific-luxe-direct.onrender.com (code appends /api). */
    NEXT_PUBLIC_API_BASE_URL?: string;
    /** Legacy: full base including /api */
    NEXT_PUBLIC_API_URL?: string;
    INTERNAL_API_URL?: string;
  }
}
