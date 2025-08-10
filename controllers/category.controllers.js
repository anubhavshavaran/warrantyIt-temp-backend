import {PrismaClient} from "@prisma/client";
import redis from "../redis/redis.js";

const prisma = new PrismaClient();

const CACHE_EXPIRY = 3600;

const getAllCategories = async (req, res) => {
    try {
        // const CATEGORY_CACHE_KEY = 'CATEGORIES_CACHE';
        // const cachedCategories = await redis.get(CATEGORY_CACHE_KEY);
        //
        // if (cachedCategories) {
        //     return res.status(200).json({
        //         success: true,
        //         data: {
        //             categories: JSON.parse(cachedCategories)
        //         },
        //     });
        // }

        const categories = await prisma.category.findMany({
            include: {
                _count: {
                    select: {
                        SubCategory: true,
                        Product: true
                    }
                }
            }
        });

        // await redis.setEx(CATEGORY_CACHE_KEY, CACHE_EXPIRY, JSON.stringify(categories));

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

        // const key = 'SUB_CATEGORY_CACHE_' + cat;
        // const cachedSubs = await redis.get(key);
        //
        // if (cachedSubs) {
        //     console.log('from cache', key);
        //     return res.status(200).json({
        //         success: true,
        //         data: {
        //             subCategories: JSON.parse(cachedSubs)
        //         },
        //     });
        // }

        const subCategories = await prisma.subCategory.findMany({
            where: {
                categoryId: cat
            },
            include: {
                _count: {
                    select: {
                        Product: true
                    }
                }
            }
        });

        if (subCategories.length === 0) {
            return res.status(404).json({
                success: true,
                message: "No sub category found",
            });
        }

        // await redis.setEx(key, CACHE_EXPIRY, JSON.stringify(subCategories));

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