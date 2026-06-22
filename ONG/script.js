 const header = document.querySelector('header');
 
 function abrirMenu() {
     const flexNav = document.querySelector('nav ul');
     if (flexNav) flexNav.classList.toggle('flexNav');
 }
        
    window.addEventListener('scroll', () => {
            if (window.scrollY > 20) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });

document.addEventListener('DOMContentLoaded', () => {
    const toggles = document.querySelectorAll('.proyecto-toggle');

    toggles.forEach(btn => {
        const li = btn.closest('.proyecto');
        const content = btn.nextElementSibling;

        // ensure content has transitionable max-height
        content.style.maxHeight = '0px';

        btn.addEventListener('click', (e) => {
            const isOpen = li.classList.contains('open');

            if (isOpen) {
                // close
                li.classList.remove('open');
                btn.setAttribute('aria-expanded', 'false');
                // animate to 0 then hide after transition
                content.style.maxHeight = content.scrollHeight + 'px';
                requestAnimationFrame(() => {
                    content.style.maxHeight = '0px';
                });
                const onTransitionEnd = () => {
                    content.setAttribute('hidden', '');
                    content.removeEventListener('transitionend', onTransitionEnd);
                };
                content.addEventListener('transitionend', onTransitionEnd);
            } else {
                // open
                li.classList.add('open');
                btn.setAttribute('aria-expanded', 'true');
                content.removeAttribute('hidden');
                // set to scrollHeight for smooth expand
                const height = content.scrollHeight;
                content.style.maxHeight = height + 'px';
            }
        });
    });

    const slides = document.querySelectorAll('.slide');
    const prevButton = document.querySelector('.carrusel-control.prev');
    const nextButton = document.querySelector('.carrusel-control.next');
    let currentIndex = 0;

    function updateCarrusel(index) {
        slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === index);
        });
    }

    function showSlide(direction) {
        if (slides.length === 0) return;
        currentIndex = (currentIndex + direction + slides.length) % slides.length;
        updateCarrusel(currentIndex);
    }

    if (slides.length && prevButton && nextButton) {
        prevButton.addEventListener('click', () => showSlide(-1));
        nextButton.addEventListener('click', () => showSlide(1));
        updateCarrusel(currentIndex);
    }
    
    // Hide header while the full-screen carousel is mostly visible
    const carouselSection = document.querySelector('.carrusel-section.full-screen-carrusel');
    if (carouselSection && window.IntersectionObserver) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                    if (entry.intersectionRatio >= 0.75) {
                        header.classList.add('hidden');
                    } else {
                        header.classList.remove('hidden');
                    }
                });
        }, { threshold: [0, 0.25, 0.5, 0.75, 1] });

        observer.observe(carouselSection);
    }

    // Impact calculator form
    const donacionForm = document.getElementById('donacionForm');
    const montoInput = document.getElementById('monto');
    const impactoResultado = document.getElementById('impactoResultado');

    if (donacionForm && montoInput && impactoResultado) {
        donacionForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const monto = Number(montoInput.value);
            if (!monto || monto < 100) {
                impactoResultado.innerHTML = '<span>Ingresá al menos $100 para calcular tu impacto.</span>';
                return;
            }

            const costoPorTortuga = 10000;
            const tortugas = Math.floor(monto / costoPorTortuga);
            const restante = monto % costoPorTortuga;
            const falta = restante > 0 ? costoPorTortuga - restante : 0;
            const mensajeTortugas = tortugas > 0
                ? `Tu donación cubre la ayuda de <span>${tortugas} tortuga${tortugas === 1 ? '' : 's'}</span>.`
                : 'Con ese monto podés dar un gran paso y empezar a juntar ayuda para una tortuga.';
            const mensajeRestante = falta > 0
                ? ` Quedan <span>$${falta}</span> para completar la próxima tortuga.`
                : '';

            impactoResultado.innerHTML = `
                ${mensajeTortugas}
                ${mensajeRestante}
                <br>
                <small>Cada $10.000 de ayuda equivale al cuidado de una tortuga.</small>
            `;
        });
    }

});

// Modal helper: crea un modal dinámico con template y lo agrega al body
function abrirModal(title = 'Modal', bodyHTML = ''){
    const overlay = document.createElement('div');
    overlay.className = 'modalOverlay';

    const modal = document.createElement('div');
    modal.className = 'modalStyle';
    modal.innerHTML = `
        <button class="modalCloseBtn" aria-label="Cerrar">✕</button>
        <h2>${title}</h2>
        <div class="modalBody">${bodyHTML}</div>
    `;

    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    const btnCerrar = modal.querySelector('.modalCloseBtn');
    const modalBody = modal.querySelector('.modalBody');

    btnCerrar.addEventListener('click', () => {
        overlay.remove();
    });

    // clic fuera del modal cierra
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) overlay.remove();
    });

    return { overlay, modal, modalBody };
}