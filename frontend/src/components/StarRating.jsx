import { StarIcon } from "lucide-react";

const StarRating = ({ rating, onRate, interactive = false, size = "md" }) => {
  const sizeClasses = {
    sm: "size-3",
    md: "size-4",
    lg: "size-6",
  };

  const starClass = sizeClasses[size] || sizeClasses.md;

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={!interactive}
          onClick={() => interactive && onRate && onRate(star)}
          className={`transition-transform ${
            interactive ? "hover:scale-110 cursor-pointer" : "cursor-default"
          } ${interactive ? "" : "pointer-events-none"}`}
        >
          <StarIcon
            className={`${starClass} ${
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "text-base-content/30"
            }`}
          />
        </button>
      ))}
    </div>
  );
};

export default StarRating;
