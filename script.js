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
            const targetEl = document.getElementById(target);
            if (targetEl) targetEl.classList.add('active');

            // Scroll suave hacia arriba al cambiar de pestaña
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });

    // Lógica para secciones desplegables (Acordeón)
    const toggleTriggers = document.querySelectorAll('.toggle-trigger');
    toggleTriggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            const parent = trigger.closest('.collapsible-section');
            if (parent) parent.classList.toggle('open');
        });
    });

    // Lógica para cargar firmas desde CSV (formato TAB por defecto, pero flexible)
    const signersContainer = document.getElementById('signers-container');
    if (signersContainer) {
        loadSigners();
    }

    async function loadSigners() {
        try {
            console.log('Iniciando carga de firmas...');
            const response = await fetch('https://raw.githubusercontent.com/ArchivosAbiertos/carta-abierta/refs/heads/main/firmas.csv');
            if (!response.ok) throw new Error('Cargando...');
            
            const data = await response.text();
            const lines = data.split(/\r?\n/);
            let signers = [];

            // Identificar el separador automáticamente (Tab, Punto y coma o Coma)
            const firstLine = lines[0] || '';
            let separator = '\t'; // Por defecto Tab
            if (firstLine.includes(';') && (firstLine.split(';').length > firstLine.split('\t').length)) {
                separator = ';';
            } else if (firstLine.includes(',') && (firstLine.split(',').length > firstLine.split('\t').length)) {
                separator = ',';
            }

            for (let i = 1; i < lines.length; i++) {
                const line = lines[i].trim();
                if (line) {
                    const columns = line.split(separator);
                    
                    // Nuevo orden solicitado: nombre, universidad, departamento
                    const nombre = columns[0] ? columns[0].trim() : '';
                    const univ = columns[1] ? columns[1].trim() : '';
                    const depto = columns[2] ? columns[2].trim() : '';
                    
                    if (nombre && nombre.toLowerCase() !== 'nombre') {
                        signers.push({
                            nombre: nombre,
                            departamento: depto,
                            universidad: univ
                        });
                    }
                }
            }

            // Ordenar alfabéticamente
            signers.sort((a, b) => a.nombre.localeCompare(b.nombre, 'es', { sensitivity: 'base' }));

            if (signers.length > 0) {
                // Limpiar marcador de posición
                signersContainer.innerHTML = '';
                signers.forEach(signer => {
                    const entry = document.createElement('div');
                    entry.className = 'signer-entry';
                    
                    // Construcción de la línea de institución (Universidad normal, Depto en cursiva)
                    let instHTML = '';
                    if (signer.universidad) {
                        instHTML += `<span class="signer-univ">${signer.universidad}</span>`;
                    }
                    if (signer.departamento) {
                        instHTML += (instHTML ? ', ' : '') + `<span class="signer-dept">${signer.departamento}</span>`;
                    }

                    entry.innerHTML = `
                        <span class="signer-name">${signer.nombre}</span>
                        <span class="signer-institution">${instHTML}</span>
                    `;
                    signersContainer.appendChild(entry);
                });
            } else {
                signersContainer.innerHTML = '<div class="signer-entry placeholder-entry"><p>No se encontraron datos válidos.</p></div>';
            }
        } catch (error) {
            console.error('Error cargando firmas:', error);
            if (window.location.protocol === 'file:') {
                signersContainer.innerHTML = `
                    <div class="signer-entry placeholder-entry">
                        <p style="color: #8b0000; font-weight: 700;">⚠️ Modo Local Detectado</p>
                        <p style="font-size: 0.9rem;">El navegador bloquea la lectura automática de archivos locales (CORS).</p>
                        <p style="font-size: 0.8rem; font-style: italic; margin-top: 10px;">En cuanto subas los cambios a GitHub, los firmantes aparecerán aquí sin problemas.</p>
                    </div>`;
            } else {
                signersContainer.innerHTML = '<div class="signer-entry placeholder-entry"><p>Error al abrir el archivo de firmas.</p></div>';
            }
        }
    }

});
