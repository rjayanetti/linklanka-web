// Link Lanka Interactive Core JS
document.addEventListener('DOMContentLoaded', () => {
  // Mobile Menu Toggle
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });
  }

  // --- INTERACTIVE TAXI METER SIMULATOR ---
  initMeterSimulator();

  // --- SERVICE YARDS FILTER ---
  initYardFilter();

  // --- MODALS & FORMS ---
  initModals();

  // --- INTERACTIVE HOME BRANCH MAP ---
  initHomeMap();

  // --- THREE-WHEELER FARE RECOMMENDATOR ---
  initFareCalculator();
});

// Interactive Digital Taxi Meter Simulator
function initMeterSimulator() {
  const fareDisplay = document.getElementById('meterFare');
  const distanceDisplay = document.getElementById('meterDistance');
  const waitDisplay = document.getElementById('meterWait');
  const speedDisplay = document.getElementById('meterSpeed');
  const statusBadge = document.getElementById('meterStatusBadge');
  const startBtn = document.getElementById('meterStartBtn');
  const stopBtn = document.getElementById('meterStopBtn');
  const resetBtn = document.getElementById('meterResetBtn');
  const speedSlider = document.getElementById('meterSpeedSlider');
  const printReceiptBtn = document.getElementById('meterPrintReceiptBtn');
  const receiptContainer = document.getElementById('meterReceiptModal');

  if (!fareDisplay || !startBtn) return;

  // Rate config (Standard Sri Lankan Tuk / Taxi tariffs)
  const BASE_FARE = 100.00; // First 1 km
  const PER_KM_RATE = 80.00; // Subsequent km
  const PER_MIN_WAIT_RATE = 4.00; // Per min waiting
  
  let isRunning = false;
  let distanceKm = 0.00;
  let waitMinutes = 0.00;
  let currentSpeedKmh = 35;
  let fareTotal = BASE_FARE;
  let intervalTimer = null;
  let tripStartTime = null;
  let tripEndTime = null;

  function updateDisplay() {
    fareDisplay.textContent = fareTotal.toFixed(2);
    distanceDisplay.textContent = distanceKm.toFixed(2);
    waitDisplay.textContent = Math.floor(waitMinutes) + 'm ' + Math.floor((waitMinutes % 1) * 60) + 's';
    if (speedDisplay) speedDisplay.textContent = currentSpeedKmh + ' km/h';
  }

  function calculateFare() {
    if (distanceKm <= 1.0) {
      fareTotal = BASE_FARE + (waitMinutes * PER_MIN_WAIT_RATE);
    } else {
      fareTotal = BASE_FARE + ((distanceKm - 1.0) * PER_KM_RATE) + (waitMinutes * PER_MIN_WAIT_RATE);
    }
    updateDisplay();
  }

  if (speedSlider) {
    speedSlider.addEventListener('input', (e) => {
      currentSpeedKmh = parseInt(e.target.value, 10);
      if (speedDisplay) speedDisplay.textContent = currentSpeedKmh + ' km/h';
    });
  }

  startBtn.addEventListener('click', () => {
    if (isRunning) return;
    isRunning = true;
    tripStartTime = tripStartTime || new Date();
    statusBadge.textContent = 'HIRED / මීටරය ක්‍රියාත්මකයි';
    statusBadge.className = 'px-3 py-1 text-xs font-bold uppercase rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30';
    
    startBtn.disabled = true;
    startBtn.classList.add('opacity-50', 'cursor-not-allowed');
    stopBtn.disabled = false;
    stopBtn.classList.remove('opacity-50', 'cursor-not-allowed');
    if (printReceiptBtn) {
      printReceiptBtn.classList.add('hidden');
    }

    // Interval every 1 second
    intervalTimer = setInterval(() => {
      if (currentSpeedKmh > 0) {
        // Distance incremented: speed in km/h -> km per sec (speed / 3600), accelerated 3x for snappy demo feel
        const kmPerTick = (currentSpeedKmh / 3600) * 4; 
        distanceKm += kmPerTick;
      } else {
        // Waiting time
        waitMinutes += (1 / 60) * 4;
      }
      calculateFare();
    }, 500);
  });

  stopBtn.addEventListener('click', () => {
    if (!isRunning) return;
    isRunning = false;
    tripEndTime = new Date();
    clearInterval(intervalTimer);

    statusBadge.textContent = 'STOPPED / ගමන අවසන්';
    statusBadge.className = 'px-3 py-1 text-xs font-bold uppercase rounded-full bg-red-500/20 text-red-400 border border-red-500/30';

    startBtn.disabled = false;
    startBtn.classList.remove('opacity-50', 'cursor-not-allowed');
    stopBtn.disabled = true;
    stopBtn.classList.add('opacity-50', 'cursor-not-allowed');

    if (printReceiptBtn) {
      printReceiptBtn.classList.remove('hidden');
    }
  });

  resetBtn.addEventListener('click', () => {
    isRunning = false;
    clearInterval(intervalTimer);
    distanceKm = 0.00;
    waitMinutes = 0.00;
    fareTotal = BASE_FARE;
    tripStartTime = null;
    tripEndTime = null;

    statusBadge.textContent = 'FOR HIRE / සූදානම්';
    statusBadge.className = 'px-3 py-1 text-xs font-bold uppercase rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30';

    startBtn.disabled = false;
    startBtn.classList.remove('opacity-50', 'cursor-not-allowed');
    stopBtn.disabled = true;
    stopBtn.classList.add('opacity-50', 'cursor-not-allowed');
    if (printReceiptBtn) {
      printReceiptBtn.classList.add('hidden');
    }
    updateDisplay();
  });

  if (printReceiptBtn) {
    printReceiptBtn.addEventListener('click', () => {
      generateReceipt();
    });
  }

  function generateReceipt() {
    const receiptBox = document.getElementById('receiptContent');
    if (!receiptBox) return;

    const receiptNo = 'LLM-' + Math.floor(100000 + Math.random() * 900000);
    const dateStr = (tripEndTime || new Date()).toLocaleString('en-LK', {
      year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });

    receiptBox.innerHTML = `
      <div class="text-center border-b border-dashed border-gray-400 pb-3 mb-3">
        <h4 class="font-extrabold text-lg tracking-wider">LINK LANKA (PVT) LTD</h4>
        <p class="text-xs text-gray-600">PIONEER IN DIGITAL TAXI METERS</p>
        <p class="text-xs text-gray-500">HOTLINE: 0117177277 | www.linklanka.lk</p>
        <p class="text-[11px] text-gray-500 mt-1">ISO 9001-2008 CERTIFIED MANUFACTURE</p>
      </div>

      <div class="text-xs space-y-1 border-b border-dashed border-gray-400 pb-3 mb-3">
        <div class="flex justify-between"><span>RECEIPT NO:</span> <span class="font-mono font-bold">${receiptNo}</span></div>
        <div class="flex justify-between"><span>DATE & TIME:</span> <span>${dateStr}</span></div>
        <div class="flex justify-between"><span>TAXI REG NO:</span> <span class="font-bold">WP-AB-8429</span></div>
        <div class="flex justify-between"><span>METER S/N:</span> <span>LK-984210</span></div>
      </div>

      <div class="text-xs space-y-1.5 border-b border-dashed border-gray-400 pb-3 mb-3">
        <div class="flex justify-between">
          <span>BASE DISTANCE (1.0 KM):</span>
          <span>Rs. ${BASE_FARE.toFixed(2)}</span>
        </div>
        <div class="flex justify-between">
          <span>RUN DIST (${Math.max(0, distanceKm - 1).toFixed(2)} KM @ Rs. 80):</span>
          <span>Rs. ${(Math.max(0, distanceKm - 1) * PER_KM_RATE).toFixed(2)}</span>
        </div>
        <div class="flex justify-between">
          <span>WAITING TIME (${Math.floor(waitMinutes)}m):</span>
          <span>Rs. ${(waitMinutes * PER_MIN_WAIT_RATE).toFixed(2)}</span>
        </div>
      </div>

      <div class="py-2 border-b-2 border-dashed border-black mb-3">
        <div class="flex justify-between items-center text-base font-extrabold">
          <span>TOTAL FARE:</span>
          <span>Rs. ${fareTotal.toFixed(2)}</span>
        </div>
      </div>

      <div class="text-center text-[10px] text-gray-600 space-y-1">
        <p>THANK YOU FOR RIDING WITH LINK METER!</p>
        <p>100% SRI LANKAN INNOVATION</p>
        <p>PRESIDENTIAL AWARD WINNER</p>
      </div>
    `;

    if (receiptContainer) {
      receiptContainer.classList.remove('hidden');
      receiptContainer.classList.add('flex');
    }
  }

  // Close receipt modal
  const closeReceiptBtn = document.getElementById('closeReceiptBtn');
  if (closeReceiptBtn && receiptContainer) {
    closeReceiptBtn.addEventListener('click', () => {
      receiptContainer.classList.add('hidden');
      receiptContainer.classList.remove('flex');
    });
  }
}

