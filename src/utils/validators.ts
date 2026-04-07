import { CONFIG } from "../config";
import type { UserName } from "../types/domain";

interface ValidatedExpenseInput {
  payer: UserName;
  amount: number;
  desc: string;
}

export const validators = {
  userName(name: string, existingUsers: UserName[] = []): UserName {
    const normalizedName = name.toLowerCase().trim();

    if (normalizedName.length > CONFIG.VALIDATION.MAX_NAME_LENGTH) {
      throw new Error(
        `Por favor escribe un nombre válido (máximo ${CONFIG.VALIDATION.MAX_NAME_LENGTH} caracteres)`,
      );
    }

    if (existingUsers.includes(normalizedName)) {
      throw new Error("Esa persona ya existe");
    }

    return normalizedName;
  },

  expense(
    payer: string,
    amountInput: string | number,
    desc: string,
  ): ValidatedExpenseInput {
    const normalizedPayer = payer.trim();
    if (normalizedPayer.length === 0) {
      throw new Error("Por favor selecciona quién pagó");
    }

    const parsedAmount =
      typeof amountInput === "number" ? amountInput : Number(amountInput);
    if (
      !Number.isFinite(parsedAmount) ||
      parsedAmount < CONFIG.VALIDATION.MIN_AMOUNT ||
      parsedAmount > CONFIG.VALIDATION.MAX_AMOUNT
    ) {
      throw new Error(
        `Por favor ingresa un monto válido (mínimo $${CONFIG.VALIDATION.MIN_AMOUNT}, máximo $${CONFIG.VALIDATION.MAX_AMOUNT})`,
      );
    }

    const normalizedDesc = desc.trim();
    if (normalizedDesc.length === 0) {
      throw new Error("Por favor ingresa un concepto para el gasto");
    }

    return {
      payer: normalizedPayer,
      amount: parsedAmount,
      desc: normalizedDesc,
    };
  },
};
