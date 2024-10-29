import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "node:path";
import electron from "vite-plugin-electron/simple";
import fs from "node:fs";
import pkg from "./package.json";

export default defineConfig(({ mode }) => {
  fs.rmSync("dist/CIB/electron", { recursive: true, force: true });

  const isDev = mode === "development";
  const isBuild = mode === "production_aws";

  const projectName = "CIB";
  const envDir = path.resolve(__dirname, `envs/${projectName}`);
  const env = loadEnv(mode, envDir);
  return {
    base: env.VITE_BASE_URL ?? "./", // 確保相對路徑正確
    build: {
      outDir: "dist/CIB/renderer",
    },
    plugins: [
      vue(),
      electron({
        main: {
          entry: ["src/electron-main.ts", "src/server.ts"],
          vite: {
            build: {
              sourcemap: isDev,
              minify: isBuild,
              outDir: "dist/CIB/electron",
              rollupOptions: {
                external: Object.keys(pkg.dependencies ?? {}),
              },
            },
          },
        },
      }),
    ],
    resolve: {
      alias: {
        "@": "/src",
      },
    },
    clearScreen: false,
  };
});
