import { useEffect, useState } from "react";
import { Header } from "./components/Header";
import { UsersSection } from "./components/UsersSection";
import { ExpenseSection } from "./components/ExpenseSection";
import { BalanceSection } from "./components/BalanceSection";
import { Footer } from "./components/Footer";
import { storage } from "./utils/storage";
import { notifications } from "./utils/notifications";
import { usersManager } from "./utils/users";
import { expensesManager } from "./utils/expenses";
import type { Expense, UserName } from "./types/domain";

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return "Ocurrió un error inesperado";
}

function App() {
  const [users, setUsers] = useState<UserName[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);

  useEffect(() => {
    const savedUsers = storage.loadUsers();
    const savedExpenses = storage.loadExpenses();
    setUsers(savedUsers);
    setExpenses(savedExpenses);
  }, []);

  const addUser = (name: string): boolean => {
    try {
      const newUser = usersManager.addUser(users, name);
      setUsers(newUser);
      storage.saveUsers(newUser);
      notifications.success(`"${name}" añadido correctamente`);
      return true;
    } catch (error: unknown) {
      notifications.error(getErrorMessage(error));
      return false;
    }
  };

  const addExpense = (payer: string, amount: string, desc: string): boolean => {
    try {
      const newExpense = expensesManager.addExpense(
        expenses,
        payer,
        amount,
        desc,
      );
      setExpenses(newExpense);
      storage.saveExpenses(newExpense);
      notifications.success("Gasto añadido correctamente");
      return true;
    } catch (error: unknown) {
      notifications.error(getErrorMessage(error));
      return false;
    }
  };

  const clearData = () => {
    if (
      window.confirm("¿Estás seguro de que quieres borrar todos los datos?")
    ) {
      setUsers([]);
      setExpenses([]);
      storage.clearAll();
      notifications.success("Todos los datos han sido borrados");
    }
  };

  return (
    <>
      <main className="app">
        <Header />

        <UsersSection users={users} onAddUser={addUser} />

        <ExpenseSection
          users={users}
          expenses={expenses}
          onAddExpense={addExpense}
        />

        <BalanceSection
          users={users}
          expenses={expenses}
          onClearData={clearData}
        />
      </main>
      <Footer />
    </>
  );
}

export default App;
