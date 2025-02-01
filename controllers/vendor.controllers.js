import {PrismaClient} from "@prisma/client";

const prisma = new PrismaClient();

const handleCreateVendor = async (req, res) => {
    try {
        const vendor = await prisma.vendor.create({
            data: {
                ...req.body
            }
        });

        res.status(200).send({
            status: "Vendor created successfully",
            data: {vendor}
        });
    } catch (error) {
        res.status(500).send({
            status: "Error",
            message: error.message
        });
    }
}

const handleGetAllVendors = async (req, res) => {
    try {
        const vendors = await prisma.vendor.findMany();

        res.status(200).send({
            status: "Vendors fetched successfully",
            data: {vendors}
        });
    } catch (error) {
        res.status(500).send({
            status: "Error",
            message: error.message
        });
    }
}

const handleGetVendor = async (req, res) => {
    const { id } = req.params;

    try {
        const vendor = await prisma.vendor.findUnique({
            where: {
                vendorId: id
            }
        });

        if (vendor) {
            res.status(200).send({
                status: "Vendor fetched successfully",
                data: {vendor}
            });
        } else {
            res.status(404).send({
                status: "Vendor not found",
                message: `No vendor found with ID ${id}`
            });
        }
    } catch (error) {
        res.status(500).send({
            status: "Error",
            message: error.message
        });
    }
}

const handleUpdateVendor = async (req, res) => {
    const { id } = req.params;
    const updatedData = req.body;

    try {
        const updatedVendor = await prisma.vendor.update({
            where: {
                vendorId: id
            },
            data: updatedData
        });

        res.status(200).send({
            status: "Vendor updated successfully",
            data: {updatedVendor}
        });
    } catch (error) {
        if (error.code === 'P2025') {
            res.status(404).send({
                status: "Vendor not found",
                message: `No vendor found with ID ${id}`
            });
        } else {
            res.status(500).send({
                status: "Error",
                message: error.message
            });
        }
    }
}

const handleDeleteVendor = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedVendor = await prisma.vendor.delete({
            where: {
                vendorId: id
            }
        });

        res.status(204).send({
            status: "Vendor deleted successfully"
        });
    } catch (error) {
        if (error.code === 'P2025') {
            res.status(404).send({
                status: "Vendor not found",
                message: `No vendor found with ID ${id}`
            });
        } else {
            res.status(500).send({
                status: "Error",
                message: error.message
            });
        }
    }
}

const handleSearchVendors = async (req, res) => {
    const {q} = req.params;
    const vendors = await prisma.vendor.findMany({
        where: {
            vendorName: {
                contains: q,
                mode: "insensitive",
            },
        },
    });

    res.status(200).json({
        status: 'Vendors fetched successfully',
        data: {
            vendors
        }
    });
}

export {
    handleGetAllVendors,
    handleGetVendor,
    handleUpdateVendor,
    handleDeleteVendor,
    handleCreateVendor,
    handleSearchVendors,
}