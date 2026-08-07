export const requestLogger = (req, res, next) => {
    const start = Date.now();

    res.on("finish", () => {
        const duration = Date.now() - start;
        const statusCode = res.statusCode;

        let logSymbol = 'ℹ️';
        if (statusCode >= 500) logSymbol = '💥';
        else if (statusCode >= 400) logSymbol = '⚠️';
        else if (statusCode >= 300) logSymbol = '🔀';
        else if (statusCode >= 200) logSymbol = '✅';

        console.log(
            `${logSymbol} [${req.method}] ${req.originalUrl} - ${statusCode} (${duration}ms)`
        );
    })
    next();
};