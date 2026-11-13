const animePage = document.getElementById("anime")
const mangaPage = document.getElementById("manga")
const searchPage = document.getElementById("search")
const profilePage = document.getElementById("profile")

renderPage()

window.addEventListener("hashchange", () => {
    renderPage()
})

function renderPage(){
    document.querySelectorAll("main > section").forEach(section => section.hidden = true);
    const currentPage = document.getElementById(location.hash.slice(1)) || animePage;
    currentPage.hidden = false;

    document.querySelectorAll("nav > a").forEach(a=>a.ariaCurrent=null);
    document.querySelector(`a[href="#${currentPage.id}"]`).ariaCurrent = "page";
}