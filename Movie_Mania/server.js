import express from 'express'
import cors from 'cors'
import reviews from "./api/reviews.route.js"

console.log('🌟 Loading server.js...')

const app = express()

app.use((req, res, next) => {
    console.log(`📨 REQUEST: ${req.method} ${req.url}`)
    next()
})

app.use(cors())
app.use(express.json())

// Test route
app.get('/', (req, res) => {
    console.log('🏠 Root route hit')
    res.json({ message: 'Server is working!' })
})

console.log('🔗 About to mount reviews routes...')
app.use("/api/v1/reviews", reviews)
console.log('✅ Reviews routes mounted')

// Simple 404 handler without wildcards
app.use((req, res) => {
    console.log(`❌ 404: ${req.method} ${req.url}`)
    res.status(404).json({error: "not found", path: req.url})
})

console.log('✅ Server.js loaded successfully')

export default app