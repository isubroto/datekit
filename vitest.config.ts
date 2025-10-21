import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: ["node_modules/", "dist/", "tests/", "*.config.ts"],
    },
    // Show console.log output
    silent: false,
    // Run tests in sequence to see output clearly
    sequence: {
      shuffle: false,
    },
  },
});
