import {PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();

const handleRegisterProduct = async (req, res) => {
    const {userId} = req.user;

    try {
        const registeredProduct = await prisma.product.create({
            data: {
                ...req.body,
                userId: userId,
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

const handleGetProductsByType = async (req, res) => {
    const {type} = req.params;
    const products = await prisma.product.findMany({
        where: {
            productType: type
        },
        select: {
            productId: true,
            productBrand: true
        }
    });

    res.status(200).json({
        status: 'Products fetched successfully',
        data: {
            products
        }
    });
}

const handleSearchProducts = async (req, res) => {
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
}

export {
    handleRegisterProduct,
    handleGetAllProducts,
    handleUpdateProduct,
    handleGetProduct,
    handleDeleteProduct,
    handleGetProductsByType,
    handleSearchProducts,
};