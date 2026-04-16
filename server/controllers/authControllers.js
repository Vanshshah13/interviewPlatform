import { User } from "../models/User.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/jwtToken.js";

export const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                message: "All fields are required"
            })
        }

        const emailRegex = /^\S+@\S+\.\S+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                message: "Invalid email format. please enter valid email",
                success: false
            })
        }

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
        if (!passwordRegex.test(password)) {
            return res.status(400).json({
                success: false,
                message:
                    "Password must contain at least one uppercase letter, one special character, and be at least 8 characters long."
            });
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({
                message: "User already Exists."
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name: name.trim(),
            email: email.toLowerCase(),
            password: hashedPassword
        });

        const token = generateToken(user._id);

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: {
                _id: user._id,
                name: user.name,
                email: user.email,
                token,
            },
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Server Error",
            error: error.message,
        });
    }
}

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "All fields are required."
            });
        }

        const emailRegex = /^\S+@\S+\.\S+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                message: "Invalid email format. please enter valid email",
                success: false
            })
        }

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
        if (!passwordRegex.test(password)) {
            return res.status(400).json({
                success: false,
                message:
                    "Password must contain at least one uppercase letter, one special character, and be at least 8 characters long."
            });
        }

        const user = await User.findOne({ email: email.toLowerCase() });

        if(!user){
            return res.status(400).json({
                message: "Invalid credentials",
            });
        }

        const isMatch = await bcrypt.compare(password , user.password);

        if(!isMatch){
            return res.status(400).json({
                message : "Password is incorrect"
            })
        }

        const token = generateToken(user._id);

        return res.status(200).json({
            success : true,
            message : "Login Successful",
            data : {
                _id : user._id,
                name : user.name,
                email : user.email,
                token
            }
        })

    } catch (error) {
        return res.status(500).json({
            success : false,
            message : "Server Error",
            error : error.message
        })
    }
}