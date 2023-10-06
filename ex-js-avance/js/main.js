import { haversine } from "./modules/utils/math.js";

const TOTAL_CINEMA_IN_PAGE = 20;

async function main({ userLocation, page = 0, refine = "" } = {}) {
  const url =
    "https://data.culture.gouv.fr/api/explore/v2.1/catalog/datasets/etablissements-cinematographiques/records?offset=" +
    page * TOTAL_CINEMA_IN_PAGE +
    "&limit=" +
    TOTAL_CINEMA_IN_PAGE +
    refine;
  const response = await fetch(url);
  const data = await response.json();

  const total = data.total_count;
  let cinemas = data.results.sort((a, b) => b.fauteuils - a.fauteuils);

  if (userLocation) {
    cinemas.map((cinema) => {
      const cinemaLocation = [cinema.latitude, cinema.longitude];
      const distance = haversine(userLocation, cinemaLocation);
      cinema.distance = distance;
      return cinema;
    });
  }

  cinemas = cinemas.sort((a, b) => a.distance - b.distance);

  console.log(data);

  const cinemasHTML = cinemas.map((cinema) =>
    cinemaToHTML(cinema, userLocation)
  );
  const parent = document.getElementById("cinema-list");
  parent.innerHTML = cinemasHTML.join("");

  const totalPages = Math.ceil(total / TOTAL_CINEMA_IN_PAGE) - 1;
  const pagination = generatePagination(totalPages, page, userLocation, refine);
  const paginationParent = document.getElementById("pagination");
  paginationParent.innerHTML = "";
  paginationParent.appendChild(pagination);
}

if ("geolocation" in navigator) {
  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const { latitude, longitude } = position.coords;
      const userLocation = [latitude, longitude];
      const response = await fetch(
        "https://api-adresse.data.gouv.fr/reverse?lat=" +
          latitude +
          "&lon=" +
          longitude
      );
      const data = await response.json();
      const code = data.features[0].properties.postcode
        .toString()
        .substring(0, 2);

      const refine = `&refine=dep%3A"${code}"`;

      main({
        userLocation: userLocation,
        refine: refine,
      });
    },
    (err) => {
      main();
    }
  );
}

function cinemaToHTML(cinema) {
  let distance = null;
  const html = `
    <div class="cinema">
        <h2>${cinema.nom}</h2>
        <p>${cinema.commune}, ${cinema.fauteuils} fauteuils</p>
        <address>${cinema.adresse}</address>
        ${
          typeof cinema.distance === "number"
            ? `<h3>Distance : ${Math.floor(cinema.distance)} km</h3>`
            : ""
        }
    </div>
  `;
  return html;
}

function generatePagination(total, currentPage, userLocation, refine) {
  function createLi(pageNumber, isActive = false) {
    const li = document.createElement("li");
    li.dataset.page = pageNumber;
    li.textContent = pageNumber;
    if (isActive) {
      li.classList.add("active");
    } else {
      li.addEventListener("click", (e) => {
        e.preventDefault();
        if (pageNumber === "...") return;
        const clickedPage = parseInt(li.dataset.page);
        main({ userLocation, page: clickedPage, refine });
      });
    }
    return li;
  }

  const pagination = document.createElement("ul");

  const maxPagesToShow = 8;

  if (total <= maxPagesToShow) {
    for (let i = 0; i <= total; i++) {
      pagination.appendChild(createLi(i, i === currentPage));
    }
  } else {
    let startPage = Math.max(currentPage - Math.floor(maxPagesToShow / 2), 0);
    let endPage = Math.min(
      startPage + Math.floor(maxPagesToShow / 1) - 1,
      total
    );
    console.log("🚀 ~ startPage:", startPage);
    console.log("🚀 ~ endPage:", endPage);

    if (endPage === total) {
      startPage = Math.max(total - maxPagesToShow + 1, 1);
    }

    if (startPage > 1) {
      pagination.appendChild(createLi(0));
      if (startPage > 2) {
        pagination.appendChild(createLi("..."));
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pagination.appendChild(createLi(i, i === currentPage));
    }

    if (endPage < total) {
      if (endPage < total - 1) {
        pagination.appendChild(createLi("..."));
      }
      pagination.appendChild(createLi(total));
    }
  }

  return pagination;
}
