const myAnimeList = JSON.parse(localStorage.getItem("animeList")) ?? []
const listContainer = document.getElementById("anime-container")

console.log(myAnimeList);


function renderPage(){
    listContainer.innerHTML = myAnimeList.map(anime => `
            <img
                src="${anime.coverImage.extraLarge}"
                srcset="${anime.coverImage.large} 1x, ${anime.coverImage.extraLarge} 2x"
                alt="${anime.title.romaji}"
            />
            <h2>${anime.title.romaji}</h2>
        `)
}

renderPage()