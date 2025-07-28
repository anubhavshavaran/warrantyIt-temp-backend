import jwt from "jsonwebtoken";
import {promisify} from "util";
import {PrismaClient} from "@prisma/client";

const prisma = new PrismaClient();

const isUserAuthenticated = async (req, res, next) => {
    try {
        let token;
        if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({
                message: "Authenticate again!",
            });
        }

        const decoded = await promisify(jwt.verify)(token, process.env.JWTSECRET);

        const user = await prisma.user.findUnique({
            where: {
                userId: decoded.userId,
            }
        });

        if (!user) {
            return res.status(401).json({
                message: "This user no longer exists!",
            });
        }

        req.user = user;

        next();
    } catch (error) {
        console.log("Something Went Wrong In Authentication Middleware", error);

        return res.status(401).json({
            message: "Authentication failed: Invalid or expired token.",
            error: error.name
        });
    }
};

export {
    isUserAuthenticated
};