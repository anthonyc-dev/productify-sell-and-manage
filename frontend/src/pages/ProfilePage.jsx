import { Link, useNavigate } from "react-router";
import { useMyProducts, useDeleteProduct } from "../hooks/useProducts";
import { useMyProductRatings } from "../hooks/useRatings";
import LoadingSpinner from "../components/LoadingSpinner";
import StarRating from "../components/StarRating";
import {
  MoreVertical,
  PackageIcon,
  StarIcon,
  MessageSquareIcon,
  PlusIcon,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";

const ActionMenu = ({ product }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const deleteProduct = useDeleteProduct();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDelete = () => {
    if (confirm("Delete this product?")) deleteProduct.mutate(product.id);
    setIsOpen(false);
  };

  return (
    <div className="dropdown dropdown-end" ref={dropdownRef}>
      <button
        tabIndex={0}
        role="button"
        className="btn btn-ghost btn-xs btn-square"
        onClick={() => setIsOpen(!isOpen)}
      >
        <MoreVertical className="size-4" />
      </button>
      <ul
        tabIndex={0}
        className="dropdown-content z-10 menu p-2 shadow bg-base-300 rounded-box w-32"
      >
        <li>
          <button
            onClick={() => {
              navigate(`/product/${product.id}`);
              setIsOpen(false);
            }}
          >
            View
          </button>
        </li>
        <li>
          <button
            onClick={() => {
              navigate(`/edit/${product.id}`);
              setIsOpen(false);
            }}
          >
            Edit
          </button>
        </li>
        <li>
          <button onClick={handleDelete} className="text-error">
            Delete
          </button>
        </li>
      </ul>
    </div>
  );
};

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState("products");
  const { data: products, isLoading } = useMyProducts();
  const { data: ratings } = useMyProductRatings();

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
          <div className="stat-value text-secondary">
            {ratings?.length || 0}
          </div>
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
                <h3 className="card-title text-base-content/50">
                  No products yet
                </h3>
                <p className="text-base-content/40 text-sm">
                  Start by creating your first product
                </p>
                <Link to="/create" className="btn btn-primary btn-sm mt-4">
                  Create Product
                </Link>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table bg-base-300">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Description</th>
                    <th>Stock</th>
                    <th>Colors</th>
                    <th className="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id} className="hover">
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="avatar">
                            <div className="w-12 h-12 rounded">
                              <img src={product.imageUrl} alt={product.title} />
                            </div>
                          </div>
                          <span className="font-medium">{product.title}</span>
                        </div>
                      </td>
                      <td className="max-w-xs truncate">
                        {product.description}
                      </td>
                      <td>
                        <span className="badge badge-accent">
                          {product.inventory}
                        </span>
                      </td>
                      <td>
                        {product.colors && (
                          <div className="flex gap-1">
                            {product.colors.split(",").map((color, index) => (
                              <div
                                key={index}
                                className="w-4 h-4 rounded-full border border-base-content/20"
                                style={{
                                  backgroundColor: color.trim().toLowerCase(),
                                }}
                                title={color.trim()}
                              />
                            ))}
                          </div>
                        )}
                      </td>
                      <td className="text-right">
                        <ActionMenu product={product} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {/* Reviews Tab */}
      {activeTab === "reviews" && (
        <>
          {ratings && ratings.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="table bg-base-300">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Product</th>
                    <th>Rating</th>
                    <th>Feedback</th>
                  </tr>
                </thead>
                <tbody>
                  {ratings.map((rating) => (
                    <tr key={rating.id} className="hover">
                      <td>
                        <div className="flex items-center gap-2">
                          <div className="avatar">
                            <div className="w-8 rounded-full">
                              <img
                                src={rating.user?.imageUrl}
                                alt={rating.user?.name}
                              />
                            </div>
                          </div>
                          <span>{rating.user?.name || "Anonymous"}</span>
                        </div>
                      </td>
                      <td>{rating.productTitle}</td>
                      <td>
                        <StarRating rating={rating.rating} size="sm" />
                      </td>
                      <td className="max-w-xs">
                        {rating.feedback ? (
                          <span className="italic text-base-content/70">
                            "{rating.feedback}"
                          </span>
                        ) : (
                          <span className="text-base-content/40">
                            No feedback
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="card bg-base-300">
              <div className="card-body items-center text-center py-16">
                <MessageSquareIcon className="size-16 text-base-content/20" />
                <h3 className="card-title text-base-content/50">
                  No reviews yet
                </h3>
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
