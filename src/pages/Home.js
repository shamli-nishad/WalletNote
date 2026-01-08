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

  const formatCurrency = (amount) => {
    return Math.abs(amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  container.innerHTML = `
    <!-- Compact Top Balance Card -->
    <div class="card" style="background: linear-gradient(135deg, var(--primary), var(--secondary)); border: none; text-align: center; padding: 1.25rem; border-radius: 20px;">
      <p style="font-size: 0.8125rem; opacity: 0.8; margin-bottom: 0.25rem;">Total Balance</p>
      <h2 style="font-size: 2rem; font-weight: 800; margin-bottom: 0.75rem;">${balance < 0 ? '-' : ''}${symbol}${formatCurrency(balance)}</h2>
      
      <div style="display: flex; justify-content: center; gap: 2rem; font-size: 0.75rem; border-top: 1px solid rgba(255,255,255,0.15); padding-top: 0.75rem;">
        <div style="display: flex; align-items: center; gap: 0.5rem;">
          <span style="opacity: 0.7;">Income:</span>
          <span style="font-weight: 700;">${symbol}${formatCurrency(summaries.allTime.income)}</span>
        </div>
        <div style="display: flex; align-items: center; gap: 0.5rem;">
          <span style="opacity: 0.7;">Exp:</span>
          <span style="font-weight: 700;">${symbol}${formatCurrency(summaries.allTime.expense)}</span>
        </div>
      </div>
    </div>
    
    <!-- Dense Summary Grid -->
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem;">
      ${['daily', 'weekly', 'monthly', 'yearly'].map(period => {
    const data = summaries[period];
    const net = data.income - data.expense;
    const color = getBalanceColor(data.income, data.expense);

    return `
          <div class="card" style="padding: 0.875rem; border-radius: 16px;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem;">
              <span style="font-size: 0.75rem; font-weight: 600; color: var(--text-muted); text-transform: capitalize;">${period}</span>
              <span style="font-size: 0.875rem; font-weight: 700; color: ${color};">${net < 0 ? '-' : ''}${symbol}${formatCurrency(net)}</span>
            </div>
            
            <div style="display: flex; gap: 0.5rem; font-size: 0.625rem; opacity: 0.8;">
              <span style="color: var(--success);">+${symbol}${formatCurrency(data.income)}</span>
              <span style="color: var(--danger);">-${symbol}${formatCurrency(data.expense)}</span>
            </div>
          </div>
        `;
  }).join('')}
    </div>

    <div style="margin-top: 1.25rem;">
      <button class="btn btn-primary" id="home-add-btn" style="padding: 0.875rem; font-size: 0.9375rem;">
        <i>➕</i> Add Transaction
      </button>
    </div>
  `;

  container.querySelector('#home-add-btn').addEventListener('click', () => {
    navigate('transactions');
  });

  return container;
}