// Service Yard Locator Filter
function initYardFilter() {
  const filterBtns = document.querySelectorAll('.yard-filter-btn');
  const yardCards = document.querySelectorAll('.yard-card');
  const searchInput = document.getElementById('yardSearchInput');

  if (!yardCards.length) return;

  function applyFilter(region, query = '') {
    const q = query.trim().toLowerCase();
    yardCards.forEach(card => {
      const cardRegion = card.getAttribute('data-region') || '';
      const cardTitle = (card.querySelector('.yard-title')?.textContent || '').toLowerCase();
      const cardAddress = (card.querySelector('.yard-address')?.textContent || '').toLowerCase();

      const matchesRegion = (region === 'all' || cardRegion === region);
      const matchesSearch = !q || cardTitle.includes(q) || cardAddress.includes(q);

      if (matchesRegion && matchesSearch) {
        card.style.display = 'block';
      } else {
        card.style.display = 'none';
      }
    });
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => {
        b.classList.remove('bg-amber-400', 'text-gray-900', 'font-bold');
        b.classList.add('bg-gray-800', 'text-gray-300');
      });
      btn.classList.remove('bg-gray-800', 'text-gray-300');
      btn.classList.add('bg-amber-400', 'text-gray-900', 'font-bold');

      const region = btn.getAttribute('data-filter') || 'all';
      const q = searchInput ? searchInput.value : '';
      applyFilter(region, q);
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const activeBtn = document.querySelector('.yard-filter-btn.bg-amber-400');
      const region = activeBtn ? activeBtn.getAttribute('data-filter') : 'all';
      applyFilter(region, e.target.value);
    });
  }
}

