// ========================================
// LOAD DATA
// ========================================

const sales =
    JSON.parse(
        localStorage.getItem(
            "pos_sales"
        )
    ) || [];

const products =
    JSON.parse(
        localStorage.getItem(
            "pos_products"
        )
    ) || [];

/* =========================
   DAILY SALES CHART
========================= */

function renderDailySalesChart() {

    const dailyTotals = {};

    sales.forEach(sale => {

        const date =

            new Date(
                sale.date
            )

            .toLocaleDateString();

        if (!dailyTotals[date]) {

            dailyTotals[date] = 0;

        }

        dailyTotals[date] += sale.total;

    });

    new Chart(

        document.getElementById(
            "dailySalesChart"
        ),

        {

            type:"line",

            data:{

                labels:
                    Object.keys(
                        dailyTotals
                    ),

                datasets:[{

                    label:
                        "Daily Sales",

                    data:
                        Object.values(
                            dailyTotals
                        ),

                    tension:0.4,

                    fill:true

                }]

            },

            options:{

                responsive:true,

                maintainAspectRatio:false

            }

        }

    );

}

/* =========================
   MONTHLY SALES CHART
========================= */

function renderMonthlySalesChart() {

    const monthlyTotals = {};

    sales.forEach(sale => {

        const d =
            new Date(
                sale.date
            );

        const month =

            d.getFullYear()

            +

            "-"

            +

            String(
                d.getMonth()+1
            )

            .padStart(
                2,
                "0"
            );

        if (!monthlyTotals[month]) {

            monthlyTotals[month] = 0;

        }

        monthlyTotals[month] += sale.total;

    });

    new Chart(

        document.getElementById(
            "monthlySalesChart"
        ),

        {

            type:"bar",

            data:{

                labels:
                    Object.keys(
                        monthlyTotals
                    ),

                datasets:[{

                    label:
                        "Monthly Sales",

                    data:
                        Object.values(
                            monthlyTotals
                        )

                }]

            },

            options:{

                responsive:true,

                maintainAspectRatio:false

            }

        }

    );

}

/* =========================
   EXPORT EXCEL
========================= */
document
.getElementById(
    "exportExcelBtn"
)
.addEventListener(
    "click",
    exportExcel
);

