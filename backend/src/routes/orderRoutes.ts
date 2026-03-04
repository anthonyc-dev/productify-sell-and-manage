import { Router } from "express";
import * as orderController from "../controllers/orderController";
import { requireAuth } from "@clerk/express";

const router = Router();

// POST /api/orders - Create new order (protected)
router.post("/", requireAuth(), orderController.createOrder);

// GET /api/orders - Get current user's orders (protected)
router.get("/", requireAuth(), orderController.getMyOrders);

// GET /api/orders/:id - Get single order by ID (protected)
router.get("/:id", requireAuth(), orderController.getOrderById);

// DELETE /api/orders/:id - Delete single order by ID (protected - owner only)
router.delete("/:id", requireAuth(), orderController.deleteOrder);

// DELETE /api/orders - Delete all orders for current user (protected)
router.delete("/", requireAuth(), orderController.deleteAllOrders);

export default router;
