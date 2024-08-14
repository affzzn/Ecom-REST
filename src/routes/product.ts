import express, { Request, Response, NextFunction } from "express";

import Product from "../models/Product";

const router = express.Router();

// create a product listing (only for admin)

router.post(
  "/create",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const newProduct = new Product(req.body);

      //   const product = await newProduct.save();

      // or

      const product = await Product.create(req.body);

      res.status(201).json(product);
    } catch (error) {
      res.status(500).json({ message: error });
    }
  }
);

// search for a product

router.get("/search/:query", async (req: Request, res: Response) => {
  try {
    const { query } = req.params;

    const products = await Product.find({
      $or: [
        {
          name: {
            $regex: new RegExp(query, "i"),
          },
          category: {
            $regex: new RegExp(query, "i"),
          },
        },
      ],
    });

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

// get all products

router.get("/", async (req: Request, res: Response) => {
  try {
    const products = await Product.find();

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error });
  }
});

// fetch products based on category

router.get("/:category", async (req: Request, res: Response) => {
  try {
    const { category } = req.params;

    const products = await Product.find({ category });

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error });
  }
});

// get a single product

router.get("/get/:pId", async (req: Request, res: Response) => {
  try {
    const { pId } = req.params;

    const product = await Product.findById({ _id: pId });

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

export default router;
