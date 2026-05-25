/** Matches backend AdminLoginResponse (camelCase JSON). */
export type AdminLoginResponse = {
  accessToken: string;
  tokenType: string;
  expiresInSeconds: number;
};
