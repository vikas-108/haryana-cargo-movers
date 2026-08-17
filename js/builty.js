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

  const grNoInput = document.getElementById('grNo');
  const grDateInput = document.getElementById('grDate');
  const toastEl = document.getElementById('toast');

  let toastTimer;
  function showToast(msg){
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(()=> toastEl.classList.remove('show'), 2800);
  }

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

  [totalFreight, grCharge, lcCharge, labourCharge, tollCharge, ddCharge].forEach(el=>{
    el.addEventListener('input', sumTotal);
  });

  // ===== Auto-generated G.R. No. (starts at 0) + editable save/lookup by G.R. No. =====
  const GR_COUNTER_KEY = 'jhcmGrCounter';
  const BILTY_STORE_KEY = 'jhcmBiltyStore'; // keyed by G.R. No. so re-saving the same number updates it in place

  const RESET_TEXT_IDS = [
    'grDate','fromCity','toCity','deliveryAt','pvtMark',
    'consignorName','consignorGSTIN','consigneeName','consigneeGSTIN',
    'pkgs','description','invoiceNo','valueOfBill','ewayBillNo',
    'driverSign','clerkSign'
  ];
  const RESET_CHARGE_FIELDS = [actualWeight, chargedWeight, rate, totalFreight, grCharge, lcCharge, labourCharge, tollCharge, ddCharge, grandTotal];

  const grBadge = document.getElementById('grStatusBadge');
  let currentIsExisting = false;

  function getGrCounter(){
    const stored = localStorage.getItem(GR_COUNTER_KEY);
    return stored === null ? 0 : parseInt(stored, 10);
  }
  function setGrCounter(n){ localStorage.setItem(GR_COUNTER_KEY, String(n)); }

  function loadBiltyStore(){
    try{ return JSON.parse(localStorage.getItem(BILTY_STORE_KEY)) || {}; }
    catch(e){ return {}; }
  }
  function saveBiltyStore(store){ localStorage.setItem(BILTY_STORE_KEY, JSON.stringify(store)); }

  function initGrNo(){
    grNoInput.value = getGrCounter();
  }
  initGrNo();

  function collectFormData(){
    const data = { grNo: grNoInput.value, savedAt: new Date().toISOString() };
    RESET_TEXT_IDS.forEach(id=>{ data[id] = document.getElementById(id).value; });
    RESET_CHARGE_FIELDS.forEach(el=>{ data[el.id] = el.value; });
    const payStatus = document.querySelector('input[name="payStatus"]:checked');
    const taxPayableBy = document.querySelector('input[name="taxPayableBy"]:checked');
    data.payStatus = payStatus ? payStatus.value : '';
    data.taxPayableBy = taxPayableBy ? taxPayableBy.value : '';
    return data;
  }

  function populateForm(data){
    RESET_TEXT_IDS.forEach(id=>{ document.getElementById(id).value = data[id] || ''; });
    RESET_CHARGE_FIELDS.forEach(el=>{ el.value = data[el.id] || ''; });
    document.querySelectorAll('input[name="payStatus"]').forEach(r=>{ r.checked = (r.value === data.payStatus); });
    document.querySelectorAll('input[name="taxPayableBy"]').forEach(r=>{ r.checked = (r.value === data.taxPayableBy); });
  }

  function updateGrBadge(){
    if(!grBadge) return;
    grBadge.textContent = currentIsExisting ? 'editing saved record' : '';
    grBadge.classList.toggle('existing', currentIsExisting);
  }

  function advanceGrNo(){
    const next = getGrCounter() + 1;
    setGrCounter(next);
    grNoInput.value = next;
  }

  function resetForNextBilty(){
    RESET_TEXT_IDS.forEach(id=>{ document.getElementById(id).value = ''; });
    RESET_CHARGE_FIELDS.forEach(el=>{ el.value = ''; });
    document.querySelectorAll('input[name="payStatus"]').forEach(r=> r.checked = false);
    document.getElementById('taxTransporter').checked = true;
    currentIsExisting = false;
    updateGrBadge();
  }

  // Typing/selecting an already-saved G.R. No. loads that bilty's full details back into the form.
  function handleGrNoLookup(){
    const grNo = grNoInput.value.trim();
    const store = loadBiltyStore();
    if(grNo && store[grNo]){
      populateForm(store[grNo]);
      currentIsExisting = true;
      showToast('G.R. No. ' + grNo + ' loaded — edit the details and click Save to update it.');
    } else {
      currentIsExisting = false;
    }
    updateGrBadge();
  }
  grNoInput.addEventListener('change', handleGrNoLookup);

  function handleSave(){
    const grNo = grNoInput.value.trim();
    if(!grNo){ showToast('Enter a G.R. No. before saving.'); return; }

    const store = loadBiltyStore();
    store[grNo] = collectFormData();
    saveBiltyStore(store);

    if(currentIsExisting){
      showToast('G.R. No. ' + grNo + ' updated.');
    } else {
      showToast('G.R. No. ' + grNo + ' saved. Moving on to the next G.R. No.');
      advanceGrNo();
      resetForNextBilty();
    }
  }

  document.getElementById('saveBtn').addEventListener('click', handleSave);

  document.getElementById('printBtn').addEventListener('click', ()=>{
    const grNo = grNoInput.value.trim();
    if(!grNo){ showToast('Enter a G.R. No. before printing.'); return; }
    // Save & Print always saves immediately, so nothing is lost even if the print dialog is cancelled.
    const store = loadBiltyStore();
    store[grNo] = collectFormData();
    saveBiltyStore(store);
    window.print();
  });

  // After the print dialog closes we can't tell whether the person actually printed or
  // hit Cancel — browsers fire this event either way — so we ask. The bilty itself is
  // already saved at this point either way; a confirmed "yes, I printed it" is what
  // advances to the next G.R. No. and clears the form. Cancel leaves everything exactly
  // as it was — same G.R. No., same data, ready to try printing again. Re-printing an
  // already-saved record never advances or resets anything.
  window.addEventListener('afterprint', ()=>{
    if(currentIsExisting) return;
    const grNo = grNoInput.value.trim();
    if(!grNo) return;
    const didPrint = confirm(
      'Did the Goods Receipt for G.R. No. ' + grNo + ' print successfully?\n\n' +
      'OK — move on to the next G.R. No.\n' +
      'Cancel — keep this same bilty open (G.R. No. stays the same).'
    );
    if(didPrint){
      advanceGrNo();
      resetForNextBilty();
      showToast('G.R. No. ' + grNo + ' saved. Ready for G.R. No. ' + grNoInput.value + '.');
    }
  });

  // ===== Build the Driver's Copy as a live-synced clone of the Original, right before printing =====
  const CHARGE_FIELD_IDS = ['rate','totalFreight','grCharge','lcCharge','labourCharge','tollCharge','ddCharge','grandTotal'];

  function syncDriverCopy(){
    const original = document.getElementById('sheet');
    const clone = original.cloneNode(true);

    // copy the live values (cloneNode only copies default attributes, not typed-in values)
    const originalFields = original.querySelectorAll('input, textarea, select');
    const cloneFields = clone.querySelectorAll('input, textarea, select');
    originalFields.forEach((el, i)=>{
      const c = cloneFields[i];
      if(!c) return;
      if(el.type === 'radio' || el.type === 'checkbox'){ c.checked = el.checked; }
      else { c.value = el.value; }
    });

    // If the bill is already Paid or T.B.B., the driver isn't collecting any money —
    // zero out the whole charges section on the Driver's Copy so no amount is shown.
    const checkedStatus = original.querySelector('input[name="payStatus"]:checked');
    const statusValue = checkedStatus ? checkedStatus.value : '';
    if(statusValue === 'T.B.B.'){
      CHARGE_FIELD_IDS.forEach(id=>{
        const field = clone.querySelector('#' + id);
        if(field) field.value = '0';
      });
    }

    // strip every id from the clone so we never end up with duplicate DOM ids
    if(clone.id) clone.removeAttribute('id');
    clone.querySelectorAll('[id]').forEach(el => el.removeAttribute('id'));

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