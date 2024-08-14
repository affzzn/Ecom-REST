import express, { Request, Response, NextFunction } from "express";
import Address from "../models/Address";

const router = express.Router();

// create a new address

router.post(
  "/create",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const address = await Address.create(req.body);

      res.status(201).json(address);
    } catch (error) {
      res.status(500).json({ message: error });
    }
  }
);

// update an address

router.put("/update/:aId", async (req: Request, res: Response) => {
  try {
    const { aId } = req.params;

    const addressToUpdate = await Address.findByIdAndUpdate(
      aId,
      {
        $set: req.body,
      },
      { new: true }
    );

    res.status(200).json(addressToUpdate);
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

// delete an address

router.delete("/delete/:aId", async (req: Request, res: Response) => {
  try {
    const { aId } = req.params;

    await Address.findByIdAndDelete({ _id: aId });

    res.status(200).json({ message: "Address deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

// get a users addresses

router.get("/:uId", async (req: Request, res: Response) => {
  try {
    const { uId } = req.params;

    const address = await Address.find({ user: uId });

    return res.status(200).json(address);
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

export default router;
