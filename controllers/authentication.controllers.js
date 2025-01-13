import {PrismaClient} from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {OAuth2Client} from 'google-auth-library';

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const client = new OAuth2Client(CLIENT_ID);

const prisma = new PrismaClient();

const signToken = (userId) => {
    return jwt.sign({userId}, process.env.JWTSECRET, {
        expiresIn: process.env.JWTEXPIRESIN,
    });
}

const verifyGoogleToken = async (idToken) => {
    try {
        const ticket = await client.verifyIdToken({
            idToken,
            audience: CLIENT_ID,
        });
        return ticket.getPayload();
    } catch (error) {
        console.error('Error verifying Google token:', error);
        throw new Error('Invalid token');
    }
};

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

        const token = signToken(newUser.userId);

        newUser.password = undefined;
        newUser.createdAt = undefined;
        newUser.updatedAt = undefined;

        res.status(201)
            .json({
                message: "User created successfully",
                token,
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

const handleUserSignIn = async (req, res) => {
    try {
        const {email, password} = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Please fill all the fields",
                status: false,
            });
        }

        const user = await prisma.user.findUnique({
            where: {email},
        });

        if (!user) {
            return res.status(400).json({
                message: "Incorrect email or password",
                status: false,
            });
        }

        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword) {
            return res.status(400).json({
                message: "Incorrect email or password",
                status: false,
            });
        }

        const token = signToken(user.userId);

        user.password = undefined;
        user.createdAt = undefined;
        user.updatedAt = undefined;

        res.status(200)
            .json({
                message: "Login successful",
                token,
                user
            });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Something went wrong in sign in",
            status: false,
        });
    }
};

const handleUserWithGoogle = async (req, res) => {
    const {token} = req.params;

    if (!token) {
        return res.status(400).json({
            message: "Token is required",
        });
    }

    try {
        const {email, name} = await verifyGoogleToken(token);


        let user = await prisma.user.findUnique({
            where: {email},
        });

        if (!user) {
            user = await prisma.user.create({
                data: {
                    name,
                    email
                }
            });
        }

        const token = signToken(user.userId);

        user.password = undefined;
        user.createdAt = undefined;
        user.updatedAt = undefined;

        res.status(200)
            .json({
                message: "Authenticated successfully",
                token,
                user
            });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Something went wrong in sign in",
            status: false,
        });
    }
}

export {
    handleUserSignUp,
    handleUserSignIn,
    handleUserWithGoogle,
};