function exportExcel() {

    const workbook =
        XLSX.utils.book_new();

    /* =====================
       SALES SUMMARY
    ===================== */

    const salesSummary = [];

    sales.forEach(sale => {

        salesSummary.push({

            Receipt: sale.id,

            Date: sale.date,

            Items: sale.items.length,

            Total: sale.total,

            Paid: sale.paid,

            Change: sale.change

        });

    });

    const summarySheet =

        XLSX.utils.json_to_sheet(
            salesSummary
        );

    XLSX.utils.book_append_sheet(

        workbook,

        summarySheet,

        "Sales Summary"

    );

    /* =====================
       SALES DETAILS
    ===================== */

    const details = [];

    sales.forEach(sale => {

        sale.items.forEach(item => {

            details.push({

                Receipt: sale.id,

                Date: sale.date,

                Product: item.name,

                Qty: item.qty,

                CostPrice:
                    item.costPrice,

                SellingPrice:
                    item.price,

                Revenue:
                    item.price *
                    item.qty,

                Profit:

                    (
                        item.price -

                        item.costPrice
                    )

                    *

                    item.qty

            });

        });

    });

    const detailSheet =

        XLSX.utils.json_to_sheet(
            details
        );

    XLSX.utils.book_append_sheet(

        workbook,

        detailSheet,

        "Sales Details"

    );

    /* =====================
       INVENTORY
    ===================== */

    const inventory =

        products.map(product => ({

            Product:
                product.name,

            Category:
                product.category,

            Stock:
                product.stock,

            CostPrice:
                product.costPrice,

            SellingPrice:
                product.price,

            InventoryValue:

                product.stock *

                product.costPrice

        }));

    const inventorySheet =

        XLSX.utils.json_to_sheet(
            inventory
        );

    XLSX.utils.book_append_sheet(

        workbook,

        inventorySheet,

        "Inventory"

    );

    XLSX.writeFile(

        workbook,

        `POS_Report_${new Date()
        .toISOString()
        .split("T")[0]}.xlsx`

    );

}
/* =========================
   EXPORT PDF
========================= */
function exportPDF() {

    const {
        jsPDF
    } = window.jspdf;

    const doc =
        new jsPDF();

    const sales =
        JSON.parse(
            localStorage.getItem(
                "pos_sales"
            )
        ) || [];

    const settings =
        JSON.parse(
            localStorage.getItem(
                "pos_settings"
            )
        ) || {};

    let y = 20;

    /* =========================
       HEADER
    ========================= */

    doc.setFontSize(20);

    doc.setFont(
        undefined,
        "bold"
    );

    doc.text(

        settings.businessName ||

        "BUSINESS SALES REPORT",

        15,

        y

    );

    y += 8;

    doc.setFontSize(10);

    doc.setFont(
        undefined,
        "normal"
    );

    doc.text(

        settings.businessPhone ||

        "",

        15,

        y

    );

    y += 5;

    doc.text(

        settings.businessAddress ||

        "",

        15,

        y

    );

    y += 5;

    doc.text(

        `Generated: ${new Date().toLocaleString()}`,

        15,

        y

    );

    y += 8;

    doc.line(
        15,
        y,
        195,
        y
    );

    y += 10;

    /* =========================
       SUMMARY
    ========================= */

    const totalRevenue =

        sales.reduce(

            (sum,sale) =>

                sum + sale.total,

            0

        );

    doc.setFontSize(12);

    doc.setFont(
        undefined,
        "bold"
    );

    doc.text(

        "REPORT SUMMARY",

        15,

        y

    );

    y += 8;

    doc.setFont(
        undefined,
        "normal"
    );

    doc.text(

        `Transactions: ${sales.length}`,

        15,

        y

    );

    y += 6;

    doc.text(

        `Revenue: K${totalRevenue.toFixed(2)}`,

        15,

        y

    );

    y += 10;

    doc.line(
        15,
        y,
        195,
        y
    );

    y += 10;

    /* =========================
       SALES DETAILS
    ========================= */

    sales.forEach(

        sale => {

            if (y > 240) {

                doc.addPage();

                y = 20;

            }

            doc.setFontSize(12);

            doc.setFont(
                undefined,
                "bold"
            );

            doc.text(

                `Receipt: ${sale.id}`,

                15,

                y

            );

            y += 6;

            doc.setFont(
                undefined,
                "normal"
            );

            doc.text(

                `Date: ${sale.date}`,

                15,

                y

            );

            y += 10;

            /* TABLE HEADER */

            doc.setFont(
                undefined,
                "bold"
            );

            doc.text(
                "Product",
                20,
                y
            );

            doc.text(
                "Qty",
                120,
                y
            );

            doc.text(
                "Amount",
                180,
                y,
                {
                    align:
                    "right"
                }
            );

            y += 4;

            doc.line(
                20,
                y,
                180,
                y
            );

            y += 6;

            doc.setFont(
                undefined,
                "normal"
            );

            sale.items.forEach(

                item => {

                    if (y > 260) {

                        doc.addPage();

                        y = 20;

                    }

                    doc.text(

                        item.name,

                        20,

                        y

                    );

                    doc.text(

                        `${item.qty} x K${item.price}`,

                        120,

                        y

                    );

                    doc.text(

                        `K${(

                            item.qty *

                            item.price

                        ).toFixed(2)}`,

                        180,

                        y,

                        {
                            align:
                            "right"
                        }

                    );

                    y += 6;

                }

            );

            y += 2;

            doc.line(
                20,
                y,
                180,
                y
            );

            y += 7;

            doc.setFont(
                undefined,
                "bold"
            );

            doc.text(

                `Sale Total: K${sale.total.toFixed(2)}`,

                20,

                y

            );

            y += 8;

            doc.setFont(
                undefined,
                "normal"
            );

            doc.line(
                15,
                y,
                195,
                y
            );

            y += 10;

        }

    );

    /* =========================
       GRAND TOTAL
    ========================= */

    if (y > 240) {

        doc.addPage();

        y = 20;

    }

    doc.setFontSize(14);

    doc.setFont(
        undefined,
        "bold"
    );

    doc.text(

        `GRAND TOTAL REVENUE: K${totalRevenue.toFixed(2)}`,

        15,

        y

    );

    y += 10;

    /* =========================
       FOOTER
    ========================= */

    doc.setFontSize(10);

    doc.setFont(
        undefined,
        "normal"
    );

    doc.text(

        "Generated by Babbage POS System",

        15,

        285

    );

    /* =========================
       SAVE
    ========================= */

    doc.save(

        `Sales_Report_${
            new Date()
            .toISOString()
            .split("T")[0]
        }.pdf`

    );

}

document
.getElementById(
    "exportPdfBtn"
)
.addEventListener(
    "click",
    exportPDF
);

/* =========================
   INIT
========================= */

renderDailySalesChart();

renderMonthlySalesChart();