// Modals & Inquiry Toast
function initModals() {
  const inquiryForms = document.querySelectorAll('.inquiry-form');
  const toast = document.getElementById('globalToast');

  inquiryForms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn) {
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = 'Sending... / යවමින් පවතී...';
        submitBtn.disabled = true;

        setTimeout(() => {
          submitBtn.innerHTML = originalText;
          submitBtn.disabled = false;
          form.reset();
          showToast('Thank you! Your request has been received. Our team will contact you shortly.');
        }, 1000);
      }
    });
  });

  function showToast(msg) {
    if (!toast) {
      alert(msg);
      return;
    }
    toast.querySelector('.toast-msg').textContent = msg;
    toast.classList.remove('translate-y-24', 'opacity-0');
    toast.classList.add('translate-y-0', 'opacity-100');

    setTimeout(() => {
      toast.classList.add('translate-y-24', 'opacity-0');
      toast.classList.remove('translate-y-0', 'opacity-100');
    }, 4500);
  }
}

// Interactive Home Page Branch Map
function initHomeMap() {
  const mapEl = document.getElementById('homeBranchMap');
  if (!mapEl || typeof L === 'undefined') return;

  const map = L.map('homeBranchMap', {
    center: [7.8731, 80.7718],
    zoom: 7,
    scrollWheelZoom: false
  });

  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors'
  }).addTo(map);

  function cleanPhone(val) {
    if (val === undefined || val === null) return '';
    let s = String(val).trim();
    if (s.endsWith('.0')) s = s.slice(0, -2);
    if (/^\d{9}$/.test(s)) s = '0' + s;
    return s;
  }

  async function getLocations() {
    try {
      if (typeof XLSX === 'undefined') throw new Error('SheetJS not loaded');
      const res = await fetch('assets/data/locations.xlsx');
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const buffer = await res.arrayBuffer();
      const wb = XLSX.read(buffer, { type: 'array' });
      const list = [];

      const branchSheetName = wb.SheetNames.find(n => n.toLowerCase().includes('branch')) || wb.SheetNames[1];
      if (branchSheetName && wb.Sheets[branchSheetName]) {
        const rows = XLSX.utils.sheet_to_json(wb.Sheets[branchSheetName], { defval: '' });
        rows.forEach(r => {
          const name = (r.Description || r.AgentName || r.Name || '').trim();
          if (!name) return;
          list.push({
            name: name,
            address: String(r.Address || '').trim(),
            phone_no1: cleanPhone(r.Telephone1),
            lon: parseFloat(r.Longitude) || 0,
            lat: parseFloat(r.Latitude) || 0,
            photo: String(r.Photo || '').trim(),
            location_type: 1
          });
        });
      }

      const agentSheetName = wb.SheetNames.find(n => n.toLowerCase().includes('agent')) || wb.SheetNames[0];
      if (agentSheetName && wb.Sheets[agentSheetName]) {
        const rows = XLSX.utils.sheet_to_json(wb.Sheets[agentSheetName], { defval: '' });
        rows.forEach(r => {
          const name = (r.AgentName || r.Description || r.Name || '').trim();
          if (!name) return;
          list.push({
            name: name,
            address: String(r.Address || '').trim(),
            phone_no1: cleanPhone(r.Telephone1),
            lon: parseFloat(r.Longitude) || 0,
            lat: parseFloat(r.Latitude) || 0,
            photo: String(r.Photo || '').trim(),
            location_type: 2
          });
        });
      }

      if (list.length > 0) return list;
      throw new Error('No entries in Excel');
    } catch (e) {
      const res = await fetch('assets/data/locations.json');
      return await res.json();
    }
  }

  getLocations()
    .then(locations => {
      const bounds = [];
      locations.forEach(loc => {
        const lat = parseFloat(loc.lat);
        const lon = parseFloat(loc.lon);
        if (!lat || !lon || lat < 5 || lon < 79) return;

        bounds.push([lat, lon]);
        const isBranch = (loc.location_type === 1);
        const colorBg = isBranch ? '#F59E0B' : '#10B981';
        const badgeText = isBranch ? 'Official Branch' : 'Authorized Dealer';
        const badgeBg = isBranch ? 'bg-amber-400 text-slate-950 font-black' : 'bg-emerald-500 text-white font-black';

        const customIcon = L.divIcon({
          className: 'custom-map-pin',
          html: `
            <div style="background-color: ${colorBg}; width: 28px; height: 28px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 10px rgba(0,0,0,0.5); border: 2px solid #ffffff;">
              <svg style="transform: rotate(45deg); width: 14px; height: 14px; color: ${isBranch ? '#0f172a' : '#ffffff'};" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
            </div>`,
          iconSize: [28, 28],
          iconAnchor: [14, 28],
          popupAnchor: [0, -26]
        });

        const cleanAddr = (loc.address || '').replace(/\\n|\n/g, ', ');
        const p1 = (loc.phone_no1 || '').trim();
        const photoHtml = loc.photo 
          ? `<div class="h-20 w-full rounded-md overflow-hidden mb-1.5 bg-slate-900"><img src="assets/img/branches/${loc.photo}" onerror="this.onerror=null; this.src='assets/img/${loc.photo}';" alt="${loc.name}" class="w-full h-full object-cover"></div>` 
          : '';

        const popupHtml = `
          <div class="text-left font-sans text-xs max-w-[220px]">
            ${photoHtml}
            <span class="px-2 py-0.5 rounded text-[10px] uppercase tracking-wider ${badgeBg} inline-block mb-1">
              ${badgeText}
            </span>
            <h4 class="font-extrabold text-sm text-white mb-0.5">${loc.name || 'LINK LANKA'}</h4>
            <p class="text-slate-300 leading-snug mb-2 text-[11px]">${cleanAddr}</p>
            <div class="flex items-center space-x-2 pt-1.5 border-t border-slate-700/80">
              ${p1 ? `<a href="tel:${p1}" class="bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold px-2 py-1 rounded-md text-[11px] shadow">📞 ${p1}</a>` : ''}
              <a href="https://www.google.com/maps/search/?api=1&query=${lat},${lon}" target="_blank" rel="noopener" class="bg-blue-600 hover:bg-blue-500 text-white font-bold px-2 py-1 rounded-md text-[11px]">📍 Directions</a>
            </div>
          </div>
        `;

        L.marker([lat, lon], { icon: customIcon }).addTo(map).bindPopup(popupHtml);
      });

      if (bounds.length > 0) {
        map.fitBounds(bounds, { padding: [30, 30] });
      }
    })
    .catch(err => console.error('Error loading home map locations:', err));
}

