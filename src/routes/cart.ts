import express, { Request, Response, NextFunction } from "express";

import Cart from "../models/Cart";

const router = express.Router();

// add to cart

router.post("/add", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId, productId, quantity } = req.body;

    // check if the user already has a cart
    // if they do, update the cart
    // if they don't, create a new cart

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = await Cart.create({
        user: userId,
        products: [],
      });
    }

    const exisitingProductIndex = cart.products.findIndex(
      (item) => item.product.toString() === productId
    );

    // update cart if product already exists
    // else add new product to cart
    if (exisitingProductIndex !== -1) {
      cart.products[exisitingProductIndex].quantity += quantity;
    } else {
      cart.products.push({ product: productId, quantity });
    }

    await cart.save();

    res.status(200).json({ message: "Product added to cart" });
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

// remove a product from the cart

router.delete(
  "/remove/",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId, productId } = req.body;

      const cart = await Cart.findOne({ user: userId });

      if (!cart) {
        return res.status(404).json({ message: "Cart not found" });
      }

      const productIndex = cart.products.findIndex(
        (item) => item.product.toString() === productId
      );

      if (productIndex !== -1) {
        if (cart.products[productIndex].quantity > 1) {
          cart.products[productIndex].quantity -= 1;
        }
      } else {
        return res.status(404).json({ message: "Product not found in cart" });
      }
    } catch (error) {
      res.status(500).json({ message: error });
    }
  }
);

export default router;
