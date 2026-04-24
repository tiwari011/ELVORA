import { Routes, Route } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Home from "../pages/Home";
import Products from "../pages/Products";
import ProductDetail from "../pages/ProductDetail";
import CategoryProducts from "../pages/CategoryProducts";
import Login from "../pages/Login";
import Register from "../pages/Register";
import About from "../pages/About";
import Contact from "../pages/Contact";
import Cart from "../pages/Cart";
import Checkout from "../pages/Checkout";
import OrderSuccess from "../pages/OrderSuccess";
import MyOrders from "../pages/MyOrders";
import OrderDetails from "../pages/OrderDetails";
import Profile from "../pages/Profile";
import ProtectedRoute from "../components/ProtectedRoute";
import AdminProtectedRoute from "../components/AdminProtectedRoute";
import AdminLogin from "../pages/admin/AdminLogin";
import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminProducts from "../pages/admin/AdminProducts";
import AdminProductForm from "../pages/admin/AdminProductForm";
import AdminOrders from "../pages/admin/AdminOrders";
import AdminOrderDetails from "../pages/admin/AdminOrderDetails";
import AdminUsers from "../pages/admin/AdminUsers";
import AdminLayout from "../components/AdminLayout";
import AdminCategories from "../pages/admin/AdminCategories";
import FAQ from "../pages/FAQ";
import Shipping from "../pages/Shipping";
import Support from "../pages/Support";
import ServiceCenter from "../pages/ServiceCenter";
import Terms from "../pages/Terms";
import Privacy from "../pages/Privacy";
import Returns from "../pages/Returns";
import Cancellation from "../pages/Cancellation";

export default function App() {
  return (
    <Routes>
      {/* Admin routes */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route
        path="/admin"
        element={
          <AdminProtectedRoute>
            <AdminLayout />
          </AdminProtectedRoute>
        }
      >
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="products/add" element={<AdminProductForm />} />
        <Route path="products/edit/:id" element={<AdminProductForm />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="orders/:id" element={<AdminOrderDetails />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="categories" element={<AdminCategories />} />{" "}
      </Route>

      {/* Public routes */}
      <Route
        path="*"
        element={
          <>
            <Navbar />
            <main className="min-h-screen">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<Products />} />
                <Route path="/product/:slug" element={<ProductDetail />} />
                <Route path="/category/:slug" element={<CategoryProducts />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route
                  path="/cart"
                  element={
                    <ProtectedRoute>
                      <Cart />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/checkout"
                  element={
                    <ProtectedRoute>
                      <Checkout />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/order-success/:orderId"
                  element={
                    <ProtectedRoute>
                      <OrderSuccess />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/orders"
                  element={
                    <ProtectedRoute>
                      <MyOrders />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/orders/:orderId"
                  element={
                    <ProtectedRoute>
                      <OrderDetails />
                    </ProtectedRoute>
                  }
                />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/shipping" element={<Shipping />} />
                <Route path="/support" element={<Support />} />
                <Route path="/service-centers" element={<ServiceCenter />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/returns" element={<Returns />} />
                <Route path="/cancellation" element={<Cancellation />} />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </main>
            <Footer />
          </>
        }
      />
    </Routes>
  );
}
