import { dataService } from '../services/dataService';

export function Home({ navigate }) {
  const summaries = dataService.getSummaries();
  const balance = summaries.allTime.income - summaries.allTime.expense;

  const container = document.createElement('div');
  container.className = 'animate-slide-up';

  const getBalanceColor = (income, expense) => {
    const bal = income - expense;
    if (bal > 0) return 'var(--success)';
    if (bal < 0) return 'var(--danger)';
    return 'var(--text-muted)';
  };

  const symbol = dataService.getCurrencySymbol();
  const currentCurrency = dataService.getCurrencyCode();
  const currencies = dataService.getAvailableCurrencies();

  const formatCurrency = (amount) => {
    return amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  container.innerHTML = `
    <div class="card" style="background: linear-gradient(135deg, var(--primary), var(--secondary)); border: none; text-align: center; padding: 2rem;">
      <p style="font-size: 0.875rem; opacity: 0.8; margin-bottom: 0.5rem;">Total Balance</p>
      <h2 style="font-size: 2.5rem; font-weight: 800; margin-bottom: 1rem;">${symbol}${formatCurrency(balance)}</h2>
      <div style="display: flex; justify-content: space-around; font-size: 0.875rem;">
        <div>
          <p style="opacity: 0.8;">Income</p>
          <p style="font-weight: 700;">${symbol}${formatCurrency(summaries.allTime.income)}</p>
        </div>
        <div>
          <p style="opacity: 0.8;">Expenses</p>
          <p style="font-weight: 700;">${symbol}${formatCurrency(summaries.allTime.expense)}</p>
        </div>
      </div>
    </div>

    <h3 style="margin: 1.5rem 0 1rem; font-size: 1.125rem;">Recent Summaries</h3>
    
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
      <div class="card">
        <p style="font-size: 0.75rem; color: var(--text-muted); margin-bottom: 0.5rem;">Daily</p>
        <div style="margin-bottom: 0.5rem;">
          <p style="font-weight: 700; color: var(--success); font-size: 0.875rem;">+${symbol}${formatCurrency(summaries.daily.income)}</p>
          <p style="font-weight: 700; color: var(--danger); font-size: 0.875rem;">-${symbol}${formatCurrency(summaries.daily.expense)}</p>
        </div>
        <div style="border-top: 1px solid var(--border); padding-top: 0.5rem;">
          <p style="font-size: 0.625rem; color: var(--text-muted); text-transform: uppercase;">Balance</p>
          <p style="font-weight: 700; color: ${getBalanceColor(summaries.daily.income, summaries.daily.expense)};">
            ${symbol}${formatCurrency(summaries.daily.income - summaries.daily.expense)}
          </p>
        </div>
      </div>

      <div class="card">
        <p style="font-size: 0.75rem; color: var(--text-muted); margin-bottom: 0.5rem;">Weekly</p>
        <div style="margin-bottom: 0.5rem;">
          <p style="font-weight: 700; color: var(--success); font-size: 0.875rem;">+${symbol}${formatCurrency(summaries.weekly.income)}</p>
          <p style="font-weight: 700; color: var(--danger); font-size: 0.875rem;">-${symbol}${formatCurrency(summaries.weekly.expense)}</p>
        </div>
        <div style="border-top: 1px solid var(--border); padding-top: 0.5rem;">
          <p style="font-size: 0.625rem; color: var(--text-muted); text-transform: uppercase;">Balance</p>
          <p style="font-weight: 700; color: ${getBalanceColor(summaries.weekly.income, summaries.weekly.expense)};">
            ${symbol}${formatCurrency(summaries.weekly.income - summaries.weekly.expense)}
          </p>
        </div>
      </div>

      <div class="card">
        <p style="font-size: 0.75rem; color: var(--text-muted); margin-bottom: 0.5rem;">Monthly</p>
        <div style="margin-bottom: 0.5rem;">
          <p style="font-weight: 700; color: var(--success); font-size: 0.875rem;">+${symbol}${formatCurrency(summaries.monthly.income)}</p>
          <p style="font-weight: 700; color: var(--danger); font-size: 0.875rem;">-${symbol}${formatCurrency(summaries.monthly.expense)}</p>
        </div>
        <div style="border-top: 1px solid var(--border); padding-top: 0.5rem;">
          <p style="font-size: 0.625rem; color: var(--text-muted); text-transform: uppercase;">Balance</p>
          <p style="font-weight: 700; color: ${getBalanceColor(summaries.monthly.income, summaries.monthly.expense)};">
            ${symbol}${formatCurrency(summaries.monthly.income - summaries.monthly.expense)}
          </p>
        </div>
      </div>

      <div class="card">
        <p style="font-size: 0.75rem; color: var(--text-muted); margin-bottom: 0.5rem;">Yearly</p>
        <div style="margin-bottom: 0.5rem;">
          <p style="font-weight: 700; color: var(--success); font-size: 0.875rem;">+${symbol}${formatCurrency(summaries.yearly.income)}</p>
          <p style="font-weight: 700; color: var(--danger); font-size: 0.875rem;">-${symbol}${formatCurrency(summaries.yearly.expense)}</p>
        </div>
        <div style="border-top: 1px solid var(--border); padding-top: 0.5rem;">
          <p style="font-size: 0.625rem; color: var(--text-muted); text-transform: uppercase;">Balance</p>
          <p style="font-weight: 700; color: ${getBalanceColor(summaries.yearly.income, summaries.yearly.expense)};">
            ${symbol}${formatCurrency(summaries.yearly.income - summaries.yearly.expense)}
          </p>
        </div>
      </div>
    </div>

    <div style="margin-top: 2rem;">
      <button class="btn btn-primary" id="add-transaction-btn">
        <i>➕</i> Add New Transaction
      </button>
    </div>
  `;

  container.querySelector('#add-transaction-btn').addEventListener('click', () => {
    navigate('transactions');
  });

  return container;
}
