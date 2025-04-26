document.addEventListener("DOMContentLoaded", () => {
  const navMain = document.getElementsByName("nav");

  if (!navMain) return;

  let observer = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.intersectionRatio < 1) {
          navMain.classList.add("is-sticky");
        } else {
          navMain.classList.remove("is-sticky");
        }
      });
    },
    {
      threshold: [1], // Observe when 100% of the element is visible
    }
  );

  observer.observe(navMain);
});

document.addEventListener("DOMContentLoaded", () => {
  const track = document.querySelector(".carousel-track");
  if (!track) {
    console.error("Error: No se encontró el elemento .carousel-track");
    return;
  }
  const slides = Array.from(track.children);
  const nextButton = document.querySelector(".carousel-button.next");
  const prevButton = document.querySelector(".carousel-button.prev");
  const navDotsContainer = document.querySelector(".carousel-nav");

  if (!nextButton || !prevButton) {
    console.error("Error: No se encontraron los botones de navegación.");
    return;
  }
  if (slides.length === 0) {
    console.error("Error: No se encontraron slides dentro de .carousel-track.");
    return;
  }

  // Define cuánto vw mover en cada paso

  const stepVw = 45;

  // Generación de puntos
  if (navDotsContainer) {
    slides.forEach((slide, index) => {
      const dot = document.createElement("button");
      dot.classList.add("nav-dot");
      if (index === 0) dot.classList.add("active");
      dot.addEventListener("click", () => {
        moveToSlide(index);
      });
      navDotsContainer.appendChild(dot);
    });
  }
  const navDots = navDotsContainer ? Array.from(navDotsContainer.children) : [];

  let currentSlideIndex = 0;

  // Función para mover el carrusel (MODIFICADA)
  const moveToSlide = (targetIndex) => {
    stopCurrentVideo(); // Detener video actual

    // Usa stepVw para calcular el desplazamiento
    const offsetVw = stepVw * targetIndex;
    track.style.transform = `translateX(-${offsetVw}vw)`;

    // Actualizar puntos de navegación
    if (navDots.length > 0) {
      const currentDot = navDotsContainer.querySelector(".active");
      if (currentDot) {
        currentDot.classList.remove("active");
      }

      if (navDots[targetIndex]) {
        navDots[targetIndex].classList.add("active");
      }
    }

    currentSlideIndex = targetIndex;
    updateNavButtons();
  };

  // Función para actualizar botones
  const updateNavButtons = () => {
    // Oculta/muestra botones según el índice
    prevButton.style.display = currentSlideIndex === 0 ? "none" : "block";
    nextButton.style.display =
      currentSlideIndex === slides.length - 1 ? "none" : "block";
  };

  // Función para detener video
  const stopCurrentVideo = () => {
    const currentSlide = slides[currentSlideIndex];
    const iframe = currentSlide?.querySelector("iframe"); // Usa optional chaining por si acaso
    if (iframe?.contentWindow) {
      iframe.contentWindow.postMessage(
        '{"event":"command","func":"stopVideo","args":""}',
        "*"
      );
    }
  };

  nextButton.addEventListener("click", () => {
    const nextIndex = currentSlideIndex + 1;
    if (nextIndex < slides.length) {
      moveToSlide(nextIndex);
    }
  });

  prevButton.addEventListener("click", () => {
    const prevIndex = currentSlideIndex - 1;
    if (prevIndex >= 0) {
      moveToSlide(prevIndex);
    }
  });

  // Inicializar estado de los botones al cargar
  updateNavButtons();

  window.addEventListener("resize", () => {
    // Simplemente reaplica la transformación actual basada en vw
    const offsetVw = stepVw * currentSlideIndex;
    track.style.transition = "none"; // Evita animación durante el ajuste
    track.style.transform = `translateX(-${offsetVw}vw)`;
    // Pequeño retraso para restaurar la animación
    setTimeout(() => {
      track.style.transition = "transform 0.5s ease-in-out";
    }, 50);
  });
});
