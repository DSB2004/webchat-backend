import { hash, compare } from "bcrypt";

const SALT_ROUNDS = 12;

export const HashPassword = async (password: string): Promise<string> => {
  return await hash(password, SALT_ROUNDS);
};

export const ComparePassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  return await compare(password, hashedPassword);
};
