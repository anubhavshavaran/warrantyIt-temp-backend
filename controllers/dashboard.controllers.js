import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const handleUserDashboard = async (req, res) => {
    const { userId } = req.user;

    try {
        const allWarranties = await prisma.warranty.findMany({
            where: {
                userId: userId,
            },
            include: {
                product: {
                    include: {
                        category: true,
                    }
                },
            },
        });


        const claims = await prisma.claim.findMany({
            where: {
                userId: userId,
            },
        });

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const oneMonthFromNow = new Date();
        oneMonthFromNow.setMonth(oneMonthFromNow.getMonth() + 1);

        const categorizedWarranties = {
            inWarranty: [],
            expiringSoon: [],
            expired: [],
        };

        let totalDurationInDays = 0;
        let validWarrantyCount = 0;

        for (const warranty of allWarranties) {
            if (warranty.warrantyEnd) {
                const warrantyEndDate = new Date(warranty.warrantyEnd);
                if (warrantyEndDate < today) {
                    categorizedWarranties.expired.push(warranty);
                } else if (warrantyEndDate >= today && warrantyEndDate <= oneMonthFromNow) {
                    categorizedWarranties.expiringSoon.push(warranty);
                } else {
                    categorizedWarranties.inWarranty.push(warranty);
                }
            }

            if (warranty.warrantyStart && warranty.warrantyEnd) {
                const startDate = new Date(warranty.warrantyStart);
                const endDate = new Date(warranty.warrantyEnd);

                if (!isNaN(startDate.getTime()) && !isNaN(endDate.getTime())) {
                    const durationInMs = endDate.getTime() - startDate.getTime();
                    totalDurationInDays += durationInMs / (1000 * 60 * 60 * 24);
                    validWarrantyCount++;
                }
            }
        }

        const averageWarrantyDuration = validWarrantyCount > 0
            ? Math.round(totalDurationInDays / validWarrantyCount)
            : 0;

        const productsByCategory = {};
        for (const warranty of allWarranties) {
            if (warranty.product && warranty.product.category) {
                const categoryName = warranty.product.category.category;
                if (!productsByCategory[categoryName]) {
                    productsByCategory[categoryName] = [];
                }
                productsByCategory[categoryName].push(warranty.product);
            }
        }

        res.status(200).json({
            status: true,
            data: {
                warranties: categorizedWarranties,
                products: productsByCategory,
                averageWarrantyDurationInDays: averageWarrantyDuration,
                claims
            }
        });

    } catch (e) {
        console.error("Error in user dashboard:", e);
        res.status(500).json({
            status: false,
            message: "An error occurred while fetching dashboard data.",
            error: e.message,
        });
    }
};

export {
    handleUserDashboard,
};
