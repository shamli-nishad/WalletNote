import { dataService } from '../services/dataService';

export function Transactions({ navigate }) {
  const transactions = dataService.getTransactions();
  const categories = dataService.getCategories();

  const container = document.createElement('div');
  container.className = 'animate-slide-up';

  container.innerHTML = `
    <div style="display: flex; flex-direction: column; gap: 1rem; margin-bottom: 1.5rem;">
      <div style="position: relative;">
        <input type="text" id="tx-search" placeholder="Search transactions..." style="padding-left: 2.5rem;">
        <i style="position: absolute; left: 1rem; top: 50%; transform: translateY(-50%); opacity: 0.5;">🔍</i>
      </div>
      
      <div style="display: flex; gap: 0.5rem; overflow-x: auto; padding-bottom: 0.5rem; scrollbar-width: none;">
        <button class="btn btn-secondary filter-btn active" data-type="all" style="width: auto; padding: 0.5rem 1rem; font-size: 0.875rem;">All</button>
        <button class="btn btn-secondary filter-btn" data-type="expense" style="width: auto; padding: 0.5rem 1rem; font-size: 0.875rem;">Expenses</button>
        <button class="btn btn-secondary filter-btn" data-type="income" style="width: auto; padding: 0.5rem 1rem; font-size: 0.875rem;">Income</button>
      </div>
    </div>

    <!-- In-page Transaction Form (Expandable) -->
    <div id="tx-form-container" style="display: none; margin-bottom: 1.5rem;">
      <div class="card" style="border: 2px solid var(--primary);">
        <h3 id="form-title" style="margin-bottom: 1.5rem;">Add Transaction</h3>
        <form id="tx-form">
          <input type="hidden" id="tx-id">
          <div class="form-group">
            <label>Amount</label>
            <input type="number" id="tx-amount" step="0.01" required placeholder="0.00">
          </div>
          <div class="form-group" style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
            <div>
              <label>Type</label>
              <select id="tx-type">
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </div>
            <div>
              <label>Date</label>
              <input type="date" id="tx-date" required>
            </div>
          </div>
          <div class="form-group">
            <label>Category</label>
            <div style="display: flex; gap: 0.5rem;">
              <select id="tx-category" required>
                ${categories.map(c => `<option value="${c.id}">${c.name}</option>`).join('')}
              </select>
              <button type="button" class="btn btn-secondary" id="btn-add-cat-page" style="width: auto; padding: 0 0.75rem;">+</button>
            </div>
          </div>
          <div class="form-group">
            <label>Description (Optional)</label>
            <textarea id="tx-desc" rows="2"></textarea>
          </div>
          <div style="display: flex; gap: 1rem; margin-top: 1rem;">
            <button type="button" class="btn btn-secondary" id="form-cancel">Cancel</button>
            <button type="submit" class="btn btn-primary">Save Transaction</button>
          </div>
        </form>
      </div>
    </div>

    <div id="tx-list" class="card" style="padding: 0;">
      ${renderTransactionList(transactions)}
    </div>
  `;

  // Append FAB to #app so it stays in place when #content scrolls
  const fabBtn = document.createElement('div');
  fabBtn.className = 'fab';
  fabBtn.id = 'fab-add';
  fabBtn.innerHTML = '<i>➕</i>';
  document.getElementById('app').appendChild(fabBtn);

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
  const formContainer = container.querySelector('#tx-form-container');
  const form = container.querySelector('#tx-form');

  fabBtn.addEventListener('click', () => {
    form.reset();
    container.querySelector('#tx-id').value = '';
    container.querySelector('#tx-date').value = new Date().toISOString().split('T')[0];
    container.querySelector('#form-title').textContent = 'Add Transaction';
    formContainer.style.display = 'block';
    formContainer.scrollIntoView({ behavior: 'smooth' });
  });

  container.querySelector('#btn-add-cat-page').addEventListener('click', () => {
    if (confirm('Manage categories in the Admin section?')) {
      navigate('admin');
    }
  });

  container.querySelector('#form-cancel').addEventListener('click', () => {
    formContainer.style.display = 'none';
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const id = container.querySelector('#tx-id').value;
    const txData = {
      amount: container.querySelector('#tx-amount').value,
      type: container.querySelector('#tx-type').value,
      categoryId: container.querySelector('#tx-category').value,
      date: container.querySelector('#tx-date').value,
      description: container.querySelector('#tx-desc').value
    };

    if (id) {
      dataService.updateTransaction(id, txData);
    } else {
      dataService.addTransaction(txData);
    }

    formContainer.style.display = 'none';
  });

  container.addEventListener('click', (e) => {
    if (e.target.classList.contains('btn-edit')) {
      const id = e.target.dataset.id;
      const tx = dataService.getTransactions().find(t => t.id === id);
      if (tx) {
        container.querySelector('#tx-id').value = tx.id;
        container.querySelector('#tx-amount').value = tx.amount;
        container.querySelector('#tx-type').value = tx.type;
        container.querySelector('#tx-category').value = tx.categoryId;
        container.querySelector('#tx-date').value = new Date(tx.date).toISOString().split('T')[0];
        container.querySelector('#tx-desc').value = tx.description || '';
        container.querySelector('#form-title').textContent = 'Edit Transaction';
        formContainer.style.display = 'block';
        formContainer.scrollIntoView({ behavior: 'smooth' });
      }
    } else if (e.target.classList.contains('btn-delete')) {
      if (confirm('Are you sure you want to delete this transaction?')) {
        dataService.deleteTransaction(e.target.dataset.id);
      }
    }
  });

  const searchInput = container.querySelector('#tx-search');
  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();
    const filtered = dataService.getTransactions().filter(t =>
      t.description?.toLowerCase().includes(query) ||
      categories.find(c => c.id === t.categoryId)?.name.toLowerCase().includes(query)
    );
    container.querySelector('#tx-list').innerHTML = renderTransactionList(filtered);
  });

  container.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      container.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const type = btn.dataset.type;
      const filtered = type === 'all'
        ? dataService.getTransactions()
        : dataService.getTransactions().filter(t => t.type === type);
      container.querySelector('#tx-list').innerHTML = renderTransactionList(filtered);
    });
  });

  return container;
}
