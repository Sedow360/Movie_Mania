const api = 'http://localhost:5500/api/v1/reviews/movies/popular';
const IMG_PATH = 'https://image.tmdb.org/t/p/w1280';
const search_api = 'http://localhost:5500/api/v1/reviews/movies/search?q=';

const movies = document.getElementById("movie");
const form = document.getElementById("form");
const search = document.getElementById("query");

returnMovies(api);

console.log('Script loaded!');
console.log('Movie element:', document.getElementById("movie"));
console.log('API URL:', api);

function returnMovies(url) {
    fetch(url)
        .then(res => {
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            return res.json();
        })
        .then(function(data) {
            console.log(data);
            
            // Clear existing content
            movies.innerHTML = '';
            
            // Create a single row to hold all cards
            const div_row = document.createElement('div');
            div_row.setAttribute('class', 'row');
            movies.appendChild(div_row);

            // Handle TMDB API response structure
            const movieResults = data.results || [];
            
            if (movieResults.length === 0) {
                movies.innerHTML = '<p>No movies found.</p>';
                return;
            }
            
            movieResults.forEach(element => {
                if (element.poster_path) {  // Only create card if there's a poster
                    const div_col = document.createElement('div');
                    div_col.setAttribute('class', 'col');

                    const div_card = document.createElement('div');
                    div_card.setAttribute('class', 'card');

                    const image = document.createElement('img');
                    image.setAttribute('class', 'thumbnail');
                    image.src = IMG_PATH + element.poster_path;

                    const title = document.createElement('h3');
                    title.innerHTML = `${element.title}<br><a href="movie.html?id=${element.id}&title=${element.title}">Reviews</a>`;

                    div_card.appendChild(image);
                    div_card.appendChild(title);
                    div_col.appendChild(div_card);
                    div_row.appendChild(div_col);
                }
            });
        })
        .catch(error => {
            console.error('Error fetching movies:', error);
            movies.innerHTML = '<div class="error"><p>Error loading movies. Please make sure your backend server is running on port 5500.</p><p>Error: ' + error.message + '</p></div>';
        });
}

form.addEventListener('submit', (e) => {
    e.preventDefault();
    movies.innerHTML = "";

    const searchItem = search.value.trim();

    if (searchItem) {
        returnMovies(search_api + encodeURIComponent(searchItem));
        search.value = "";
    }
});