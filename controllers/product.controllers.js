import {PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();

const handleRegisterProduct = async (req, res) => {
    try {
        const registeredProduct = await prisma.product.create({
            data: {
                ...req.body,
            },
        });

        return res.status(200).json({
            message: "Product created successfully",
            status: true,
            data: {
                registeredProduct
            }
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Something went wrong while registering the product",
            status: false,
        });
    }
};

const handleGetAllProducts = async (req, res) => {
    const products = await prisma.product.findMany();

    res.status(200).json({
        status: 'Products fetched successfully',
        length: products.length,
        data: {products},
    });
}

const handleGetProduct = async (req, res) => {
    const product = await prisma.product.findUnique({
        where: {
            productId: req.params.id,
        }
    });

    res.status(200).json({
        status: 'Product fetched successfully',
        data: {product},
    });
}

const handleDeleteProduct = async (req, res) => {
    await prisma.product.delete({
        where: {
            productId: req.params.id,
        }
    });

    res.status(204).json({
        status: 'Product deleted successfully',
    });
}

const handleUpdateProduct = async (req, res) => {
    const updatedProduct = await prisma.product.update({
        where: {
            productId: req.params.id,
        },
        data: {
            ...req.body,
        }
    });

    res.status(200).json({
        status: 'Product updated successfully',
        data: {
            updatedProduct
        }
    });
}

const handleSearchProducts = async (req, res) => {
    try {
        const {q} = req.params;
        const products = await prisma.product.findMany({
            where: {
                productName: {
                    contains: q,
                    mode: "insensitive",
                },
                userId: req.user.userId,
            },
        });

        res.status(200).json({
            status: 'Products fetched successfully',
            data: {
                products
            }
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({
            message: "Something went wrong while searching the product",
            status: false,
        });
    }
}

const handleGetProductsByCatSubCat = async (req, res) => {
    try {
        const {cat, subCat} = req.params;

        const products = await prisma.product.findMany({
            where: {
                categoryId: cat,
                subCategoryId: subCat,
            }
        });

        res.status(200).json({
            status: 'Products fetched successfully',
            data: {
                products
            }
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({
            message: "Something went wrong while searching the product",
            status: false,
        });
    }
};

const handleGetProductsByBrand = async (req, res) => {
    try {
        const {brand} = req.params;

        if (!brand) {
            return res.status(404).json({
                status: false,
                message: 'Please provide a brand',
            });
        }

        const products = await prisma.product.findMany({
            where: {
                brandId: brand,
            }
        });

        res.status(200).json({
            status: true,
            data: {
                products
            }
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({
            message: "Something went wrong while searching the products",
            status: false,
        });
    }
}

export {
    handleRegisterProduct,
    handleGetAllProducts,
    handleUpdateProduct,
    handleGetProduct,
    handleDeleteProduct,
    handleSearchProducts,
    handleGetProductsByCatSubCat,
    handleGetProductsByBrand,
};