import { Link } from "react-router";
import {
  SignInButton,
  SignUpButton,
  useAuth,
  useUser,
  useClerk,
} from "@clerk/clerk-react";
import { useMyOrders } from "../hooks/useOrders";
import {
  ShoppingBagIcon,
  ShoppingCartIcon,
  PackageIcon,
  ShoppingBasket,
  LogOutIcon,
  SettingsIcon,
} from "lucide-react";
import ThemeSelector from "./ThemeSelector";
import { useCart } from "../context/CartContext";

function Navbar() {
  const { isSignedIn } = useAuth();
  const cartContext = (() => {
    try {
      return useCart();
    } catch {
      return null;
    }
  })();
  const totalItems = cartContext?.totalItems || 0;
  const { data: orders } = useMyOrders({ enabled: isSignedIn });
  const orderCount = orders?.length || 0;

  const { user } = useUser();
  const { signOut, openUserProfile } = useClerk();

  const googleAccount = user?.externalAccounts.find(
    (acc) => acc.provider === "google",
  );
  const bestImageUrl = googleAccount?.imageUrl || user?.imageUrl;

  return (
    <div className="navbar bg-base-300">
      <div className="max-w-5xl mx-auto w-full px-4 flex justify-between items-center">
        {/* LOGO - LEFT SIDE */}
        <div className="flex-1">
          <Link to="/" className="btn btn-ghost gap-2">
            <ShoppingBagIcon className="size-5 text-primary" />
            <span className="text-lg font-bold font-mono uppercase tracking-wider">
              Productify
            </span>
          </Link>
        </div>

        <div className="flex gap-2 items-center">
          <ThemeSelector />
          {isSignedIn ? (
            <>
              {/* <Link to="/create" className="btn btn-primary btn-sm gap-1">
                <PlusIcon className="size-4" />
                <span className="hidden sm:inline">New Product</span>
              </Link> */}
              <Link to="/cart" className="btn btn-ghost btn-sm gap-1 indicator">
                <ShoppingCartIcon className="size-4" />
                {totalItems > 0 && (
                  <span className="indicator-item badge badge-secondary badge-xs">
                    {totalItems}
                  </span>
                )}
                <span className="hidden sm:inline">Cart</span>
              </Link>
              <Link
                to="/orders"
                className="btn btn-ghost btn-sm gap-1 indicator"
              >
                <ShoppingBasket className="size-4" />
                {orderCount > 0 && (
                  <span className="indicator-item badge badge-secondary badge-xs">
                    {orderCount}
                  </span>
                )}
                <span className="hidden sm:inline">Orders</span>
              </Link>
              <Link to="/profile" className="btn btn-ghost btn-sm gap-1">
                <PackageIcon className="size-4" />
                <span className="hidden sm:inline">Products</span>
              </Link>

              {/* Custom User Dropdown */}
              <div className="dropdown dropdown-end">
                <div
                  tabIndex={0}
                  role="button"
                  className="btn btn-ghost btn-circle avatar"
                >
                  <div className="w-8 h-8 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 overflow-hidden shadow-lg">
                    <img
                      src={bestImageUrl}
                      alt={user?.fullName || "User"}
                      className="object-cover w-full h-full"
                    />
                  </div>
                </div>
                <ul
                  tabIndex={0}
                  className="mt-3 z-1 p-2 shadow-xl menu menu-sm dropdown-content bg-base-300 rounded-box w-52 border border-base-content/10"
                >
                  <li className="menu-title px-4 py-2 opacity-50 text-[10px] uppercase font-bold tracking-widest">
                    Account
                  </li>
                  <li>
                    <button
                      onClick={() => openUserProfile()}
                      className="gap-3 py-3"
                    >
                      <SettingsIcon className="size-4" />
                      <span>Manage Profile</span>
                    </button>
                  </li>
                  <div className="divider my-0 opacity-10"></div>
                  <li>
                    <button
                      onClick={() => signOut()}
                      className="text-error gap-3 py-3 hover:bg-error/10"
                    >
                      <LogOutIcon className="size-4" />
                      <span>Sign Out</span>
                    </button>
                  </li>
                </ul>
              </div>
            </>
          ) : (
            <>
              <SignInButton mode="modal">
                <button className="btn btn-ghost btn-sm">Sign In</button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="btn btn-primary btn-sm">Get Started</button>
              </SignUpButton>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
export default Navbar;
