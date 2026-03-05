import { Link } from "react-router";
import { MessageCircleIcon, StarIcon } from "lucide-react";
import { useAuth } from "@clerk/clerk-react";
import StarRating from "./StarRating";

const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

const ProductCard = ({ product }) => {
  const { userId } = useAuth();
  const isNew = new Date(product.createdAt) > oneWeekAgo;
  const isOwner = userId === product.userId;

  const ratings = product.ratings || [];
  const avgRating = ratings.length > 0
    ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
    : 0;
  const displayRating = parseFloat(avgRating.toFixed(1));

  return (
    <Link
      to={`/product/${product.id}`}
      className="card bg-base-300 hover:bg-base-200 transition-colors"
    >
      <figure className="px-4 pt-4">
        <img
          src={product.imageUrl}
          alt={product.title}
          className="rounded-xl h-40 w-full object-cover"
        />
      </figure>
      <div className="card-body p-4">
        <h2 className="card-title text-base">
          {product.title}
          {isNew && <span className="badge badge-secondary badge-sm">NEW</span>}
        </h2>
        <div className="flex justify-between items-center mt-1">
          <p className="text-primary font-bold">
            ${parseFloat(product.price).toFixed(2)}
          </p>
          {ratings.length > 0 && (
            <div className="flex items-center gap-1">
              <StarIcon className="size-3 fill-yellow-400 text-yellow-400" />
              <span className="text-xs font-medium">{displayRating}</span>
              <span className="text-xs text-base-content/50">({ratings.length})</span>
            </div>
          )}
          {isOwner && (
            <span
              className={`text-xs font-semibold ${
                product.inventory > 0 ? "text-success" : "text-error"
              }`}
            >
              {product.inventory > 0
                ? `${product.inventory} left`
                : "Out of stock"}
            </span>
          )}
        </div>
        <p className="text-sm text-base-content/70 line-clamp-2">
          {product.description}
        </p>

        <div className="divider my-1"></div>

        <div className="flex items-center justify-between">
          {product.user && (
            <div className="flex items-center gap-2">
              <div className="avatar">
                <div className="w-6 rounded-full ring-1 ring-primary">
                  <img src={product.user.imageUrl} alt={product.user.name} />
                </div>
              </div>
              <span className="text-xs text-base-content/60">
                {product.user.name}
              </span>
            </div>
          )}
          {product.comments && (
            <div className="flex items-center gap-1 text-base-content/50">
              <MessageCircleIcon className="size-3" />
              <span className="text-xs">{product.comments.length}</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
