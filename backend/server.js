const http = require('http');
const app = require('./app');
require('dotenv').config;

const normalizePort = val => {
    const port = parseInt(val, 10);

    if(isNaN(port)) return val;
    if(port >= 0) return port;
    
    return false;
};

const port = normalizePort(process.env.PORT || 3000);

app.set('port', port);

//*** the errorHandler function checks for various errors and handles them appropriately ***/
const errorHandler = error => {
    //*** if the server hears nothing on the call ***/
    if (error.syscall !== 'listen') {
        throw error;
    };
    const address = server.address();
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
    switch (error.code) {
        //*** permission denied ***/
        case 'EACCES':
        console.error(bind + ' requires elevated privileges.');
        process.exit(1);
        break;

        //*** address is  allready use ***/
        case 'EADDRINUSE':
        console.error(bind + ' is already in use.');
        process.exit(1);
        break;
        
        default:
        throw error;
    };
};

const server = http.createServer(app);

server.on('error', errorHandler);
server.on('listening', () => {
    const address= server.address();
    const bind = typeof address === 'string' ? 'pipe' + address : 'port: ' + port;
    console.log(`Listening on ${bind}`);
});

server.listen(port);