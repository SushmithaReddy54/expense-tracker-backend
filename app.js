const express = require('express')
const cors = require('cors');
const { db } = require('./db/db');
const app = express();

require('dotenv').config();

const PORT = process.env.PORT;
//middlewares
app.use(cors())

require('./models/ExpenseModel')
require('./models/IncomeModel')
require('./models/users')
require('./controllers/sendMail')
app.use(express.json())

//routes
// readdirSync('./routes').map((route) => app.use('/api/v1', require('./routes/' + route)));
app.use(require('./routes/transactions'))
app.use(require('./routes/auth'))

const server = () => {
    db()
    app.listen(PORT, () => {
        console.log('listening to port:', PORT)
    })
}

server()