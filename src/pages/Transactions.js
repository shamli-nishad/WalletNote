import { dataService } from '../services/dataService';
import { openTransactionModal } from '../components/TransactionModal';

export function Transactions({ navigate }) {
  const transactions = () => dataService.getTransactions();
  const categories = dataService.getCategories();

  const container = document.createElement('div');
  container.className = 'animate-slide-up';

  const refreshList = (txs = null) => {
    container.querySelector('#tx-list').innerHTML = renderTransactionList(txs || transactions());
  };

  container.innerHTML = `
    <div style="display: flex; flex-direction: column; gap: 1rem; margin-bottom: 1.5rem;">
      <div style="display: flex; gap: 0.75rem; align-items: center;">
        <div style="position: relative; flex: 1;">
          <input type="text" id="tx-search" placeholder="Search..." style="padding-left: 2.5rem;">
          <i style="position: absolute; left: 1rem; top: 50%; transform: translateY(-50%); opacity: 0.5;">🔍</i>
        </div>
        <div style="display: flex; gap: 0.5rem;">
          <button class="btn btn-secondary" id="btn-add-expense" style="width: auto; padding: 0.75rem 1rem; font-size: 0.8125rem; white-space: nowrap; color: var(--danger); border-color: var(--danger);">
            <i>➖</i> Expense
          </button>
          <button class="btn btn-primary" id="btn-add-income" style="width: auto; padding: 0.75rem 1rem; font-size: 0.8125rem; white-space: nowrap; background: var(--success);">
            <i>➕</i> Income
          </button>
        </div>
      </div>
      
      <div style="display: flex; gap: 0.5rem; overflow-x: auto; padding-bottom: 0.5rem; scrollbar-width: none;">
        <button class="btn btn-secondary filter-btn active" data-type="all" style="width: auto; padding: 0.5rem 1.25rem; font-size: 0.875rem; border-radius: 20px;">All</button>
        <button class="btn btn-secondary filter-btn" data-type="expense" style="width: auto; padding: 0.5rem 1.25rem; font-size: 0.875rem; border-radius: 20px;">Expenses</button>
        <button class="btn btn-secondary filter-btn" data-type="income" style="width: auto; padding: 0.5rem 1.25rem; font-size: 0.875rem; border-radius: 20px;">Income</button>
      </div>
    </div>

    <div id="tx-list" class="card" style="padding: 0;">
      ${renderTransactionList(transactions())}
    </div>
  `;

  function renderTransactionList(txs) {
    if (txs.length === 0) {
      return `<div style="padding: 3rem; text-align: center; color: var(--text-muted);">No transactions found</div>`;
    }
    return txs.map(tx => {
      const category = categories.find(c => c.id === tx.categoryId) || { name: 'Uncategorized', icon: '❓' };
      return `
        <div class="transaction-item" data-id="${tx.id}">
          <div style="display: flex; align-items: center; gap: 1rem;">
            <div style="width: 40px; height: 40px; background: var(--background); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.25rem;">
              ${category.icon}
            </div>
            <div class="transaction-info">
              <span style="font-weight: 600;">${tx.description || category.name}</span>
              <span class="transaction-category">${category.name} • ${(() => {
          const [y, m, d] = tx.date.split('-').map(Number);
          return new Date(y, m - 1, d).toLocaleDateString();
        })()}</span>
            </div>
          </div>
          <div style="text-align: right;">
            <div class="transaction-amount ${tx.type === 'income' ? 'amount-income' : 'amount-expense'}">
              ${tx.type === 'income' ? '+' : '-'}${dataService.getCurrencySymbol()}${tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </div>
            <div style="margin-top: 0.25rem;">
              <button class="btn-edit" style="background:none; border:none; color:var(--primary); font-size:0.75rem; cursor:pointer;" data-id="${tx.id}">Edit</button>
              <span style="color:var(--border)">|</span>
              <button class="btn-delete" style="background:none; border:none; color:var(--danger); font-size:0.75rem; cursor:pointer;" data-id="${tx.id}">Delete</button>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  // Event Listeners
  container.querySelector('#btn-add-expense').addEventListener('click', () => {
    openTransactionModal(null, () => refreshList(), 'expense');
  });

  container.querySelector('#btn-add-income').addEventListener('click', () => {
    openTransactionModal(null, () => refreshList(), 'income');
  });

  container.addEventListener('click', (e) => {
    if (e.target.classList.contains('btn-edit')) {
      const id = e.target.dataset.id;
      openTransactionModal(id, () => refreshList());
    } else if (e.target.classList.contains('btn-delete')) {
      if (confirm('Are you sure you want to delete this transaction?')) {
        dataService.deleteTransaction(e.target.dataset.id);
        refreshList();
      }
    }
  });

  const searchInput = container.querySelector('#tx-search');
  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();
    const filtered = transactions().filter(t =>
      t.description?.toLowerCase().includes(query) ||
      categories.find(c => c.id === t.categoryId)?.name.toLowerCase().includes(query)
    );
    refreshList(filtered);
  });

  container.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      container.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const type = btn.dataset.type;
      const filtered = type === 'all'
        ? transactions()
        : transactions().filter(t => t.type === type);
      refreshList(filtered);
    });
  });

  return container;
}
