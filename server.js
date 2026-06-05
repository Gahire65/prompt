import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import connectDB from '../config/db.js';
import authRoutes from '../routes/authRoutes.js';
import carRoutes from '../routes/carRoutes.js';
import parkingSlotRoutes from '../routes/parkingSlotRoutes.js';
import parkingRecordRoutes from '../routes/parkingRecordRoutes.js';
import paymentRoutes from '../routes/paymentRoutes.js';

const app = express();
connectDB();

// Allow any origin during development (or add your specific ports)
app.use(cors({ origin: true, credentials: true }));

app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/cars', carRoutes);
app.use('/api/slots', parkingSlotRoutes);
app.use('/api/records', parkingRecordRoutes);
app.use('/api/payments', paymentRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server on port ${PORT}`));
