const express = require('express');
const net = require('net');
const cors = require(`cors`)

const app = express();
const PORT = 5555;

// Middleware to parse JSON requests
app.use(express.json());
app.use(cors());

// Port scanning function
const scanPort = (host, port, timeout = 2000) => {
  return new Promise((resolve) => {
    const socket = new net.Socket();

    const onTimeout = () => {
      socket.destroy();
      resolve({ port, status: 'closed' });
    };

    const onError = () => {
      socket.destroy();
      resolve({ port, status: 'closed' });
    };

    const onConnect = () => {
      socket.destroy();
      resolve({ port, status: 'open' });
    };

    socket.setTimeout(timeout);
    socket.once('timeout', onTimeout);
    socket.once('error', onError);
    socket.connect(port, host, onConnect);
  });
};

// Port scanner endpoint
app.get('/scan', async (req, res) => {
  let { host, ports } = req.query;
    console.log("post method id called")
  
ports =  ports.split(',').map(Number)
console.log(host, ports, )
    console.log(!host, !ports, !Array.isArray(ports))

  if (!host || !ports || !Array.isArray(ports)) {
    return res.status(400).json({ error: 'Invalid input. Provide host and an array of ports.' });
  }

  const results = await Promise.all(ports.map((port) => scanPort(host, port)));

  res.json({ host, results });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
