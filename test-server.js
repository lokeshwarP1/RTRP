const http = require('http');

// Function to check if a server is running on a specific port
function checkServerRunning(port) {
  return new Promise((resolve) => {
    const req = http.get(`http://localhost:${port}`, (res) => {
      console.log(`Server is running on port ${port}. Status: ${res.statusCode}`);
      resolve(true);
    });
    
    req.on('error', (err) => {
      console.log(`Server is not accessible on port ${port}: ${err.message}`);
      resolve(false);
    });
    
    req.setTimeout(3000, () => {
      req.abort();
      console.log(`Request to port ${port} timed out`);
      resolve(false);
    });
  });
}

// Check multiple ports
async function checkPorts() {
  console.log('Checking if development server is accessible...');
  
  const ports = [3000, 5173, 3002];
  
  for (const port of ports) {
    const isRunning = await checkServerRunning(port);
    console.log(`Port ${port}: ${isRunning ? 'ACCESSIBLE' : 'NOT ACCESSIBLE'}`);
  }
}

checkPorts();
