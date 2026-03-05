import type { Request, Response } from "express";

import * as queries from "../db/queries";
import { getAuth } from "@clerk/express";

export const rateProduct = async (req: Request, res: Response) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const { productId } = req.params;
    const { rating, feedback } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: "Rating must be between 1 and 5" });
    }

    const product = await queries.getProductById(productId);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    if (product.userId === userId) {
      return res.status(403).json({ error: "You cannot rate your own product" });
    }

    const result = await queries.createOrUpdateRating({
      rating: parseInt(rating),
      feedback: feedback || null,
      userId,
      productId,
    });

    res.status(200).json(result);
  } catch (error) {
    console.error("Error rating product:", error);
    res.status(500).json({ error: "Failed to rate product" });
  }
};

export const getProductRatings = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    const ratings = await queries.getRatingsByProductId(productId);

    const avgRating = ratings.length > 0
      ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
      : 0;

    res.status(200).json({
      ratings,
      averageRating: parseFloat(avgRating.toFixed(1)),
      totalRatings: ratings.length,
    });
  } catch (error) {
    console.error("Error getting ratings:", error);
    res.status(500).json({ error: "Failed to get ratings" });
  }
};

export const getUserProductRatings = async (req: Request, res: Response) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const ratings = await queries.getAllRatingsForUserProducts(userId);

    const ratingsWithProduct = ratings.map((r) => ({
      ...r,
      productTitle: r.product?.title,
      productImage: r.product?.imageUrl,
    }));

    res.status(200).json(ratingsWithProduct);
  } catch (error) {
    console.error("Error getting user product ratings:", error);
    res.status(500).json({ error: "Failed to get ratings" });
  }
};
