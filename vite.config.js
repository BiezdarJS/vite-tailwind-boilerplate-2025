import fs from "fs"
import handlebars from 'vite-plugin-handlebars';
import removeConsole from 'vite-plugin-remove-console';
import tailwindcss from "@tailwindcss/vite";
import {
    resolve
} from 'path';

const hbsDir = resolve(__dirname, "app/partials");

export default {
    base: './',
    root: "./app",
    plugins: [
        tailwindcss(),
        handlebars({
            partialDirectory: resolve(__dirname, 'app/partials'),
        }),
        removeConsole(),
        {
            name: "handlebars-hot-reload",
            configureServer(server) {
                const partialsDir = resolve(__dirname, "app/partials");

                fs.watch(partialsDir, { recursive: true }, () => {
                    console.log("Handlebars file changed. Reloading...");
                    server.ws.send({ type: "full-reload" });
                });
            },
        },
    ],
    resolve: {
        alias: {
            '@img': resolve(__dirname, 'app/img'), // <-- Add this alias
        },
    },
    build: {
        outDir: resolve(__dirname, 'dist'),
        emptyOutDir: true,
        rollupOptions: {
            input: {
                ...fs.readdirSync("./app").filter(file => file.includes('.html')).reduce((ac, cv) => (ac[cv.split('.html')[0]] = resolve(__dirname, 'app/' + cv), ac), {}),
            }
        }
    },
    publicDir: '../public',
    server: {
        watch: {
            usePolling: true, // Ensures changes in files are picked up
            interval: 100, // Adjust polling interval if needed
        },
    },
};