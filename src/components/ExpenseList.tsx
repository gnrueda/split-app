import dayjs from "dayjs";
import "dayjs/locale/es.js";
import relativeTime from "dayjs/plugin/relativeTime.js";
import { CONFIG } from "../config";
import type { Expense } from "../types/domain";

dayjs.locale("es");
dayjs.extend(relativeTime);

interface ExpenseListProps {
  expense: Expense;
}

export function ExpenseList({ expense }: ExpenseListProps) {
  const expenseDate = dayjs(expense.timestamp);
  const relativeTimeText = expenseDate.fromNow();
  const absoluteTime = expenseDate.format("DD/MM/YYYY HH:mm");
  const timestampText = ` - ${relativeTimeText} [${absoluteTime}]`;

  return (
    <li className="expense-item">
      <div className="expense-main">
        <span className="expense-desc">{expense.desc}</span>
        <span className="expense-payer">Pagó {expense.payer}</span>
      </div>
      <div className="expense-meta">
        <span className="expense-amount">
          ${expense.amount.toFixed(CONFIG.PRECISION.ROUNDING_DECIMALS)}
        </span>
        <span className="expense-time">{timestampText}</span>
      </div>
    </li>
  );
}
