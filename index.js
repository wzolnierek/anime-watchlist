

window.addEventListener("hashchange", (event) => {
    const result = location.hash;
    console.log(result.slice(1));
})