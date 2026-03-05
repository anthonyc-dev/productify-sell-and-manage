import { Link, useNavigate } from "react-router";
import { useMyProducts, useDeleteProduct } from "../hooks/useProducts";
import { useMyProductRatings } from "../hooks/useRatings";
import LoadingSpinner from "../components/LoadingSpinner";
import StarRating from "../components/StarRating";
import {
  PlusIcon,
  PackageIcon,
  EyeIcon,
  EditIcon,
  Trash2Icon,
  StarIcon,
  MessageSquareIcon,
} from "lucide-react";
import { useState } from "react";

const ProfilePage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("products");
  const { data: products, isLoading } = useMyProducts();
  const { data: ratings } = useMyProductRatings();
  const deleteProduct = useDeleteProduct();

  const handleDelete = (id) => {
    if (confirm("Delete this product?")) deleteProduct.mutate(id);
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">My Products</h1>
          <p className="text-base-content/60 text-sm">Manage your listings</p>
        </div>
        <Link to="/create" className="btn btn-primary btn-sm gap-1">
          <PlusIcon className="size-4" /> New Product
        </Link>
      </div>

      {/* Stats */}
      <div className="stats bg-base-300 w-full">
        <div className="stat">
          <div className="stat-title">Total Products</div>
          <div className="stat-value text-primary">{products?.length || 0}</div>
        </div>
        <div className="stat">
          <div className="stat-title">Total Reviews</div>
          <div className="stat-value text-secondary">{ratings?.length || 0}</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs tabs-boxed bg-base-300 w-fit">
        <button
          className={`tab ${activeTab === "products" ? "tab-active" : ""}`}
          onClick={() => setActiveTab("products")}
        >
          <PackageIcon className="size-4 mr-2" /> Products
        </button>
        <button
          className={`tab ${activeTab === "reviews" ? "tab-active" : ""}`}
          onClick={() => setActiveTab("reviews")}
        >
          <StarIcon className="size-4 mr-2" /> Reviews
        </button>
      </div>

      {/* Products Tab */}
      {activeTab === "products" && (
        <>
          {products?.length === 0 ? (
            <div className="card bg-base-300">
              <div className="card-body items-center text-center py-16">
                <PackageIcon className="size-16 text-base-content/20" />
                <h3 className="card-title text-base-content/50">No products yet</h3>
                <p className="text-base-content/40 text-sm">
                  Start by creating your first product
                </p>
                <Link to="/create" className="btn btn-primary btn-sm mt-4">
                  Create Product
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid gap-4">
              {products.map((product) => (
                <div key={product.id} className="card card-side bg-base-300">
                  <figure className="w-32 shrink-0">
                    <img
                      src={product.imageUrl}
                      alt={product.title}
                      className="h-full object-cover"
                    />
                  </figure>
                  <div className="card-body p-4">
                    <h2 className="card-title text-base">{product.title}</h2>
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-base-content/60">
                        {product.description}
                      </p>
                      <div className="badge badge-accent badge-sm whitespace-nowrap">
                        {product.inventory} in stock
                      </div>
                    </div>
                    {product.colors && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {product.colors.split(",").map((color, index) => (
                          <div
                            key={index}
                            className="w-3 h-3 rounded-full border border-base-content/20"
                            style={{ backgroundColor: color.trim().toLowerCase() }}
                            title={color.trim()}
                          />
                        ))}
                      </div>
                    )}
                    <div className="card-actions justify-end mt-2">
                      <button
                        onClick={() => navigate(`/product/${product.id}`)}
                        className="btn btn-ghost btn-xs gap-1"
                      >
                        <EyeIcon className="size-3" /> View
                      </button>
                      <button
                        onClick={() => navigate(`/edit/${product.id}`)}
                        className="btn btn-ghost btn-xs gap-1"
                      >
                        <EditIcon className="size-3" /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="btn btn-ghost btn-xs text-error gap-1"
                        disabled={deleteProduct.isPending}
                      >
                        <Trash2Icon className="size-3" /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Reviews Tab */}
      {activeTab === "reviews" && (
        <>
          {ratings && ratings.length > 0 ? (
            <div className="space-y-3">
              {ratings.map((rating) => (
                <div key={rating.id} className="card bg-base-300">
                  <div className="card-body p-4">
                    <div className="flex items-start gap-3">
                      <div className="avatar">
                        <div className="w-8 rounded-full">
                          <img src={rating.user?.imageUrl} alt={rating.user?.name} />
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-sm">{rating.user?.name || "Anonymous"}</span>
                          <StarRating rating={rating.rating} size="sm" />
                        </div>
                        <p className="text-xs text-base-content/50 mt-1">
                          on {rating.productTitle}
                        </p>
                        {rating.feedback && (
                          <p className="text-sm text-base-content/80 mt-2 bg-base-200 p-2 rounded">
                            "{rating.feedback}"
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="card bg-base-300">
              <div className="card-body items-center text-center py-16">
                <MessageSquareIcon className="size-16 text-base-content/20" />
                <h3 className="card-title text-base-content/50">No reviews yet</h3>
                <p className="text-base-content/40 text-sm">
                  Reviews from customers will appear here
                </p>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ProfilePage;
