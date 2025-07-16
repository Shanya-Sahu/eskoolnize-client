import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_SERVER_API;

export default async function verifyToken(token: string): Promise<boolean> {
  if (!token) return false;

  try {
    await axios.get(
      `${process.env.NEXT_PUBLIC_SERVER_API}/api/v1/auth/verify`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return true;
  } catch {
    return false;
  }
}
