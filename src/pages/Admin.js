import { dataService } from '../services/dataService';

export function Admin() {
  const categories = dataService.getCategories();
  const settings = dataService.loadData().settings || { retentionDays: 0 };

  const container = document.createElement('div');
  container.className = 'animate-slide-up';

  container.innerHTML = `
    <h3 style="margin-bottom: 1rem;">Data Management</h3>
    <div class="card">
      <div style="display: flex; flex-direction: column; gap: 1rem;">
        <button class="btn btn-secondary" id="export-btn">
          <i>📤</i> Export Data (JSON)
        </button>
        <div style="position: relative;">
          <input type="file" id="import-input" accept=".json" style="display: none;">
          <button class="btn btn-secondary" id="import-btn">
            <i>📥</i> Import Data (JSON)
          </button>
        </div>
        <button class="btn btn-danger" id="clear-btn">
          <i>🗑️</i> Clear All Local Data
        </button>
      </div>
    </div>

    <h3 style="margin: 2rem 0 1rem;">Settings</h3>
    <div class="card">
      <div class="form-group" style="margin-bottom: 1.5rem;">
        <label>Primary Currency</label>
        <select id="currency-select">
          ${dataService.getAvailableCurrencies().map(c => `
            <option value="${c}" ${c === dataService.getCurrencyCode() ? 'selected' : ''}>${c}</option>
          `).join('')}
        </select>
        <p style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.5rem;">
          This will update the currency symbol globally across the app.
        </p>
      </div>

      <div class="form-group" style="margin-bottom: 0;">
        <label>Data Retention Policy</label>
        <select id="retention-select">
          <option value="0" ${settings.retentionDays === 0 ? 'selected' : ''}>Keep All-Time</option>
          <option value="30" ${settings.retentionDays === 30 ? 'selected' : ''}>Last 30 Days</option>
          <option value="90" ${settings.retentionDays === 90 ? 'selected' : ''}>Last 90 Days</option>
          <option value="365" ${settings.retentionDays === 365 ? 'selected' : ''}>Last Year</option>
        </select>
        <p style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.5rem;">
          Transactions older than the selected period will be automatically deleted.
        </p>
      </div>
    </div>

    <h3 style="margin: 2rem 0 1rem;">Categories Management</h3>
    
    <!-- In-page Category Form -->
    <div id="cat-form-container" style="display: none; margin-bottom: 1.5rem;">
      <div class="card" style="border: 2px solid var(--primary);">
        <h3 style="margin-bottom: 1.5rem;">Add Category</h3>
        <form id="cat-form">
          <div class="form-group">
            <label>Category Name</label>
            <input type="text" id="cat-name" required placeholder="e.g. Travel">
          </div>
          <div class="form-group">
            <label>Icon (Emoji)</label>
            <input type="text" id="cat-icon" required placeholder="✈️">
          </div>
          <div class="form-group">
            <label>Type</label>
            <select id="cat-type">
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </div>
          <div style="display: flex; gap: 1rem; margin-top: 1rem;">
            <button type="button" class="btn btn-secondary" id="cat-form-cancel">Cancel</button>
            <button type="submit" class="btn btn-primary">Save Category</button>
          </div>
        </form>
      </div>
    </div>

    <div class="card" style="padding: 0;">
      <div style="padding: 1rem; border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center;">
        <span style="font-weight: 600;">Manage Categories</span>
        <button class="btn btn-primary" id="add-cat-btn" style="width: auto; padding: 0.5rem 1rem; font-size: 0.875rem;">+ Add</button>
      </div>
      <div id="cat-list">
        ${categories.map(cat => `
          <div class="transaction-item" style="padding: 0.75rem 1rem;">
            <div style="display: flex; align-items: center; gap: 0.75rem;">
              <span>${cat.icon}</span>
              <span>${cat.name}</span>
              <span style="font-size: 0.625rem; background: var(--background); padding: 2px 6px; border-radius: 4px; color: var(--text-muted); text-transform: uppercase;">
                ${cat.type}
              </span>
            </div>
            <button class="btn-delete-cat" style="background:none; border:none; color:var(--danger); font-size:1.25rem; cursor:pointer;" data-id="${cat.id}">×</button>
          </div>
        `).join('')}
      </div>
    </div>
  `;

  // Event Listeners
  container.querySelector('#export-btn').addEventListener('click', () => {
    dataService.exportData();
  });

  const importInput = container.querySelector('#import-input');
  container.querySelector('#import-btn').addEventListener('click', () => {
    importInput.click();
  });

  importInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const success = dataService.importData(event.target.result);
      if (success) {
        alert('Data imported successfully!');
        window.location.reload();
      } else {
        alert('Failed to import data. Please check the file format.');
      }
    };
    reader.readAsText(file);
  });

  container.querySelector('#clear-btn').addEventListener('click', () => {
    if (confirm('Are you sure you want to clear ALL data? This action cannot be undone.')) {
      dataService.clearAllData();
      window.location.reload();
    }
  });

  container.querySelector('#retention-select').addEventListener('change', (e) => {
    dataService.setRetentionPolicy(e.target.value);
    alert('Retention policy updated.');
  });

  container.querySelector('#currency-select').addEventListener('change', (e) => {
    dataService.setCurrency(e.target.value);
    alert('Currency updated.');
  });

  // Category Event Listeners
  const catFormContainer = container.querySelector('#cat-form-container');
  const catForm = container.querySelector('#cat-form');

  container.querySelector('#add-cat-btn').addEventListener('click', () => {
    catForm.reset();
    catFormContainer.style.display = 'block';
    catFormContainer.scrollIntoView({ behavior: 'smooth' });
  });

  container.querySelector('#cat-form-cancel').addEventListener('click', () => {
    catFormContainer.style.display = 'none';
  });

  catForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const catData = {
      name: container.querySelector('#cat-name').value,
      icon: container.querySelector('#cat-icon').value,
      type: container.querySelector('#cat-type').value
    };
    dataService.addCategory(catData);
    catFormContainer.style.display = 'none';
  });

  container.addEventListener('click', (e) => {
    if (e.target.classList.contains('btn-delete-cat')) {
      try {
        if (confirm('Are you sure you want to delete this category?')) {
          dataService.deleteCategory(e.target.dataset.id);
        }
      } catch (err) {
        alert(err.message);
      }
    }
  });

  return container;
}
