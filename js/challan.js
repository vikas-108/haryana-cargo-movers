document.addEventListener("DOMContentLoaded", () => {

    // =====================================================
    // BUTTONS
    // =====================================================

    const addItemBtn = document.getElementById("addItemBtn");
    const closeModal = document.getElementById("closeModal");
    const cancelBtn = document.getElementById("cancelBtn");
    const saveItem = document.getElementById("saveItem");
const settlementTopay =
    document.getElementById("settlementTopay");

const settlementDD =
    document.getElementById("settlementDD");

const settlementLC =
    document.getElementById("settlementLC");

const settlementPF =
    document.getElementById("settlementPF");

const settlementKatt =
    document.getElementById("settlementKatt");

const deliveryCommission =
    document.getElementById("deliveryCommission");

const payToDriver =
    document.getElementById("payToDriver");
    const printChallanBtn =
        document.getElementById("printChallanBtn");


    // =====================================================
    // MODAL
    // =====================================================

    const modal = document.getElementById("itemModal");


    // =====================================================
    // INPUTS
    // =====================================================

    const grnumber =
        document.getElementById("grnumber");

    const consignor =
        document.getElementById("consignor");

    const consignee =
        document.getElementById("consignee");

    const description =
        document.getElementById("description");

    const nag =
        document.getElementById("nag");

    const station =
        document.getElementById("station");

    const pm =
        document.getElementById("pm");

    const weight =
        document.getElementById("weight");

    const topay =
        document.getElementById("topay");

    const paid =
        document.getElementById("paid");

    const dd =
        document.getElementById("dd");

    const katt =
        document.getElementById("katt");

    const ctl =
        document.getElementById("ctl");

    const freight =
        document.getElementById("freight");


    // =====================================================
    // TABLE
    // =====================================================

    const goodsBody =
        document.getElementById("goodsBody");


    // =====================================================
    // TOTALS
    // =====================================================

    const totalNag =
        document.getElementById("totalNag");

    const totalWeight =
        document.getElementById("totalWeight");

    const totalFreight =
        document.getElementById("totalFreight");

    const totalpaid =
        document.getElementById("totalpaid");

    const totalctl =
        document.getElementById("totalctl");


    // =====================================================
    // CHECK REQUIRED ELEMENTS
    // =====================================================

    if (!addItemBtn) {
        console.error("addItemBtn not found");
        return;
    }

    if (!modal) {
        console.error("itemModal not found");
        return;
    }

    if (!saveItem) {
        console.error("saveItem not found");
        return;
    }

    if (!goodsBody) {
        console.error("goodsBody not found");
        return;
    }


    // =====================================================
    // DATA
    // =====================================================

    let editIndex = -1;

    let items = [];


    // =====================================================
    // OPEN MODAL
    // =====================================================

    addItemBtn.addEventListener("click", () => {

        editIndex = -1;

        saveItem.innerHTML =
            '<i class="fa-solid fa-plus"></i> Add Item';

        modal.classList.add("show");

        // Focus first field
        setTimeout(() => {

            if (grnumber) {
                grnumber.focus();
            }

        }, 100);

    });


    // =====================================================
    // CLOSE MODAL
    // =====================================================

    function closePopup() {

        modal.classList.remove("show");

        clearForm();

    }


    if (closeModal) {

        closeModal.addEventListener(
            "click",
            closePopup
        );

    }


    if (cancelBtn) {

        cancelBtn.addEventListener(
            "click",
            closePopup
        );

    }


    // Click outside modal

    window.addEventListener("click", (e) => {

        if (e.target === modal) {

            closePopup();

        }

    });


    // =====================================================
    // SAVE / ADD ITEM
    // =====================================================

    saveItem.addEventListener("click", () => {

        /*
         * ONLY THESE ARE REQUIRED
         *
         * Other financial fields can be empty.
         */

        if (
            grnumber.value.trim() === "" ||
            consignor.value.trim() === "" ||
            consignee.value.trim() === "" ||
            description.value.trim() === "" ||
            nag.value.trim() === "" ||
            station.value.trim() === "" ||
            weight.value.trim() === ""
        ) {

            alert(
                "Please fill GR No., Consignor, Consignee, Description, Nag, Station and Weight."
            );

            return;

        }


        // =================================================
        // CREATE OBJECT
        // Empty numeric fields become 0
        // =================================================

        const obj = {

            grnumber:
                grnumber.value.trim(),

            consignor:
                consignor.value.trim(),

            consignee:
                consignee.value.trim(),

            description:
                description.value.trim(),

            nag:
                Number(nag.value) || 0,

            station:
                station.value.trim(),

            pm:
                Number(pm.value) || 0,

            weight:
                Number(weight.value) || 0,

            topay:
                Number(topay.value) || 0,

            paid:
                Number(paid.value) || 0,

            dd:
                Number(dd.value) || 0,

            katt:
                Number(katt.value) || 0,

            ctl:
                Number(ctl.value) || 0,

            freight:
                Number(freight.value) || 0

        };


        // =================================================
        // ADD
        // =================================================

        if (editIndex === -1) {

            items.push(obj);

        }

        // =================================================
        // UPDATE
        // =================================================

        else {

            items[editIndex] = obj;

        }


        // Reset edit state

        editIndex = -1;

        saveItem.innerHTML =
            '<i class="fa-solid fa-plus"></i> Add Item';


        // Render

        renderTable();


        // Close

        closePopup();

    });


    // =====================================================
    // RENDER TABLE
    // =====================================================

    function renderTable() {

        goodsBody.innerHTML = "";


        let nagTotal = 0;

        let weightTotal = 0;

        let paidTotal = 0;

        let freightTotal = 0;

        let ctlTotal = 0;


        items.forEach((item, index) => {

            // Totals

            nagTotal += Number(item.nag) || 0;

            weightTotal += Number(item.weight) || 0;

            paidTotal += Number(item.paid) || 0;

            ctlTotal += Number(item.ctl) || 0;

            freightTotal += Number(item.freight) || 0;


            // Table row

            goodsBody.innerHTML += `

                <tr>

                    <td>
                        ${index + 1}
                    </td>

                    <td>
                        ${escapeHTML(item.grnumber)}
                    </td>

                    <td>
                        ${escapeHTML(item.consignor)}
                    </td>

                    <td>
                        ${escapeHTML(item.consignee)}
                    </td>

                    <td>
                        ${escapeHTML(item.description)}
                    </td>

                    <td>
                        ${item.nag}
                    </td>

                    <td>
                        ${escapeHTML(item.station)}
                    </td>

                    <td>
                        ${item.pm}
                    </td>

                    <td>
                        ${item.weight}
                    </td>

                    <td>
                        ${item.topay}
                    </td>

                    <td>
                        ${item.paid}
                    </td>

                    <td>
                        ${item.dd}
                    </td>

                    <td>
                        ${item.katt}
                    </td>

                    <td>
                        ${item.ctl}
                    </td>

                    <td>
                        ₹ ${item.freight}
                    </td>

                    <td class="action-column">

                        <button
                            type="button"
                            class="editBtn"
                            data-id="${index}">

                            ✏

                        </button>

                        <button
                            type="button"
                            class="deleteBtn"
                            data-id="${index}">

                            🗑

                        </button>

                    </td>

                </tr>

            `;

        });


        // =================================================
        // UPDATE TOTALS
        // =================================================

        if (totalNag) {

            totalNag.innerText =
                nagTotal;

        }


        if (totalWeight) {

            totalWeight.innerText =
                weightTotal + " KG";

        }


        if (totalpaid) {

            totalpaid.innerText =
                "₹ " + paidTotal.toFixed(2);

        }


        if (totalctl) {

            totalctl.innerText =
                ctlTotal.toFixed(2);

        }


        if (totalFreight) {

            totalFreight.innerText =
                "₹ " + freightTotal.toFixed(2);

        }


        // Attach edit/delete

        attachEvents();
         calculateDriverPayment();
    }


    // =====================================================
    // EDIT / DELETE
    // =====================================================

    function attachEvents() {


        // -----------------------------
        // EDIT
        // -----------------------------

        document
            .querySelectorAll(".editBtn")
            .forEach(btn => {

                btn.addEventListener("click", function () {

                    const id =
                        Number(this.dataset.id);

                    const item =
                        items[id];

                    if (!item) {
                        return;
                    }


                    editIndex = id;


                    // Fill form

                    grnumber.value =
                        item.grnumber || "";

                    consignor.value =
                        item.consignor || "";

                    consignee.value =
                        item.consignee || "";

                    description.value =
                        item.description || "";

                    nag.value =
                        item.nag ?? "";

                    station.value =
                        item.station || "";

                    pm.value =
                        item.pm ?? "";

                    weight.value =
                        item.weight ?? "";

                    topay.value =
                        item.topay ?? "";

                    paid.value =
                        item.paid ?? "";

                    dd.value =
                        item.dd ?? "";

                    katt.value =
                        item.katt ?? "";

                    ctl.value =
                        item.ctl ?? "";

                    freight.value =
                        item.freight ?? "";


                    // Change button

                    saveItem.innerHTML =
                        '<i class="fa-solid fa-pen"></i> Update Item';


                    // Open modal

                    modal.classList.add("show");

                });

            });


        // -----------------------------
        // DELETE
        // -----------------------------

        document
            .querySelectorAll(".deleteBtn")
            .forEach(btn => {

                btn.addEventListener("click", function () {

                    const id =
                        Number(this.dataset.id);


                    if (
                        confirm(
                            "Delete this item?"
                        )
                    ) {

                        items.splice(id, 1);

                        renderTable();

                    }

                });

            });

    }


    // =====================================================
    // CLEAR FORM
    // =====================================================

    function clearForm() {

        grnumber.value = "";

        consignor.value = "";

        consignee.value = "";

        description.value = "";

        nag.value = "";

        station.value = "";

        pm.value = "";

        weight.value = "";

        topay.value = "";

        paid.value = "";

        dd.value = "";

        katt.value = "";

        ctl.value = "";

        freight.value = "";


        editIndex = -1;


        saveItem.innerHTML =
            '<i class="fa-solid fa-plus"></i> Add Item';

    }
// =====================================================
// DRIVER PAYMENT CALCULATION
// =====================================================

function calculateDriverPayment() {

    let totalToPay = 0;
    let totalDD = 0;
    let totalLC = 0;
    let totalPF = 0;
    let totalKatt = 0;

    items.forEach(item => {

        totalToPay += Number(item.topay) || 0;
        totalDD += Number(item.dd) || 0;
        totalLC += Number(item.ctl) || 0;
        totalPF += Number(item.freight) || 0;
        totalKatt += Number(item.katt) || 0;

    });

    const commission =
        Number(deliveryCommission?.value) || 0;

    const calculatedAmount =
        totalToPay
        - totalDD
        - commission
        + totalLC
        + totalPF
        - totalKatt;


    settlementTopay.innerText =
        "₹ " + totalToPay.toFixed(2);

    settlementDD.innerText =
        "− ₹ " + totalDD.toFixed(2);

    settlementLC.innerText =
        "+ ₹ " + totalLC.toFixed(2);

    settlementPF.innerText =
        "+ ₹ " + totalPF.toFixed(2);

    settlementKatt.innerText =
        "− ₹ " + totalKatt.toFixed(2);


    /*
       Only automatically set Pay To Driver
       when the user has not manually changed it.
    */

    if (
        payToDriver.dataset.manual !== "true"
    ) {

        payToDriver.value =
            calculatedAmount.toFixed(2);

    }

}
if (deliveryCommission) {

    deliveryCommission.addEventListener(
        "input",
        calculateDriverPayment
    );

}

    // =====================================================
    // ESCAPE HTML
    // Prevent HTML injection from user input
    // =====================================================

    function escapeHTML(value) {

        return String(value ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");

    }


    // =====================================================
    // PRINT
    // =====================================================

    if (printChallanBtn) {

        printChallanBtn.addEventListener(
            "click",
            () => {

                renderTable();

                setTimeout(() => {

                    window.print();

                }, 100);

            }
        );

    }

});
