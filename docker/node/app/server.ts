import { createApp } from './app';
import { Server } from 'http';

const PORT: number = 3000;

export const listenApp = async (): Promise<void> => {
    try {
        const app = await createApp(); // Express instance

        const server: Server = app.listen(PORT, () => {
            console.log(`✅ Server is running at http://localhost:${PORT}`);
        });

        // Safe shutdown upon receiving SIGINT or SIGTERM (e.g., docker stop, Ctrl+C)
        process.on('SIGINT', () => shutdown(server, 'SIGINT'));
        process.on('SIGTERM', () => shutdown(server, 'SIGTERM'));

    } catch (error) {
        console.error("❌ Error starting the server: ", error);
        process.exit(1); // Terminate the process with an error code
    }
};

const shutdown = (server: Server, signal: string) => {
    console.log(`\n🔴 Signal ${signal} received, shutting down the server...`);
    server.close(() => {
        console.log('✅ Server successfully shut down.');
        process.exit(0);
    });
};