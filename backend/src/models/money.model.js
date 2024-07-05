import mongoose from 'mongoose';
import User from './user.model.js';


const moneySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    
    amount:{
        type: Decimal128,
        required: true
    }
});

export default Money = mongoose.Schema("Money", moneySchema)