import express, { type Application } from 'express';
import { handleAuthCallback } from './Controllers/authController.js';
import { initializeBitrixService } from './Auth/initializeBitrixService.js';
import { logger } from './Utils/logger.js';
import { setupRoutes } from './route.js';
import cors from 'cors';

const app: Application = express();
const PORT: number | string = process.env.PORT || 3000;

const allowedOrigins = [
    "https://calc-frontend.premierchoiceint.online",
    "https://bitrix24calculatorv2.premierchoiceint.online",
];

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    credentials: true
}));

app.get('/', handleAuthCallback);


app.use(express.json());

setupRoutes(app);


app.listen(PORT, async () => {
    logger.info(`Server is running on port ${PORT}`);
    await initializeBitrixService();
});


