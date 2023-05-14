const mongoose = require('mongoose');
//url local : mongodb://localhost:27017/gl-b-23
mongoose.connect('mongodb+srv://user:user123@cluster0.hwebykz.mongodb.net/?retryWrites=true&w=majority',{
    useUnifiedTopology: true,
    useNewUrlParser: true,
    autoIndex: true, //make this also true
})
.then(()=>console.log('MongoDB is connected'))
.catch(err=>console.error('MongoDB not connected, error : ',err));