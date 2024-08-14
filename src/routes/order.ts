import express, { Request, Response } from "express";

import Order from "../models/Order";
const router = express.Router();

// create a new order

router.post("/create", async (req: Request, res: Response) => {
  try {
    const order = await Order.create(req.body);
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

// delete an order

router.delete("/delete/:oId", async (req: Request, res: Response) => {
  try {
    const { oId } = req.params;

    await Order.findByIdAndDelete({ _id: oId });

    res.status(200).json({ message: "Order deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

// get user orders

router.get("/:uId", async (req: Request, res: Response) => {
  try {
    const { uId } = req.params;

    const orders = await Order.find({ user: uId });

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

export default router;
