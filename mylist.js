const listContainer = document.getElementById("anime-container");
const animeSection = document.getElementById("anime");

export function renderAnime() {
    const myAnimeList = JSON.parse(localStorage.getItem("animeList")) ?? [];

    if (myAnimeList.length === 0) {
        animeSection.querySelector(".no-titles").innerHTML =
            `<p>Nothing to find here...<br> Go search add something!</p>`;
        listContainer.innerHTML = "";
    } else {
        animeSection.querySelector(".no-titles").innerHTML = "";
        listContainer.innerHTML = myAnimeList
            .map(
                (anime) => `
            <li>
            <article class="list-card">
                <img
                    src="${anime.coverImage.extraLarge}"
                    srcset="${anime.coverImage.large} 1x, ${anime.coverImage.extraLarge} 2x"
                    alt="${anime.title.romaji}"
                />
                <div>
                    <h3>${anime.title.romaji}</h3>
                    <p>1 / 12 episodes</p>
                </div>
            </article>
            </li>
            `,
            )
            .join("");
    }
}
