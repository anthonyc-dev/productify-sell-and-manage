import type { Request, Response } from "express";
import * as queries from "../db/queries";
import { getAuth } from "@clerk/express";

// Create order (protected)
export const createOrder = async (req: Request, res: Response) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const { items } = req.body;
    // items: [{ productId: string, quantity: number }]

    if (!items || !Array.isArray(items) || items.length === 0) {
      res.status(400).json({ error: "At least one item is required" });
      return;
    }

    // Validate all products exist, fetch prices, and ensure buyer != seller
    const orderItems: {
      productId: string;
      quantity: number;
      price: string;
      selectedColor?: string;
    }[] = [];
    let totalAmount = 0;

    for (const item of items) {
      const product = await queries.getProductById(item.productId);
      if (!product) {
        res.status(404).json({ error: `Product ${item.productId} not found` });
        return;
      }

      if (product.userId === userId) {
        res.status(400).json({ error: "You cannot buy your own products" });
        return;
      }

      const price = parseFloat(product.price);
      const quantity = item.quantity || 1;

      // Validate inventory
      if (product.inventory < quantity) {
        res.status(400).json({
          error: `Not enough stock for ${product.title}. Only ${product.inventory} left.`,
        });
        return;
      }

      totalAmount += price * quantity;

      orderItems.push({
        productId: item.productId,
        quantity,
        price: product.price,
        selectedColor: item.selectedColor,
      });
    }

    const order = await queries.createOrder(
      {
        userId,
        totalAmount: totalAmount.toFixed(2),
        status: "completed",
      },
      orderItems,
    );

    res.status(201).json(order);
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ error: "Failed to create order" });
  }
};

// Get current user's orders (protected)
export const getMyOrders = async (req: Request, res: Response) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const orders = await queries.getOrdersByUserId(userId);
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error getting orders:", error);
    res.status(500).json({ error: "Failed to get orders" });
  }
};

// Get single order by ID (protected - owner only)
export const getOrderById = async (req: Request, res: Response) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const { id } = req.params;
    const order = await queries.getOrderById(id);

    if (!order) {
      res.status(404).json({ error: "Order not found" });
      return;
    }

    if (order.userId !== userId) {
      res.status(403).json({ error: "You can only view your own orders" });
      return;
    }

    res.status(200).json(order);
  } catch (error) {
    console.error("Error getting order:", error);
    res.status(500).json({ error: "Failed to get order" });
  }
};

// Delete single order by ID (protected - owner only)
export const deleteOrder = async (req: Request, res: Response) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const { id } = req.params;

    // Check if order exists and user owns it
    const order = await queries.getOrderById(id);
    if (!order) {
      res.status(404).json({ error: "Order not found" });
      return;
    }

    if (order.userId !== userId) {
      res.status(403).json({ error: "You can only delete your own orders" });
      return;
    }

    await queries.deleteOrder(id, userId);

    res.status(200).json({ message: "Order deleted successfully" });
  } catch (error) {
    console.error("Error deleting order:", error);
    res.status(500).json({ error: "Failed to delete order" });
  }
};

// Delete all orders for current user (protected)
export const deleteAllOrders = async (req: Request, res: Response) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    await queries.deleteAllOrders(userId);

    res.status(200).json({ message: "All orders deleted successfully" });
  } catch (error) {
    console.error("Error deleting all orders:", error);
    res.status(500).json({ error: "Failed to delete all orders" });
  }
};
