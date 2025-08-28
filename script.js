// ====================
// وظائف الصفحة بعد تحميل DOM
// ====================
document.addEventListener("DOMContentLoaded", () => {

  // ======= دخول كزائر =======
  const guestBtn = document.querySelector(".guest");
  if (guestBtn) {
    guestBtn.addEventListener("click", () => {
      alert("تم الدخول كزائر مؤقت");
    });
  }

  // ======= وضع الليل/النهار =======
  const toggleModeBtn = document.getElementById("toggle-mode");
  if (toggleModeBtn) {
    toggleModeBtn.addEventListener("click", () => {
      document.body.classList.toggle("dark-mode");
      toggleModeBtn.innerHTML = document.body.classList.contains("dark-mode")
        ? '<i class="fas fa-sun"></i>'
        : '<i class="fas fa-moon"></i>';
    });
  }

  // ======= تغيير اللغة =======
  const langSwitch = document.getElementById("lang-switch");
  if(langSwitch){
    langSwitch.addEventListener("change", () => {
      alert("تم تغيير اللغة إلى: " + langSwitch.value);
      // لاحقًا يمكن إضافة ترجمة النصوص ديناميكيًا هنا
    });
  }

  // ======= خريطة Leaflet =======
  const mapElement = document.getElementById('map');
  if(mapElement){
    // إنشاء الخريطة
    var map = L.map('map').setView([21.4225, 39.8262], 17); // إحداثيات الكعبة

    // إضافة طبقة OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap'
    }).addTo(map);

    // بيانات الأماكن
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
        .bindPopup(p.name)
        .addTo(map);
      marker.placeType = p.type;
      markers.push(marker);
    });

    // فلترة الأماكن
    const checkboxes = document.querySelectorAll(".filter");
    checkboxes.forEach(cb => {
      cb.addEventListener("change", () => {
        markers.forEach(marker => {
          const typeCheckbox = document.querySelector(`.filter[data-type="${marker.placeType}"]`);
          if(typeCheckbox.checked){
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
          radius:8,
          color:"red",
          fillColor:"red",
          fillOpacity:0.8
        }).addTo(map).bindPopup("موقعك الحالي");
        map.setView([lat,lng],17);
      });
    }
  }

  // ======= تنبيه وقت الصلاة =======
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
        alert(`حان وقت صلاة ${p.name}`);
      }
    });
  }, 60000);

  // ======= إرسال نموذج التواصل =======
  const contactForm = document.getElementById("contactForm");
  if(contactForm){
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      alert("تم إرسال رسالتك بنجاح! سيتم الرد عليك قريبًا.");
      contactForm.reset();
    });
  }

});
