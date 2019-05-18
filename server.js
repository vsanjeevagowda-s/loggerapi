const express = require('express');
const mongoose = require('mongoose');
const hmve = require('hmve');
const { Schema } = mongoose;
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cors());
app.options('*', cors());

const port = process.env.PORT || 3001;
const router = express.Router();

const recordSchema = new Schema({
  date: {
    type: String,
    unique: true,
    required: true,
  },
  description: String,
});
recordSchema.set('toJSON', { virtuals: true });
const Record = mongoose.model('Record', recordSchema);

mongoose.Promise = global.Promise;
require('dotenv').config();
const DATABASE_URL = process.env.DATABASE_URL;
mongoose.connect(DATABASE_URL, {
  useCreateIndex: true,
  useNewUrlParser: true,
});

app.use('/api', router);

router.get('/', (req, res) => {
  res.json({ data: "Welcome" });
});

router.post('/records/create', async (req, res) => {
  try {
    const { date, description } = req.body;
    const resp = await Record.create({ date, description });
    return res.status(201).json({ success: true, resp });
  } catch (error) {
    return res.status(422).json({ success: false, error: hmve(Record, error).message });
  }
});

router.get('/records/list', async (req, res) => {
  try {
    const resp = await Record.find({}).sort([['date', -1]]);
    return res.status(200).json({ success: true, resp });
  } catch (error) {
    return res.status(422).json({ success: false, error: hmve(Record, error).message });
  }
});

app.listen(port);
console.log('Server started at: localhost:' + port);
