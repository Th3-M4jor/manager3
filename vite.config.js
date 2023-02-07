import { defineConfig } from "vite"
import { compression } from "vite-plugin-compression2"

export default defineConfig(({ command }) => {
    if (command == "serve") {
        return {
            server: {
                port: 9001,
                cors: true,
            }
        }
    }

    // else is production build
    return {
        build: {
            target: "esnext",
            modulePreload: false,
            cssCodeSplit: false,
            assetsDir: "./",
            sourcemap: true,
        },
        esbuild: {
            drop: ["console", "debugger"],
            treeShaking: true
        },
        plugins: [
            compression({ exclude: [/\.(webp)$/], threshold: 1024, compressionOptions: { level: 9 } }),
            compression({ algorithm: "brotliCompress", exclude: [/\.(br)$/, /\.(gz)$/, /\.(webp)$/], threshold: 1024 })
        ],
        preview: {
            port: 9001,
            cors: true,
        }
    }
})