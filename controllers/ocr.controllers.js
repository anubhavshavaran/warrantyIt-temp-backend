import {Jimp, JimpMime} from "jimp";
import OpenAI from "openai";
const openai = new OpenAI({apiKey: process.env.OPEN_AI_API_KEY});

const handleAI = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({error: 'No image provided'});
        }

        const image = await Jimp.read(req.file.buffer);

        await image
            .scale(0.1)
            .greyscale();

        const processedBuffer = await image.getBuffer(JimpMime.jpeg);
        const base64Image = Buffer.from(processedBuffer).toString('base64');

        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: "You are an assistant that extracts product and warranty details from invoices. Return the data as a **valid JSON object** with no extra characters, no backticks, no 'json' tags, and no text before or after the JSON. Only return the pure JSON object."
                },
                {
                    role: "user",
                    content: [
                        {
                            type: "text",
                            text: "Extract product name, product type, product brand, serial number (which is the invoice number in the bill), date of purchase, seller name, seller address, seller contact, seller email, seller GSTIN, warranty start date (if not present make it equal to date of purchase), warranty end date, warranty period (if not present make it 1 (year)), is it a brand warranty, what does the warranty covers(if not present then write not specified) and return policy of vendor(if not present then write not specified)."
                        },
                        {
                            type: "image_url",
                            image_url: {
                                url: `data:image/jpeg;base64,${base64Image}`,
                            },
                        }
                    ],
                }
            ]
        });

        console.log(completion)

        const jsonString = completion.choices[0].message.content;
        const cleanString = JSON.parse(jsonString.replace(/\\n/g, '').replace(/\\+/g, '').trim());

        res.status(200).json({
            success: true,
            data: cleanString,
        });
    } catch (error) {
        res.status(500).json({
            error: 'Text extraction failed',
            details: error.message
        });
    }
}

export {
    handleAI,
}