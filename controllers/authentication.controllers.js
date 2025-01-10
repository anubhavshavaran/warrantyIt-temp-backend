import {PrismaClient} from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

const handleUserSignUp = async (req, res) => {
    try {
        const {name, email, password} = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                message: "Please fill all the fields",
                status: false,
            });
        }

        const existingUser = await prisma.user.findUnique({
            where: {email},
        });

        if (existingUser) {
            return res.status(400).json({
                message: "User already exists!",
                status: false,
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
            },
        });

        const tokenData = {
            userId: newUser.userId,
            email: newUser.email,
        };

        const signedToken = jwt.sign(tokenData, process.env.JWTSECRET, {
            expiresIn: "30d",
        });

        newUser.password = undefined;
        newUser.createdAt = undefined;
        newUser.updatedAt = undefined;

        res.status(201)
            .json({
                message: "User created successfully",
                token: signedToken,
                newUser
            });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Something went wrong in sign up",
            status: false,
        });
    }
};

const handleUserSignIn = async (request, response) => {
    try {
        const {email, password} = request.body;

        if (!email || !password) {
            return response.status(400).json({
                message: "Please fill all the fields",
                status: false,
            });
        }

        const user = await prisma.user.findUnique({
            where: {email},
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

        const generatedToken = jwt.sign(tokenData, process.env.JWTSECRET, {
            expiresIn: "30d",
        });

        user.password = undefined;
        user.createdAt = undefined;
        user.updatedAt = undefined;

        response.status(200)
            .json({
                message: "Login successful",
                token: generatedToken,
                user
            });
    } catch (error) {
        console.error(error);
        response.status(500).json({
            message: "Something went wrong in sign in",
            status: false,
        });
    }
};

export {
    handleUserSignUp,
    handleUserSignIn
};