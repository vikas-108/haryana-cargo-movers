
(function(){
  const tableBody = document.getElementById('tableBody');
  const addBtn = document.getElementById('addBtn');
  const saveBtn = document.getElementById('saveBtn');
  const printBtn = document.getElementById('printBtn');
  const modalOverlay = document.getElementById('modalOverlay');
  const cancelBtn = document.getElementById('cancelBtn');
  const entryForm = document.getElementById('entryForm');

  const partyNameInput = document.getElementById('partyName');
  const partyAddressEl = document.getElementById('partyAddress');
  const partyGSTINInput = document.getElementById('partyGSTIN');
  const taxesPaidByInput = document.getElementById('taxesPaidBy');
  const historyBadge = document.getElementById('historyBadge');
  const partyNamesList = document.getElementById('partyNamesList');
  const toastEl = document.getElementById('toast');

  let rows = [];
  let rowIdCounter = 0;
  let lastMatchedPartyKey = null;

  // seed with the original bill's data so the layout looks right immediately
  const seedData = [
    {grdate:"08/05/26", grno:"10224306", destination:"BHARATPUR", item:"PAINT", qty:11, wgt:165, rate:3.5, freight:577.5, bc:50, dd:0, lc:44, pf:20, invno:"PNT/26-27/0061"},
    {grdate:"14/05/26", grno:"10224529", destination:"SIKAR", item:"PAINT", qty:66, wgt:1335, rate:3, freight:4005, bc:50, dd:1000, lc:264, pf:20, invno:"PNT/26-"},
    {grdate:"14/05/26", grno:"10224531", destination:"LUNKARANS", item:"PAINT", qty:1, wgt:20, rate:4, freight:80, bc:50, dd:0, lc:4, pf:20, invno:"PNT/26-27/0110"},
    {grdate:"18/05/26", grno:"10224680", destination:"RAWATSAR", item:"PAINT", qty:5, wgt:62, rate:4.5, freight:279, bc:50, dd:0, lc:20, pf:20, invno:"PNT/26-27/0158"},
    {grdate:"27/05/26", grno:"10224977", destination:"HANUMANGARH", item:"PAINT", qty:8, wgt:123, rate:3.5, freight:430.5, bc:50, dd:0, lc:32, pf:20, invno:"PNT/26-"},
    {grdate:"28/05/26", grno:"10224999", destination:"SARDAR", item:"PAINT", qty:10, wgt:220, rate:3.5, freight:770, bc:50, dd:0, lc:40, pf:20, invno:"PNT/26-27/0280"},
  ];

  seedData.forEach(d=>{
    const total = num(d.freight)+num(d.bc)+num(d.dd)+num(d.lc);
    const gtotal = total; // matches original bill pattern (G.Total = Total, PF shown separately)
    addRow({...d, total, gtotal});
  });

  function num(v){ const n=parseFloat(v); return isNaN(n)?0:n; }
  function fmt(n){
    if (Number.isInteger(n)) return String(n);
    return (Math.round(n*100)/100).toString();
  }
  function escHtml(v){
    if (v===undefined||v===null) return '';
    return String(v)
      .replace(/&/g,'&amp;')
      .replace(/</g,'&lt;')
      .replace(/>/g,'&gt;');
  }

  function addRow(data){
    const id = 'r' + (++rowIdCounter);
    rows.push({id, ...data});
    renderTable();
  }

  function removeRow(id){
    rows = rows.filter(r=>r.id!==id);
    renderTable();
  }

  function renderTable(){
    tableBody.innerHTML = '';
    rows.forEach(r=>{
      const tr = document.createElement('tr');
      tr.dataset.id = r.id;
      tr.innerHTML = `
        <td class="al-left"><div class="cell-input" contenteditable="true" data-field="grdate">${escHtml(r.grdate)}</div></td>
        <td class="al-left"><div class="cell-input" contenteditable="true" data-field="grno">${escHtml(r.grno)}</div></td>
        <td class="al-left"><div class="cell-input" contenteditable="true" data-field="destination">${escHtml(r.destination)}</div></td>
        <td class="al-left"><div class="cell-input" contenteditable="true" data-field="item">${escHtml(r.item)}</div></td>
        <td><div class="cell-input" contenteditable="true" data-field="qty">${escHtml(r.qty)}</div></td>
        <td><div class="cell-input" contenteditable="true" data-field="wgt">${escHtml(r.wgt)}</div></td>
        <td><div class="cell-input" contenteditable="true" data-field="rate">${escHtml(r.rate)}</div></td>
        <td><div class="cell-input" contenteditable="true" data-field="freight">${escHtml(r.freight)}</div></td>
        <td><div class="cell-input" contenteditable="true" data-field="bc">${escHtml(r.bc)}</div></td>
        <td><div class="cell-input" contenteditable="true" data-field="dd">${escHtml(r.dd)}</div></td>
        <td><div class="cell-input" contenteditable="true" data-field="lc">${escHtml(r.lc)}</div></td>
        <td><div class="cell-input" contenteditable="true" data-field="total">${escHtml(r.total)}</div></td>
        <td><div class="cell-input" contenteditable="true" data-field="pf">${escHtml(r.pf)}</div></td>
        <td><div class="cell-input" contenteditable="true" data-field="gtotal">${escHtml(r.gtotal)}</div></td>
        <td class="al-left"><div class="cell-input" contenteditable="true" data-field="invno">${escHtml(r.invno)}</div></td>
        <td class="row-actions no-print"><button class="icon-btn" title="Delete row">✕</button></td>
      `;
      tr.querySelector('.icon-btn').addEventListener('click', ()=>removeRow(r.id));
      tr.querySelectorAll('.cell-input').forEach(el=>{
        el.addEventListener('input', ()=>{
          const row = rows.find(x=>x.id===r.id);
          const field = el.dataset.field;
          row[field] = el.textContent;
          recalcTotals();
        });
        el.addEventListener('keydown', (e)=>{
          if (e.key === 'Enter'){ e.preventDefault(); el.blur(); }
        });
      });
      tableBody.appendChild(tr);
    });
    recalcTotals();
  }

  function recalcTotals(){
    let sumQty=0, sumWgt=0, sumFreight=0, sumBC=0, sumDD=0, sumLC=0, sumTotal=0, sumPF=0, sumGTotal=0;
    rows.forEach(r=>{
      sumQty+=num(r.qty); sumWgt+=num(r.wgt); sumFreight+=num(r.freight);
      sumBC+=num(r.bc); sumDD+=num(r.dd); sumLC+=num(r.lc);
      sumTotal+=num(r.total); sumPF+=num(r.pf); sumGTotal+=num(r.gtotal);
    });
    document.getElementById('sumQty').textContent = fmt(sumQty);
    document.getElementById('sumWgt').textContent = fmt(sumWgt);
    document.getElementById('sumFreight').textContent = fmt(sumFreight);
    document.getElementById('sumBC').textContent = fmt(sumBC);
    document.getElementById('sumDD').textContent = fmt(sumDD);
    document.getElementById('sumLC').textContent = fmt(sumLC);
    document.getElementById('sumTotal').textContent = fmt(sumTotal);
    document.getElementById('sumPF').textContent = fmt(sumPF);
    document.getElementById('sumGTotal').textContent = fmt(sumGTotal);

    const billAmount = sumGTotal + sumPF; // Grand total = G.Total column + PF/O.CH as on original bill
    document.getElementById('billAmountDisplay').textContent = fmt(billAmount);
    document.getElementById('amountInWords').textContent = 'Rupees ' + numberToWords(Math.round(billAmount)) + ' Only /-';
  }

  // ===== Modal handling =====
  const modalPartyName = document.getElementById('modalPartyName');

  addBtn.addEventListener('click', ()=>{
    entryForm.reset();
    modalOverlay.classList.add('active');
    modalPartyName.focus();
  });
  cancelBtn.addEventListener('click', closeModal);
  modalOverlay.addEventListener('click', (e)=>{ if(e.target===modalOverlay) closeModal(); });
  function closeModal(){ modalOverlay.classList.remove('active'); }

  entryForm.addEventListener('submit', (e)=>{
    e.preventDefault();
    const partyName = modalPartyName.value.trim();
    if(!partyName) return;
    const ok = fetchAndAddPartyBills(partyName);
    if(ok) closeModal();
  });

  printBtn.addEventListener('click', ()=>{ window.print(); });

  // ===== Toast =====
  let toastTimer;
  function showToast(msg, isError){
    toastEl.textContent = msg;
    toastEl.classList.toggle('error', !!isError);
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(()=> toastEl.classList.remove('show'), 2800);
  }

  // ===== Party-based storage: Save Bill + auto-fetch on party name entry =====
  const STORAGE_KEY = 'balajiBillsByParty';

  function normalizeName(name){ return (name||'').trim().toLowerCase(); }

  function loadStore(){
    try{ return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; }
    catch(e){ return {}; }
  }
  function saveStore(data){
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  function refreshPartyDatalist(){
    const data = loadStore();
    partyNamesList.innerHTML = '';
    Object.values(data).forEach(p=>{
      const opt = document.createElement('option');
      opt.value = p.displayName;
      partyNamesList.appendChild(opt);
    });
  }

  function saveBill(){
    const partyName = partyNameInput.value.trim();
    if(!partyName){ showToast('Enter a party name before saving.', true); return; }
    const key = normalizeName(partyName);
    const data = loadStore();
    if(!data[key]){ data[key] = { displayName: partyName, address:'', gstin:'', taxesPaidBy:'', bills: [] }; }

    data[key].displayName = partyName;
    data[key].address = partyAddressEl.textContent.trim();
    data[key].gstin = partyGSTINInput.value.trim();
    data[key].taxesPaidBy = taxesPaidByInput.value;

    const billNo = document.getElementById('billNo').value.trim();
    const billDate = document.getElementById('billDate').value.trim();
    const rowsSnap = rows.map(r=>{ const {id, ...rest} = r; return rest; });

    const billRecord = { billNo, billDate, rows: rowsSnap, savedAt: new Date().toISOString() };
    const existingIdx = data[key].bills.findIndex(b=>b.billNo === billNo && billNo!=='');
    if(existingIdx > -1){ data[key].bills[existingIdx] = billRecord; }
    else { data[key].bills.push(billRecord); }

    saveStore(data);
    refreshPartyDatalist();
    lastMatchedPartyKey = key;
    historyBadge.textContent = data[key].bills.length + (data[key].bills.length===1 ? ' bill on file' : ' bills on file');
    showToast('Bill saved for ' + partyName + '.');
  }
  saveBtn.addEventListener('click', saveBill);

  function handlePartyNameCheck(){
    const partyName = partyNameInput.value.trim();
    const key = normalizeName(partyName);
    if(!key){ historyBadge.textContent=''; lastMatchedPartyKey=null; return; }

    const data = loadStore();
    const partyData = data[key];

    if(!partyData){ historyBadge.textContent=''; lastMatchedPartyKey=null; return; }

    historyBadge.textContent = partyData.bills.length + (partyData.bills.length===1 ? ' bill on file' : ' bills on file');

    if(key === lastMatchedPartyKey) return; // already handled this exact match
    lastMatchedPartyKey = key;

    if(partyData.address) partyAddressEl.textContent = partyData.address;
    if(partyData.gstin) partyGSTINInput.value = partyData.gstin;
    if(partyData.taxesPaidBy) taxesPaidByInput.value = partyData.taxesPaidBy;

    const totalRows = partyData.bills.reduce((s,b)=>s+b.rows.length,0);
    if(totalRows > 0){
      const ok = confirm(
        'Found ' + partyData.bills.length + ' previous bill(s) with ' + totalRows +
        ' entrie(s) for "' + partyData.displayName + '".\n\nLoad all their entries into this table?'
      );
      if(ok){
        rows = [];
        partyData.bills.forEach(b=>{
          b.rows.forEach(r=> addRow({...r}));
        });
        if(rows.length === 0) renderTable();
        showToast('Loaded ' + totalRows + ' entrie(s) for ' + partyData.displayName + '.');
      }
    }
  }

  function fetchAndAddPartyBills(partyName){
    const key = normalizeName(partyName);
    const data = loadStore();
    const partyData = data[key];

    if(!partyData || !partyData.bills || partyData.bills.length === 0){
      showToast('No saved bills found for "' + partyName + '".', true);
      return false;
    }

    // keep the bill header in sync with the party being fetched
    partyNameInput.value = partyData.displayName;
    if(partyData.address) partyAddressEl.textContent = partyData.address;
    if(partyData.gstin) partyGSTINInput.value = partyData.gstin;
    if(partyData.taxesPaidBy) taxesPaidByInput.value = partyData.taxesPaidBy;
    lastMatchedPartyKey = key;
    historyBadge.textContent = partyData.bills.length + (partyData.bills.length===1 ? ' bill on file' : ' bills on file');

    let count = 0;
    partyData.bills.forEach(b=>{
      b.rows.forEach(r=>{ addRow({...r}); count++; });
    });

    showToast('Added ' + count + ' entrie(s) for ' + partyData.displayName + '.');
    return true;
  }

  partyNameInput.addEventListener('change', handlePartyNameCheck);
  partyNameInput.addEventListener('input', ()=>{
    clearTimeout(partyNameInput._t);
    partyNameInput._t = setTimeout(handlePartyNameCheck, 450);
  });

  refreshPartyDatalist();

  // ===== Number to words (Indian numbering system) =====
  function numberToWords(num){
    if (num===0) return 'Zero';
    const a = ['','One','Two','Three','Four','Five','Six','Seven','Eight','Nine','Ten',
      'Eleven','Twelve','Thirteen','Fourteen','Fifteen','Sixteen','Seventeen','Eighteen','Nineteen'];
    const b = ['','','Twenty','Thirty','Forty','Fifty','Sixty','Seventy','Eighty','Ninety'];

    function two(n){
      if(n<20) return a[n];
      return b[Math.floor(n/10)] + (n%10? ' ' + a[n%10] : '');
    }
    function three(n){
      if(n>99) return a[Math.floor(n/100)] + ' Hundred' + (n%100? ' ' + two(n%100) : '');
      return two(n);
    }

    let str = '';
    const crore = Math.floor(num / 10000000); num %= 10000000;
    const lakh = Math.floor(num / 100000); num %= 100000;
    const thousand = Math.floor(num / 1000); num %= 1000;
    const hundred = num;

    if(crore) str += three(crore) + ' Crore ';
    if(lakh) str += three(lakh) + ' Lakh ';
    if(thousand) str += three(thousand) + ' Thousand ';
    if(hundred) str += three(hundred);

    return str.trim();
  }
})();
