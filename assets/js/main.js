// --- PARTIE 1 : PHOTO QUI SE REPLIE (LOGIQUE AJUSTÉE) ---
const photoContainer = document.getElementById('photo-container');

window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    
    // On commence à réduire après 50px de scroll pour laisser le temps de voir la photo
    if (scrollY > 50) {
        const maxScroll = 300; // Distance de scroll pour disparition complète
        const percentage = Math.max(0, 1 - ((scrollY - 50) / maxScroll));
        
        photoContainer.style.opacity = percentage;
        // Effet de rétrécissement (Scale) et remontée (TranslateY)
        photoContainer.style.transform = `scale(${0.8 + (percentage * 0.2)}) translateY(-${(scrollY - 50) / 2}px)`;
        
        // On cache complètement si invisible pour la performance
        if (percentage <= 0) {
            photoContainer.style.visibility = 'hidden';
            photoContainer.style.height = '0px'; // On réduit la hauteur pour remonter le contenu
            photoContainer.style.marginTop = '0px';
        } else {
            photoContainer.style.visibility = 'visible';
            photoContainer.style.height = 'auto';
        }
    } else {
        // État initial (Grand)
        photoContainer.style.opacity = 1;
        photoContainer.style.transform = 'scale(1) translateY(0)';
        photoContainer.style.visibility = 'visible';
        photoContainer.style.height = 'auto';
        photoContainer.style.marginTop = '4rem'; // mt-16
    }
});

// --- PARTIE 2 : FOOTER SCANNER (CONTACTS) ---

// Tes données de contact
const SOCIAL_CARDS = [
    {
        title: "GITHUB",
        subtitle: "Code Source",
        icon: "fab fa-github",
        color: "#ffffff", 
        link: "https://github.com",
        desc: "Repos"
    },
    {
        title: "LINKEDIN",
        subtitle: "Pro",
        icon: "fab fa-linkedin",
        color: "#e5e7eb", 
        link: "https://linkedin.com",
        desc: "Connect"
    },
    {
        title: "EMAIL",
        subtitle: "Contact",
        icon: "fas fa-envelope",
        color: "#d1d5db", 
        link: "mailto:tonemail@gmail.com",
        desc: "Write me"
    },
    {
        title: "WHATSAPP",
        subtitle: "Chat",
        icon: "fab fa-whatsapp",
        color: "#25D366", 
        link: "#",
        desc: "Message"
    }
];

class CardStreamController {
    constructor() {
        this.container = document.getElementById("cardStream");
        this.cardLine = document.getElementById("cardLine");
        this.position = 0;
        this.velocity = 50; // Vitesse de défilement
        this.direction = -1; // Vers la gauche
        this.isDragging = false;
        
        // On lance seulement si les éléments existent dans le DOM
        if(this.cardLine && this.container) {
            this.init();
        } else {
            console.error("Erreur: Éléments du footer introuvables");
        }
    }

    init() {
        this.populateCardLine();
        this.setupEventListeners();
        this.animate();
    }

    populateCardLine() {
        this.cardLine.innerHTML = "";
        // On duplique les cartes 4 fois pour être sûr que ça couvre l'écran
        const cardsToRender = [...SOCIAL_CARDS, ...SOCIAL_CARDS, ...SOCIAL_CARDS, ...SOCIAL_CARDS];
        
        cardsToRender.forEach((data) => {
            const wrapper = this.createCardWrapper(data);
            this.cardLine.appendChild(wrapper);
        });
    }

    createCardWrapper(data) {
        const wrapper = document.createElement("div");
        wrapper.className = "card-wrapper";
        
        // Carte Normale (Visible par défaut)
        const normalCard = document.createElement("div");
        normalCard.className = "card card-normal";
        normalCard.innerHTML = `
            <div class="text-3xl mb-2" style="color: ${data.color}">
                <i class="${data.icon}"></i>
            </div>
            <h3 class="text-sm font-bold text-white tracking-widest">${data.title}</h3>
            <p class="text-gray-500 text-[10px] mt-1 font-mono">${data.subtitle}</p>
        `;
        
        // Clic sur la carte
        normalCard.onclick = () => {
            if(!this.isDragging) window.open(data.link, '_blank');
        };

        // Carte ASCII (Visible quand scanné)
        const asciiCard = document.createElement("div");
        asciiCard.className = "card card-ascii";
        const asciiContent = document.createElement("div");
        asciiContent.className = "ascii-content";
        asciiContent.textContent = this.generateCode(30, 20); 
        asciiCard.appendChild(asciiContent);

        wrapper.appendChild(normalCard);
        wrapper.appendChild(asciiCard);

        return wrapper;
    }

