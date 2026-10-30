const itemsContainer = document.getElementById("items-container");
const findAnime = document.getElementById("find-anime")
const searchAnime = document.getElementById("find-anime-search")

const url = "https://graphql.anilist.co"
const query = `
query ($search: String!) {
  Page {
    media(search: $search, type: ANIME) {
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
    }
  }
}
`;

findAnime.addEventListener("submit", async function (e) {
    e.preventDefault();

    const options = {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        },
        body: JSON.stringify({
        query: query,
        variables: { search: searchAnime.value },
        }),
    };
    const res = await fetch(url, options)
    const data = await res.json()

    console.log(data.data.Page.media);

    itemsContainer.innerHTML = data.data.Page.media.map(anime => `
        <li>
        <article>
            <img
                src="${anime.coverImage.extraLarge}"
                srcset="${anime.coverImage.large} 1x, ${anime.coverImage.extraLarge} 2x"
                alt="${anime.title.romaji}"
            />
            <div>
                <h3>${anime.title.romaji}</h3>
                
                <div>
                    <p>${anime.format}</p>
                    <p>${anime.episodes ===1 ? `${anime.duration} min` : `${anime.episodes} episodes`}</p>
                    <p>${anime.weightedScore}</p>
                </div>
                <p>${anime.description}</p>
            </div>
        </article>
        </li>
        `).join("")
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