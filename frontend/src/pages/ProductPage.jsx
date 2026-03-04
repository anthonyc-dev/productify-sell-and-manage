import {
  ArrowLeftIcon,
  EditIcon,
  Trash2Icon,
  CalendarIcon,
  UserIcon,
  ShoppingCartIcon,
  XIcon,
  PlusIcon,
  MinusIcon,
  PaletteIcon,
} from "lucide-react";
import LoadingSpinner from "../components/LoadingSpinner";
import CommentsSection from "../components/CommentsSection";
import { useAuth } from "@clerk/clerk-react";
import { useProduct, useDeleteProduct } from "../hooks/useProducts";
import { useParams, Link, useNavigate } from "react-router";
import { useCart } from "../context/CartContext";
import { useState } from "react";

function ProductPage() {
  const { id } = useParams();
  const { userId, isSignedIn } = useAuth();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [addedToCart, setAddedToCart] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);

  const { data: product, isLoading, error } = useProduct(id);
  const deleteProduct = useDeleteProduct();

  const handleDelete = () => {
    if (confirm("Delete this product permanently?")) {
      deleteProduct.mutate(id, { onSuccess: () => navigate("/") });
    }
  };

  const handleAddToCart = () => {
    if (!showModal) {
      const colors = product.colors
        ? product.colors.split(",").map((c) => c.trim())
        : [];
      setSelectedColor(colors.length > 0 ? colors[0] : "");
      setQuantity(1);
      setShowModal(true);
      return;
    }

    addItem(product, selectedColor || null, quantity);
    setAddedToCart(true);
    setShowModal(false);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  if (isLoading) return <LoadingSpinner />;

  if (error || !product) {
    return (
      <div className="card bg-base-300 max-w-md mx-auto">
        <div className="card-body items-center text-center">
          <h2 className="card-title text-error">Product not found</h2>
          <Link to="/" className="btn btn-primary btn-sm">
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  const isOwner = userId === product.userId;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Link to="/" className="btn btn-ghost btn-sm gap-1">
          <ArrowLeftIcon className="size-4" /> Back
        </Link>
        {isOwner && (
          <div className="flex gap-2">
            <Link
              to={`/edit/${product.id}`}
              className="btn btn-ghost btn-sm gap-1"
            >
              <EditIcon className="size-4" /> Edit
            </Link>
            <button
              onClick={handleDelete}
              className="btn btn-error btn-sm gap-1"
              disabled={deleteProduct.isPending}
            >
              {deleteProduct.isPending ? (
                <span className="loading loading-spinner loading-xs" />
              ) : (
                <Trash2Icon className="size-4" />
              )}
              Delete
            </button>
          </div>
        )}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Image */}
        <div className="card bg-base-300">
          <figure className="p-4">
            <img
              src={product.imageUrl}
              alt={product.title}
              className="rounded-xl w-full h-80 object-cover"
            />
          </figure>
        </div>

        <div className="card bg-base-300">
          <div className="card-body">
            <h1 className="card-title text-2xl">{product.title}</h1>

            {/* Price */}
            <p className="text-3xl font-bold text-primary mt-1">
              ${parseFloat(product.price).toFixed(2)}
            </p>

            <div className="flex flex-wrap gap-4 text-sm text-base-content/60 my-2">
              <div className="flex items-center gap-1">
                <CalendarIcon className="size-4" />
                {new Date(product.createdAt).toLocaleDateString()}
              </div>
              <div className="flex items-center gap-1">
                <UserIcon className="size-4" />
                {product.user?.name}
              </div>
              {isOwner && (
                <div
                  className={`flex items-center gap-1 font-semibold ${
                    product.inventory > 0 ? "text-success" : "text-error"
                  }`}
                >
                  {product.inventory > 0
                    ? `${product.inventory} in stock`
                    : "Out of stock"}
                </div>
              )}
            </div>

            <div className="divider my-2"></div>

            <p className="text-base-content/80 leading-relaxed">
              {product.description}
            </p>

            {/* Add to Cart Button - only for non-owners who are signed in */}
            {isSignedIn && !isOwner && (
              <>
                <div className="divider my-2"></div>
                <button
                  className={`btn w-full gap-2 ${
                    addedToCart ? "btn-success" : "btn-primary"
                  }`}
                  onClick={handleAddToCart}
                  disabled={product.inventory <= 0}
                >
                  <ShoppingCartIcon className="size-4" />
                  {product.inventory <= 0
                    ? "Out of Stock"
                    : addedToCart
                      ? "Added to Cart ✓"
                      : "Add to Cart"}
                </button>
              </>
            )}

            {product.user && (
              <>
                <div className="divider my-2"></div>
                <div className="flex items-center gap-3">
                  <div className="avatar">
                    <div className="w-12 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                      <img
                        src={product.user.imageUrl}
                        alt={product.user.name}
                      />
                    </div>
                  </div>
                  <div>
                    <p className="font-semibold">{product.user.name}</p>
                    <p className="text-xs text-base-content/50">Creator</p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Comments */}
      <div className="card bg-base-300">
        <div className="card-body">
          <CommentsSection
            productId={id}
            comments={product.comments}
            currentUserId={userId}
          />
        </div>
      </div>

      {/* SELECTION MODAL */}
      {showModal && (
        <div className="modal modal-open">
          <div className="modal-box bg-base-300">
            <button
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
              onClick={() => setShowModal(false)}
            >
              <XIcon className="size-4" />
            </button>
            <h3 className="font-bold text-lg mb-4">Add to Cart</h3>

            <div className="space-y-6">
              {/* Color Selection */}
              {product.colors && (
                <div>
                  <p className="text-sm font-semibold mb-3 flex items-center gap-2">
                    <PaletteIcon className="size-4 text-primary" />
                    Select Color:{" "}
                    <span className="text-primary">{selectedColor}</span>
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {product.colors
                      .split(",")
                      .map((c) => c.trim())
                      .map((color) => (
                        <button
                          key={color}
                          className={`group relative flex flex-col items-center gap-1 transition-all ${
                            selectedColor === color
                              ? "scale-110"
                              : "opacity-70 hover:opacity-100"
                          }`}
                          onClick={() => setSelectedColor(color)}
                        >
                          <div
                            className={`w-10 h-10 rounded-full border-2 transition-all shadow-sm ${
                              selectedColor === color
                                ? "border-primary ring-2 ring-primary/20"
                                : "border-base-content/10"
                            }`}
                            style={{ backgroundColor: color.toLowerCase() }}
                          />
                          <span className="text-[10px] font-medium uppercase tracking-wider">
                            {color}
                          </span>
                        </button>
                      ))}
                  </div>
                </div>
              )}

              {/* Quantity Selection */}
              <div className="bg-base-200 p-4 rounded-xl border border-base-300">
                <p className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <ShoppingCartIcon className="size-4 text-primary" />
                  Select Quantity
                </p>
                <div className="flex items-center justify-between">
                  <div className="join border border-base-300">
                    <button
                      className="btn btn-sm join-item bg-base-100 hover:bg-base-300"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    >
                      <MinusIcon className="size-4" />
                    </button>
                    <div className="btn btn-sm join-item no-animation bg-base-100 cursor-default min-w-12 font-mono text-lg">
                      {quantity}
                    </div>
                    <button
                      className="btn btn-sm join-item bg-base-100 hover:bg-base-300"
                      onClick={() =>
                        setQuantity(Math.min(product.inventory, quantity + 1))
                      }
                      disabled={quantity >= product.inventory}
                    >
                      <PlusIcon className="size-4" />
                    </button>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-base-content/50">
                      Available Stock
                    </p>
                    <p className="text-sm font-bold">
                      {product.inventory} units
                    </p>
                  </div>
                </div>
              </div>

              {/* Price Calculation (Optional but helpful) */}
              <div className="flex justify-between items-center pt-2">
                <span className="text-sm text-base-content/60">Subtotal</span>
                <span className="text-xl font-bold text-primary">
                  ${(parseFloat(product.price) * quantity).toFixed(2)}
                </span>
              </div>
            </div>

            <div className="modal-action mt-6">
              <button
                className="btn btn-primary w-full shadow-lg"
                onClick={handleAddToCart}
              >
                Add {quantity} to Cart
              </button>
            </div>
          </div>
          <div
            className="modal-backdrop"
            onClick={() => setShowModal(false)}
          ></div>
        </div>
      )}
    </div>
  );
}

export default ProductPage;
