import {PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();

const handleRegisterProduct = async (req, res) => {
    try {
        const registeredProduct = await prisma.product.create({
            data: {
                ...req.body
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
    const product = await prisma.product.delete({
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

export {
    handleRegisterProduct,
    handleGetAllProducts,
    handleUpdateProduct,
    handleGetProduct,
    handleDeleteProduct
};