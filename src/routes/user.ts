

import express, { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import User from "../models/User";
import { UserType } from "../types/types";

const router = express.Router();

// Update a user
router.put('/update/:userId', async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Get the id from the URL
        const { userId } = req.params;

        // Find the user by ID
        const user: UserType | null = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // If the password is provided in the request body, hash it
        if (req.body.password) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(req.body.password, salt);
            req.body.password = hashedPassword;
        }

        // Update the user with the new data from the request body
        const updatedUser: UserType | null = await User.findByIdAndUpdate(
            userId,
            { $set: req.body },
            { new: true } // Return the updated user
        );

        if (!updatedUser) {
            return res.status(500).json({ message: "Failed to update user" });
        }

        // Send the updated user as a response
        res.status(200).json(updatedUser);

    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});


// GET aa user

router.get('/:userId', async (req: Request, res: Response, next: NextFunction) => {
    try {
        
        // Get the user ID from the URL
        const { userId } = req.params;


        // Find the user by ID
        const user: UserType | null = await User.findById({ _id: userId });


        // If the user is not found, return a 404 error
        if(!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Send the user as a response
        res.status(200).json(user);

    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
})



// DELETE a user


router.delete('/delete/:userId', async (req: Request, res: Response, next: NextFunction) => {

    try {


        // Get the user ID from the URL
        const {userId} = req.params;


        // check if the user exists

        const userToDelete= await User.findById(userId)
        if(!userToDelete) {
            return res.status(404).json({ message: "User not found" });
        }

        // delete the userToDelete

        await userToDelete.deleteOne();


        // check if the user is deleted

        const check = await User.findById(userId);

        if(check) {
            return res.status(500).json({ message: "Failed to delete user" });
        }

        // Send a success message
        res.status(200).json({ message: "User deleted successfully" });
        
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ message: "Internal server error" });
    }


})


export default router;
