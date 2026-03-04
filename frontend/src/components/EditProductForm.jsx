import {
  ArrowLeftIcon,
  ImageIcon,
  TypeIcon,
  FileTextIcon,
  SaveIcon,
  DollarSignIcon,
  BoxIcon,
  PaletteIcon,
  XIcon,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";

function EditProductForm({ product, isPending, isError, onSubmit }) {
  const [formData, setFormData] = useState({
    title: product.title,
    description: product.description,
    imageUrl: product.imageUrl,
    price: product.price || "0",
    inventory: product.inventory !== undefined ? product.inventory : 10,
    colors: product.colors || "",
  });

  return (
    <div className="max-w-lg mx-auto">
      <Link to="/profile" className="btn btn-ghost btn-sm gap-1 mb-4">
        <ArrowLeftIcon className="size-4" /> Back
      </Link>

      <div className="card bg-base-300">
        <div className="card-body">
          <h1 className="card-title">
            <SaveIcon className="size-5 text-primary" />
            Edit Product
          </h1>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              onSubmit(formData);
            }}
            className="space-y-4 mt-4"
          >
            <label className="input input-bordered flex items-center gap-2 bg-base-200">
              <TypeIcon className="size-4 text-base-content/50" />
              <input
                type="text"
                placeholder="Product title"
                className="grow"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
              />
            </label>

            <label className="input input-bordered flex items-center gap-2 bg-base-200">
              <ImageIcon className="size-4 text-base-content/50" />
              <input
                type="url"
                placeholder="Image URL"
                className="grow"
                value={formData.imageUrl}
                onChange={(e) =>
                  setFormData({ ...formData, imageUrl: e.target.value })
                }
                required
              />
            </label>

            {/* PRICE & INVENTORY */}
            <div className="grid grid-cols-2 gap-4">
              <label className="input input-bordered flex items-center gap-2 bg-base-200">
                <DollarSignIcon className="size-4 text-base-content/50" />
                <input
                  type="number"
                  placeholder="Price"
                  className="grow"
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  required
                />
              </label>

              <label className="input input-bordered flex items-center gap-2 bg-base-200">
                <BoxIcon className="size-4 text-base-content/50" />
                <input
                  type="number"
                  placeholder="Inventory"
                  className="grow"
                  min="0"
                  step="1"
                  value={formData.inventory}
                  onChange={(e) =>
                    setFormData({ ...formData, inventory: e.target.value })
                  }
                  required
                />
              </label>
            </div>

            {/* COLORS INPUT */}
            <div className="space-y-2">
              <label className="text-sm font-semibold flex items-center gap-2">
                <PaletteIcon className="size-4 text-primary" />
                Available Colors
              </label>
              <ColorTagInput
                value={formData.colors}
                onChange={(colorsArray) =>
                  setFormData({ ...formData, colors: colorsArray.join(",") })
                }
              />
            </div>

            {formData.imageUrl && (
              <div className="rounded-box overflow-hidden">
                <img
                  src={formData.imageUrl}
                  alt="Preview"
                  className="w-full h-40 object-cover"
                  onError={(e) => (e.currentTarget.style.display = "none")}
                />
              </div>
            )}

            <div className="form-control">
              <div className="flex items-start gap-2 p-3 rounded-box bg-base-200 border border-base-300">
                <FileTextIcon className="size-4 text-base-content/50 mt-1" />
                <textarea
                  placeholder="Description"
                  className="grow bg-transparent resize-none focus:outline-none min-h-24"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            {isError && (
              <div role="alert" className="alert alert-error alert-sm">
                <span>Failed to update. Try again.</span>
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={isPending}
            >
              {isPending ? (
                <span className="loading loading-spinner" />
              ) : (
                "Save Changes"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
function ColorTagInput({ value, onChange }) {
  const [input, setInput] = useState("");
  const tags = value ? value.split(",").filter(Boolean) : [];

  const addTag = (tag) => {
    const trimmed = tag.trim();
    if (trimmed && !tags.includes(trimmed)) {
      onChange([...tags, trimmed]);
    }
    setInput("");
  };

  const removeTag = (indexToRemove) => {
    onChange(tags.filter((_, index) => index !== indexToRemove));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(input);
    } else if (e.key === "Backspace" && !input && tags.length > 0) {
      removeTag(tags.length - 1);
    }
  };

  return (
    <div className="flex flex-wrap gap-2 p-2 min-h-12 items-center bg-base-200 rounded-box border border-base-300 focus-within:border-primary transition-colors">
      {tags.map((tag, index) => (
        <div
          key={index}
          className="badge badge-primary gap-1 pl-2 pr-1 h-7 border-none"
        >
          <div
            className="w-2.5 h-2.5 rounded-full border border-white/20"
            style={{ backgroundColor: tag.toLowerCase() }}
          />
          <span className="text-xs font-medium">{tag}</span>
          <button
            type="button"
            className="btn btn-ghost btn-xs btn-circle h-5 w-5 min-h-0"
            onClick={() => removeTag(index)}
          >
            <XIcon className="size-3" />
          </button>
        </div>
      ))}
      <input
        type="text"
        className="bg-transparent border-none outline-none text-sm grow min-w-[120px]"
        placeholder={tags.length === 0 ? "Add color (Enter or comma)..." : ""}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={() => addTag(input)}
      />
    </div>
  );
}

export default EditProductForm;
