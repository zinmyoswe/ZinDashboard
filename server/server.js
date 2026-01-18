import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './configs/db.js';
import supplierRoutes from './routes/supplierRoutes.js';
import userRoutes from './routes/userRoutes.js';
import purchaseRoutes from './routes/purchaseRoutes.js';
import purchaseDetailRoutes from './routes/purchaseDetailRoutes.js';

const app = express();
const port = 3000;

await connectDB()

//Middleware
app.use(express.json())
app.use(cors())

//API Routes
app.use('/api/supplier', supplierRoutes);
app.use('/api/user', userRoutes);
app.use('/api/purchase', purchaseRoutes);
app.use('/api/purchaseDetail', purchaseDetailRoutes);
app.get('/', (req,res) => res.send('Zin POS Server is Live!'))

app.listen(port, ()=> console.log(`Server listening at http://localhost:${port}`));

