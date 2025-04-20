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

export {
    handleGetAllBrandsByCatSubCat,
}