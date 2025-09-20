const api = 'http://localhost:5500/api/v1/reviews';
const url = new URL(location.href);
const movieId = url.searchParams.get("id")
const movieTitle = url.searchParams.get("title")

const movies = document.getElementById("section");
const title = document.getElementById("title");

title.innerText = movieTitle;

// Create the "New Review" card
const div_new = document.createElement('div');
div_new.className = "col"; // Use your existing col class
div_new.innerHTML = `
    <div class="card">
        <h4>New Review</h4>
        <p><strong>Review: </strong><input type="text" id="new_rev" value=""></p>
        <p><strong>User: </strong><input type="text" id="new_user" value=""></p>
        <button onclick="saveReview('new_rev', 'new_user')" class="save-btn">Save Review</button>
    </div>`;

// Create a container row for side-by-side layout
const reviewsContainer = document.createElement('div');
reviewsContainer.className = "row";
reviewsContainer.id = "reviews-container";
movies.appendChild(reviewsContainer);

// Add the new review card to the container
reviewsContainer.appendChild(div_new);

// Then load existing reviews
returnReviews(api);

function returnReviews(url) {
    fetch(url + "/movie/" + movieId)
        .then(res => res.json())
        .then(function(data) {
            console.log("Received data:", data);
            console.log("Data type:", typeof data);
            console.log("Is array:", Array.isArray(data));
            
            // Handle different response formats
            let reviews = [];
            
            if (Array.isArray(data)) {
                // Data is already an array
                reviews = data;
            } else if (data && typeof data === 'object') {
                // Data is an object - check common properties
                if (data.reviews && Array.isArray(data.reviews)) {
                    // Response format: { reviews: [...] }
                    reviews = data.reviews;
                } else if (data.data && Array.isArray(data.data)) {
                    // Response format: { data: [...] }
                    reviews = data.data;
                } else if (data.results && Array.isArray(data.results)) {
                    // Response format: { results: [...] }
                    reviews = data.results;
                } else {
                    // If it's a single review object, wrap it in an array
                    if (data._id || data.review || data.user) {
                        reviews = [data];
                    }
                }
            }
            
            console.log("Processed reviews array:", reviews);
            console.log("Number of reviews:", reviews.length);

            if (reviews.length === 0) {
                console.log("No reviews found for this movie");
                return;
            }

            reviews.forEach((review, index) => {
                console.log(`Processing review ${index + 1}:`, review);
                
                const div_card = document.createElement('div');
                div_card.className = "col"; // Use your existing col class
                div_card.innerHTML = `
                <div class="card" id="${review._id}">
                    <p><strong>Review: </strong>${review.review}</p>
                    <p><strong>User: </strong>${review.user}</p>
                    <div class="button-group">
                        <button onclick="editReview('${review._id}', '${review.review}', '${review.user}')" class="edit-btn">
                            Edit</button>
                        <button onclick="deleteReview('${review._id}')" class="delete-btn">
                            Delete</button>
                    </div>
                </div>`;
                
                // Add to the reviews container instead of movies directly
                const container = document.getElementById('reviews-container');
                container.appendChild(div_card);
                console.log(`Review ${index + 1} added to DOM`);
            });
        })
        .catch(error => {
            console.error("Error fetching reviews:", error);
        });
}

function editReview(id, review, user) {
    const el = document.getElementById(id);
    const revIn = "review" + id;
    const uId = "user" + id;

    el.innerHTML = `
        <p><strong>Review: </strong>
            <input type="text" id="${revIn}" value="${review}">
        </p>
        <p><strong>User: </strong>
            <input type="text" id="${uId}" value="${user}">
        </p>
        <button onclick="saveReview('${revIn}', '${uId}', '${id}')" class="save-btn">Save</button>
    `;
}

function saveReview(revId, uId, id="") {
    const review = document.getElementById(revId).value;
    const user = document.getElementById(uId).value;

    if (id) {
        // Update existing review
        fetch(api + "/" + id, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-type': 'application/json'
            },
            body: JSON.stringify({"user": user, "review": review})
        }).then(res => res.json())
            .then(res => {
                console.log("Update response:", res);
                location.reload();
            })
            .catch(error => console.error("Update error:", error));
    } else {
        // Create new review
        fetch(api + "/new", {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-type': 'application/json'
            },
            body: JSON.stringify({"user": user, "review": review, "movieId": movieId})
        }).then(res => res.json())
            .then(res => {
                console.log("Create response:", res);
                location.reload();
            })
            .catch(error => console.error("Create error:", error));
    }
}

function deleteReview(id) {
    fetch(api + "/" + id, {
        method: 'DELETE',
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-type': 'application/json'
        }
    }).then(res => res.json())
        .then(res => {
            console.log("Delete response:", res);
            location.reload();
        })
        .catch(error => console.error("Delete error:", error));
}