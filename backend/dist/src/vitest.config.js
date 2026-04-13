import { defineConfig } from "vitest/config";
export default defineConfig({
    test: {
        globals: true, // Use describe/it/expect without imports
        environment: "node", // We're testing Node.js, not browser
    },
});
