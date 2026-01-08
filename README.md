# WalletNote

WalletNote is a sleek, mobile-first, and offline-first personal finance tracker built with modern web technologies. It allows users to manage their daily, weekly, monthly, and yearly finances with ease, providing deep insights into spending habits while prioritizing data privacy through local storage.

## 🚀 Key Features

-   **Dashboard Overview**: Real-time balance, income, and expense tracking.
-   **Multi-Period Summaries**: Distinct views for Daily, Weekly, Monthly, and Yearly performance including period balances.
-   **Transaction Management**: Effortless entry of expenses and income with an in-page expandable form.
-   **Category Insights**: Visual breakdown of spending by category with percentage distribution.
-   **Global Currency Support**: Support for multiple currencies (USD, EUR, GBP, INR, JPY, CNY) with a global setting in the Admin panel.
-   **Data Portability**: Export and import your data as JSON for backups or migration.
-   **Privacy Focused**: All data is stored locally in the browser's `localStorage`.
-   **Retention Policy**: Configurable automatic data purging to keep your database lean.

## 🛠 Technical Details

-   **Frontend**: Vanilla JavaScript (ES Module based single-page application).
-   **Styling**: Modern CSS3 with a Glassmorphism aesthetic, tailored for mobile responsiveness.
-   **Build Tool**: [Vite](https://vitejs.dev/) (Configured for Node.js compatibility).
-   **Storage**: Browser `localStorage` API.
-   **Persistence**: Custom `DataService` layer for CRUD operations and summary calculations.
-   **Routing**: Client-side hash-based routing.

## 📦 Getting Started

### Prerequisites

-   [Node.js](https://nodejs.org/) (v20.15.0 or higher recommended)
-   npm (comes with Node.js)

### Installation

1.  Clone or download the project.
2.  Install dependencies:
    ```bash
    npm install
    ```

### Development

Run the development server:
```bash
npm run dev
```
The application will be available at `http://localhost:5175/` (or the port specified in your console).

### Building for Production

To create a production-ready bundle:
```bash
npm run build
```

The output will be in the `dist/` directory.

## 📁 Project Structure

-   `index.html`: Main entry point.
-   `src/main.js`: Application initialization and routing logic.
-   `src/style.css`: Global styles and design system.
-   `src/services/dataService.js`: Core business logic and data management.
-   `src/pages/`: UI components for different views (Home, Transactions, Insights, Admin).

## 📄 License

This project is open-source and available for personal use.
