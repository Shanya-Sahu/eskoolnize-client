export interface Auth {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    verified: boolean;
  };
  token: string | null;
}
