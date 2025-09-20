import dao from "../dao/reviewsDAO.js"

export default class ReviewCtrl {
    static async apiPostReview(req, res, next) {
        try {
            console.log('📝 apiPostReview called with:', req.body)
            const movId = req.body.movieId;
            const review = req.body.review;
            const user = req.body.user;

            const reviewRes = await dao.addReview(movId, user, review)
            console.log('✅ Review added:', reviewRes)

            res.json({status: "success", data: reviewRes})
        } catch(e) {
            console.error('❌ Error in apiPostReview:', e)
            res.status(500).json({ error: e.message || e.toString() })
        }
    }

    static async apiGetReviews(req, res, next) {
        try {
            console.log('🔍 apiGetReviews called for movie:', req.params.id)
            let id = req.params.id || {};
            console.log('📞 Calling dao.getReviewsByMovieId with:', id)
            
            let reviews = await dao.getReviewsByMovieId(id);
            console.log('📖 DAO returned:', reviews)

            if (!reviews) {
                console.log('❌ No reviews found')
                res.status(404).json({ error: "No reviews found for this movie" });
                return;
            }

            if (reviews.error) {
                console.log('❌ DAO returned error:', reviews.error)
                res.status(500).json({ error: "Database error" });
                return;
            }

            console.log('✅ Sending reviews:', reviews)
            res.json({ reviews: reviews, count: reviews.length });
        } catch(e) {
            console.error('❌ Error in apiGetReviews:', e)
            console.error('❌ Error stack:', e.stack)
            res.status(500).json({ error: e.message || e.toString() })
        }
    }

    static async apiGetReview(req, res, next) {
        try {
            console.log('🔍 apiGetReview called for ID:', req.params.id)
            let id = req.params.id || {};
            let review = await dao.getReview(id);

            if (!review) {
                res.status(404).json({ error: "Review not found" });
                return;
            }

            res.json(review);
        } catch(e) {
            console.error('❌ Error in apiGetReview:', e)
            res.status(500).json({ error: e.message || e.toString() })
        }
    }

    static async apiUpdateReview(req, res, next) {
        try {
            console.log('📝 apiUpdateReview called:', req.params.id, req.body)
            const reviewId = req.params.id;
            const review = req.body.review;
            const user = req.body.user;

            const reviewResponse = await dao.updateReview(reviewId, user, review);

            var { error } = reviewResponse;
            if (error) {
                res.status(500).json({ error: error.message || error.toString() })
                return;
            }

            if (reviewResponse.modifiedCount === 0) {
                throw new Error("unable to update review - review not found or no changes made");
            }

            res.json({ status: "success" })
        } catch(e) {
            console.error('❌ Error in apiUpdateReview:', e)
            res.status(500).json({ error: e.message || e.toString() })
        }
    }

    static async apiDeleteReview(req, res, next) {
        try {
            console.log('🗑️ apiDeleteReview called for:', req.params.id)
            const reviewId = req.params.id;
            const reviewResponse = await dao.deleteReview(reviewId);
            console.log('✅ Delete response:', reviewResponse)
            res.json({ status: "success", deletedCount: reviewResponse.deletedCount })
        } catch(e) {
            console.error('❌ Error in apiDeleteReview:', e)
            res.status(500).json({ error: e.message || e.toString() })
        }
    }
}