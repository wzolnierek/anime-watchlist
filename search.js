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

// data.data.Page.media[0]
// {
//   "id": 154587,
//   "title": {
//     "romaji": "Sousou no Frieren",
//     "english": "Frieren: Beyond Journey’s End",
//     "native": "葬送のフリーレン"
//   },
//   "genres": [
//     "Adventure",
//     "Drama",
//     "Fantasy"
//   ],
//   "coverImage": {
//     "medium": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx154587-qQTzQnEJJ3oB.jpg",
//     "large": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx154587-qQTzQnEJJ3oB.jpg",
//     "extraLarge": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx154587-qQTzQnEJJ3oB.jpg"
//   },
//   "description": "The adventure is over but life goes on for an elf mage just beginning to learn what living is all about. Elf mage Frieren and her courageous fellow adventurers have defeated the Demon King and brought peace to the land. But Frieren will long outlive the rest of her former party. How will she come to understand what life means to the people around her? Decades after their victory, the funeral of one her friends confronts Frieren with her own near immortality. Frieren sets out to fulfill the last wishes of her comrades and finds herself beginning a new adventure…\n<br><br>\n(Source: Crunchyroll)",
//   "episodes": 28,
//   "duration": 24,
//   "weightedScore": 91
// }
