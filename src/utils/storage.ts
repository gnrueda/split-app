import { expensesManager } from "./expenses";
import type {
  Expense,
  StorageKey,
  StorageSchema,
  UserName,
} from "../types/domain";

const STORAGE_KEYS: StorageKey[] = ["users", "expenses"];

const memoryStorage: StorageSchema = {
  users: [],
  expenses: [],
};

function sanitizeUsers(users: unknown): UserName[] {
  if (!Array.isArray(users)) {
    return [];
  }

  return users
    .filter((user): user is string => typeof user === "string")
    .map((user) => user.trim())
    .filter((user) => user.length > 0);
}

function sanitizeExpenses(expenses: unknown): Expense[] {
  if (!Array.isArray(expenses)) {
    return [];
  }

  const isValidExpenseInput = (
    expense: unknown,
  ): expense is Record<string, unknown> => {
    if (!expense || typeof expense !== "object") {
      return false;
    }

    const candidate = expense as Record<string, unknown>;
    const payer = candidate["payer"];
    const desc = candidate["desc"];
    const amount = candidate["amount"];

    const hasValidPayer = typeof payer === "string" && payer.trim() !== "";
    const hasValidDesc = typeof desc === "string" && desc.trim() !== "";
    const hasValidAmount =
      typeof amount === "number" && Number.isFinite(amount);

    return hasValidPayer && hasValidDesc && hasValidAmount;
  };

  return expenses.filter(isValidExpenseInput).map((expense) => ({
    id:
      typeof expense.id === "string" && expense.id.length > 0
        ? expense.id
        : expensesManager.createExpenseId(),
    payer: String(expense.payer).trim(),
    amount: Number(expense.amount),
    desc: String(expense.desc).trim(),
    timestamp:
      typeof expense.timestamp === "string" && expense.timestamp.length > 0
        ? expense.timestamp
        : new Date(0).toISOString(),
  }));
}

function isLocalStorageAvailable(): boolean {
  try {
    const test = "__localStorage_test__";
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
}

export const storage = {
  save<K extends StorageKey>(
    key: K,
    data: StorageSchema[K],
    errorMessage: string,
  ): void {
    try {
      if (isLocalStorageAvailable()) {
        localStorage.setItem(key, JSON.stringify(data));
      } else {
        memoryStorage[key] = data;
        console.warn(
          "localStorage no está disponible. Usando almacenamiento en memoria.",
        );
      }
    } catch (error) {
      console.error(errorMessage, error);
      memoryStorage[key] = data;
    }
  },

  load<K extends StorageKey>(
    key: K,
    errorMessage: string,
    defaultValue: StorageSchema[K],
  ): StorageSchema[K] {
    try {
      if (isLocalStorageAvailable()) {
        const saved = localStorage.getItem(key);
        if (saved === null) {
          return defaultValue;
        }
        return JSON.parse(saved) as unknown as StorageSchema[K];
      }

      console.warn(
        "localStorage no está disponible. Usando almacenamiento en memoria.",
      );
      return memoryStorage[key] ?? defaultValue;
    } catch (error) {
      console.error(errorMessage, error);
      return memoryStorage[key] ?? defaultValue;
    }
  },

  saveUsers(users: UserName[]): void {
    this.save("users", users, "Error al guardar usuarios:");
  },

  loadUsers(): UserName[] {
    return sanitizeUsers(this.load("users", "Error al cargar usuarios:", []));
  },

  saveExpenses(expenses: Expense[]): void {
    this.save("expenses", expenses, "Error al guardar gastos:");
  },

  loadExpenses(): Expense[] {
    return sanitizeExpenses(
      this.load("expenses", "Error al cargar gastos:", []),
    );
  },

  clearAll(): void {
    STORAGE_KEYS.forEach((key) => {
      try {
        if (isLocalStorageAvailable()) {
          localStorage.removeItem(key);
        } else {
          memoryStorage[key] = [];
        }
      } catch (error) {
        console.error("Error al limpiar datos:", error);
        memoryStorage[key] = [];
      }
    });

    if (!isLocalStorageAvailable()) {
      console.warn(
        "localStorage no está disponible. Limpiando almacenamiento en memoria.",
      );
    }
  },
};
