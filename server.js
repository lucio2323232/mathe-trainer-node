const express = require('express');
const fs = require('fs');
const app = express();
const PORT = 3000;

app.use(express.json());

let data = {
  users: [],
  visitorCount: 0
};

if (fs.existsSync('data.json')) {
  data = JSON.parse(fs.readFileSync('data.json'));
}

app.get('/', (req, res) => {
  data.visitorCount++;
  fs.writeFileSync('data.json', JSON.stringify(data));
  res.send(`Willkommen! Besucherzähler: ${data.visitorCount}`);
});

app.post('/register', (req, res) => {
  const { username, password } = req.body;
  if (data.users.find(u => u.username === username)) {
    return res.status(400).send('Benutzer existiert bereits.');
  }
  data.users.push({ username, password });
  fs.writeFileSync('data.json', JSON.stringify(data));
  res.send('Benutzer registriert!');
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = data.users.find(u => u.username === username && u.password === password);
  if (user) {
    res.send('Login erfolgreich!');
  } else {
    res.status(401).send('Login fehlgeschlagen.');
  }
});

app.listen(PORT, () => {
  console.log(`Server läuft auf http://localhost:${PORT}`);
});
