const itemsContainer = document.getElementById("items-container");
const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");
const searchSection = document.getElementById("search");
const typeSelect = document.getElementById("media-type");

const url = "https://graphql.anilist.co";
const query = `
query ($search: String, $type: MediaType) {
  Page {
    media(search: $search, type: $type) {
      id
      title {
        romaji
        english
        native
      }
      genres
      coverImage {
        medium
        large
        extraLarge
      }
      description
      episodes
      duration
      weightedScore
      format
      type
      chapters
      volumes
      status
    }
  }
}
`;

const mediaFormat = {
    TV: "TV",
    TV_SHORT: "TV Short",
    MOVIE: "Movie",
    SPECIAL: "Special",
    OVA: "OVA",
    ONA: "ONA",
    MUSIC: "Music",
    MANGA: "Manga",
    NOVEL: "Novel",
    ONE_SHOT: "One Shot",
};

const mediaStatus = {
    FINISHED: "Finished",
    RELEASING: "Releasing",
    NOT_YET_RELEASED: "Not yet released",
    CANCELLED: "Canceled",
    HIATUS: "Hiatus",
};

let searchedList;
searchForm.addEventListener("submit", async function (e) {
    e.preventDefault();
    const searchTerm = searchInput.value;
    if (searchTerm == "") {
        searchSection.querySelector(".no-titles").innerHTML = `
            <div class="no-titles">
                <img src="images/movie-clip.svg"/>
                <p>Start exploring</p>
            </div>`;
        itemsContainer.innerHTML = "";
    } else {
        try {
            searchSection.querySelector(".no-titles").innerHTML = "";
            const data = await fetchAnime(searchTerm);
            searchedList = data;
            if (data) renderSearch(data);
        } catch (err) {
            itemsContainer.innerHTML = `<p style="color: red; text-align: center; font-size: 3rem; margin: 200px">Can't connect to the server</p>`;
        }
    }
});

async function fetchAnime(searchTerm) {
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
        body: JSON.stringify({
            query: query,
            variables: {
                search: searchTerm,
                type: typeSelect.value,
            },
        }),
    };
    const res = await fetch(url, options);
    const data = await res.json();

    return data.data.Page.media;
}

function renderSearch(data) {
    if (data.length === 0) {
        itemsContainer.innerHTML = `<p class="blank-search no-titles">Unable to find what you’re looking for.<br> Please try another search.</p>`;
    } else {
        const animeList = JSON.parse(localStorage.getItem("animeList")) ?? [];
        itemsContainer.innerHTML = data
            .map(
                (item) =>
                    `
            <li>
            <article class="search-card">
                <img
                    src="${item.coverImage.extraLarge}"
                    srcset="${item.coverImage.large} 1x, ${item.coverImage.extraLarge} 2x"
                    alt="${item.title.romaji}"
                />
                <div class="card-text">
                    <h3>${item.title.romaji}<span>
                        <button class="add-btn" data-id="${item.id}">
                            ${animeList.some((item) => item.id === item.id) ? "added" : "add"}
                        </button></span>
                    </h3>
                    
                    <div class="card-span">
                        <p>${mediaFormat[`${item.format}`]}</p>
                        <p>${formatLength(item)}</p>
                        <p>${item.weightedScore}%</p>
                    </div>
                    <p class="anime-desc">${item.description}</p>
                    <p class="card-tags">${item.genres.join(", ")}</p>
                </div>
            </article>
            </li>
            `,
            )
            .join("");
    }
}

function formatLength(item) {
    if (item.status === "FINISHED") {
        if (item.type === "ANIME") {
            return item.episodes === 1
                ? `${item.duration} min`
                : `${item.episodes} episodes`;
        } else if (item.type === "MANGA") {
            return item.chapters === 1
                ? `${item.chapters} chapter`
                : `${item.chapters} chapters`;
        }
    } else {
        return `${mediaStatus[`${item.status}`]}`;
    }
}

itemsContainer.addEventListener("click", function (e) {
    const button = e.target.closest(".add-btn");
    if (!button) return;
    console.log(e.target.closest(".add-btn"));

    const animeList = JSON.parse(localStorage.getItem("animeList")) ?? [];
    const newItem = searchedList.find(
        (item) => item.id === Number(button.dataset.id),
    );
    if (!animeList.some((anime) => anime.id === newItem.id)) {
        animeList.push(newItem);
    }

    localStorage.setItem("animeList", JSON.stringify(animeList));

    button.textContent = "added";
});
