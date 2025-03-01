function generateOTP(length = 6) {
    const chars = '0123456789';

    if (!Number.isInteger(length) || length < 1) {
        throw new Error('Length must be a positive integer');
    }

    let otp = '';
    for (let j = 0; j < length; j++) {
        const randomIndex = Math.floor(Math.random() * chars.length);
        otp += chars[randomIndex];
    }

    return otp;
}

export { generateOTP };