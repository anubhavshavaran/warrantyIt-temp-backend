import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const handleGetAllClaims = async (req, res) => {
    const { userId } = req.user;

    try {
        const claims = await prisma.claim.findMany({
            where: {
                userId
            },
            include: {
                warranty: {
                    include: {
                        product: true,
                    }
                }
            }
        });

        res.status(200).json({
            status: true,
            data: { claims }
        })
    } catch (error) {
        console.error("Error fetching claims:", error);
        res.status(500).json({ message: "Failed to retrieve claims.", error: error.message });
    }
};

const handleGetClaimById = async (req, res) => {
    const { id } = req.query;

    try {
        const claim = await prisma.claim.findUnique({
            where: { claimId: id },
            include: {
                warranty: {
                    include: {
                        product: true,
                    }
                }
            },
        });

        if (!claim) {
            return res.status(404).json({ message: "Claim not found." });
        }

        res.status(200).json({
            status: true,
            data: { claim }
        })
    } catch (error) {
        console.error(`Error fetching claim ${id}:`, error);
        res.status(500).json({ message: "Failed to retrieve claim.", error: error.message });
    }
};

const handleCreateClaim = async (req, res) => {
    const { userId } = req.user;
    const { warrantyId, claimIssue, claimImageUrl, serviceDate, serviceTime, claimAddress } = req.body;

    if (!warrantyId || !claimIssue || !serviceDate || !serviceTime || !claimAddress) {
        return res.status(400).send({
            status: "Error",
            message: "Missing required claim details."
        });
    }

    try {
        const newClaim = await prisma.$transaction(async (tx) => {
            const claim = await tx.claim.create({
                data: {
                    userId,
                    warrantyId,
                    claimIssue,
                    claimImageUrl,
                    serviceDate,
                    serviceTime,
                    claimAddress,
                }
            });

            await tx.claimStatusHistory.create({
                data: {
                    claimId: claim.claimId,
                    status: 'SUBMITTED',
                }
            });

            return claim;
        });

        res.status(201).send({
            status: "Claim created successfully",
            data: { claim: newClaim }
        });
    } catch (error) {
        console.error("Error creating claim:", error);
        res.status(500).send({
            status: "Error",
            message: error.message || "An internal server error occurred."
        });
    }
};

const handleUpdateClaimStatus = async (req, res) => {
    const { claimId } = req.params;
    const { newStatus } = req.body;

    if (!newStatus) {
        return res.status(400).send({
            status: "Error",
            message: "A new status must be provided."
        });
    }

    try {
        const updatedClaim = await prisma.$transaction(async (tx) => {
            const claim = await tx.claim.update({
                where: { claimId },
                data: {
                    currentStatus: newStatus,
                }
            });

            await tx.claimStatusHistory.create({
                data: {
                    claimId: claim.claimId,
                    status: newStatus,
                }
            });

            return claim;
        });

        res.status(200).send({
            status: "Claim status updated successfully",
            data: { claim: updatedClaim }
        });

    } catch (error) {
        console.error("Error updating claim status:", error);
        if (error.code === 'P2025') {
            return res.status(404).send({
                status: "Error",
                message: `Claim with ID ${claimId} not found.`
            });
        }
        res.status(500).send({
            status: "Error",
            message: error.message || "An internal server error occurred."
        });
    }
};

const handleUpdateClaim = async (req, res) => {
    const { id } = req.query;
    const updateData = req.body;

    try {
        const updatedClaim = await prisma.claim.update({
            where: { claimId: id },
            data: updateData,
        });
        res.status(200).json({
            status: true,
            message: "Claim updated successfully",
            data: { updatedClaim }
        });
    } catch (error) {
        console.error(`Error updating claim ${id}:`, error);
        if (error.code === 'P2025') {
            return res.status(404).json({ message: `Claim with ID '${id}' not found.` });
        }
        res.status(500).json({ message: "Failed to update claim.", error: error.message });
    }
};

const handleDeleteClaim = async (req, res) => {
    const { id } = req.query;

    try {
        await prisma.claim.delete({
            where: { claimId: id },
        });
        res.status(204).send();
    } catch (error) {
        console.error(`Error deleting claim ${id}:`, error);
        if (error.code === 'P2025') {
            return res.status(404).json({ message: `Claim with ID '${id}' not found.` });
        }
        res.status(500).json({ message: "Failed to delete claim.", error: error.message });
    }
};

export {
    handleGetAllClaims,
    handleGetClaimById,
    handleCreateClaim,
    handleUpdateClaim,
    handleDeleteClaim,
    handleUpdateClaimStatus,
};
