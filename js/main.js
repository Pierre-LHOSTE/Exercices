import { haversine } from "./modules/utils/math.js";

const TOTAL_CINEMA_IN_PAGE = 20;

async function main(userLocation, page = 0) {
  console.log("Load");
  const response = await fetch(
    "https://data.culture.gouv.fr/api/explore/v2.1/catalog/datasets/etablissements-cinematographiques/records?offset=" +
      page * TOTAL_CINEMA_IN_PAGE +
      "&limit=" +
      TOTAL_CINEMA_IN_PAGE
  );
  const data = await response.json();

  const total = data.total_count;
  const cinemas = data.results.sort((a, b) => b.fauteuils - a.fauteuils);

  const cinemasHTML = cinemas.map((cinema) =>
    cinemaToHTML(cinema, userLocation)
  );
  const parent = document.getElementById("cinema-list");
  parent.innerHTML = cinemasHTML.join("");

  const totalPages = Math.ceil(total / TOTAL_CINEMA_IN_PAGE) - 1;
  const pagination = generatePagination(totalPages, page, userLocation);
  const paginationParent = document.getElementById("pagination");
  paginationParent.innerHTML = "";
  paginationParent.appendChild(pagination);
}

if ("geolocation" in navigator) {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const userLocation = [
        position.coords.latitude,
        position.coords.longitude,
      ];
      main(userLocation);
    },
    (err) => {
      main();
    }
  );
}

function cinemaToHTML(cinema, userLocation) {
  let distance = null;
  if (userLocation) {
    const cinemaLocation = [
      cinema.geolocalisation.lat,
      cinema.geolocalisation.lon,
    ];
    distance = haversine(userLocation, cinemaLocation);
  }
  const html = `
    <div class="cinema">
        <h2>${cinema.nom}</h2>
        <p>${cinema.commune}, ${cinema.fauteuils} fauteuils</p>
        <address>${cinema.adresse}</address>
        ${
          distance !== null
            ? `<h3>Distance : ${Math.floor(distance)} km</h3>`
            : ""
        }
    </div>
  `;
  return html;
}

function generatePagination(total, page, userLocation) {
  function createLi(page, active = false) {
    const li = document.createElement("li");
    li.dataset.page = page;
    li.textContent = page;
    li.addEventListener("click", (e) => {
      e.preventDefault();
      const clickedPage = parseInt(li.dataset.page);
      console.log(clickedPage);
      main(userLocation, clickedPage);
    });
    if (active) li.classList.add("active");
    return li;
  }

  const pagination = document.createElement("ul");

  let count = 8 + page;
  let offset = 0;

  if (page <= 3) {
    for (let i = 0; i < page; i++) {
      pagination.appendChild(createLi(i));
      count--;
    }
  } else {
    offset = 3;
    pagination.appendChild(createLi(page - 3));
    pagination.appendChild(createLi(page - 2));
    pagination.appendChild(createLi(page - 1));
  }

  for (let i = page; i <= count - offset; i++) {
    if (i === page) {
      pagination.appendChild(createLi(i, true));
    } else {
      pagination.appendChild(createLi(i));
    }
  }

  pagination.appendChild(createLi(total));
  return pagination;
}
