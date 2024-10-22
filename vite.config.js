import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
    base: './',  // 確保相對路徑正確
    plugins: [vue()],
    build: {
        outDir: 'dist',
    }
});
