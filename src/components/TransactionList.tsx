import { CONFIG } from "../config";
import type { Transaction } from "../types/domain";

interface TransactionListProps {
  transaction: Transaction;
}

export function TransactionList({ transaction }: TransactionListProps) {
  return (
    <li className="debt-item">
      <span className="debt-parties">
        <strong>{transaction.from}</strong> paga a{" "}
        <strong>{transaction.to}</strong>
      </span>
      <span className="debt-amount">
        ${transaction.amount.toFixed(CONFIG.PRECISION.ROUNDING_DECIMALS)}
      </span>
    </li>
  );
}
