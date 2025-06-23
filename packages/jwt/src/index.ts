import { SignJWT, jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export const CreateJWT = async ({
  payload,
  expireIn = "7d",
}: {
  payload: any;
  expireIn: string;
}): Promise<string> => {
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expireIn)
    .sign(secret);

  return token;
};

export const VerifyJWT = async <T = any>(token: string): Promise<T | null> => {
  try {
    const actualToken = token.split(" ")[1] || "";
    const { payload } = await jwtVerify<T>(actualToken, secret);
    return payload;
  } catch (e) {
    console.error("JWT verification failed:", e);
    return null;
  }
};
