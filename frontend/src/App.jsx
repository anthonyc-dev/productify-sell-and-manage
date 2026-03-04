import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignOutButton,
} from "@clerk/clerk-react";
import Navbar from "./components/Navbar";
import { Navigate, Route, Routes } from "react-router";
import HomePage from "./pages/HomePage";
import ProductPage from "./pages/ProductPage";
import ProfilePage from "./pages/ProfilePage";
import CreatePage from "./pages/CreatePage";
import EditProductPage from "./pages/EditProductPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrdersPage from "./pages/OrdersPage";
import useAuthReq from "./hooks/useAuthReq";
import useUserSync from "./hooks/useUserSync";
import { CartProvider } from "./context/CartContext";

function App() {
  const { isClerkLoaded, isSignedIn } = useAuthReq();
  useUserSync();

  if (!isClerkLoaded) return null;

  return (
    <CartProvider>
      <div className="min-h-screen bg-base-100">
        <Navbar />
        <main className="max-w-5xl mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/product/:id" element={<ProductPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route
              path="/checkout"
              element={isSignedIn ? <CheckoutPage /> : <Navigate to={"/"} />}
            />
            <Route
              path="/orders"
              element={isSignedIn ? <OrdersPage /> : <Navigate to={"/"} />}
            />
            <Route
              path="/profile"
              element={isSignedIn ? <ProfilePage /> : <Navigate to={"/"} />}
            />
            <Route
              path="/create"
              element={isSignedIn ? <CreatePage /> : <Navigate to={"/"} />}
            />
            <Route
              path="/edit/:id"
              element={isSignedIn ? <EditProductPage /> : <Navigate to={"/"} />}
            />
          </Routes>
        </main>
      </div>
    </CartProvider>
  );
}

export default App;
