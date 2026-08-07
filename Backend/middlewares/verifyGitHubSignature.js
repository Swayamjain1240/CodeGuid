import crypto from "crypto";

export const verifyGithubSig = (req, res, next) => {
    try {
        const sig = req.headers['x-hub-signature-256'];
        const secret = process.env.GITHUB_WEBHOOK_SECRET;

        if (!secret) {
            console.error("Missing GitHub signature in enviroment")
            return res.status(500).json({ error: 'Server security misconfiguration' });
        }

        if (!sig) {
            return res.status(401).json({ message: "Missing x-hub signature header" })
        }

        if (!req.rawBody) {
            return res.status(400).json({
                error: 'Raw request body not available. Ensure express.json({ verify: ... }) is configured.'
            });
        }


        const hmac = crypto.createHmac('sha256', secret);
        const digest = 'sha256=' + hmac.update(req.rawBody).digest('hex');

        const checksum = Buffer.from(sig, 'utf-8');
        const expectedChecksum = Buffer.from(digest, 'utf-8');

        if (
            checksum.length !== expectedChecksum.length ||
            !crypto.timingSafeEqual(checksum, expectedChecksum)
        ) {
            console.error('Webhook signature verification failed');
            return res.status(401).json({ error: 'Invalid webhook signature' });
        }

        console.log('Webhook signature verified successfully');
        next();

    } catch (error) {
        console.error('Signature Verification Error:', error.message);
        return res.status(500).json({ error: 'Internal server error during verification' });
    }
}