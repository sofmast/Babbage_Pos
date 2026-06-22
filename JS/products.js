// ========================================
// PRODUCTS MODULE
// ========================================

let products = [];

// ========================================
// LOAD PRODUCTS
// ========================================

// ========================================
// LOAD PRODUCTS
// ========================================

function loadProducts() {

    const savedProducts =
        localStorage.getItem(
            "pos_products"
        );

    try {

        products = savedProducts
            ? JSON.parse(savedProducts)
            : [];

    } catch (error) {

        console.error(
            "Failed to load products:",
            error
        );

        products = [];

    }

}

// ========================================
// SAVE PRODUCTS
// ========================================

function saveProducts(productsData) {

    localStorage.setItem(
        "pos_products",
        JSON.stringify(productsData)
    );

}

// ========================================
// GET PRODUCTS
// ========================================

function getProducts() {

    return products;

}

// ========================================
// RENDER PRODUCTS
// ========================================

function renderProducts(productList = products) {

    const productGrid =
        document.getElementById(
            "productGrid"
        );

    if (!productGrid) return;

    productGrid.innerHTML = "";

    if (productList.length === 0) {

        productGrid.innerHTML = `
            <p class="empty">
                No products found
            </p>
        `;

        return;

    }

    productList.forEach(product => {

        const card =
            document.createElement(
                "div"
            );

        card.className =
            "product-card";

        card.innerHTML = `

            <h3>
                ${product.name}
            </h3>

            <p>
                ${product.category}
            </p>

            <p>
                Stock:
                ${product.stock}
            </p>

            <div class="product-price">

                K${Number(
                    product.price
                ).toFixed(2)}

            </div>

            <button
                class="add-btn">

                Add To Cart

            </button>

        `;

        card.querySelector(
            ".add-btn"
        ).addEventListener(
            "click",
            () => {

                if (
                    typeof addToCart ===
                    "function"
                ) {

                    addToCart(product);

                }

            }
        );

        productGrid.appendChild(
            card
        );

    });

}

// ========================================
// LOAD CATEGORIES
// ========================================

function loadCategories() {

    const categoryFilter =
        document.getElementById(
            "categoryFilter"
        );

    if (!categoryFilter) return;

    categoryFilter.innerHTML =
        `<option value="all">
            All Categories
        </option>`;

    const categories =
        [...new Set(
            products.map(
                p => p.category
            )
        )];

    categories.forEach(category => {

        const option =
            document.createElement(
                "option"
            );

        option.value =
            category;

        option.textContent =
            category;

        categoryFilter.appendChild(
            option
        );

    });

}

// ========================================
// CATEGORY FILTER
// ========================================

function initializeCategoryFilter() {

    const categoryFilter =
        document.getElementById(
            "categoryFilter"
        );

    if (!categoryFilter) return;

    categoryFilter.addEventListener(
        "change",
        () => {

            const selected =
                categoryFilter.value;

            if (
                selected === "all"
            ) {

                renderProducts();

                return;

            }

            const filtered =
                products.filter(
                    product =>
                        product.category ===
                        selected
                );

            renderProducts(
                filtered
            );

        }
    );

}

// ========================================
// REDUCE STOCK
// ========================================

function reduceStock(cartItems) {

    let products = getProducts();

    cartItems.forEach(cartItem => {

        const product = products.find(
            p =>
                String(p.id) ===
                String(cartItem.id)
        );

        if (!product) return;

        product.stock = Math.max(
            0,
            Number(product.stock) -
            Number(cartItem.qty)
        );

    });

    saveProducts(products);

    return products;
}

// ========================================
// SEARCH PRODUCTS
// ========================================
// ========================================
// PRODUCT SEARCH
// ========================================

function initializeSearch() {

    const searchInput =
        document.getElementById(
            "search"
        );

    if (!searchInput) return;

    searchInput.addEventListener(
        "input",
        () => {

            const keyword =
                searchInput.value
                    .toLowerCase()
                    .trim();

            if (keyword === "") {

                renderProducts(products);

                return;

            }

            const filteredProducts =
                products.filter(product => {

                    const name =
                        (product.name || "")
                        .toLowerCase();

                    const category =
                        (product.category || "")
                        .toLowerCase();

                    return (
                        name.includes(keyword) ||
                        category.includes(keyword)
                    );

                });

            renderProducts(
                filteredProducts
            );

        }
    );

}

// ========================================
// INITIALIZE PRODUCTS
// ========================================

loadProducts();

loadCategories();

renderProducts();

initializeCategoryFilter();

initializeSearch();