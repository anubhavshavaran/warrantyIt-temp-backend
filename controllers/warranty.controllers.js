import {PrismaClient} from "@prisma/client";

const getWarrantyStatus = (endDateString) => {
    if (!endDateString) return 'ACTIVE';

    const today = new Date();
    const endDate = new Date(endDateString);

    today.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);

    const differenceInTime = endDate.getTime() - today.getTime();
    const differenceInDays = Math.ceil(differenceInTime / (1000 * 3600 * 24));

    if (differenceInDays < 0) {
        return 'EXPIRED';
    }
    if (differenceInDays >= 0 && differenceInDays <= 30) {
        return 'EXPIRING_SOON';
    }
    return 'ACTIVE';
};

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
        const warrantiesFromDb = await prisma.warranty.findMany({
            where: {
                userId: req.user.userId,
            },
            include: {
                product: {
                    include: {
                        brand: true,
                        category: true,
                        subCategory: true,
                    }
                }
            }
        });

        const warrantiesWithStatus = warrantiesFromDb.map(warranty => {
            const status = getWarrantyStatus(warranty.warrantyEnd);
            return {
                ...warranty,
                status: status,
            };
        });

        res.status(200).send({
            status: "Warranties fetched successfully",
            data: { warranties: warrantiesWithStatus }
        });
    } catch (error) {
        res.status(500).send({
            status: false,
            message: error.message
        });
    }
};

const handleGetWarranty = async (req, res) => {
    const { id } = req.params;

    try {
        const warranty = await prisma.warranty.findUnique({
            where: {
                warrantyId: id
            },
            include: {
                product: {
                    include: {
                        brand: true,
                        category: true,
                        subCategory: true,
                    }
                }
            }
        });

        warranty.status = getWarrantyStatus(warranty.warrantyEnd);

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