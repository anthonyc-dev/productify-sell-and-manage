import { Link } from "react-router";
import { useCart } from "../context/CartContext";
import {
  ArrowLeftIcon,
  ShoppingCartIcon,
  Trash2Icon,
  MinusIcon,
  PlusIcon,
  ShoppingBagIcon,
} from "lucide-react";

function CartPage() {
  const { cart, removeItem, updateQuantity, totalAmount } = useCart();

  if (cart.length === 0) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="card bg-base-300">
          <div className="card-body items-center text-center py-16">
            <ShoppingCartIcon className="size-16 text-base-content/20" />
            <h2 className="card-title text-base-content/50">
              Your cart is empty
            </h2>
            <p className="text-base-content/40 text-sm">
              Browse products and add some to your cart!
            </p>
            <Link to="/" className="btn btn-primary btn-sm mt-2">
              Browse Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Link to="/" className="btn btn-ghost btn-sm gap-1">
          <ArrowLeftIcon className="size-4" /> Continue Shopping
        </Link>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <ShoppingCartIcon className="size-6 text-primary" />
          Cart
        </h1>
      </div>

      {/* Cart Items */}
      <div className="space-y-3">
        {cart.map((item) => (
          <div
            key={`${item.productId}-${item.selectedColor}`}
            className="card bg-base-300"
          >
            <div className="card-body p-4">
              <div className="flex gap-4 items-center">
                {/* Image */}
                <div className="avatar">
                  <div className="w-20 h-20 rounded-xl">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="object-cover"
                    />
                  </div>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold truncate">{item.title}</h3>
                  <p className="text-xs text-base-content/50">
                    Sold by {item.sellerName}
                  </p>
                  <p className="text-primary font-bold mt-1">
                    ${parseFloat(item.price).toFixed(2)}
                  </p>
                  {item.selectedColor && (
                    <div className="flex items-center gap-1.5 mt-1 px-2 py-0.5 rounded-full bg-base-100 border border-base-content/10 w-fit">
                      <div
                        className="w-2.5 h-2.5 rounded-full border border-base-content/20"
                        style={{
                          backgroundColor: item.selectedColor.toLowerCase(),
                        }}
                      />
                      <span className="text-[10px] font-bold uppercase tracking-wider opacity-70">
                        {item.selectedColor}
                      </span>
                    </div>
                  )}
                  {/* <p className="text-xs text-warning mt-1">
                    {item.inventory} left in stock
                  </p> */}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    className="btn btn-ghost btn-xs btn-square"
                    onClick={() =>
                      updateQuantity(
                        item.productId,
                        item.selectedColor,
                        item.quantity - 1,
                      )
                    }
                    disabled={item.quantity <= 1}
                  >
                    <MinusIcon className="size-3" />
                  </button>
                  <span className="w-8 text-center font-mono font-bold">
                    {item.quantity}
                  </span>
                  <button
                    className="btn btn-ghost btn-xs btn-square"
                    onClick={() =>
                      updateQuantity(
                        item.productId,
                        item.selectedColor,
                        item.quantity + 1,
                      )
                    }
                    disabled={item.quantity >= item.inventory}
                  >
                    <PlusIcon className="size-3" />
                  </button>
                </div>

                {/* Subtotal */}
                <div className="text-right min-w-[80px]">
                  <p className="font-bold">
                    ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                  </p>
                </div>

                {/* Remove */}
                <button
                  className="btn btn-ghost btn-sm btn-square text-error"
                  onClick={() => removeItem(item.productId)}
                >
                  <Trash2Icon className="size-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="card bg-base-300">
        <div className="card-body">
          <div className="flex justify-between items-center text-lg font-bold">
            <span>Total</span>
            <span className="text-primary text-2xl">
              ${totalAmount.toFixed(2)}
            </span>
          </div>
          <div className="divider my-2"></div>
          <Link to="/checkout" className="btn btn-primary w-full gap-2">
            <ShoppingBagIcon className="size-4" />
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </div>
  );
}

export default CartPage;
