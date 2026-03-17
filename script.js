document.addEventListener('DOMContentLoaded', () => {
    // Lógica para el cambio de pestañas institucionales
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const target = button.getAttribute('data-target');

            // Quitar clase activa de todos los botones y contenidos
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));

            // Activar botón clicado y su contenido
            button.classList.add('active');
            document.getElementById(target).classList.add('active');

            // Scroll suave hacia arriba al cambiar de pestaña
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });

    // Lógica para secciones desplegables (Acordeón)
    const toggleTriggers = document.querySelectorAll('.toggle-trigger');
    toggleTriggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            const parent = trigger.closest('.collapsible-section');
            parent.classList.toggle('open');
        });
    });

});
