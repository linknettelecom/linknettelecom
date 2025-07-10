document.addEventListener('DOMContentLoaded', function() {

    // --- Lógica para el Header Adaptable al Scroll ---
    const header = document.querySelector('.site-header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // --- Lógica para Animaciones al Desplazarse (Scroll) ---
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });
    animatedElements.forEach(el => {
        observer.observe(el);
    });

    // --- Lógica para las Pestañas Verticales ---
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabPanels = document.querySelectorAll('.tab-panel');
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetPanelId = button.getAttribute('aria-controls');
            const targetPanel = document.getElementById(targetPanelId);
            tabButtons.forEach(btn => {
                btn.classList.remove('active');
                btn.setAttribute('aria-selected', 'false');
            });
            tabPanels.forEach(panel => {
                panel.classList.remove('active');
            });
            button.classList.add('active');
            button.setAttribute('aria-selected', 'true');
            targetPanel.classList.add('active');
        });
    });
    
    // --- Lógica del menú móvil ---
    const navToggle = document.querySelector('.mobile-nav-toggle');
    const mainNav = document.querySelector('.main-nav');
    if (navToggle) {
        navToggle.addEventListener('click', function() {
            mainNav.classList.toggle('active');
        });
    }

    // --- Lógica del acordeón del mapa ---
    const accordionItems = document.querySelectorAll('.accordion-item');
    function closeAllAccordions() {
        accordionItems.forEach(item => {
            item.querySelector('.accordion-header').classList.remove('active');
            item.querySelector('.accordion-content').style.maxHeight = null;
        });
    }
    accordionItems.forEach(item => {
        const header = item.querySelector('.accordion-header');
        const content = item.querySelector('.accordion-content');
        header.addEventListener('click', () => {
            const isActive = header.classList.contains('active');
            closeAllAccordions();
            if (!isActive) {
                header.classList.add('active');
                content.style.maxHeight = content.scrollHeight + "px";
                const lat = parseFloat(item.getAttribute('data-lat'));
                const lng = parseFloat(item.getAttribute('data-lng'));
                if (window.map) {
                    map.setCenter({ lat, lng });
                    map.setZoom(19);
                    if (window.innerWidth > 992) {
                        setTimeout(() => { map.panBy(-200, 0); }, 50);
                    }
                }
            }
        });
    });
});


// ------- LÓGICA DE GOOGLE MAPS -------
let map; 

const locations = [
    { lat: -8.75861490943112, lng: -63.901736050868585, title: 'Porto Velho' },
    { lat: -9.710443818199323, lng: -64.53161394476314, title: 'União Bandeirantes' },
    { lat: -9.257549542880978, lng: -64.4087398966081, title: 'Jaci Paraná' },
    { lat: -10.414480862625098, lng: -65.33144535390771, title: 'Nova Mamoré' },
    { lat: -10.780280005321504, lng: -65.33301796161155, title: 'Guajará-Mirim' },
    { lat: -10.374554528836622, lng: -64.80597021222648, title: 'Nova Dimensão' },
    { lat: -9.657384902426358, lng: -65.74021495576011, title: 'Vista Alegre do Abunã' },
    { lat: -9.772504471159463, lng: -66.36477920486534, title: 'Extrema' },
    { lat: -9.761585022875362, lng: -66.61735353248147, title: 'Nova California' }
];

async function initMap() {
    const initialPosition = { lat: -9.76, lng: -64.90 };
    // --- ESTILO DE MAPA PERSONALIZADO ---
    const mapStyle = [{"elementType":"geometry","stylers":[{"color":"#242f3e"}]},{"elementType":"labels.text.stroke","stylers":[{"color":"#242f3e"}]},{"elementType":"labels.text.fill","stylers":[{"color":"#746855"}]},{"featureType":"administrative.locality","elementType":"labels.text.fill","stylers":[{"color":"#d59563"}]},{"featureType":"poi","elementType":"labels.text.fill","stylers":[{"color":"#d59563"}]},{"featureType":"poi.park","elementType":"geometry","stylers":[{"color":"#263c3f"}]},{"featureType":"poi.park","elementType":"labels.text.fill","stylers":[{"color":"#6b9a76"}]},{"featureType":"road","elementType":"geometry","stylers":[{"color":"#38414e"}]},{"featureType":"road","elementType":"geometry.stroke","stylers":[{"color":"#212a37"}]},{"featureType":"road","elementType":"labels.text.fill","stylers":[{"color":"#9ca5b3"}]},{"featureType":"road.highway","elementType":"geometry","stylers":[{"color":"#746855"}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#1f2835"}]},{"featureType":"road.highway","elementType":"labels.text.fill","stylers":[{"color":"#f3d19c"}]},{"featureType":"transit","elementType":"geometry","stylers":[{"color":"#2f3948"}]},{"featureType":"transit.station","elementType":"labels.text.fill","stylers":[{"color":"#d59563"}]},{"featureType":"water","elementType":"geometry","stylers":[{"color":"#17263c"}]},{"featureType":"water","elementType":"labels.text.fill","stylers":[{"color":"#515c6d"}]},{"featureType":"water","elementType":"labels.text.stroke","stylers":[{"color":"#17263c"}]}];

    map = new google.maps.Map(document.getElementById("map"), {
        zoom: 8,
        center: initialPosition,
        disableDefaultUI: true, 
        zoomControl: true,
        styles: mapStyle
    });
    
    locations.forEach(location => {
        new google.maps.Marker({
            position: { lat: location.lat, lng: location.lng },
            map: map,
            icon: {
                url: 'assets/images/logo-completo.png',
                scaledSize: new google.maps.Size(90, 28),
                anchor: new google.maps.Point(45, 28)
            },
            label: {
                text: location.title,
                color: 'white',
                fontWeight: 'bold',
                fontSize: '12px',
                className: 'map-marker-label' 
            }
        });
    });
}