import {PrismaClient} from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {OAuth2Client} from 'google-auth-library';
import {promisify} from "util";
import {generateOTP} from "../lib/OTP.js";
import {sendMail} from "../lib/mailer.js";

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
        const {firstname, lastname, username, email, password} = req.body;

        if (!username || !email || !password || !firstname || !lastname) {
            return res.status(400).json({
                message: "Please fill all the fields",
                status: false,
            });
        }

        const usernameRegex = /^[a-zA-Z0-9_-]{3,16}$/;
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        if (!usernameRegex.test(username) || !emailRegex.test(email)) {
            return res.status(400).json({
                message: "Please provide a valid username and email address!",
                status: false,
            });
        }

        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    {email: email},
                    {username: username}
                ]
            },
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
                firstname,
                lastname,
                username,
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
        const {id, password} = req.body;

        if (!id || !password) {
            return res.status(400).json({
                message: "Please fill all the fields",
                status: false,
            });
        }

        const user = await prisma.user.findFirst({
            where: {
                OR: [
                    {email: id,},
                    {username: id}
                ]
            },
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
    try {
        const {token: googleToken} = req.params;

        if (!googleToken) {
            return res.status(400).json({
                message: "Token is required",
            });
        }
        const {email, name} = await verifyGoogleToken(googleToken);


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
            message: "Something went wrong in authentication",
            status: false,
        });
    }
}

const handleVerifyUser = async (req, res) => {
    try {
        const {token} = req.body;
        if (!token) {
            return res.status(400).json({
                message: "Please provide the token",
            });
        }

        const decoded = await promisify(jwt.verify)(token, process.env.JWTSECRET);
        const user = await prisma.user.findFirst({
            where: {
                userId: decoded.userId,
            }
        });

        if (!user) {
            return res.status(401).json({
                message: "This user no longer exists!",
            });
        }

        res.status(200).json({
            message: "Verification successfully",
            user,
            token
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({
            message: "Something went wrong in authentication",
            status: false,
        });
    }
}

const handleSendOTP = async (req, res) => {
    const {email} = req.body;
    try {
        if (!email) {
            throw new Error("Please provide an email address");
        }

        const otp = generateOTP();

        await sendMail(
            email,
            'Your OTP for signing up.',
            `This is your OTP for signing up: ${otp}. Please don't share this with anyone.`
        );

        res.status(200).json({
            message: "Email sent successfully",
            otp
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({
            message: "Something went wrong",
            error: e.message,
            status: false,
        });
    }
}

export {
    handleUserSignUp,
    handleUserSignIn,
    handleUserWithGoogle,
    handleVerifyUser,
    handleSendOTP,
};