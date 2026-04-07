import type {
  Expense,
  SplitResult,
  Transaction,
  UserName,
} from "../types/domain";

type BalanceMap = Record<UserName, number>;
type PartyBalance = { user: UserName; amount: number };

export const calculator = {
  toCents(amount: number): number {
    return Math.round(amount * 100);
  },

  toAmount(cents: number): number {
    return cents / 100;
  },

  calculateBalances(users: UserName[], expenses: Expense[]): BalanceMap {
    const balances: BalanceMap = {};
    const usersSet = new Set(users);

    users.forEach((user) => {
      balances[user] = 0;
    });

    expenses.forEach((expense) => {
      if (!usersSet.has(expense.payer)) {
        return;
      }
      balances[expense.payer] = (balances[expense.payer] ?? 0) + expense.amount;
    });

    return balances;
  },

  calculateSharesInCents(totalCents: number, users: UserName[]): BalanceMap {
    const userCount = users.length;
    const baseShare = Math.floor(totalCents / userCount);
    let remainder = totalCents % userCount;
    const shares: BalanceMap = {};

    users.forEach((user) => {
      const extraCent = remainder > 0 ? 1 : 0;
      shares[user] = baseShare + extraCent;
      if (remainder > 0) {
        remainder -= 1;
      }
    });

    return shares;
  },

  adjustBalances(balances: BalanceMap, sharesPerUser: BalanceMap): BalanceMap {
    const adjustedBalances: BalanceMap = {};

    Object.keys(balances).forEach((user) => {
      adjustedBalances[user] =
        (balances[user] ?? 0) - (sharesPerUser[user] ?? 0);
    });

    return adjustedBalances;
  },

  separateDebtorsAndCreditors(balances: BalanceMap): {
    debtors: PartyBalance[];
    creditors: PartyBalance[];
  } {
    const debtors: PartyBalance[] = [];
    const creditors: PartyBalance[] = [];

    for (const [user, amount] of Object.entries(balances)) {
      if (amount < 0) {
        debtors.push({ user, amount });
      }
      if (amount > 0) {
        creditors.push({ user, amount });
      }
    }

    return { debtors, creditors };
  },

  calculateTransactions(
    debtors: PartyBalance[],
    creditors: PartyBalance[],
  ): Transaction[] {
    const transactions: Transaction[] = [];
    let debtorIndex = 0;
    let creditorIndex = 0;

    while (debtorIndex < debtors.length && creditorIndex < creditors.length) {
      const debtor = debtors[debtorIndex];
      const creditor = creditors[creditorIndex];
      if (!debtor || !creditor) {
        break;
      }
      const amount = Math.min(Math.abs(debtor.amount), creditor.amount);

      transactions.push({
        from: debtor.user,
        to: creditor.user,
        amount: this.toAmount(amount),
      });

      debtor.amount += amount;
      creditor.amount -= amount;

      if (debtor.amount === 0) {
        debtorIndex += 1;
      }
      if (creditor.amount === 0) {
        creditorIndex += 1;
      }
    }

    return transactions;
  },

  calculateSplit(users: UserName[], expenses: Expense[]): SplitResult {
    if (users.length === 0) {
      return { transactions: [], totalExpenses: 0 };
    }

    const validExpenses = expenses.filter((expense) =>
      users.includes(expense.payer),
    );
    const totalExpenses = validExpenses.reduce(
      (sum, exp) => sum + exp.amount,
      0,
    );

    if (totalExpenses === 0) {
      return { transactions: [], totalExpenses: 0 };
    }

    const balances = this.calculateBalances(users, validExpenses);
    const balancesInCents: BalanceMap = {};
    Object.entries(balances).forEach(([user, amount]) => {
      balancesInCents[user] = this.toCents(amount);
    });

    const sharesInCents = this.calculateSharesInCents(
      this.toCents(totalExpenses),
      users,
    );
    const adjustedBalances = this.adjustBalances(
      balancesInCents,
      sharesInCents,
    );
    const { debtors, creditors } =
      this.separateDebtorsAndCreditors(adjustedBalances);

    return {
      transactions: this.calculateTransactions(debtors, creditors),
      totalExpenses,
    };
  },
};
