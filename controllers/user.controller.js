import {PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();

const handleGetUser = async (req, res) => {
    const {user} = req;

    user.password = undefined;
    user.createdAt = undefined;
    user.updatedAt = undefined;

    res.status(200).json({
        message: "User found",
        user
    });
}

const handleUpdateUser = async (req, res) => {
    const {userId} = req.body;

    try {
        const updatedUser = await prisma.user.update({
            where: {
                userId: userId,
            },
            data: {
                ...req.body,
            }
        });

        res.status(200).json({
            message: "User updated successfully",
            user: updatedUser,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Something went wrong in sign up",
            status: false,
        });
    }
}

export {
    handleGetUser,
    handleUpdateUser,
}