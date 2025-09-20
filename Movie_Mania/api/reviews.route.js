import express from "express"
import ReviewCtrl from "./reviews.ctrl.js"

console.log('📋 Loading reviews.route.js...')

const router = express.Router()

// Add this at the top of your reviews.route.js file, right after the imports
console.log('🔑 TMDB_API_KEY loaded:', process.env.TMDB_API_KEY ? 'Found' : 'NOT FOUND');
console.log('🔑 All env vars:', Object.keys(process.env).filter(key => key.includes('TMDB')));
router.use((req, res, next) => {
    console.log(`📋 REVIEWS ROUTER: ${req.method} ${req.url}`)
    next()
})

// Test route
router.route("/").get((req, res) => {
    console.log('🏠 Reviews base route hit')
    res.json({ message: "Reviews API working!" })
})

router.route("/movie/:id").get(ReviewCtrl.apiGetReviews)
router.route("/new").post(ReviewCtrl.apiPostReview)
router.route("/:id")
    .get(ReviewCtrl.apiGetReview)
    .put(ReviewCtrl.apiUpdateReview)
    .delete(ReviewCtrl.apiDeleteReview)

console.log('✅ Reviews routes configured')

router.route("/movies/popular").get(async (req, res) => {
    try {
        console.log('🎬 Fetching popular movies from TMDB')
        
        if (!process.env.TMDB_API_KEY) {
            return res.status(500).json({ error: "TMDB API key not configured" })
        }
        
        const response = await fetch(`https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=${process.env.TMDB_API_KEY}&page=1`)
        
        if (!response.ok) {
            throw new Error(`TMDB API error: ${response.status}`)
        }
        
        const data = await response.json()
        console.log('✅ Popular movies fetched successfully')
        res.json(data)
        
    } catch (error) {
        console.error('❌ Error fetching popular movies:', error)
        res.status(500).json({ error: "Failed to fetch popular movies", details: error.message })
    }
})

// Search movies in TMDB
router.route("/movies/search").get(async (req, res) => {
    try {
        console.log('🔍 Searching movies:', req.query.q)
        
        if (!process.env.TMDB_API_KEY) {
            return res.status(500).json({ error: "TMDB API key not configured" })
        }
        
        const query = req.query.q
        if (!query) {
            return res.status(400).json({ error: "Search query is required. Use ?q=movie_name" })
        }
        
        const response = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${process.env.TMDB_API_KEY}&query=${encodeURIComponent(query)}`)
        
        if (!response.ok) {
            throw new Error(`TMDB API error: ${response.status}`)
        }
        
        const data = await response.json()
        console.log('✅ Movie search completed')
        res.json(data)
        
    } catch (error) {
        console.error('❌ Error searching movies:', error)
        res.status(500).json({ error: "Failed to search movies", details: error.message })
    }
})

export default router