import { defineConfig, devices } from "@playwright/test";

// The E2E dev server binds strictly to its own port. Vite's default 5173 is
// shared with other local projects (including Docker port-forwards), and
// Playwright cannot tell a foreign server from ours, so it must never reuse one.
const port = Number(process.env.E2E_PORT ?? 5199);
const baseURL = `http://localhost:${port}`;

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
  use: {
    baseURL,
    trace: "on-first-retry",
    locale: "ja-JP",
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],

  webServer: {
    command: `bun run dev --port ${port} --strictPort`,
    url: baseURL,
    reuseExistingServer: false,
  },
});
