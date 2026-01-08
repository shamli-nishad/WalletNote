import './style.css';
import { Home } from './pages/Home';
import { Transactions } from './pages/Transactions';
import { Insights } from './pages/Insights';
import { Admin } from './pages/Admin';

const routes = {
    home: { title: 'WalletNote', component: Home, icon: '🏠' },
    transactions: { title: 'Transactions', component: Transactions, icon: '💸' },
    insights: { title: 'Insights', component: Insights, icon: '📊' },
    admin: { title: 'Admin', component: Admin, icon: '⚙️' }
};

let currentRoute = 'home';

function navigate(route) {
    if (!routes[route]) return;
    currentRoute = route;
    render();
}

function renderHeader() {
    const header = document.getElementById('header');
    header.innerHTML = `<h1>WalletNote</h1>`;
}

function renderContent() {
    const content = document.getElementById('content');
    content.innerHTML = '';
    // Remove existing FABs
    const existingFab = document.getElementById('fab-add');
    if (existingFab) existingFab.remove();

    const PageComponent = routes[currentRoute].component;
    content.appendChild(PageComponent({ navigate }));
}

function renderNavigation() {
    const nav = document.getElementById('navigation');
    nav.innerHTML = Object.entries(routes).map(([key, route]) => `
    <a href="#" class="nav-item ${currentRoute === key ? 'active' : ''}" data-route="${key}">
      <i>${route.icon}</i>
      <span>${key.charAt(0).toUpperCase() + key.slice(1)}</span>
    </a>
  `).join('');

    nav.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            navigate(e.currentTarget.dataset.route);
        });
    });
}

function render() {
    renderHeader();
    renderContent();
    renderNavigation();
}

// Initial render
window.addEventListener('DOMContentLoaded', render);

// Listen for data changes to re-render if needed
window.addEventListener('dataChanged', () => {
    // Only re-render if we are on a page that needs live updates
    // For simplicity, we re-render everything
    render();
});
