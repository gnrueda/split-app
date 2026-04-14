import { useEffect, useState } from "react";
import { calculator } from "../utils/calculator";
import { TransactionList } from "./TransactionList";
import type { Transaction, UserName, Expense } from "../types/domain";

interface BalanceSectionProps {
  users: UserName[];
  expenses: Expense[];
  onClearData: () => void;
}

export function BalanceSection({
  users,
  expenses,
  onClearData,
}: BalanceSectionProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [hasCalculated, setHasCalculated] = useState(false);
  const [showAccumulated, setShowAccumulated] = useState(false);

  const calculateSplit = () => {
    const result = calculator.calculateSplit(users, expenses);
    setTransactions(result.transactions);
    setHasCalculated(true);
  };

  const toggleAccumulated = () => {
    setShowAccumulated((prev) => !prev);
  };

  const getAccumulatedExpenses = () =>
    calculator.calculateBalances(users, expenses);

  const isCalculateDisabled = users.length === 0 || expenses.length === 0;

  useEffect(() => {
    setTransactions([]);
    setHasCalculated(false);
  }, [users, expenses]);

  return (
    <section className="section section-balance">
      <div className="section-head">
        <h2>3. Balance Final</h2>
        <p>Calcula transferencias mínimas para saldar cuentas.</p>
      </div>

      {users.length > 0 && expenses.length > 0 && (
        <div className="accumulated-section">
          <div className="accumulated-header">
            <h3>Acumulado por Participante</h3>
            <button
              type="button"
              onClick={toggleAccumulated}
              className="secondary-button"
              aria-expanded={showAccumulated}
              aria-controls="accumulated-list"
            >
              {showAccumulated ? "Ocultar" : "Mostrar"}
            </button>
          </div>

          {showAccumulated && (
            <div className="accumulated-list">
              {Object.entries(getAccumulatedExpenses())
                .sort(([, a], [, b]) => b - a)
                .map(([user, amount]) => (
                  <div key={user} className="accumulated-item">
                    <span className="user-name">{user}</span>
                    <span className="amount">${amount.toFixed(2)}</span>
                  </div>
                ))}
            </div>
          )}
        </div>
      )}

      <div className="action-buttons">
        <button
          type="button"
          onClick={calculateSplit}
          className="primary-button"
          disabled={isCalculateDisabled}
        >
          Calcular Deudas
        </button>
        <button type="button" onClick={onClearData} className="danger-button">
          Limpiar Datos
        </button>
      </div>
      <div className="results">
        {expenses.length === 0 ? (
          <p className="empty-copy">No hay gastos registrados.</p>
        ) : !hasCalculated ? (
          <p className="pending-copy">
            Hay cambios sin recalcular. Haz clic en "Calcular Deudas".
          </p>
        ) : transactions.length === 0 ? (
          <p className="success-copy">Las cuentas están saldadas.</p>
        ) : (
          <ul className="debt-list">
            {transactions.map((transaction, index) => (
              <TransactionList
                key={`${transaction.from}-${transaction.to}-${transaction.amount}-${index}`}
                transaction={transaction}
              />
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
