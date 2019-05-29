const express = require('express');
const bodyParser = require('body-parser');
const googleSheets = require('gsa-sheets');

const key = require('./privateSettings.json');

// TODO(you): Change the value of this string to the spreadsheet id for your
// GSA spreadsheet. See HW5 spec for more information.
const SPREADSHEET_ID = '1RfW0DpH0MHPSJd8SQYfnBUOaoXIpyZyjF_57d0RlTEY';

const app = express();
const jsonParser = bodyParser.json();
const sheet = googleSheets(key.client_email, key.private_key, SPREADSHEET_ID);

app.use(express.static('public'));

async function onGet(req, res) {
  const result = await sheet.getRows();
  const rows = result.rows;
  console.log(rows);

  // TODO(you): Finish onGet.
  const data = [];
  const props = rows[0].map(prop => {
    return prop;
  });

  for (let i = 1; i < rows.length; i += 1) {
    const obj = {};
    for (let j = 0; j < props.length; j += 1) {
      obj[`${props[j]}`] = rows[i][j];
    }
    data.push(obj);
  }

  res.json(data);
}
app.get('/api', onGet);

async function onPost(req, res) {
  const messageBody = req.body;

  // TODO(you): Implement onPost.
  const result = await sheet.getRows();
  const rows = result.rows;
  const props = rows[0].map(prop => {
    return prop;
  });
  const value = [];

  for (let i = 0; i < props.length; i += 1) {
    value.push(messageBody[`${props[i]}`]);
  }
  sheet.appendRow(value);
  res.json({ "response": "success" });
}
app.post('/api', jsonParser, onPost);

async function onPatch(req, res) {
  const column  = req.params.column;
  const value  = req.params.value;
  const messageBody = req.body;

  // TODO(you): Implement onPatch.

  res.json( { status: 'unimplemented'} );
}
app.patch('/api/:column/:value', jsonParser, onPatch);

async function onDelete(req, res) {
  const column  = req.params.column;
  const value  = req.params.value;

  // TODO(you): Implement onDelete.
  const result = await sheet.getRows();
  const rows = result.rows;
  const propIndex = rows[0].findIndex(prop => {
    return prop === column;
  });
  let deleteIndex = -1;

  for (let i = 1; i < rows.length; i += 1) {
    if (rows[i][propIndex] === value) {
      deleteIndex = i;
      break;
    }
  }

  sheet.deleteRow(deleteIndex);

  res.json({ "response": "success" });
}
app.delete('/api/:column/:value',  onDelete);


// Please don't change this; this is needed to deploy on Heroku.
const port = process.env.PORT || 3000;

app.listen(port, function () {
  console.log(`CS193X: Server listening on port ${port}!`);
});
