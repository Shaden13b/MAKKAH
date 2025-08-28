document.addEventListener("DOMContentLoaded", () => {
  // ====================
  // دخول كزائر
  // ====================
  const guestBtn = document.querySelector(".guest");
  if (guestBtn) {
    guestBtn.addEventListener("click", () => {
      Swal.fire({ // استخدام مكتبة SweetAlert لجمال الرسالة
        title: "مرحبًا!",
        text: "تم الدخول كزائر مؤقت 😊",
        icon: "info",
        timer: 2000,
        showConfirmButton: false
      });
    });
  }

  // ====================
  // وضع الليل/النهار
  // ====================
  const toggleModeBtn = document.getElementById("toggle-mode");
  if (toggleModeBtn) {
    toggleModeBtn.addEventListener("click", () => {
      document.body.classList.toggle("dark-mode");
      toggleModeBtn.innerHTML = document.body.classList.contains("dark-mode")
        ? '<i class="fas fa-sun"></i>'
        : '<i class="fas fa-moon"></i>';
    });
  }

  // ====================
  // تغيير اللغة
  // ====================
  const langSelect = document.getElementById("lang-select");
  if (langSelect) {
    langSelect.addEventListener("change", () => {
      const lang = langSelect.value;
      document.querySelectorAll("[data-i18n]").forEach(el => {
        const key = el.getAttribute("data-i18n");
        el.textContent = translations[lang][key];
      });
      // تأثير جمالي عند تغيير اللغة
      document.querySelector(".container").classList.add("flash");
      setTimeout(() => document.querySelector(".container").classList.remove("flash"), 500);
    });
  }

  // ====================
  // Leaflet.js - خريطة الحرم
  // ====================
  if (document.getElementById("map")) {
    var map = L.map('map').setView([21.4225, 39.8262], 17); // إحداثيات الكعبة
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap'
    }).addTo(map);

    const places = [
      {name:"دورة مياه 1", type:"bathroom", lat:21.4230, lng:39.8265},
      {name:"مصعد 1", type:"elevator", lat:21.4227, lng:39.8268},
      {name:"مصلى رجال", type:"prayer_men", lat:21.4222, lng:39.8260},
      {name:"مصلى نساء", type:"prayer_women", lat:21.4220, lng:39.8255},
      {name:"وضوء", type:"wudu", lat:21.4224, lng:39.8263},
      {name:"ماء زمزم", type:"zamzam", lat:21.4226, lng:39.8261},
    ];

    const markers = [];

    places.forEach(p => {
      const marker = L.marker([p.lat, p.lng])
        .bindPopup(`<b>${p.name}</b>`)
        .addTo(map);
      marker.placeType = p.type;
      markers.push(marker);
    });

    // فلترة الأماكن
    document.querySelectorAll(".filter").forEach(cb => {
      cb.addEventListener("change", () => {
        markers.forEach(marker => {
          if(document.querySelector(`.filter[data-type="${marker.placeType}"]`).checked){
            map.addLayer(marker);
          } else {
            map.removeLayer(marker);
          }
        });
      });
    });

    // تحديد موقع الزائر
    if(navigator.geolocation){
      navigator.geolocation.getCurrentPosition(pos => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        const userMarker = L.circleMarker([lat,lng], {
          radius:8, color:"red", fillColor:"red", fillOpacity:0.8
        }).addTo(map).bindPopup("موقعك الحالي");
        map.setView([lat,lng],17);
      });
    }
  }

  // ====================
  // تنبيهات وقت الصلاة
  // ====================
  const prayerTimes = [
    {name:"الفجر", time:"05:10"},
    {name:"الظهر", time:"12:30"},
    {name:"العصر", time:"15:45"},
    {name:"المغرب", time:"18:10"},
    {name:"العشاء", time:"19:30"}
  ];

  setInterval(() => {
    const now = new Date();
    const hh = now.getHours().toString().padStart(2,"0");
    const mm = now.getMinutes().toString().padStart(2,"0");
    const currentTime = `${hh}:${mm}`;

    prayerTimes.forEach(p => {
      if(currentTime === p.time){
        Swal.fire({
          title: `حان وقت صلاة ${p.name}`,
          icon: "info",
          timer: 4000,
          showConfirmButton: false
        });
      }
    });
  }, 60000);

  // ====================
  // نموذج التواصل
  // ====================
  const contactForm = document.getElementById("contactForm");
  if(contactForm){
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      Swal.fire({
        title: "تم الإرسال!",
        text: "تم إرسال رسالتك بنجاح، سيتم الرد عليك قريبًا.",
        icon: "success",
        timer: 2500,
        showConfirmButton: false
      });
      contactForm.reset();
    });
  }
});
