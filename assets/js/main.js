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
        <p class="text-xs text-gray-500">HOTLINE: 1314 | www.linklanka.lk</p>
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
