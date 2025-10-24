import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import { globSync } from "glob";

const __dirname = dirname(fileURLToPath(import.meta.url));
const BASE_PATH = process.env.VITE_BASE_PATH || "/";

function getHTMLPages() {
    const htmlFiles = globSync("**/*.html", {
        ignore: ["node_modules/**", "dist/**", "dist-ssr/**", ".vscode/**"],
    });
    const input = {};

    htmlFiles.forEach((file) => {
        let name;

        if (file == "index.html") name = "main";
        else name = file.replace(/\.html$/, "");

        input[name] = resolve(__dirname, file);
    });

    return input;
}

export default defineConfig({
    base: BASE_PATH,
    build: {
        rollupOptions: {
            input: getHTMLPages(),
        },
    },
});
