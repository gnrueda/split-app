import type { UserName } from "../types/domain";
import { validators } from "./validators";

export const usersManager = {
  addUser(users: UserName[], name: string): UserName[] {
    const validatedName = validators.userName(name, users);
    return [...users, validatedName];
  },
};
