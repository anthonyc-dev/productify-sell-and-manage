import { Link, useNavigate } from "react-router";
import { useCart } from "../context/CartContext";
import { useCreateOrder } from "../hooks/useOrders";
import {
  ArrowLeftIcon,
  CheckCircleIcon,
  ShoppingBagIcon,
  PackageIcon,
} from "lucide-react";

function CheckoutPage() {
  const navigate = useNavigate();
  const { cart, totalAmount, clearCart } = useCart();
  const createOrder = useCreateOrder();

  if (cart.length === 0) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="card bg-base-300">
          <div className="card-body items-center text-center py-16">
            <PackageIcon className="size-16 text-base-content/20" />
            <h2 className="card-title text-base-content/50">
              Nothing to checkout
            </h2>
            <p className="text-base-content/40 text-sm">
              Add items to your cart first.
            </p>
            <Link to="/" className="btn btn-primary btn-sm mt-2">
              Browse Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handlePlaceOrder = () => {
    const items = cart.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
      price: item.price,
      selectedColor: item.selectedColor,
    }));

    createOrder.mutate(
      { items },
      {
        onSuccess: () => {
          clearCart();
          navigate("/orders");
        },
      },
    );
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Link to="/cart" className="btn btn-ghost btn-sm gap-1">
        <ArrowLeftIcon className="size-4" /> Back to Cart
      </Link>

      <div className="card bg-base-300">
        <div className="card-body">
          <h1 className="card-title text-2xl gap-2">
            <ShoppingBagIcon className="size-6 text-primary" />
            Checkout
          </h1>

          <div className="divider my-2"></div>

          {/* Order Summary */}
          <h2 className="font-semibold text-base-content/70 mb-2">
            Order Summary
          </h2>
          <div className="space-y-3">
            {cart.map((item) => (
              <div
                key={`${item.productId}-${item.selectedColor}`}
                className="flex items-center gap-3"
              >
                <div className="avatar">
                  <div className="w-12 h-12 rounded-lg">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="object-cover"
                    />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{item.title}</p>
                  <p className="text-xs text-base-content/50">
                    ${parseFloat(item.price).toFixed(2)} × {item.quantity}
                  </p>
                  {item.selectedColor && (
                    <div className="flex items-center gap-1 mt-0.5">
                      <div
                        className="w-2 h-2 rounded-full border border-base-content/20"
                        style={{
                          backgroundColor: item.selectedColor.toLowerCase(),
                        }}
                      />
                      <span className="text-[10px] uppercase font-bold opacity-60">
                        {item.selectedColor}
                      </span>
                    </div>
                  )}
                </div>
                <p className="font-bold text-sm">
                  ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                </p>
              </div>
            ))}
          </div>

          <div className="divider my-2"></div>

          {/* Total */}
          <div className="flex justify-between items-center text-lg font-bold">
            <span>Total</span>
            <span className="text-primary text-2xl">
              ${totalAmount.toFixed(2)}
            </span>
          </div>

          {createOrder.isError && (
            <div role="alert" className="alert alert-error alert-sm mt-2">
              <span>Failed to place order. Please try again.</span>
            </div>
          )}

          <button
            className="btn btn-primary w-full mt-4 gap-2"
            onClick={handlePlaceOrder}
            disabled={createOrder.isPending}
          >
            {createOrder.isPending ? (
              <span className="loading loading-spinner" />
            ) : (
              <>
                <CheckCircleIcon className="size-4" />
                Place Order
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CheckoutPage;
