
const sections = [...document.querySelectorAll('section')];
const getLinkById = id => document.querySelector(`a[href='#${id}']`);
const barsIcon = document.getElementById("bars-icon")
const mainNavbar = document.getElementById("navbar");
const navLinks = document.getElementsByClassName("nav-link");
const categoriesDiv = document.getElementById("all-categories-div");
const catalog = document.getElementById("all-products-catalog");
const closeBtns = document.getElementsByClassName("close-modal-button");
const categoryElements = document.getElementById("category-elements-div");
const categoryHeader = document.getElementById("category-header");
const selectedItemImage = document.getElementById("selected-product-image");
const selectedItemName = document.getElementById("selected-product-name");
const selectedItemArea = document.getElementById("selected-product-area");
const itemDiv = document.getElementById("product-div");
const itemIngredientes = document.getElementById("item-ingredients");
const itemMeasures = document.getElementById("item-measures");
const itemOrigin = document.getElementById("item-origin");
const itemInfoBtn = document.getElementsByClassName("itemInfoBtn");
const itemDetails = document.getElementsByClassName("item-details");


/////// Para efecto de navbar
const inView = section => {
    let top = section.offsetTop;
    let height = section.offsetHeight;
    while (section.offsetParent) {
        section = section.offsetParent;
        top += section.offsetTop;
    }
    return (
        top < (window.pageYOffset + window.innerHeight) &&
        (top + height) > window.pageYOffset
    );
};
window.onscroll = () => {
    let next = false;
    sections.forEach(section => {
        const a = getLinkById(section.id);
        if (inView(section) && !next) {
            a.classList.add('main-navbar--current');
            next = true;
        } else {
            a.classList.remove('main-navbar--current');
        }
    });
};
//Desplegar navbar en pantallas pequeñas
barsIcon.addEventListener("click", function () {
    mainNavbar.classList.toggle("display-bar");
});
for (let i = 0; i < navLinks.length; i++) {
    navLinks[i].addEventListener("click", function () {
        mainNavbar.classList.remove("display-bar");
    });
}
/////
for (let i = 0; i < closeBtns.length; i++) {
    closeBtns[i].addEventListener("click", function (event) {
        let element = event.target.parentNode.parentNode.parentNode;
        element.classList.add("display-none");
    });
}

const categoriesUrl = 'https://www.themealdb.com/api/json/v1/1/categories.php';
const categories = fetch(categoriesUrl);
let categoryDiv = "", cadena = "", productItem = "";

categories
    .then((response) => response.json())
    .then((response => renderCategories(response)))
    .catch((error) => console.log(error));

function renderCategories(resp) {
    const array = resp.categories;
    array.map((item) => {
        const template = `
        <div class="category-div product-item" name="${item.strCategory}">
                    <h3>${item.strCategory}</h3>
                    <figure>
                        <img src="${item.strCategoryThumb}" alt="imagen" class="category-img">
                    </figure>
        </div>
        `;
        categoriesDiv.innerHTML += template;
    });
    categoryDiv = document.getElementsByClassName("category-div");
    for (let i = 0; i < categoryDiv.length; i++) {
        categoryDiv[i].addEventListener("click", function (event) {
            let categoryName = event.target.getAttribute("name");
            categoryElements.innerHTML = "";
            categoryHeader.innerText = `${categoryName}`;
            //Meals
            const mealsUrl = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${categoryName}`;
            const meals = fetch(mealsUrl);
            meals
                .then((response) => response.json())
                .then((response => showMeals(response)))
                .catch((error) => console.log(error));

            function showMeals(resp) {
                const array = resp.meals;
                array.map((item) => {
                    const template = `
                    <figure id="${item.idMeal}" class="flex product-element product-item" name="${item.idMeal}">
                        <img src="${item.strMealThumb}" alt="Producto" class="promo-image">
                            <figcaption class="product-description">
                                <h4>${item.strMeal}</h4>
                                <p><span class="brown-span">Ver detalles</span></p>
                            </figcaption>
                    </figure>
                    `;
                    categoryElements.innerHTML += template;
                });
                productItem = document.getElementsByClassName("product-item");
                for (let i = 0; i < productItem.length; i++) {
                    productItem[i].addEventListener("click", function (event) {
                        const selectedMeal = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${event.target.getAttribute("name")}`;
                        const selectedItem = fetch(selectedMeal);

                        selectedItem
                            .then((response) => response.json())
                            .then((response => showInfo(response)))
                            .catch((error) => console.log(error));

                        function showInfo(resp) {
                            const array = resp.meals;
                            array.map((item) => {
                                console.log(item);
                                let ingredients = "", measures = [], position = 0;
                                selectedItemImage.setAttribute("src", item.strMealThumb);
                                selectedItemName.innerText = item.strMeal;
                                for (const property in item) {
                                    if (property.includes("Ingredient") && item[property] !== "") {
                                        measures.push(" " + item[property]);
                                        ingredients += `${item[property]}, `;
                                    }
                                    if (property.includes("Measure") && item[property] !== "") {
                                        measures[position] = measures[position] + ` (${item[property]})`;
                                        position++;
                                    }
                                }
                                itemIngredientes.innerText = ingredients;
                                itemMeasures.innerText = measures;
                                itemOrigin.innerText = `This delicious dish is of ${item.strArea} origin`;
                            });
                            itemDiv.classList.remove("display-none");
                        }
                    });
                }



            }
            catalog.classList.remove("display-none");
        });
    }
}


for (let i = 0; i < itemInfoBtn.length; i++) {
    itemInfoBtn[i].addEventListener("click", function (event) {
        for (let j = 0; j < itemDetails.length; j++) {
            if (itemDetails[j].getAttribute("id") === itemInfoBtn[i].getAttribute("name")) {
                itemDetails[j].classList.remove("display-none");
            }
            else {
                itemDetails[j].classList.add("display-none");
            }
        }

    });
}