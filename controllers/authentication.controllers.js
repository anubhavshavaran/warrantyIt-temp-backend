import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

const handleUserSignUp = async (request, response) => {
    try {
        const { firstName, lastName, email, password } = request.body;

        if (!firstName || !lastName || !email || !password) {
            return response.status(400).json({
                message: "Please fill all the fields",
                status: false,
            });
        }

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return response.status(400).json({
                message: "User already exists!",
                status: false,
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = await prisma.user.create({
            data: {
                userId: uuidv4(),
                firstName,
                lastName,
                email,
                password: hashedPassword,
            },
        });

        const tokenData = {
            userId: newUser.userId,
            email: newUser.email,
        };

        const signedToken = jwt.sign(tokenData, process.env.JWTSECRETE, {
            expiresIn: "1d",
        });

        response
            .status(201)
            .cookie("jwttoken", signedToken, {
                maxAge: 1 * 24 * 60 * 60 * 1000,
                sameSite: "strict",
                secure: true,
            })
            .json({
                message: "User created successfully",
                status: true,
                token: signedToken,
            });
    } catch (error) {
        console.error(error);
        response.status(500).json({
            message: "Something went wrong in sign up",
            status: false,
        });
    }
};

const handleUserSignIn = async (request, response) => {
    try {
        const { email, password } = request.body;

        if (!email || !password) {
            return response.status(400).json({
                message: "Please fill all the fields",
                status: false,
            });
        }

        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return response.status(400).json({
                message: "Incorrect email or password",
                status: false,
            });
        }

        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword) {
            return response.status(400).json({
                message: "Incorrect email or password",
                status: false,
            });
        }

        const tokenData = {
            userId: user.userId,
            email: user.email,
        };

        const generatedToken = jwt.sign(tokenData, process.env.JWTSECRETE, {
            expiresIn: "1d",
        });

        response
            .status(200)
            .cookie("jwttoken", generatedToken, {
                maxAge: 1 * 24 * 60 * 60 * 1000,
                httpOnly: true,
                sameSite: "strict",
                secure: true,
            })
            .json({
                message: "Login successful",
                status: true,
                token: generatedToken,
                tokenData,
            });
    } catch (error) {
        console.error(error);
        response.status(500).json({
            message: "Something went wrong in sign in",
            status: false,
        });
    }
};

const handleUserSignOut = async (request, response) => {
    try {
        response.status(200).cookie("jwttoken", "", { maxAge: 0 }).json({
            message: "Logout successful",
            status: true,
        });
    } catch (error) {
        console.error(error);
        response.status(500).json({
            message: "Something went wrong in sign out",
            status: false,
        });
    }
};

const handleUserProfileUpdate = async (request, response) => {
    try {
        const { firstName, lastName, phoneNumber, bio, skills, email } = request.body;

        if (!firstName || !lastName || !phoneNumber || !bio || !skills || !email) {
            return response.status(400).json({
                message: "Please fill all the fields",
                status: false,
            });
        }

        const userId = request.userId;

        const updatedUser = await prisma.user.update({
            where: { userId },
            data: {
                firstName,
                lastName,
                phoneNumber,
                profile: {
                    skills: skills.split(","),
                    email,
                    bio,
                },
            },
        });

        response.status(200).json({
            message: "User profile updated successfully",
            status: true,
            user: updatedUser,
        });
    } catch (error) {
        console.error(error);
        response.status(500).json({
            message: "Something went wrong while updating profile",
            status: false,
        });
    }
};

export {
    handleUserSignUp,
    handleUserSignIn,
    handleUserSignOut,
    handleUserProfileUpdate,
};
