/**
 * local server entry file, for local development
 */
import app from './app.js';
import { createServer } from 'http'
import { initSocket } from './socket.js'

/**
 * start server with port
 */
const PORT = process.env.PORT || 5410;

const httpServer = createServer(app)
const io = initSocket(httpServer)

const server = httpServer.listen(PORT, () => {
  console.log(`Server ready on port ${PORT}`);
});

/**
 * close server
 */
const shutdown = () => {
  console.log('Shutting down server...');
  io.close(() => {
    console.log('Socket.io closed');
    server.close(() => {
      console.log('HTTP server closed');
      process.exit(0);
    });
  });

  // Force exit after 3 seconds
  setTimeout(() => {
    console.error('Forcing shutdown after 3 seconds');
    process.exit(1);
  }, 3000);
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

export default app;
