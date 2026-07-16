const header = document.querySelector("header");

window.addEventListener("scroll", () => {

    const scroll = window.scrollY;

    if (scroll < 180) {

        header.style.opacity = "1";
        header.style.transform = "translateY(0)";
        header.style.pointerEvents = "auto";

    } else if (scroll < 350) {

        const opacity = 1 - ((scroll - 180) / 170);

        header.style.opacity = opacity;
        header.style.transform = `translateY(-${(scroll-180)/10}px)`;

    } else {

        header.style.opacity = "0";
        header.style.transform = "translateY(-25px)";
        header.style.pointerEvents = "none";

    }

});

const searchButton = document.getElementById("search-toggle");
const searchOverlay = document.getElementById("search-overlay");
const searchInput = document.getElementById("search-input");

if (searchButton && searchOverlay && searchInput) {

    searchButton.addEventListener("click", (e) => {

        e.preventDefault();

        searchOverlay.classList.add("active");

        searchInput.focus();

    });

    searchOverlay.addEventListener("click", (e) => {

        if (e.target === searchOverlay) {

            searchOverlay.classList.remove("active");

        }

    });

    document.addEventListener("keydown", (e) => {

        if (e.key === "Escape") {

            searchOverlay.classList.remove("active");

        }

    });

}