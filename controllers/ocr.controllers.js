import Tesseract from 'tesseract.js';
import {Jimp, JimpMime} from "jimp";
import OpenAI from "openai";

const openai = new OpenAI({apiKey: process.env.OPEN_AI_API_KEY});

function extractWarrantyData(text) {
    const warrantyData = {
        warrantyStart: null,
        warrantyEnd: null,
        warrantyCoverage: null,
        warrantyType: null,
        isBrandWarranty: null
    };

    const lines = text.toLowerCase().split('\n');
    const dateRegex = /\d{1,2}[/-]\d{1,2}[/-]\d{2,4}|\d{4}[/-]\d{1,2}[/-]\d{1,2}/;
    const coverageRegex = /(?:coverage|warranty coverage)\s*[:\s]?\s*([a-z\s,]+)/i;
    const typeRegex = /(?:type|warranty type)\s*[:\s]?\s*(limited|extended|full|basic)/i;
    const brandRegex = /(brand|manufacturer|official)\s*(warranty)/i;

    let foundStartDate = false;

    lines.forEach(line => {
        if (line.includes('start') || line.includes('begin') || line.includes('effective')) {
            const match = line.match(dateRegex);
            if (match) {
                warrantyData.warrantyStart = match[0];
                foundStartDate = true;
            }
        } else if (line.includes('end') || line.includes('expire') || line.includes('valid until')) {
            const match = line.match(dateRegex);
            if (match) {
                warrantyData.warrantyEnd = match[0];
            }
        } else if (!foundStartDate) {
            const match = line.match(dateRegex);
            if (match && !warrantyData.warrantyStart) {
                warrantyData.warrantyStart = match[0];
            }
        }

        let match = line.match(coverageRegex);
        if (match && match[1]) {
            warrantyData.warrantyCoverage = match[1].trim();
        } else if (line.includes('parts') || line.includes('labor') || line.includes('repair')) {
            warrantyData.warrantyCoverage = warrantyData.warrantyCoverage || line.trim();
        }

        match = line.match(typeRegex);
        if (match && match[1]) {
            warrantyData.warrantyType = match[1];
        }

        if (brandRegex.test(line)) {
            warrantyData.isBrandWarranty = true;
        } else if (line.includes('third party') || line.includes('extended by')) {
            warrantyData.isBrandWarranty = false;
        }
    });

    warrantyData.isBrandWarranty = warrantyData.isBrandWarranty !== false;
    return warrantyData;
}

function identifyProductTypeRegex(productName) {
    const patterns = [
        {type: "shirt", regex: /\b(shirt|tee|t-shirt|polo)\b/i},
        {type: "pants", regex: /\b(pants|trousers|jeans|leggings)\b/i},
        {type: "shoes", regex: /\b(shoe|sneaker|boot|sandal)\b/i},
        {type: "phone", regex: /\b(phone|smartphone|mobile|iphone|galaxy)\b/i},
        {type: "laptop", regex: /\b(laptop|notebook|macbook|chromebook)\b/i},
        {type: "ram", regex: /\b(ram|memory|ddr[3-5]|dimms?)\b/i},
        {type: "ssd", regex: /\b(ssd|solid[- ]state|nvme|m\.2|sata)\b/i},
    ];

    for (const {type, regex} of patterns) {
        if (regex.test(productName)) {
            return type;
        }
    }

    return null;
}

const extractBrand = (productName) => {
    if (!productName) return null;

    const brands = [
        "HP", "Dell", "Samsung", "Logitech", "Lenovo", "Sony", "Asus",
        "Acer", "MSI", "Apple", "Corsair", "Kingston", "Seagate", "Western Digital",
        "Intel", "AMD", "Crucial", "Sandisk", "Toshiba", "Gigabyte", "Zotac",
        "EVGA", "Razer", "NZXT", "Cooler Master", "HyperX", "TP-Link", "Netgear"
    ];

    const brandRegex = new RegExp(`\\b(${brands.join("|")})\\b`, "i");

    const match = productName.match(brandRegex);

    return match ? match[1] : null;
};

function extractInvoiceDetails(text) {
    const details = {};

    const productNameMatch = text.match(/\|\d+\s*\|(.+?)\s*\|\s*\d+pcs/i);
    // const productNameMatch = text.match(
    //     /(?:\d+\s+|\|\d+\s*\|)?\s*([A-Za-z0-9][A-Za-z0-9\s\-\(\).\/]*?(?=\s*(?:\d+pcs|\|\s*\d+pcs|\d+\s*pes|\s*\d+(?:[,.]\d+)?\s*(?:pcs|pes)?)))/i
    // );
    details.productName = productNameMatch ? productNameMatch[1].trim().split(" ").slice(0, 3).join(" ") : null;
    details.productType = identifyProductTypeRegex(productNameMatch ?? '');
    details.productBrand = extractBrand(productNameMatch !== null ? productNameMatch[1].trim() : '');

    const dateMatch = text.match(/(?:\d{1,2}[-\/]\d{1,2}[-\/]\d{2,4}|\d{4}[-\/]\d{1,2}[-\/]\d{1,2}|\d{1,2}[-\/\s](?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*[-\/\s]\d{2,4})/gi);
    details.purchaseDate = dateMatch ? dateMatch[0] : null;

    const sellerNameMatch = text.match(/ati Computers|Sati Computers/i);
    details.sellerName = sellerNameMatch ? sellerNameMatch[0] : null;

    const emailMatch = text.match(
        /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/i
    );
    details.sellerEmail = emailMatch ? emailMatch[0] : null;

    const contactMatch = text.match(/Mob:\s*-?(\d{10}(?:,\s*\d{10})?)/i);
    details.sellerContact = contactMatch ? contactMatch[1].split(',').map(num => num.trim()) : null;

    const gstIn = text.match(/GSTIN\/UIN:\s?([A-Z0-9]+)/);
    details.gstIn = gstIn[1];

    const addressMatch = text.match(
        /\b(?:complex|road|street|avenue|lane|block|sector|building|city|town|village|district)\b[\s\S]*?(?=\b(?:Mob:|Phone:|Contact:|Email:|GSTIN|Invoice)\b)/i
    );
    console.log(addressMatch);
    details.vendorAddress = addressMatch ? addressMatch[0].trim() : null;

    return details;
}

const handleText = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({error: 'No image provided'});
        }

        const image = await Jimp.read(req.file.buffer);

        await image
            .scale(0.5)
            .greyscale();

        const processedBuffer = await image.getBuffer(JimpMime.jpeg);

        const {data: {text}} = await Tesseract.recognize(
            processedBuffer,
            'eng',
            {
                tessedit_pageseg_mode: Tesseract.PSM.SINGLE_BLOCK,
                tessedit_ocr_engine_mode: Tesseract.OEM.LSTM_ONLY
            }
        );

        const warrantyText = extractWarrantyData(text);
        const invoiceDetails = extractInvoiceDetails(text);

        console.log("Warranty Data:", warrantyText);
        console.log("Invoice Details:", invoiceDetails);

        res.json({
            success: true,
            text,
            data: {
                warrantyText,
                invoiceDetails
            }
        });

    } catch (error) {
        res.status(500).json({
            error: 'Text extraction failed',
            details: error.message
        });
    }
}

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
                            text: "Extract product name, product type, product brand, date of purchase, seller name, seller address, seller contact, seller email, seller GSTIN, warranty start date (if not present make it equal to date of purchase), warranty end date, warranty period (if not present make it 1 (year)), is it a brand warranty, what does the warranty covers(if not present then write not specified) and return policy of vendor(if not present then write not specified)."
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
    handleText,
    handleAI,
}