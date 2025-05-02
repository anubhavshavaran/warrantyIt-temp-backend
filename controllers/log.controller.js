import {PrismaClient} from "@prisma/client";

const prisma = new PrismaClient();

const createLog = async (req, res) => {
    try {
        const { userId } = req.user;
        const { message, stack, location } = req.body;

        if (!message || !stack) {
            return  res.status(401).send({
                status: false,
                message: 'Message and stack is required',
            });
        }

        const log = await prisma.log.create({
            data: {
                userId: userId,
                message: message,
                stack: stack,
                location: location,
            }
        });

        res.status(200).send({
            status: true,
            data: {
                log
            }
        });
    } catch (e) {
        console.error(e);
        res.status(500).send({
            status: false,
            message: 'Something went wrong',
        });
    }
}

const getAllLogs = async (req, res) => {
    try {
        const logs = await prisma.log.findMany();

        res.status(200).send({
            status: true,
            data: {
                logs
            }
        });
    } catch (e) {
        console.error(e);
        res.status(500).send({
            status: false,
            message: 'Something went wrong',
        });
    }
}

export {
    createLog,
    getAllLogs,
}