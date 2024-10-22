import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'node:path';

export default defineConfig(({ mode }) => {
    const projectName = 'CIB';
    const envDir = path.resolve(__dirname, `envs/${projectName}`);
    const env = loadEnv(mode, envDir);
    return {
        base: env.VITE_BASE_URL ?? './',  // 確保相對路徑正確
        plugins: [vue()],
        build: {
            outDir: 'dist/CIB',
        },
        resolve: {
            alias: {
                "@": "/src",
            },
        },
    };
});
