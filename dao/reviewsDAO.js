import mongodb from "mongodb"
const ObjectId = mongodb.ObjectId

let reviews

export default class ReviewsDAO {
    static async injectDB(conn) {
        if (reviews) { 
            return 
        }
        try {
            reviews = await conn.db("reviews").collection("reviews")
            console.log("✅ Connected to reviews collection")
        } catch(e) {
            console.error(`❌ Unable to establish collection handle in reviewsDAO: ${e}`)
        }
    }

    static async addReview(movieId, user, review) {
        try {
            const reviewDoc = {
                movieId: parseInt(movieId), 
                user: user, 
                review: review,
                date: new Date()
            }

            console.log("📝 Adding review:", reviewDoc)
            const result = await reviews.insertOne(reviewDoc)
            console.log("✅ Review added with ID:", result.insertedId)
            return result
        } catch(e) {
            console.error(`❌ Unable to post review: ${e}`)
            return { error: e }
        }
    }

    static async getReview(revId) {
        try {
            console.log("🔍 Getting review with ID:", revId)
            return await reviews.findOne({ _id: new ObjectId(revId) })
        } catch(e) {
            console.error(`❌ Unable to get review: ${e}`)
            return { error: e }
        }
    }

    static async updateReview(revId, user, review) {
        try {
            console.log("📝 Updating review:", revId, user, review)
            const update = await reviews.updateOne(
                { _id: new ObjectId(revId) }, 
                { 
                    $set: {
                        user: user, 
                        review: review,
                        updatedAt: new Date()
                    }
                }
            )

            console.log("✅ Update result:", update)
            return update
        } catch(e) {
            console.error(`❌ Unable to update review: ${e}`)
            return { error: e }
        }
    }

    static async deleteReview(revId) {
        try {
            console.log("🗑️ Deleting review:", revId)
            const deleteResult = await reviews.deleteOne({ _id: new ObjectId(revId) })
            console.log("✅ Delete result:", deleteResult)
            return deleteResult
        } catch(e) {
            console.error(`❌ Unable to delete review: ${e}`)
            return { error: e }
        }
    }

    static async getReviewsByMovieId(movieId) {
        try {
            console.log("🔍 Getting reviews for movie ID:", movieId)
            const cursor = await reviews.find({ movieId: parseInt(movieId) })
            const reviewsList = await cursor.toArray() // Fixed: added () to actually call the method
            console.log(`📖 Found ${reviewsList.length} reviews`)
            return reviewsList
        } catch(e) {
            console.error(`❌ Unable to get reviews: ${e}`)
            return { error: e }
        }
    }
}