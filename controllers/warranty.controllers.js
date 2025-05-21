import {PrismaClient} from "@prisma/client";

const prisma = new PrismaClient();

const handleCreateWarranty = async (req, res) => {
    const {userId} = req.user;

    try {
        const warranty = await prisma.warranty.create({
            data: {
                ...req.body,
                userId: userId
            },
            select: {
                warrantyId: true
            }
        });

        res.status(200).send({
            status: "Warranty created successfully",
            data: {warranty}
        });
    } catch (error) {
        console.log(error)
        res.status(500).send({
            status: "Error",
            message: error.message
        });
    }
}

const handleGetAllWarranties = async (req, res) => {
    try {
        const warranties = await prisma.warranty.findMany({
            where: {
                userId: req.user.userId,
            },
            include: {
                product: true,
                vendor: true
            }
        });

        res.status(200).send({
            status: "Warranties fetched successfully",
            data: {warranties}
        });
    } catch (error) {
        res.status(500).send({
            status: false,
            message: error.message
        });
    }
}

const handleGetWarranty = async (req, res) => {
    const { id } = req.params;

    try {
        const warranty = await prisma.warranty.findUnique({
            where: {
                warrantyId: id
            },
            include: {
                product: true,
                vendor: true
            }
        });

        if (warranty) {
            res.status(200).send({
                status: "Warranty fetched successfully",
                data: warranty
            });
        } else {
            res.status(404).send({
                status: "Warranty not found",
                message: `No warranty found with ID ${id}`
            });
        }
    } catch (error) {
        res.status(500).send({
            status: "Error",
            message: error.message
        });
    }
}

const handleUpdateWarranty = async (req, res) => {
    const { id } = req.params;
    const updatedData = req.body;

    try {
        const updatedWarranty = await prisma.warranty.update({
            where: {
                warrantyId: id
            },
            data: updatedData
        });

        res.status(200).send({
            status: "Warranty updated successfully",
            data: updatedWarranty
        });
    } catch (error) {
        if (error.code === 'P2025') {
            res.status(404).send({
                status: "Warranty not found",
                message: `No warranty found with ID ${id}`
            });
        } else {
            res.status(500).send({
                status: "Error",
                message: error.message
            });
        }
    }
}

const handleDeleteWarranty = async (req, res) => {
    const { id } = req.params;

    try {
        await prisma.warranty.delete({
            where: {
                warrantyId: id
            }
        });

        res.status(204).send({
            status: "Warranty deleted successfully"
        });
    } catch (error) {
        if (error.code === 'P2025') {
            res.status(404).send({
                status: "Warranty not found",
                message: `No warranty found with ID ${id}`
            });
        } else {
            res.status(500).send({
                status: "Error",
                message: error.message
            });
        }
    }
}

export {
    handleGetAllWarranties,
    handleGetWarranty,
    handleUpdateWarranty,
    handleDeleteWarranty,
    handleCreateWarranty
}