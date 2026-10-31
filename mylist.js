const myAnimeList = JSON.parse(localStorage.getItem("animeList")) ?? []
const listContainer = document.getElementById("anime-container")

function renderPage(){
    if(myAnimeList.length===0){
        listContainer.innerHTML = `<p class="blank-search no-titles">Nothing to find here...<br> Go search add something!</p>`
    } else {
        listContainer.innerHTML = myAnimeList.map(anime => `
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
            `).join("")
    }
}

renderPage()