import Tesseract from 'tesseract.js';
import {Jimp, JimpMime} from "jimp";

const handleText = async (req, res) => {
    console.log(req.file)
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No image provided' });
        }

        const image = await Jimp.read(req.file.buffer);

        await image
            .scale(0.5)
            .greyscale();

        const processedBuffer = await image.getBuffer(JimpMime.jpeg);

        const { data: { text } } = await Tesseract.recognize(
            processedBuffer,
            'eng',
            {
                tessedit_pageseg_mode: Tesseract.PSM.SINGLE_BLOCK,
                tessedit_ocr_engine_mode: Tesseract.OEM.LSTM_ONLY
            }
        );

        res.json({
            text: text,
            success: true
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