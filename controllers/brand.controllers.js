import {PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();

const handleGetAllBrandsByCatSubCat = async (req, res) => {
    try {
        const {cat, subcat} = req.params;

        if (!cat || !subcat) {
            res.status(404).json({
                status: false,
                message: 'Category and SubCategory are required',
            });
        }

        const brands = await prisma.brand.findMany({
            where: {
                categoryId: cat,
                subCategoryId: subcat,
            },
            include: {
                _count: {
                    select: {
                        Product: true,
                    }
                }
            }
        });

        res.status(200).json({
            status: true,
            data: {
                brands
            },
        });
    } catch (e) {
        console.log(e);
        res.status(500).json({
            status: false,
            message: 'Something went wrong',
        });
    }
}

const handleCreateBrand = async (req, res) => {
    try {
        const {brandName, categoryId, subCategoryId} = req.body;

        if (!brandName || !categoryId || !subCategoryId) {
            res.status(404).json({
                status: false,
                message: 'Brand name, Category and SubCategory are required',
            });
        }

        const brand = await prisma.brand.create({
            data: {
                brandName: brandName,
                categoryId: categoryId,
                subCategoryId: subCategoryId,
            }
        });

        res.status(200).json({
            status: true,
            data: {
                brand
            },
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({
            status: false,
            message: 'Something went wrong',
        });
    }
}

export {
    handleGetAllBrandsByCatSubCat,
    handleCreateBrand,
}