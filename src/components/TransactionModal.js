import { dataService } from '../services/dataService';

export function openTransactionModal(txId = null, onSave = null, initialType = 'expense') {
  const categories = dataService.getCategories();
  const tx = txId ? dataService.getTransactions().find(t => t.id === txId) : null;
  const currentType = tx ? tx.type : initialType;

  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay animate-fade-in';

  const getCategoryOptions = (type) => {
    return categories
      .filter(c => c.type === type)
      .map(c => `<option value="${c.id}" ${tx?.categoryId === c.id ? 'selected' : ''}>${c.icon} ${c.name}</option>`)
      .join('');
  };

  overlay.innerHTML = `
    <div class="modal-content animate-slide-up">
      <div class="modal-header">
        <h3>${tx ? 'Edit Transaction' : (currentType === 'income' ? 'Add Income' : 'Add Expense')}</h3>
        <button class="modal-close">&times;</button>
      </div>
      <form id="modal-tx-form">
        <input type="hidden" id="modal-tx-id" value="${tx ? tx.id : ''}">
        <div class="form-group">
          <label>Amount</label>
          <input type="number" id="modal-tx-amount" step="0.01" required placeholder="0.00" value="${tx ? tx.amount : ''}">
        </div>
        <div class="form-group" style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
          <div>
            <label>Type</label>
            <select id="modal-tx-type">
              <option value="expense" ${currentType === 'expense' ? 'selected' : ''}>Expense</option>
              <option value="income" ${currentType === 'income' ? 'selected' : ''}>Income</option>
            </select>
          </div>
          <div>
            <label>Date</label>
            <input type="date" id="modal-tx-date" required value="${tx ? tx.date : new Date().toISOString().split('T')[0]}">
          </div>
        </div>
        <div class="form-group">
          <label>Category</label>
          <select id="modal-tx-category" required>
            ${getCategoryOptions(currentType)}
          </select>
        </div>
        <div class="form-group">
          <label>Description (Optional)</label>
          <textarea id="modal-tx-desc" rows="2">${tx?.description || ''}</textarea>
        </div>
        <div style="display: flex; gap: 1rem; margin-top: 1rem;">
          <button type="button" class="btn btn-secondary modal-cancel">Cancel</button>
          <button type="submit" class="btn btn-primary">Save Transaction</button>
        </div>
      </form>
    </div>
  `;

  document.body.appendChild(overlay);
  document.body.classList.add('modal-open');

  const typeSelect = overlay.querySelector('#modal-tx-type');
  const catSelect = overlay.querySelector('#modal-tx-category');
  const modalHeader = overlay.querySelector('.modal-header h3');

  typeSelect.addEventListener('change', (e) => {
    const newType = e.target.value;
    catSelect.innerHTML = getCategoryOptions(newType);
    if (!tx) {
      modalHeader.textContent = newType === 'income' ? 'Add Income' : 'Add Expense';
    }
  });

  const close = () => {
    overlay.remove();
    document.body.classList.remove('modal-open');
  };

  overlay.querySelector('.modal-close').addEventListener('click', close);
  overlay.querySelector('.modal-cancel').addEventListener('click', close);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) close();
  });

  const form = overlay.querySelector('#modal-tx-form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const id = overlay.querySelector('#modal-tx-id').value;
    const txData = {
      amount: parseFloat(overlay.querySelector('#modal-tx-amount').value),
      type: overlay.querySelector('#modal-tx-type').value,
      categoryId: overlay.querySelector('#modal-tx-category').value,
      date: overlay.querySelector('#modal-tx-date').value,
      description: overlay.querySelector('#modal-tx-desc').value
    };

    if (id) {
      dataService.updateTransaction(id, txData);
    } else {
      dataService.addTransaction(txData);
    }

    close();
    if (onSave) onSave();
  });
}
