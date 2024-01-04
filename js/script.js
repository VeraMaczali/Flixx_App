const global = {
  currentPage: window.location.pathname,
};

//Display popular movies
async function displayPopularMovies() {
  const { results } = await fetchAPIData("movie/popular");

  results.forEach((movie) => {
    const div = document.createElement("div");
    div.classList.add("card");
    div.innerHTML = `
    <a href="movie-details.html?id=${movie.id}">
            ${
              movie.poster_path
                ? `<img
                src="https://image.tmdb.org/t/p/w500${movie.poster_path}"
                class="card-img-top"
                alt="${movie.title}"
              />`
                : `<img
              src="./images/no-image.jpg"
              class="card-img-top"
              alt="${movie.title}"
            />`
            }
          </a>
          <div class="card-body">
            <h5 class="card-title">${movie.title}</h5>
            <p class="card-text">
              <small class="text-muted">Release: ${movie.release_date}</small>
            </p>
          </div>
    `;
    document.querySelector("#popular-movies").appendChild(div);
  });
}
//Display Popular Shows
async function displayPopularTVShows() {
  const { results } = await fetchAPIData("tv/popular");

  results.forEach((tvshow) => {
    const div = document.createElement("div");
    div.classList.add("card");
    div.innerHTML = `
    <a href="tv-details.html?${tvshow.id}">
        ${
          tvshow.poster_path
            ? `<img
              src="https://image.tmdb.org/t/p/w500${tvshow.poster_path}"
              class="card-img-top"
              alt="${tvshow.name}"
            />
            `
            : `<img
            src="./images/no-image.jpg"
            class="card-img-top"
            alt="${tvshow.name}"
          />
            `
        }
          </a>
          <div class="card-body">
            <h5 class="card-title">${tvshow.name}</h5>
            <p class="card-text">
              <small class="text-muted">Aired: ${tvshow.first_air_date}</small>
            </p>
          </div>
    `;
    document.querySelector("#popular-shows").appendChild(div);
  });
}

//Display movie details
async function displayMovieDetails() {
  const movieId = window.location.search.split("=")[1];
  console.log(movieId);

  const movie = await fetchAPIData(`movie/${movieId}`);

  const div = document.createElement("div");
  div.innerHTML += `
  <div class="details-top">
    <div>
    ${
      movie.poster_path
        ? `<img
          src="https://image.tmdb.org/t/p/w500${movie.poster_path}"
          class="card-img-top"
          alt="${movie.title}"
        />
        `
        : `<img
        src="./images/no-image.jpg"
        class="card-img-top"
        alt="${movie.title}"
      />
        `
    }
    </div>
    <div>
      <h2>${movie.title}</h2>
      <p>
        <i class="fas fa-star text-primary"></i>
        ${movie.vote_average.toFixed(1)} / 10
      </p>
      <p class="text-muted">Release Date: ${movie.release_date}</p>
      <p>
        ${movie.overview}
      </p>
      <h5>Genres</h5>
      <ul class="list-group">
        ${movie.genres.map((genre) => `<li>${genre.name}</li>`).join("")}
      </ul>
      <a href="${
        movie.homepage
      }" target="_blank" class="btn">Visit Movie Homepage</a>
    </div>
  </div>
  <div class="details-bottom">
    <h2>Movie Info</h2>
    <ul>
      <li><span class="text-secondary">Budget:</span> $${addCommasToNumber(
        movie.budget
      )}</li>
      <li><span class="text-secondary">Revenue:</span> $${addCommasToNumber(
        movie.revenue
      )}</li>
      <li><span class="text-secondary">Runtime:</span> ${
        movie.runtime
      } minutes</li>
      <li><span class="text-secondary">Status:</span> ${movie.status}</li>
    </ul>
    <h4>Production Companies</h4>
    <div class="list-group">${movie.production_companies
      .map((company) => `${company.name}`)
      .join(",  ")}</div>
  </div>
  `;
  document.querySelector("#movie").appendChild(div);
}

//Fetch data from TMDB API
async function fetchAPIData(endpoint) {
  /* Register your own key for free at https://themoviedb.org */
  const API_KEY = "c1b393799d3dec03779a1bb379b6389d";
  const API_URL = "https://api.themoviedb.org/3/";
  showSpinner();
  const response = await fetch(
    `${API_URL}${endpoint}?api_key=${API_KEY}&language=en-US`
  );
  const data = await response.json();
  hideSpinner();
  return data;
}

function showSpinner() {
  document.querySelector(".spinner").classList.add("show");
}
function hideSpinner() {
  document.querySelector(".spinner").classList.remove("show");
}

//Highlight active link
function highlightActiveLink() {
  const links = document.querySelectorAll(".nav-link");
  links.forEach((link) => {
    if (link.getAttribute("href") === global.currentPage) {
      link.classList.add("active");
    }
  });
}

function addCommasToNumber(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

//Init App
function init() {
  switch (global.currentPage) {
    case "/":
    case "/index.html":
      displayPopularMovies();
      break;
    case "/shows.html":
      displayPopularTVShows();
      break;
    case "/movie-details.html":
      displayMovieDetails();
      break;
    case "/tv-details.html":
      console.log("TV Details");
      break;
    case "/search.html":
      console.log("Search");
      break;
  }

  highlightActiveLink();
}

document.addEventListener("DOMContentLoaded", init);
