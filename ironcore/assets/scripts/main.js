// =========================
// ELEMENTS
// =========================
const navbar = document.getElementById("navbar");
const programsSection = document.getElementById("programs");
const progressBar = document.getElementById("progress-bar");
const heroImg = document.querySelector(".hero-img");

const menuBtn = document.getElementById("menu-btn");
const mobileMenu = document.getElementById("mobile-menu");
const closeMenu = document.getElementById("close-menu");

const links = document.querySelectorAll(".nav-link");
const sections = document.querySelectorAll("section");

const track = document.getElementById("testimonial-track");
const cards = document.querySelectorAll(".testimonial-card");

const scrollBtn = document.getElementById("scrollTopBtn");

// =========================
// STATE
// =========================
let lastScroll = 0;
let index = 0;
let sliderInterval = null;

// =========================
// MOBILE MENU
// =========================
// OPEN (slide in)
menuBtn.addEventListener("click", () => {
    mobileMenu.classList.remove("translate-x-full");
    mobileMenu.classList.add("translate-x-0");
});

// CLOSE (slide out)
function closeMobileMenu() {
    mobileMenu.classList.add("translate-x-full");
    mobileMenu.classList.remove("translate-x-0");
}

closeMenu.addEventListener("click", closeMobileMenu);

// close when clicking links
document.querySelectorAll("#mobile-menu a").forEach(link => {
    link.addEventListener("click", closeMobileMenu);
});

// =========================
// TESTIMONIAL SLIDER
// =========================
function updateSlider() {
    if (!track || cards.length === 0) return;

    const step = 100; // each card takes full "view step"
    track.style.transform = `translateX(-${index * step}%)`;
}

function moveSlider() {
    index = (index + 1) % cards.length;
    track.style.transform = `translateX(-${index * 50}%)`;
}

function startSlider() {
    if (sliderInterval) return;
    sliderInterval = setInterval(moveSlider, 5000);
}

function stopSlider() {
    clearInterval(sliderInterval);
    sliderInterval = null;
}

startSlider();

// pause when tab hidden
document.addEventListener("visibilitychange", () => {
    document.hidden ? stopSlider() : startSlider();
});

// =========================
// KEYBOARD CONTROL
// =========================
document.addEventListener("keydown", (e) => {
    if (!track) return;

    if (e.key === "ArrowRight") {
        index = (index + 1) % cards.length;
        updateSlider();
    }

    if (e.key === "ArrowLeft") {
        index = (index - 1 + cards.length) % cards.length;
        updateSlider();
    }
});

// =========================
// REVEAL
// =========================
const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add("active");
        }
    });
}, { threshold: 0.15 });

document.querySelectorAll(".reveal").forEach(el => observer.observe(el));


window.addEventListener("scroll", () => {
    if (window.scrollY > 300) {
        scrollBtn.classList.remove("opacity-0", "pointer-events-none", "translate-y-4");
        scrollBtn.classList.add("opacity-100", "translate-y-0");
    } else {
        scrollBtn.classList.add("opacity-0", "pointer-events-none", "translate-y-4");
        scrollBtn.classList.remove("opacity-100", "translate-y-0");
    }
});

scrollBtn.addEventListener("click", () => {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});

// =========================
// SCROLL HANDLER
// =========================
window.addEventListener("scroll", () => {
    const currentScroll = window.scrollY;

    const scrollHeight =
        document.documentElement.scrollHeight - window.innerHeight;

    const trigger = window.innerHeight * 0.6;

    // =========================
    // PROGRESS BAR
    // =========================
    if (progressBar) {
        const progress = Math.min(
            100,
            Math.max(0, (currentScroll / scrollHeight) * 100)
        );
        progressBar.style.width = progress + "%";
    }

    // =========================
    // NAVBAR
    // =========================
   if (navbar) {
        if (currentScroll < trigger) {
            navbar.classList.remove(
                "fixed",
                "bg-black/80",
                "backdrop-blur",
                "shadow-lg"
            );
            navbar.classList.add("absolute");

            navbar.classList.remove("nav-visible");
            navbar.classList.add("nav-hidden");
        } else {
            navbar.classList.remove("absolute");
            navbar.classList.add("fixed", "bg-black/80", "backdrop-blur", "shadow-lg");

            if (currentScroll > lastScroll) {
                navbar.classList.remove("nav-hidden");
                navbar.classList.add("nav-visible");
            } else {
                navbar.classList.add("nav-hidden");
                navbar.classList.remove("nav-visible");
            }
        }

        // shrink effect
        if (currentScroll > trigger + 100) {
            navbar.classList.add("py-3");
            navbar.classList.remove("py-5");
        } else {
            navbar.classList.add("py-5");
            navbar.classList.remove("py-3");
        }
    }

    // =========================
    // SCROLL SPY
    // =========================
    let currentSection = "";

    sections.forEach(sec => {
        const top = sec.offsetTop - 150;
        if (currentScroll >= top) {
            currentSection = sec.id;
        }
    });

    links.forEach(link => {
        link.classList.remove("text-red-500");

        if (link.getAttribute("href") === "#" + currentSection) {
            link.classList.add("text-red-500");
        }
    });

    // =========================
    // HERO PARALLAX
    // =========================
    if (heroImg) {
        heroImg.style.transform =
            `translateY(${currentScroll * 0.25}px) scale(1.1)`;
    }

    lastScroll = currentScroll;
});