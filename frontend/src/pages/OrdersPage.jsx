import { Link } from "react-router";
import {
  useMyOrders,
  useDeleteOrder,
  useClearOrders,
} from "../hooks/useOrders";
import LoadingSpinner from "../components/LoadingSpinner";
import {
  ArrowLeftIcon,
  PackageIcon,
  CalendarIcon,
  CheckCircleIcon,
  Trash2Icon,
} from "lucide-react";

function OrdersPage() {
  const { data: orders, isLoading, error } = useMyOrders();
  const deleteOrder = useDeleteOrder();
  const clearOrders = useClearOrders();

  if (isLoading) return <LoadingSpinner />;

  if (error) {
    return (
      <div role="alert" className="alert alert-error">
        <span>Failed to load orders. Please refresh.</span>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Link to="/" className="btn btn-ghost btn-sm gap-1">
          <ArrowLeftIcon className="size-4" /> Home
        </Link>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <PackageIcon className="size-6 text-primary" />
            My Orders
          </h1>
        </div>

        {orders && orders.length > 0 && (
          <button
            onClick={() => {
              if (
                confirm(
                  "Are you sure you want to delete ALL orders? This cannot be undone.",
                )
              ) {
                clearOrders.mutate();
              }
            }}
            className="btn btn-outline btn-error btn-sm gap-1"
            disabled={clearOrders.isPending}
          >
            <Trash2Icon className="size-4" />
            Clear All
          </button>
        )}
      </div>

      {!orders || orders.length === 0 ? (
        <div className="card bg-base-300">
          <div className="card-body items-center text-center py-16">
            <PackageIcon className="size-16 text-base-content/20" />
            <h2 className="card-title text-base-content/50">No orders yet</h2>
            <p className="text-base-content/40 text-sm">
              Your purchases will appear here.
            </p>
            <Link to="/" className="btn btn-primary btn-sm mt-2">
              Browse Products
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="card bg-base-300">
              <div className="card-body p-4">
                {/* Order Header */}
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5 indicator">
                      <div className="badge badge-primary gap-1">
                        <CheckCircleIcon className="size-3" />
                        {order.status}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-base-content/60">
                      <CalendarIcon className="size-3" />
                      {new Date(order.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className="font-bold text-primary text-lg">
                      ${parseFloat(order.totalAmount).toFixed(2)}
                    </p>
                    <button
                      onClick={() => {
                        if (
                          confirm("Are you sure you want to delete this order?")
                        ) {
                          deleteOrder.mutate(order.id);
                        }
                      }}
                      className="btn btn-ghost btn-xs text-error btn-square"
                      disabled={deleteOrder.isPending}
                      title="Delete Order"
                    >
                      <Trash2Icon className="size-4" />
                    </button>
                  </div>
                </div>

                <div className="divider my-1"></div>

                {/* Order Items */}
                <div className="space-y-2">
                  {order.items?.map((item) => (
                    <div key={item.id} className="flex items-center gap-3">
                      <div className="avatar">
                        <div className="w-10 h-10 rounded-lg">
                          <img
                            src={item.product?.imageUrl}
                            alt={item.product?.title}
                            className="object-cover"
                          />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <Link
                          to={`/product/${item.productId}`}
                          className="font-medium text-sm hover:text-primary truncate block"
                        >
                          {item.product?.title}
                        </Link>
                        <div className="text-xs text-base-content/50">
                          ${parseFloat(item.price).toFixed(2)} × {item.quantity}
                          {item.product?.user && (
                            <span> · Sold by {item.product.user.name}</span>
                          )}
                          {item.selectedColor && (
                            <div className="flex items-center gap-1 mt-0.5 px-1.5 py-0.5 rounded-full bg-base-100 border border-base-content/10 w-fit">
                              <div
                                className="w-2 h-2 rounded-full border border-base-content/20"
                                style={{
                                  backgroundColor:
                                    item.selectedColor.toLowerCase(),
                                }}
                              />
                              <span className="text-[10px] font-bold uppercase tracking-wider opacity-60">
                                {item.selectedColor}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      {/* <p className="font-semibold text-sm">
                        ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                      </p> */}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default OrdersPage;
