const STORAGE_KEY = 'walletnote_data';

const CURRENCY_SYMBOLS = {
  'USD': '$',
  'EUR': '€',
  'GBP': '£',
  'INR': '₹',
  'JPY': '¥',
  'CNY': '¥'
};

const DEFAULT_CATEGORIES = [
  { id: 'cat_1', name: 'Food', type: 'expense', icon: '🍔' },
  { id: 'cat_2', name: 'Transport', type: 'expense', icon: '🚗' },
  { id: 'cat_3', name: 'Shopping', type: 'expense', icon: '🛍️' },
  { id: 'cat_4', name: 'Entertainment', type: 'expense', icon: '🎬' },
  { id: 'cat_5', name: 'Health', type: 'expense', icon: '💊' },
  { id: 'cat_6', name: 'Utilities', type: 'expense', icon: '💡' },
  { id: 'cat_7', name: 'Salary', type: 'income', icon: '💰' },
  { id: 'cat_8', name: 'Other', type: 'income', icon: '🎁' },
  { id: 'cat_9', name: 'Other', type: 'expense', icon: '📦' },
  { id: 'cat_10', name: 'Home', type: 'expense', icon: '🏠' },
  { id: 'cat_11', name: 'Childcare', type: 'expense', icon: '🧸' },
  { id: 'cat_12', name: 'Donations', type: 'expense', icon: '🤝' }
];

const INITIAL_DATA = {
  transactions: [],
  categories: DEFAULT_CATEGORIES,
  settings: {
    retentionDays: 0, // 0 means all-time
    currency: 'USD'
  }
};

class DataService {
  constructor() {
    this.data = this.loadData();
  }

  loadData() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return INITIAL_DATA;
    try {
      const parsed = JSON.parse(saved);
      // Ensure categories exist if they were added later
      if (!parsed.categories) {
        parsed.categories = DEFAULT_CATEGORIES;
      } else {
        // Merge missing default categories
        DEFAULT_CATEGORIES.forEach(defaultCat => {
          if (!parsed.categories.some(c => c.id === defaultCat.id)) {
            parsed.categories.push(defaultCat);
          }
        });
      }
      return parsed;
    } catch (e) {
      console.error('Failed to parse data', e);
      return INITIAL_DATA;
    }
  }

  saveData() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
    // Trigger a custom event for observers
    window.dispatchEvent(new CustomEvent('dataChanged'));
  }

  // Transaction CRUD
  getTransactions() {
    return this.data.transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
  }

  addTransaction(transaction) {
    const newTransaction = {
      id: 'tx_' + Date.now(),
      date: new Date().toISOString(),
      ...transaction,
      amount: parseFloat(transaction.amount)
    };
    this.data.transactions.push(newTransaction);
    this.applyRetentionPolicy();
    this.saveData();
    return newTransaction;
  }

  updateTransaction(id, updates) {
    const index = this.data.transactions.findIndex(t => t.id === id);
    if (index !== -1) {
      this.data.transactions[index] = { ...this.data.transactions[index], ...updates, amount: parseFloat(updates.amount) };
      this.saveData();
    }
  }

  deleteTransaction(id) {
    this.data.transactions = this.data.transactions.filter(t => t.id !== id);
    this.saveData();
  }

  // Category CRUD
  getCategories() {
    return this.data.categories;
  }

  addCategory(category) {
    const newCategory = {
      id: 'cat_' + Date.now(),
      ...category
    };
    this.data.categories.push(newCategory);
    this.saveData();
    return newCategory;
  }

  deleteCategory(id) {
    // Check if category is in use
    const inUse = this.data.transactions.some(t => t.categoryId === id);
    if (inUse) throw new Error('Category is in use and cannot be deleted.');

    this.data.categories = this.data.categories.filter(c => c.id !== id);
    this.saveData();
  }

  // Summaries
  getSummaries() {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();

    // Start of week (Monday)
    const day = now.getDay() || 7;
    const weekStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - day + 1).getTime();

    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
    const yearStart = new Date(now.getFullYear(), 0, 1).getTime();

    const totals = {
      daily: { income: 0, expense: 0 },
      weekly: { income: 0, expense: 0 },
      monthly: { income: 0, expense: 0 },
      yearly: { income: 0, expense: 0 },
      allTime: { income: 0, expense: 0 }
    };

    this.data.transactions.forEach(t => {
      // Parse YYYY-MM-DD as local date to avoid timezone offsets
      const [y, m, d] = t.date.split('-').map(Number);
      const tDate = new Date(y, m - 1, d).getTime();
      const amount = t.amount;
      const isIncome = t.type === 'income';

      if (isIncome) {
        totals.allTime.income += amount;
        if (tDate >= yearStart) totals.yearly.income += amount;
        if (tDate >= monthStart) totals.monthly.income += amount;
        if (tDate >= weekStart) totals.weekly.income += amount;
        if (tDate >= today) totals.daily.income += amount;
      } else {
        totals.allTime.expense += amount;
        if (tDate >= yearStart) totals.yearly.expense += amount;
        if (tDate >= monthStart) totals.monthly.expense += amount;
        if (tDate >= weekStart) totals.weekly.expense += amount;
        if (tDate >= today) totals.daily.expense += amount;
      }
    });

    return totals;
  }

  // Admin / Data Portability
  exportData() {
    const blob = new Blob([JSON.stringify(this.data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `walletnote_export_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  importData(jsonData) {
    try {
      const parsed = JSON.parse(jsonData);
      if (!parsed.transactions || !parsed.categories) throw new Error('Invalid data format');
      this.data = parsed;
      this.saveData();
      return true;
    } catch (e) {
      console.error('Import failed', e);
      return false;
    }
  }

  clearAllData() {
    this.data = INITIAL_DATA;
    this.saveData();
  }

  setRetentionPolicy(days) {
    this.data.settings.retentionDays = parseInt(days);
    this.applyRetentionPolicy();
    this.saveData();
  }

  applyRetentionPolicy() {
    const days = this.data.settings.retentionDays;
    if (days <= 0) return;

    const cutoff = Date.now() - (days * 24 * 60 * 60 * 1000);
    this.data.transactions = this.data.transactions.filter(t => new Date(t.date).getTime() > cutoff);
  }

  // Currency settings
  getCurrencySymbol() {
    return CURRENCY_SYMBOLS[this.data.settings.currency] || '$';
  }

  getCurrencyCode() {
    return this.data.settings.currency || 'USD';
  }

  getAvailableCurrencies() {
    return Object.keys(CURRENCY_SYMBOLS);
  }

  setCurrency(code) {
    this.data.settings.currency = code;
    this.saveData();
  }
}

export const dataService = new DataService();
