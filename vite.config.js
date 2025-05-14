import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import IconsResolver from 'unplugin-icons/resolver'
import Icons from 'unplugin-icons/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

const timestamp = new Date().getTime().toString().slice(0, 8)
const isDev = process.env.NODE_ENV !== 'production'

export default defineConfig({
    plugins: [
        vue(),
        AutoImport({
            resolvers: [
                ElementPlusResolver(), // 自动导入图标组件
            ],
        }),
        Components({
            resolvers: [
                ElementPlusResolver(), IconsResolver({
                    enabledCollections: ['ep'],
                })
            ]
        }),
        Icons({
            autoInstall: true,
        })
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src')
        },
        extensions: ['.js', '.vue']
    },
    server: {
        port: 80,
        open: false,
        cors: true,
        proxy: {
            '/magic': {
                target: 'http://localhost:8081/',
                ws: true,
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/magic/, '/magic')
            }
        }
    },
    build: {
        sourcemap: false,
        rollupOptions: {
            output: {
                entryFileNames: isDev ? 'js/[name].js' : `js/[name]-[hash:8].${timestamp}.js`,
                chunkFileNames: isDev ? 'js/[name].js' : `js/magic-[hash:8].${timestamp}.js`,
                assetFileNames: ({
                    name
                }) => {
                    if (/\.(css)$/.test(name)) {
                        return isDev ? 'css/[name].[ext]' : `css/magic-[hash:8].${timestamp}.[ext]`
                    }
                    if ([".jpg", ".png", ".gif", ".webp"].some((ext) => name.endsWith(ext))) {
                        return isDev ? 'img/[name].[ext]' : `img/[name]-[hash:8].${timestamp}.[ext]`
                    }
                    return '[name].[ext]'
                }
            }
        }
    }
})
