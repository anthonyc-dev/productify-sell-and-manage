import { Router } from "express";
import { rateProduct, getProductRatings, getUserProductRatings } from "../controllers/ratingController";

const router = Router();

router.post("/:productId", rateProduct);
router.get("/:productId", getProductRatings);
router.get("/my/products", getUserProductRatings);

export default router;
