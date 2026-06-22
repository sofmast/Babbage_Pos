let sales =
    JSON.parse(
        localStorage.getItem(
            "pos_sales"
        )
    ) || [];

const salesContainer =
    document.getElementById(
        "salesContainer"
    );

function renderSales(
    data = sales
) {

    salesContainer.innerHTML = "";

    let revenue = 0;

    data.forEach(sale => {

        revenue += sale.total;

        const card =
            document.createElement(
                "div"
            );

        card.className =
            "sale-card";

        let itemsHTML = "";

        sale.items.forEach(item => {

            itemsHTML += `

                <div class="sale-item">

                    <span>

                        ${item.name}
                        x${item.qty}

                    </span>

                    <span>

                        K${(
                            item.price *
                            item.qty
                        ).toFixed(2)}

                    </span>

                </div>

            `;

        });

        card.innerHTML = `

            <h3>

                ${sale.id}

            </h3>

            <p>

                ${sale.date}

            </p>

            <hr>

            <div class="sale-items">

                ${itemsHTML}

            </div>

            <hr>

            <p>

                Total:
                K${sale.total.toFixed(2)}

            </p>
            <br>

            <div id="batscont">
<button
    onclick="
        deleteSale(
            '${sale.id}'
        )
    ">

    Delete

</button>

</div>
            

        `;

        salesContainer.appendChild(
            card
        );

    });

    document.getElementById(
        "totalTransactions"
    ).textContent =
        data.length;

    document.getElementById(
        "totalRevenue"
    ).textContent =
        `K${revenue.toFixed(2)}`;

}

document
.getElementById(
    "searchSale"
)
.addEventListener(
    "input",
    e => {

        const keyword =
            e.target.value
            .toLowerCase();

        const filtered =
            sales.filter(
                sale =>

                sale.id
                .toLowerCase()
                .includes(keyword)
            );

        renderSales(filtered);

    }
);

document
.getElementById(
    "searchSale"
)
.addEventListener(
    "input",
    e => {

        const keyword =
            e.target.value
            .toLowerCase();

        const filtered =
            sales.filter(
                sale =>

                sale.id
                .toLowerCase()
                .includes(keyword)
            );

        renderSales(filtered);

    }
);

function calculateTodaySales() {

    const today =
        new Date()
        .toISOString()
        .split("T")[0];

    let total = 0;

    sales.forEach(sale => {

        if (
            sale.date
            .startsWith(today)
        ) {

            total += sale.total;

        }

    });

    document
    .getElementById(
        "todaySales"
    )
    .textContent =
        `K${total.toFixed(2)}`;

}


//**************************************** */
// MOMTHLY SALESA
//*************************************** */

function calculateMonthlySales() {

    const currentMonth =
        new Date()
        .toISOString()
        .slice(0, 7);

    let total = 0;

    sales.forEach(sale => {

        if (
            sale.date
            .startsWith(
                currentMonth
            )
        ) {

            total += sale.total;

        }

    });

    document
    .getElementById(
            "monthlySales"
        )
        .textContent =
        `K${total.toFixed(2)}`;

}

function calculateProfit() {

    let profit = 0;

    sales.forEach(sale => {

        sale.items.forEach(item => {

            profit +=

                (
                    item.price -
                    item.costPrice
                ) *

                item.qty;

        });

    });

    document
    .getElementById(
        "totalProfit"
    )
    .textContent =
        `K${profit.toFixed(2)}`;

}


function deleteSale(
    saleId
) {

    showConfirm(

        "Delete Sale",

        "This action cannot be undone. Continue?",

        () => {

            sales =
                sales.filter(
                    sale =>
                        sale.id !==
                        saleId
                );

            localStorage.setItem(

                "pos_sales",

                JSON.stringify(
                    sales
                )

            );

            renderSales();

        }

    );

}
//************************************** */
//    DELETECONFIRMATION FUNCTION.
//************************************** */

let confirmCallback = null;

function showConfirm(

    title,

    message,

    callback

) {

    document
        .getElementById(
            "confirmTitle"
        )
        .textContent =
        title;

    document
        .getElementById(
            "confirmMessage"
        )
        .textContent =
        message;

    confirmCallback =
        callback;

    document
        .getElementById(
            "confirmModal"
        )
        .classList.add(
            "show"
        );

}

//************************************** */
//    DELETECONFIRMATION EVENTLISTENER
//************************************** */
document
.getElementById(
    "confirmCancel"
)
.addEventListener(
    "click",
    () => {

        document
        .getElementById(
            "confirmModal"
        )
        .classList.remove(
            "show"
        );

    }
);

document
.getElementById(
    "confirmOk"
)
.addEventListener(
    "click",
    () => {

        document
        .getElementById(
            "confirmModal"
        )
        .classList.remove(
            "show"
        );

        if (
            typeof confirmCallback
            === "function"
        ) {

            confirmCallback();

        }
        reload();
    }
);
function reload(){
renderSales();
calculateTodaySales();
calculateMonthlySales();
}

reload();