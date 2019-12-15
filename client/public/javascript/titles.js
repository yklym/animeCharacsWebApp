console.log("Loading Titles.JS");
const searchBar = document.getElementById('titlesSearch');
const paginationUl = document.getElementById("titlesPagUl");

function renderTitles(pageNumber = 1,characId =  null) {
    console.log("rendering titles...");
    const keyword = searchBar.value;
    let apiReq = `/api/v1/titles?page=${pageNumber}${keyword ? `&search=${keyword}` : ""}${characId ? `&title=${characId}` : ""}`;
    // console.log(apiReq);
    Promise.all([
            fetch("/templates/titleTemplate.mustache").then(x => x.text()),
            fetch(apiReq, {
                credentials: "include"
            }).then(x => x.json()),
        ])
        .then(([templateStr, itemsData]) => {
            // console.log('templateStr', templateStr);
            // console.log('itemsData', itemsData);

            const dataObject = {
                titles: itemsData.resTitles
            };

            // console.log(`Curr page ${getCurrPage()}`);
            createPAginationLinks(pageNumber, itemsData.pagesAmount);
            const renderedHtmlStr = Mustache.render(templateStr, dataObject);
            return renderedHtmlStr;
        })
        .then(htmlStr => {
            // console.log('htmlStr', htmlStr);
            const appEl = document.getElementById('titles-div');
            // console.log(appEl);
            appEl.innerHTML = htmlStr;
        })
        .catch(err => console.error(err));
}

function getCurrPage() {
    const links = document.getElementsByClassName("titlesPag");

    for (let i = 0; i < links.length; i++) {
        let element = links[i];
        if (element.classList.contains("active")) {
            return element.innerText;
        }
    }
    return 1;
}

function createPAginationLinks(currPage, pageAmount) {
    let leftArr = document.createElement("li");
    leftArr.classList.add("page-item");
    leftArr.innerHTML = `<a class="page-link ${currPage === 1 ? "disabled" : ""}" aria-label="Previous">
                            <span aria-hidden="true">&laquo;</span>
                            <span class="sr-only">Previous</span>
                        </a>`;
    paginationUl.innerHTML = "";
    leftArr.addEventListener("click", () => {
        renderTitles(getCurrPage() - 1);
    });
    paginationUl.appendChild(leftArr);
    for (let i = currPage - 3; i < currPage + 3; i++) {
        if (i <= 0) {
            i = 1;
        }
        if (i > pageAmount) {
            break;
        }

        let link = document.createElement("li");
        link.classList.add("titlePag");
        link.classList.add("page-item");
        link.innerHTML = `<a class="page-link">${i}</a>`;

        if (i == currPage) {
            link.classList.add("active");
        }
        link.addEventListener("click", () => {
            renderTitles(i);
        });
        paginationUl.appendChild(link);
    }
    let rightArr = document.createElement("li");
    rightArr.classList.add("page-item");
    rightArr.innerHTML = `<a class="page-link ${currPage === pageAmount ? "disabled" : ""}" aria-label="Previous">
                            <span aria-hidden="true">&raquo;</span>
                            <span class="sr-only">Previous</span>
                          </a>`;

    rightArr.addEventListener("click", () => {
        renderTitles(+getCurrPage() + 1);
    });
    paginationUl.appendChild(rightArr);
}

searchBar.addEventListener("change", renderTitles);

renderTitles();
