import React from "react";
import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Shop from "./pages/Shop";
import About from "./pages/About";
import Contact from "./pages/Contact";

import Blog from "./pages/Blog";


// Dashboards & Profiles
import UserDashboard from "./pages/User/UserDashboard";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import AdminProfile from "./pages/Admin/AdminProfile";
import ManageProducts from "./pages/Admin/ManageProducts";
import UserProfile from "./pages/User/UserProfile";
import ForgotPassword from "./pages/ForgotPassword";
import DeliveryDashboard from "./pages/Delivery/DeliveryDashboard";

// User-specific pages
import UserProducts from "./pages/User/UserProducts";   // ✅ new page
import Cart from "./pages/User/Cart";                   // ✅ new page
import Wishlist from "./pages/User/Wishlist";           // ✅ new page
import Orders from "./pages/User/Orders";               // ✅ new page
import ProductDetail from "./pages/User/ProductDetail"; // ✅ detail page
import OrderTracking from "./pages/User/OrderTracking";
import AdminAnalytics from "./pages/Admin/AdminAnalytics";
import ManageDeliveryBoys from "./pages/Admin/ManageDeliveryBoys";

// ✅ Protected route wrapper
import ProtectedRoute from "./components/ProtectedRoute";
import AdminOrders from "./pages/Admin/AdminOrders";
import Seed from "./pages/Seed";
import Gift from "./pages/Gift";
import BlogAdmin from "./pages/Admin/BlogAdmin"
import PlantCareAdmin from "./pages/Admin/PlantCareAdmin"
import PlantCare from "./pages/PlantCare";

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/about" element={<About />} />
      <Route path="/shop" element={<Shop />} />
      <Route path="/contact" element={<Contact />} />
     <Route path="/seeds" element={<Seed/>}/>
      <Route path="/blog" element={<Blog />} />
 <Route path="/gifts" element={<Gift/>}/>
      <Route path="/care" element={<PlantCare/>} />

      {/* ✅ Product detail route (public) */}
      <Route path="/products/:id" element={<ProductDetail />} />

      {/* ✅ Protected Routes (User only) */}
      <Route
        path="/user-dashboard"
        element={
          <ProtectedRoute role="user">
            <UserDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/user/profile"
        element={
          <ProtectedRoute role="user">
            <UserProfile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/user/orders"
        element={
          <ProtectedRoute role="user">
            <Orders />
          </ProtectedRoute>
        }
      />
      <Route
        path="/user/products"
        element={
          <ProtectedRoute role="user">
            <UserProducts />
          </ProtectedRoute>
        }
      />
      <Route
        path="/user/cart"
        element={
          <ProtectedRoute role="user">
            <Cart />
          </ProtectedRoute>
        }
      />
      <Route
        path="/user/wishlist"
        element={
          <ProtectedRoute role="user">
            <Wishlist />
          </ProtectedRoute>
        }
      />

      <Route path="/orders/:id" element={<OrderTracking />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* ✅ Protected Routes (Admin only) */}
      <Route
        path="/admin-dashboard"
        element={
          <ProtectedRoute role="admin">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/profile"
        element={
          <ProtectedRoute role="admin">
            <AdminProfile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/products"
        element={
          <ProtectedRoute role="admin">
            <ManageProducts />
          </ProtectedRoute>
        }
      />
      <Route
      path="/admin/orders"
      element={
        <ProtectedRoute role="admin">
          <AdminOrders/>
        </ProtectedRoute>
      }
      />
      <Route 
      path="/admin/analytics" 
      element={<ProtectedRoute role="admin">
        <AdminAnalytics/>
      </ProtectedRoute>}/>

       <Route 
      path="/admin/delivery" 
      element={<ProtectedRoute role="admin">
        <ManageDeliveryBoys/>
      </ProtectedRoute>}/>
      <Route
  path="/delivery-dashboard"
  element={
    <ProtectedRoute role="delivery">
      <DeliveryDashboard />
    </ProtectedRoute>
  }
/>
<Route
path="/admin/blogs"
element={<ProtectedRoute role="admin">
  <BlogAdmin/>
</ProtectedRoute>}
/>
<Route
path="/admin/plant-care"
element={<ProtectedRoute role="admin">
  <PlantCareAdmin/>
</ProtectedRoute>}
/>
    </Routes>
   

  );
}

export default App;
