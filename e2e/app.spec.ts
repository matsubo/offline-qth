import { expect, test } from "@playwright/test";

test.describe("オフラインQTH アプリケーション", () => {
  test.beforeEach(async ({ page, context }) => {
    await context.grantPermissions(["geolocation"]);
    await context.setGeolocation({ latitude: 35.6895, longitude: 139.6917 });
    await page.goto("/");
  });

  test("ページタイトルが正しく表示される", async ({ page }) => {
    await expect(page).toHaveTitle(/オフラインQTH/);
    await expect(page.locator("h1")).toContainText("OFFLINE QTH");
  });

  test("位置情報が取得ボタンで取得される", async ({ page }) => {
    // 初期状態はreadyメッセージ
    await expect(page.getByText("位置情報を取得してください")).toBeVisible();

    // 取得ボタンをクリック
    await page.getByRole("button", { name: "位置情報を取得" }).click();

    // 位置情報が取得されるまで待機
    await expect(page.getByText("位置情報を取得しました")).toBeVisible({
      timeout: 15000,
    });

    // 緯度・経度が表示されることを確認
    await expect(page.getByText("緯度")).toBeVisible();
    await expect(page.getByText("経度")).toBeVisible();
  });

  test("グリッドロケーターが表示される", async ({ page }) => {
    // 取得ボタンをクリック
    await page.getByRole("button", { name: "位置情報を取得" }).click();

    await expect(page.getByText("位置情報を取得しました")).toBeVisible({
      timeout: 15000,
    });

    await expect(page.getByText("グリッドロケーター")).toBeVisible();
  });

  test("再取得ボタンが機能する", async ({ page }) => {
    // 最初の取得
    await page.getByRole("button", { name: "位置情報を取得" }).click();
    await expect(page.getByText("位置情報を取得しました")).toBeVisible({
      timeout: 15000,
    });

    // 再取得
    await page.getByRole("button", { name: "位置情報を取得" }).click();
    await expect(page.getByText("位置情報を取得しました")).toBeVisible({
      timeout: 15000,
    });
  });

  test("オンライン状態が表示される", async ({ page }) => {
    await expect(page.getByText("オンライン")).toBeVisible();
  });

  test("必要な情報がすべて表示される", async ({ page }) => {
    await page.getByRole("button", { name: "位置情報を取得" }).click();
    await expect(page.getByText("位置情報を取得しました")).toBeVisible({
      timeout: 15000,
    });

    await expect(page.getByText("緯度")).toBeVisible();
    await expect(page.getByText("経度")).toBeVisible();
    await expect(page.getByText("標高")).toBeVisible();
    await expect(page.getByText("都道府県")).toBeVisible();
    await expect(page.getByText("市区町村")).toBeVisible();
    await expect(page.getByText("グリッドロケーター")).toBeVisible();
    await expect(page.getByText("JCC", { exact: true })).toBeVisible();
    await expect(page.getByText("JCG", { exact: true })).toBeVisible();
  });

  test("フッターにリンクが表示される", async ({ page }) => {
    await expect(page.locator('a:has-text("JE1WFV")')).toBeVisible();
    await expect(page.locator('a:has-text("JE1WFV")')).toHaveAttribute(
      "href",
      "https://x.com/je1wfv",
    );

    const githubLink = page.locator('a:has-text("GitHub")').first();
    await expect(githubLink).toBeVisible();
    await expect(githubLink).toHaveAttribute("href", "https://github.com/matsubo/offline-qth");
  });
});
