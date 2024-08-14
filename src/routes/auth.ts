import express from "express";

const router = express.Router();

import { Request, Response } from 'express'
import User from '../models/User'
import { UserType } from "../types/types";
import bcrypt from 'bcrypt'
import jwt, { JwtPayload } from 'jsonwebtoken'


// REGISTER

router.post('/register', async (req: Request, res: Response) => {

    try {


        const {name, email, password} = req.body;


        // check if all fields are filled
        if(!name || !email || !password) {
            return res.status(400).json({message: "All fields are required"})
        }


        // check of the user already exists
        const existingUser: UserType = await User.findOne({email})

        if(existingUser) {
            return res.status(400).json({message: "User already exists"})
        }

        // hash the password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)


        // other wise register the new user to the database:

        const newUser: UserType = {
            name,
            email,
            password: hashedPassword,

        }

        await User.create(newUser)

        // // check if user was created using _id
        // const createdUser: UserType = await User.findById(newUser._id).select("-password")

        // if(!createdUser) {
        //     return res.status(500).json({message: "Internal server error"})
        // }




        res.status(201).json(newUser)
        
    } catch (error) {
        res.status(500).json({message: "Internal server error"})
    }

})


// LOGIN

router.post('/login', async (req: Request, res: Response) => {

    try {   


        // get the email and password from the request body (user input)
        const {email, password} = req.body;


        // check if all fields are filled
        if(!email || !password) {
            return res.status(400).json({message: "All fields are required"})
        }

        // look for user in DB:

        const user: UserType = await User.findOne({email})


        // check if user exists
        if(!user) {
            return res.status(400).json({message: "User not found"})
        }

        // validate password with the hashed password in the database

        const validPassword = await bcrypt.compare(password, user.password)
        if(!validPassword) {
            return res.status(400).json({message: "Invalid password"})
        }

        // generate a token using _id from mongoDB and send it to the user
        const token = jwt.sign({_id: user._id}, process.env.JWT_SECRET, {expiresIn: "3d"})



        // if user exists and password is valid, return the user
        res.cookie("token", token, {httpOnly: true}).status(200).json("Logged in successfully")


        
    } catch (error) {
        res.status(500).json({message: "Internal server error"})
    }



})


// LOGOUT


router.get('/logout', async (req: Request, res: Response) => {


    try {

        // clear the cookie to logout
        res.clearCookie("token").status(200).json("Logged out successfully")
        
    } catch (error) {
        res.status(500).json({message: "Internal server error"})
    }


})



// // GET CURRENT USER



// router.get('/refetch', async (req: Request, res: Response) => {

//     const token = req.cookies.token
//     try {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET as string)
//         const id = (decoded as JwtPayload)._id
//         const user = await User.findById(id)
//         res.status(200).json(user)


        
//     } catch (error) {
//         res.status(500).json({message: "Internal server error"})
//     }


// })


// GET CURRENT USER
router.get('/refetch', async (req: Request, res: Response) => {
    try {
        // Ensure the token exists in cookies
        const token = req.cookies?.token;
        if (!token) {
            return res.status(401).json({ message: "Authentication token is missing" });
        }

        if (token) {
            const decoded = jwt.decode(token);
            console.log(decoded);  // Check the content of the token, including 'iat' and 'exp'
        }


        // Decode the token to get the _id
        let decoded: JwtPayload | undefined;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
        } catch (err) {
            return res.status(401).json({ message: "Invalid or expired token" });
        }

        // Extract the user ID from the token
        const userId = decoded._id;

        // Find the user by ID in the database
        const user: UserType | null = await User.findById(userId).select("-password"); // Exclude the password field

        // Check if the user exists
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Return the user data
        res.status(200).json(user);
    } catch (error) {
        console.error("Error fetching current user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});




export default router