import {PrismaClient} from "@prisma/client";

const prisma = new PrismaClient();

const getAllCategories = async (req, res) => {
    try {
        const categories = await prisma.category.findMany();

        res.status(200).json({
            success: true,
            data: {categories},
        });
    } catch (e) {
        res.status(500).send({
            error: true,
            message: e.message,
        });
    }
}

const getAllSubCategories = async (req, res) => {
    try {
        const {cat} = req.params;

        if (!cat) {
            return res.status(400).send({
                error: true,
                message: "Please provide a category.",
            });
        }

        const subCategories = await prisma.subCategory.findMany({
            where: {
                categoryId: cat
            }
        });

        if (subCategories.length === 0) {
            return res.status(404).json({
                success: true,
                message: "No sub category found",
            });
        }

        res.status(200).json({
            success: true,
            data: {subCategories},
        });
    } catch (e) {
        res.status(500).send({
            error: true,
            message: e.message,
        });
    }
}

export {
    getAllCategories,
    getAllSubCategories,
}