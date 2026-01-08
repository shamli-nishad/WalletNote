import { dataService } from '../services/dataService';

export function Insights() {
  const transactions = dataService.getTransactions();
  const categories = dataService.getCategories();

  // Calculate category-wise spending (expenses only)
  const categoryTotals = {};
  let totalExpense = 0;

  transactions.filter(t => t.type === 'expense').forEach(t => {
    categoryTotals[t.categoryId] = (categoryTotals[t.categoryId] || 0) + t.amount;
    totalExpense += t.amount;
  });

  const sortedCategories = Object.entries(categoryTotals)
    .map(([id, amount]) => ({
      ...categories.find(c => c.id === id) || { name: 'Unknown', icon: '❓' },
      amount
    }))
    .sort((a, b) => b.amount - a.amount);

  const container = document.createElement('div');
  container.className = 'animate-slide-up';

  container.innerHTML = `
    <h3 style="margin-bottom: 1rem;">Spending by Category</h3>
    ${sortedCategories.length === 0 ? `
      <div class="card" style="text-align: center; padding: 3rem; color: var(--text-muted);">
        No data available to show insights.
      </div>
    ` : `
      <div class="card" style="padding: 1.5rem;">
        ${sortedCategories.map(cat => {
    const percentage = totalExpense > 0 ? (cat.amount / totalExpense) * 100 : 0;
    return `
            <div style="margin-bottom: 1.5rem;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem; font-size: 0.875rem;">
                <span style="display: flex; align-items: center; gap: 0.5rem;">
                  <span>${cat.icon}</span>
                  <span style="font-weight: 600;">${cat.name}</span>
                </span>
                <span>${dataService.getCurrencySymbol()}${cat.amount.toLocaleString()} (${percentage.toFixed(1)}%)</span>
              </div>
              <div style="height: 8px; background: var(--background); border-radius: 4px; overflow: hidden;">
                <div style="height: 100%; width: ${percentage}%; background: var(--primary); border-radius: 4px;"></div>
              </div>
            </div>
          `;
  }).join('')}
      </div>
    `}

    <h3 style="margin: 2rem 0 1rem;">Trends</h3>
    <div class="card" style="padding: 1.5rem; text-align: center; color: var(--text-muted);">
      <p>More detailed trends and charts coming soon!</p>
    </div>
  `;

  return container;
}