// --- THREE-WHEELER FARE RECOMMENDATION ENGINE ---
function initFareCalculator() {
  const petrolInput = document.getElementById('petrolCost');
  const profitInput = document.getElementById('profit');
  const petrolSlider = document.getElementById('petrolSlider');
  const profitSlider = document.getElementById('profitSlider');
  const resultTable = document.getElementById('resultTable');
  const totalCostDisplay = document.getElementById('totalCost');
  const firstKmDisplay = document.getElementById('firstKm');
  const secondKmDisplay = document.getElementById('secondKm');

  if (!petrolInput || !resultTable) return;

  function formatCurrency(val) {
    return val.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }

  function roundTo5(val) {
    return Math.floor(val / 5) * 5;
  }

  const costDefinitions = [
    {
      id: 'petrol_actual',
      name: 'Petrol (Actual Hire)',
      sinhala: 'සැබෑ ධාවන ඉන්ධන පිරිවැය',
      category: 'Fuel',
      calc: (p) => p / 20,
      desc: 'Approx. fuel consumption is 20–25 km per Litre.\nCalculation: Fuel Price (Rs/L) ÷ 20 km = Direct Fuel Cost per KM during passenger hire.'
    },
    {
      id: 'petrol_wastage',
      name: 'Petrol (Wastage / Empty Running 50%)',
      sinhala: 'හිස් ධාවනය (50% නාස්තිය)',
      category: 'Fuel',
      calc: (p) => (p / 20) * 0.5,
      desc: 'Calculated per km cost considering 100 km passenger hire & 50 km empty running/deadheading per day.\nThis is 50% of Petrol (Actual Hire).'
    },
    {
      id: 'service',
      name: 'Service & Lubricants',
      sinhala: 'නඩත්තු සහ ලිහිසි තෙල්',
      category: 'Maintenance',
      calc: () => 15000 / 3750,
      desc: 'Body Wash / Under Wash / Oil Change / Filters / Gear Cable Replacement / Lubrication: Rs. 15,000.\nRequired every 3,000 km (3,750 km monthly distance): Rs. 15,000 ÷ 3,750 km = Rs. 4.00/km.'
    },
    {
      id: 'tire',
      name: 'Tire / Tube Wear',
      sinhala: 'ටයර් සහ ටියුබ් ගෙවීම',
      category: 'Maintenance',
      calc: () => 16500 / 35000,
      desc: 'Complete 3-Tire replacement set: Rs. 5,500 × 3 = Rs. 16,500.\nExpected lifespan: Approx. 35,000 km per tire set.\nCalculation: Rs. 16,500 ÷ 35,000 km = Rs. 0.47/km.'
    },
    {
      id: 'fees',
      name: 'Annual Fees / Insurance',
      sinhala: 'වාර්ෂික බලපත්‍ර සහ රක්ෂණය',
      category: 'Regulatory',
      calc: () => 0.75,
      desc: 'Annual Commercial Insurance: Rs. 25,000\nRevenue License: Rs. 1,000\nEmission Test: Rs. 1,000\nTotal Annual Overheads: Rs. 27,000 ÷ 36,000 operational km = Rs. 0.75/km.'
    },
    {
      id: 'salary',
      name: 'Driver Wage / Earnings',
      sinhala: 'රියදුරු දෛනික වැටුප',
      category: 'Livelihood',
      calc: () => 3000 / 150,
      desc: 'Baseline fair living wage: Rs. 3,000 per day.\nCalculated over standard daily distance of 150 km: Rs. 3,000 ÷ 150 km = Rs. 20.00/km.'
    },
    {
      id: 'depreciation',
      name: 'Vehicle Depreciation',
      sinhala: 'වාහන ක්ෂයවීම',
      category: 'Capital',
      calc: () => 1800000 / 540000,
      desc: 'Three-Wheeler Replacement Cost: LKR 1.5 to 1.8 Million.\nVehicle Lifetime: 12 Years.\nDaily Distance: 150 km (Hire: 100 km / Empty: 50 km).\nMonthly Distance: 150 km × 25 working days = 3,750 km.\nAnnual Distance: 3,750 km × 12 = 45,000 km.\nLifetime Distance: 45,000 km × 12 years = 540,000 km.\nDepreciation Per km: Rs. 1,800,000 ÷ 540,000 km = Rs. 3.33/km.'
    },
    {
      id: 'interest',
      name: 'Interest on Capital',
      sinhala: 'ප්‍රාග්ධන පොලිය',
      category: 'Capital',
      calc: () => 180000 / 45000,
      desc: 'Approx. Annual Financing / Opportunity Interest: 10% on Rs. 1,800,000 = Rs. 180,000/year.\nInterest on Capital Per km: Rs. 180,000 ÷ 45,000 annual km = Rs. 4.00/km.'
    },
    {
      id: 'repairs',
      name: 'Running Repairs & Battery',
      sinhala: 'ධාවන අලුත්වැඩියා සහ බැටරි',
      category: 'Maintenance',
      calc: () => 15750 / 3750,
      desc: 'LKR 15,000 for regular running repairs + Battery replacement every 18 months.\nTotal monthly maintenance reserve: Rs. 15,750.\nRunning Cost Per km: Rs. 15,750 ÷ 3,750 km = Rs. 4.20/km.'
    }
  ];

  window.currentFareRows = [];

  function calculate() {
    const petrol = parseFloat(petrolInput.value) || 0;
    const profit = parseFloat(profitInput.value) || 0;

    // Sync sliders
    if (petrolSlider && parseFloat(petrolSlider.value) !== petrol) {
      petrolSlider.value = petrol;
    }
    if (profitSlider && parseFloat(profitSlider.value) !== profit) {
      profitSlider.value = profit;
    }

    const rows = costDefinitions.map(def => ({
      ...def,
      value: def.calc(petrol)
    }));
    window.currentFareRows = rows;

    let total = 0;
    rows.forEach(r => total += r.value);

    // PROFIT BASED CALCULATION (Exact formula from formulla.js)
    const secondKm = roundTo5(total + (total * (profit / 100)));
    const firstKm = secondKm + 30;
    const profitAmount = (secondKm > total) ? (secondKm - total) : 0;

    // Render Table
    resultTable.innerHTML = '';
    rows.forEach((r, idx) => {
      const pct = total > 0 ? ((r.value / total) * 100).toFixed(1) : '0';
      const tr = document.createElement('tr');
      tr.className = 'border-b border-slate-100 hover:bg-amber-50/50 transition-colors text-xs sm:text-sm';
      tr.innerHTML = `
        <td class="py-3 px-3 sm:px-4">
          <div class="font-bold text-slate-800">${r.name}</div>
          <div class="text-[10px] text-slate-400 font-medium">${r.sinhala} • <span class="text-amber-600 font-semibold">${r.category}</span></div>
        </td>
        <td class="py-3 px-3 sm:px-4 text-right font-mono font-bold text-slate-900">
          Rs. ${formatCurrency(r.value)}
        </td>
        <td class="py-3 px-3 sm:px-4 text-center hidden sm:table-cell">
          <span class="inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-600">
            ${pct}%
          </span>
        </td>
        <td class="py-3 px-3 sm:px-4 text-center">
          <button type="button" onclick="showFareModal(${idx})" class="p-1 sm:px-2.5 sm:py-1 rounded-lg text-amber-600 hover:text-amber-900 hover:bg-amber-100/70 text-xs font-bold transition-all inline-flex items-center space-x-1" title="View formula details">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <span class="hidden sm:inline">Info</span>
          </button>
        </td>
      `;
      resultTable.appendChild(tr);
    });

    if (totalCostDisplay) totalCostDisplay.innerText = 'Rs. ' + formatCurrency(total);
    if (secondKmDisplay) secondKmDisplay.innerText = 'Rs. ' + secondKm;
    if (firstKmDisplay) firstKmDisplay.innerText = 'Rs. ' + firstKm;

    const profitDisplay = document.getElementById('profitAmount');
    if (profitDisplay) profitDisplay.innerText = 'Rs. ' + formatCurrency(profitAmount);

    const fuelTotal = (rows[0].value + rows[1].value);
    const fuelDisplay = document.getElementById('fuelTotalCost');
    if (fuelDisplay) fuelDisplay.innerText = 'Rs. ' + formatCurrency(fuelTotal);

    // Visual percentage distribution bars
    if (total > 0) {
      const fuelPct = ((fuelTotal / total) * 100).toFixed(0);
      const wagePct = ((rows[5].value / total) * 100).toFixed(0);
      const maintPct = (((rows[2].value + rows[3].value + rows[8].value) / total) * 100).toFixed(0);
      const capPct = (((rows[4].value + rows[6].value + rows[7].value) / total) * 100).toFixed(0);

      const fuelBar = document.getElementById('barFuel');
      const wageBar = document.getElementById('barWage');
      const maintBar = document.getElementById('barMaint');
      const capBar = document.getElementById('barCapital');

      if (fuelBar) { fuelBar.style.width = fuelPct + '%'; fuelBar.textContent = 'Fuel ' + fuelPct + '%'; }
      if (wageBar) { wageBar.style.width = wagePct + '%'; wageBar.textContent = 'Wage ' + wagePct + '%'; }
      if (maintBar) { maintBar.style.width = maintPct + '%'; maintBar.textContent = 'Maint ' + maintPct + '%'; }
      if (capBar) { capBar.style.width = capPct + '%'; capBar.textContent = 'Cap ' + capPct + '%'; }
    }
  }

  // Event Listeners
  petrolInput.addEventListener('input', calculate);
  profitInput.addEventListener('input', calculate);

  if (petrolSlider) {
    petrolSlider.addEventListener('input', (e) => {
      petrolInput.value = e.target.value;
      calculate();
    });
  }

  if (profitSlider) {
    profitSlider.addEventListener('input', (e) => {
      profitInput.value = e.target.value;
      calculate();
    });
  }

  // Preset buttons
  document.querySelectorAll('[data-set-petrol]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      petrolInput.value = btn.getAttribute('data-set-petrol');
      calculate();
      updatePresetPillStyle('[data-set-petrol]', btn);
    });
  });

  document.querySelectorAll('[data-set-profit]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      profitInput.value = btn.getAttribute('data-set-profit');
      calculate();
      updatePresetPillStyle('[data-set-profit]', btn);
    });
  });

  function updatePresetPillStyle(selector, activeBtn) {
    document.querySelectorAll(selector).forEach(b => {
      b.classList.remove('bg-amber-400', 'text-slate-950', 'border-amber-400');
      b.classList.add('bg-slate-100', 'text-slate-700', 'border-slate-200');
    });
    activeBtn.classList.remove('bg-slate-100', 'text-slate-700', 'border-slate-200');
    activeBtn.classList.add('bg-amber-400', 'text-slate-950', 'border-amber-400');
  }

  // Initial Calculation
  calculate();
}

// Global modal helpers for fare details
window.showFareModal = function(index) {
  const modal = document.getElementById('fareInfoModal');
  const modalTitle = document.getElementById('fareModalTitle');
  const modalText = document.getElementById('fareModalText');
  const modalMeta = document.getElementById('fareModalMeta');
  
  if (!modal || !window.currentFareRows || !window.currentFareRows[index]) return;
  const row = window.currentFareRows[index];

  if (modalTitle) modalTitle.innerText = row.name;
  if (modalMeta) modalMeta.innerText = 'Category: ' + row.category + ' • Cost: Rs. ' + (row.value ? row.value.toFixed(2) : '0.00') + ' / km';
  if (modalText) modalText.innerText = row.desc;

  modal.classList.remove('hidden');
  modal.classList.add('flex');
};

window.closeFareModal = function() {
  const modal = document.getElementById('fareInfoModal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
};

// Backward-compatibility alias for formulla.js showDetails
window.showDetails = function(index) {
  window.showFareModal(index);
};

