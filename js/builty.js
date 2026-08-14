
(function(){
  function num(v){ const n = parseFloat(v); return isNaN(n) ? 0 : n; }
  function round2(n){ return Math.round(n * 100) / 100; }

  const actualWeight = document.getElementById('actualWeight');
  const chargedWeight = document.getElementById('chargedWeight');
  const rate = document.getElementById('rate');
  const totalFreight = document.getElementById('totalFreight');
  const grCharge = document.getElementById('grCharge');
  const lcCharge = document.getElementById('lcCharge');
  const labourCharge = document.getElementById('labourCharge');
  const tollCharge = document.getElementById('tollCharge');
  const ddCharge = document.getElementById('ddCharge');
  const grandTotal = document.getElementById('grandTotal');

  function sumTotal(){
    const total = num(totalFreight.value) + num(grCharge.value) + num(lcCharge.value) +
                  num(labourCharge.value) + num(tollCharge.value) + num(ddCharge.value);
    grandTotal.value = total ? round2(total) : '';
  }

  function autoCalculate(){
    const weight = num(chargedWeight.value) || num(actualWeight.value);
    const r = num(rate.value);
    if(weight && r){
      totalFreight.value = round2(weight * r);
    }
    sumTotal();
  }

  document.getElementById('calcBtn').addEventListener('click', autoCalculate);
  document.getElementById('printBtn').addEventListener('click', ()=> window.print());

  [totalFreight, grCharge, lcCharge, labourCharge, tollCharge, ddCharge].forEach(el=>{
    el.addEventListener('input', sumTotal);
  });

  // ===== Build the Driver's Copy as a live-synced clone of the Original, right before printing =====
  function syncDriverCopy(){
    const original = document.getElementById('sheet');
    const clone = original.cloneNode(true);

    // strip every id from the clone so we never end up with duplicate DOM ids
    if(clone.id) clone.removeAttribute('id');
    clone.querySelectorAll('[id]').forEach(el => el.removeAttribute('id'));

    // copy the live values (cloneNode only copies default attributes, not typed-in values)
    const originalFields = original.querySelectorAll('input, textarea, select');
    const cloneFields = clone.querySelectorAll('input, textarea, select');
    originalFields.forEach((el, i)=>{
      const c = cloneFields[i];
      if(!c) return;
      if(el.type === 'radio' || el.type === 'checkbox'){ c.checked = el.checked; }
      else { c.value = el.value; }
    });

    // give the clone's radio groups their own name so they never interact with the original's
    clone.querySelectorAll('input[type=radio]').forEach(r=>{ r.name = r.name + '-copy'; });

    // relabel this copy
    const tag = clone.querySelector('.copy-tag');
    if(tag) tag.textContent = "DRIVER'S COPY";

    const container = document.getElementById('sheetCloneContainer');
    container.innerHTML = '';
    container.appendChild(clone);
  }

  window.addEventListener('beforeprint', syncDriverCopy);
})();
