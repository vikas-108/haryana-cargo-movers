document.addEventListener("DOMContentLoaded", () => {
    // --- Calculation Logic ---
    const chargedWeightElement = document.getElementById("charged-weight-val");
    const rateElement = document.getElementById("rate-val");
    const totalFreightElement = document.getElementById("freight-val");
    const operationalCostInputs = document.querySelectorAll(".cost-calc");
    const totalOutputField = document.getElementById("grand-total");

    function processInvoiceSheetMath() {
        const chargedWeight = parseFloat(chargedWeightElement.value) || 0;
        const rateCharge = parseFloat(rateElement.value) || 0;
        
        // 1. Calculate Base Freight (Charged Weight * Rate)
        const calculatedFreight = chargedWeight * rateCharge;
        
        // 2. Display Freight
        totalFreightElement.value = calculatedFreight > 0 ? calculatedFreight.toFixed(2) : "";

        // 3. Sum All Costs (Freight + Labor + Toll + etc)
        let subtotalAccumulator = calculatedFreight;
        operationalCostInputs.forEach(inputNode => {
            subtotalAccumulator += parseFloat(inputNode.value) || 0;
        });

        // 4. Update Grand Total
        totalOutputField.value = subtotalAccumulator > 0 ? subtotalAccumulator.toFixed(2) : "";
    }

    // Attach Math Listeners
    chargedWeightElement.addEventListener("input", processInvoiceSheetMath);
    rateElement.addEventListener("input", processInvoiceSheetMath);
    operationalCostInputs.forEach(inputBox => inputBox.addEventListener("input", processInvoiceSheetMath));

    // --- GSTIN 15-Box Auto-Step Logic ---
    const gstBoxes = document.querySelectorAll(".gst-box");
    
    gstBoxes.forEach((box, index) => {
        box.addEventListener("input", (e) => {
            // If user types a char, move to next box
            if (box.value.length === 1) {
                if (index < gstBoxes.length - 1) {
                    gstBoxes[index + 1].focus();
                }
            }
        });

        box.addEventListener("keydown", (e) => {
            // If user hits Backspace on empty box, move to previous
            if (e.key === "Backspace" && box.value === "") {
                if (index > 0) {
                    gstBoxes[index - 1].focus();
                }
            }
        });
    });
});


function printBilty() {

    const printSheet = document.getElementById("print-sheet");

    printSheet.innerHTML = `
        <!-- Your print HTML -->
    `;

    window.print();
}
