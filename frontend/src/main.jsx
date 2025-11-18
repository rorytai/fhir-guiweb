import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'   // ← 一定要有這行，否則 Tailwind 不會生效

createRoot(document.getElementById('root')).render(<App />)

