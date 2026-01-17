import React from "react"
import { ThemeProvider } from "./components/theme-provider"
import { ModeToggle } from "./components/mode-toggle"
import { Routes, Route, useLocation, Navigate } from "react-router-dom"
import Navbar from "./components/Navbar"

/* USER SIDE PAGES */
import Home from "./pages/Home"
import Sales from "./pages/Sales"
import Customers from "./pages/Customers"

/* ADMIN LAYOUT */
import AdminLayout from "./layouts/AdminLayout"

/* ADMIN PAGES */
import Products from "./admin/pages/Products"
import Categories from "./admin/pages/Categories"
import Suppliers from "./admin/pages/Suppliers"
import Purchases from "./admin/pages/Purchases"
import PurchaseDetails from "./admin/pages/PurchaseDetails"
import Inventory from "./admin/pages/Inventory"
import StockLogs from "./admin/pages/StockLogs"
import Users from "./admin/pages/Users"
import Roles from "./admin/pages/Roles"
import Reports from "./admin/pages/Reports"
import Dashboard from "./admin/pages/Dashboard"

const App = () => {
  const isAdminRoute = useLocation().pathname.startsWith("/admin")

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      

      {/* USER NAVBAR ONLY */}
      {!isAdminRoute && <Navbar />}

      <Routes>
        {/* ================= USER SIDE (CASHIER) ================= */}
        <Route path="/" element={<Home />} />

        {/* POS Screen (sales + sale_items + payments + products) */}
        <Route path="/sales" element={<Sales />} />

        {/* Optional customer selection */}
        <Route path="/customers" element={<Customers />} />

        {/* ================= ADMIN SIDE ================= */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="products" element={<Products />} />
          <Route path="categories" element={<Categories />} />
          <Route path="suppliers" element={<Suppliers />} />
          <Route path="purchases" element={<Purchases />} />
          <Route path="purchases/:id" element={<PurchaseDetails />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="stock-logs" element={<StockLogs />} />
          <Route path="users" element={<Users />} />
          <Route path="roles" element={<Roles />} />
          <Route path="reports" element={<Reports />} />
        </Route>
      </Routes>
    </ThemeProvider>
  )
}

export default App
