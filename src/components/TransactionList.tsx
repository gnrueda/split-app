import { CONFIG } from "../config";
import type { Transaction } from "../types/domain";

interface TransactionListProps {
  transaction: Transaction;
}

export function TransactionList({ transaction }: TransactionListProps) {
  return (
    <li className="debt-item">
      {transaction.from} le paga a {transaction.to}: $
      {transaction.amount.toFixed(CONFIG.PRECISION.ROUNDING_DECIMALS)}
    </li>
  );
}
