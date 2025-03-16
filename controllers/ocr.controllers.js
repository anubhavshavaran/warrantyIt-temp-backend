import Tesseract from 'tesseract.js';
import {Jimp, JimpMime} from "jimp";

function extractWarrantyData(text) {
    const warrantyData = {
        warrantyStart: null,
        warrantyEnd: null,
        warrantyCoverage: null,
        warrantyType: null,
        // serialNumber: null,
        isBrandWarranty: null
    };

    const lines = text.toLowerCase().split('\n');
    const dateRegex = /\d{1,2}[/-]\d{1,2}[/-]\d{2,4}|\d{4}[/-]\d{1,2}[/-]\d{1,2}/;
    // const serialRegex = /(?:serial|sn|s\/n|serial number)\s*[:#-]?\s*([a-z0-9-]+)/i;
    // const serialRegex = /^(?:\d{4}-\d{4}-\d{5}|[a-z0-9 _-]+)$/i;
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

        // if (line.includes('serial number') || line.includes('serial') || line.includes('sn')) {
        //     console.log('serial')
        //     let match = line.match(serialRegex);
        //     console.log(match)
        //     if (match && match[1]) {
        //         warrantyData.serialNumber = match[1].trim();
        //     }
        // }

        let match = line.match(coverageRegex);
        if (match && match[1]) {
            console.log(match)
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

const handleText = async (req, res) => {
    console.log(req.file)
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
        console.log(warrantyText);

        res.json({
            success: true,
            data: {
                warrantyText
            }
        });

    } catch (error) {
        console.error('OCR Error:', error);
        res.status(500).json({
            error: 'Text extraction failed',
            details: error.message
        });
    }
}

export {
    handleText,
}