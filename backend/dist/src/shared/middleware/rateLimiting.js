const clients = new Map();
// Fixed Window Algorithm
export default function RateLimiter(options) {
    return (req, res, next) => {
        const now = Date.now();
        const IP = String(req.ip);
        const clientData = clients.get(IP);
        if (!clientData) {
            clients.set(IP, { count: 1, firstRequest: now });
        }
        else {
            if (now > clientData.firstRequest + options.windowSize) {
                clients.set(IP, { count: 1, firstRequest: now });
            }
            else {
                clientData.count++;
            }
        }
        const current = clients.get(IP);
        if (current.count > options.max) {
            return res.status(429).json({ message: options.message });
        }
        return next();
    };
}
