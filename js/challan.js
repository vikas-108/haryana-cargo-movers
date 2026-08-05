
document.addEventListener("DOMContentLoaded", () => {

    // Buttons
    const addItemBtn = document.getElementById("addItemBtn");
    const closeModal = document.getElementById("closeModal");
    const cancelBtn = document.getElementById("cancelBtn");
    const saveItem = document.getElementById("saveItem");

    // Modal
    const modal = document.getElementById("itemModal");

    // Inputs
    const tm = document.getElementById("tm");
    const bags = document.getElementById("bags");
    const particular = document.getElementById("particular");
    const nag = document.getElementById("nag");
    const weight = document.getElementById("weight");
    const freight = document.getElementById("freight");

    // Table
    const goodsBody = document.getElementById("goodsBody");

    // Totals
    const totalBags = document.getElementById("totalBags");
    const totalWeight = document.getElementById("totalWeight");
    const totalFreight = document.getElementById("totalFreight");

    let editIndex = -1;

    let items = [];

    // -----------------------------
    // Modal
    // -----------------------------

    addItemBtn.onclick = () => {

        modal.classList.add("show");

    };

    function closePopup() {

        modal.classList.remove("show");

        clearForm();

    }

    closeModal.onclick = closePopup;

    cancelBtn.onclick = closePopup;

    window.onclick = function(e){

        if(e.target===modal){

            closePopup();

        }

    }

    // -----------------------------
    // Save Item
    // -----------------------------

    saveItem.onclick = function(){

        if(
            bags.value==="" ||
            particular.value==="" ||
            weight.value==="" ||
            nag.value===""||
            freight.value===""){

            alert("Please fill all fields.");

            return;

        }

        const obj={

            tm:tm.value,

            bags:Number(bags.value),

            particular:particular.value,
            nag:Number(nag.value),
            weight:Number(weight.value),

            freight:Number(freight.value)

        };

        if(editIndex==-1){

            items.push(obj);

        }else{

            items[editIndex]=obj;

            editIndex=-1;

            saveItem.innerText="Add Item";

        }

        renderTable();

        closePopup();

    }

    // -----------------------------
    // Render Table
    // -----------------------------

    function renderTable(){

        goodsBody.innerHTML="";

        let bagTotal=0;
         let nagTotal=0;
        let weightTotal=0;
        
        let freightTotal=0;

        items.forEach((item,index)=>{

            bagTotal+=item.bags;
            nagTotal+=item.nag;
            weightTotal+=item.weight;

            freightTotal+=item.freight;

            goodsBody.innerHTML+=`

            <tr>

                <td>${index+1}</td>

                <td>${item.tm}</td>

                <td>${item.bags}</td>

                <td>${item.particular}</td>
                <td>${item.nag}</td>
                <td>${item.weight}</td>

                <td>₹ ${item.freight}</td>

                <td>

                    <button class="editBtn" data-id="${index}">

                        ✏

                    </button>

                    <button class="deleteBtn" data-id="${index}">

                        🗑

                    </button>

                </td>

            </tr>

            `;

        });

        totalBags.innerText=bagTotal;
        totalNag.innerText=nagTotal;
        totalWeight.innerText=weightTotal+" KG";

        totalFreight.innerText="₹ "+freightTotal;

        attachEvents();

    }

    // -----------------------------
    // Edit/Delete
    // -----------------------------

    function attachEvents(){

        document.querySelectorAll(".editBtn").forEach(btn=>{

            btn.onclick=function(){

                const id=this.dataset.id;

                editIndex=id;

                tm.value=items[id].tm;

                bags.value=items[id].bags;

                particular.value=items[id].particular;
                nag.value=items[id].nag;
                weight.value=items[id].weight;

                freight.value=items[id].freight;

                saveItem.innerText="Update Item";

                modal.classList.add("show");

            }

        });

        document.querySelectorAll(".deleteBtn").forEach(btn=>{

            btn.onclick=function(){

                if(confirm("Delete this item?")){

                    items.splice(this.dataset.id,1);

                    renderTable();

                }

            }

        });

    }

    // -----------------------------
    // Clear Form
    // -----------------------------

    function clearForm(){

        tm.selectedIndex=0;

        bags.value="";

        particular.value="";
         nag.value="";
        weight.value="";

        freight.value="";

        editIndex=-1;

        saveItem.innerText="Add Item";

    }

});