    generateCode(w, h) {
        const chars = "01.|:;*=+-_ABDOULAYE"; // Un peu de personnalisation
        let out = "";
        for(let i=0; i<h; i++) {
            for(let j=0; j<w; j++) {
                out += chars[Math.floor(Math.random() * chars.length)];
            }
            out += "\n";
        }
        return out;
    }

    setupEventListeners() {
        this.cardLine.addEventListener("mousedown", () => this.isDragging = true);
        window.addEventListener("mouseup", () => this.isDragging = false);
        window.addEventListener("mousemove", (e) => {
            if(this.isDragging) {
                this.position += e.movementX;
                this.cardLine.style.transform = `translateX(${this.position}px)`;
            }
        });
    }

    animate() {
        if(!this.isDragging) {
            this.position += this.velocity * this.direction * 0.016;
            
            // Reset position pour boucle infinie fluide
            // On reset quand on a défilé d'un tiers de la longueur totale
            const totalWidth = this.cardLine.scrollWidth / 3; 
            if (Math.abs(this.position) > totalWidth) {
                this.position = 0;
            }
        }
        
        this.cardLine.style.transform = `translateX(${this.position}px)`;
        this.updateCardClipping();
        requestAnimationFrame(() => this.animate());
    }

    updateCardClipping() {
        // Centre de l'écran (Scanner)
        const scannerX = this.container.offsetWidth / 2;
        const wrappers = document.querySelectorAll(".card-wrapper");
        
        wrappers.forEach(wrapper => {
            const rect = wrapper.getBoundingClientRect();
            const cardLeft = rect.left;
            const cardWidth = rect.width;
            
            const normalCard = wrapper.querySelector(".card-normal");
            const asciiCard = wrapper.querySelector(".card-ascii");
            
            // Si la carte passe sous le scanner (au centre)
            if (cardLeft < scannerX && (cardLeft + cardWidth) > scannerX) {
                const intersect = scannerX - cardLeft;
                const percentage = (intersect / cardWidth) * 100;
                
                // Effet de révélation (Clip Path)
                normalCard.style.clipPath = `inset(0 0 0 ${percentage}%)`;
                asciiCard.style.clipPath = `inset(0 ${100 - percentage}% 0 0)`;
            } else if ((cardLeft + cardWidth) < scannerX) {
                // Déjà passé (Gauche) -> Tout noir/ASCII ou Reset
                normalCard.style.clipPath = `inset(0 0 0 100%)`;
                asciiCard.style.clipPath = `inset(0 0 0 0)`;
            } else {
                // Pas encore passé (Droite) -> Normal
                normalCard.style.clipPath = `inset(0 0 0 0)`;
                asciiCard.style.clipPath = `inset(0 100% 0 0)`;
            }
        });
    }
}

// Initialisation
document.addEventListener("DOMContentLoaded", () => {
    // Menu Mobile
    const mobileBtn = document.getElementById('mobile-menu-btn');
    const navUl = document.querySelector('nav ul');
    
    if(mobileBtn) {
        mobileBtn.addEventListener('click', () => {
            navUl.classList.toggle('hidden');
            navUl.classList.toggle('flex');
            navUl.classList.toggle('flex-col');
            navUl.classList.toggle('absolute');
            navUl.classList.toggle('top-16');
            navUl.classList.toggle('left-0');
            navUl.classList.toggle('w-full');
            navUl.classList.toggle('bg-white');
            navUl.classList.toggle('border-b');
        });
    }

    // Lancement du Footer Scanner
    new CardStreamController();
});