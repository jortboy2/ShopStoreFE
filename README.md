# ShopSell Frontend

This is the frontend codebase for the ShopSell project, an e-commerce platform built with React and Vite.

## Features

- **Public Pages**:
  - Home
  - About
  - Contact
  - Product Listing
  - Product Details
  - Cart
  - Checkout
  - Orders
  - 404 Not Found

- **Admin Pages**:
  - Dashboard
  - Product Management
  - Category Management
  - User Management
  - Promocode Management
  - Order Management

- **Reusable Components**:
  - Layouts (Header, Footer, Admin Sidebar)
  - Authentication Modals (Login, Register)
  - Notifications (Snackbar)

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd FE
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and configure the environment variables:
   ```env
   VITE_API_URL=https://shopstorebe.onrender.com/api
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## Scripts

- `npm run dev`: Start the development server.
- `npm run build`: Build the project for production.
- `npm run preview`: Preview the production build.

## Tech Stack

- **Frontend**: React, React Router, Vite
- **Styling**: Tailwind CSS
- **State Management**: Context API
- **Notifications**: Notistack
- **Icons**: Font Awesome, React Icons

## Contributing

1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add your message"
   ```
4. Push to the branch:
   ```bash
   git push origin feature/your-feature-name
   ```
5. Open a pull request.

## License

This project is licensed under the MIT License.
