import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

//export default defineConfig({
//  plugins: [react()],
//  server: {
//    host: true,              // 等同 0.0.0.0
//    port: 5173,
//    strictPort: true,
//    // HMR：在 Docker 下常卡住，補上 clientPort（宿主機看到的埠）
//    hmr: {
//      clientPort: 5173,
//      // 如果仍有問題，可加上：
//      // host: 'localhost',   // 或改成你的宿主機 IP/域名
//      host: "172.20.1.16",
//      // protocol: 'ws'
//    },
//    proxy: {
//      // 如果你的後端跑在宿主機的 3001
//      //'/api': 'http://host.docker.internal:3001'
//      // Linux 上沒有 host.docker.internal 時，改成宿主機的實際 IP
//      '/api': 'http://172.20.1.16:3001'
//    }
//  }
//})


export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0",
    proxy: {
      '/api': 'http://localhost:3001'
    }
  }
})

