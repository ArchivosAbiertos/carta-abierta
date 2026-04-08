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

    // Lógica para cargar firmas desde CSV
    const signersContainer = document.getElementById('signers-container');
    if (signersContainer) {
        loadSigners();
    }

    async function loadSigners() {
        try {
            const response = await fetch('firmas.csv');
            if (!response.ok) throw new Error('No se pudo cargar el archivo de firmas');
            
            const data = await response.text();
            const lines = data.split('\n');
            const signers = [];

            // Empezamos en 1 para saltar la cabecera
            for (let i = 1; i < lines.length; i++) {
                const line = lines[i].trim();
                if (line) {
                    const [nombre, departamento, universidad] = line.split(';');
                    if (nombre) {
                        signers.push({
                            nombre: nombre.trim(),
                            institucion: `${departamento.trim()}${departamento && universidad ? ', ' : ''}${universidad.trim()}`
                        });
                    }
                }
            }

            // Renderizar firmas
            if (signers.length > 0) {
                // Limpiar marcador de posición si existen firmas reales
                signersContainer.innerHTML = '';
                
                signers.forEach(signer => {
                    const entry = document.createElement('div');
                    entry.className = 'signer-entry';
                    entry.innerHTML = `
                        <span class="signer-name">${signer.nombre}</span>
                        <span class="signer-institution">${signer.institucion}</span>
                    `;
                    signersContainer.appendChild(entry);
                });
            }
        } catch (error) {
            console.error('Error cargando firmas:', error);
        }
    }

});
