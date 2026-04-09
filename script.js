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

    // Lógica para cargar firmas desde CSV (formato TAB)
    const signersContainer = document.getElementById('signers-container');
    if (signersContainer) {
        loadSigners();
    }

    async function loadSigners() {
        try {
            console.log('Iniciando carga de firmas...');
            const response = await fetch('firmas.csv');
            if (!response.ok) throw new Error('No se pudo encontrar el archivo "firmas.csv"');
            
            const data = await response.text();
            const lines = data.split(/\r?\n/);
            let signers = [];

            // Usamos tabulación (\t) as delimiter
            const separator = '\t'; 

            for (let i = 1; i < lines.length; i++) {
                const line = lines[i].trim();
                if (line) {
                    const columns = line.split(separator);
                    const nombre = columns[0] ? columns[0].trim() : '';
                    const depto = columns[1] ? columns[1].trim() : '';
                    const univ = columns[2] ? columns[2].trim() : '';
                    
                    if (nombre && nombre.toLowerCase() !== 'nombre') {
                        signers.push({
                            nombre: nombre,
                            institucion: depto && univ ? `${depto}, ${univ}` : (depto || univ || '')
                        });
                    }
                }
            }

            // Ordenar alfabéticamente
            signers.sort((a, b) => a.nombre.localeCompare(b.nombre, 'es', { sensitivity: 'base' }));

            if (signers.length > 0) {
                // Limpiar marcador de posición y rellenar con datos reales
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
            } else {
                signersContainer.innerHTML = '<div class="signer-entry placeholder-entry"><p>No se encontraron datos en el archivo.</p></div>';
            }
        } catch (error) {
            console.error('Error cargando firmas:', error);
            const errorMsg = window.location.protocol === 'file:' 
                ? 'El navegador bloquea la carga de archivos locales (CORS). Sube los cambios a GitHub o usa un servidor local para probar.' 
                : 'Error al abrir "firmas.csv". Asegúrate de que el archivo existe y tiene el formato correcto.';
            
            signersContainer.innerHTML = `<div class="signer-entry placeholder-entry"><p style="color: #8b0000; font-weight: 700;">⚠️ ${errorMsg}</p></div>`;
        }
    }

});
