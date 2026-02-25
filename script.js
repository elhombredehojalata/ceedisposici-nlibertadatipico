<script>
    // 1. Inicialización de la Fecha de Hoy al cargar la página
    window.onload = function() {
        const meses = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
        const f = new Date();
        const fechaTexto = `Piura, ${f.getDate()} de ${meses[f.getMonth()]} de ${f.getFullYear()}`;
        document.getElementById('fecha_disp').value = fechaTexto;
    };

    // 2. Función para abrir el Modal de Resumen
    function abrirResumen() {
        const nombre = document.getElementById('nombre').value.trim();
        if (!nombre) {
            alert("⚠️ Por favor, ingrese el nombre del imputado.");
            return;
        }

        // Recopilamos datos para la vista previa
        const dataResumen = [
            { l: "Imputado", v: nombre.toUpperCase() },
            { l: "DNI", v: document.getElementById('dni').value || "---" },
            { l: "Fecha Disposición", v: document.getElementById('fecha_disp').value },
            { l: "N° Disposición", v: document.getElementById('num_disp').value },
            { l: "Vehículo", v: document.getElementById('check_vehiculo').checked ? document.getElementById('vehiculo').value : "NO APLICA" },
            { l: "Firma Digital", v: document.getElementById('check_firma').checked ? "SÍ" : "NO" }
        ];

        // Inyectamos el HTML en la lista de resumen
        document.getElementById('listaResumen').innerHTML = dataResumen.map(i => `
            <div class="resumen-item">
                <span class="resumen-label">${i.l}</span>
                <span class="resumen-val">${i.v}</span>
            </div>
        `).join('');
        
        document.getElementById('modalResumen').style.display = 'flex';
    }

    // 3. Función para cerrar el Modal
    function cerrarResumen() {
        document.getElementById('modalResumen').style.display = 'none';
    }

    // 4. Conversor de Dosaje a Letras
    function convertirDosajeALetras(num) {
        const valor = parseFloat(num);
        if (isNaN(valor)) return "cero gramos con cero centigramos";
        const partes = valor.toFixed(2).split('.');
        const unidades = ["cero", "un", "dos", "tres", "cuatro", "cinco", "seis", "siete", "ocho", "nueve"];
        
        let entero = unidades[parseInt(partes[0])] || partes[0];
        return `${entero} gramos con ${partes[1]} centigramos de alcohol por litro de sangre`;
    }

    // 5. Función Maestra: Procesar y Descargar Word (Solución Móvil incluida)
    async function procesarWord() {
        // Cerramos el modal inmediatamente para evitar doble click
        cerrarResumen();

        const conFirma = document.getElementById('check_firma').checked;
        const nombre = document.getElementById('nombre').value.toUpperCase().trim();
        const dni = document.getElementById('dni').value;
        const archivoModelo = conFirma ? 'MODELO_3_FIRMADO.docx' : 'MODELO_3.docx';

        // Preparamos el objeto DATA con todas las etiquetas del Word
        const data = {
            NUMERO_DISPOSICION: document.getElementById('num_disp').value,
            FECHA_DISPOSICION: document.getElementById('fecha_disp').value,
            NOMBRE_IMPUTADO: nombre,
            NUMERO_DNI: dni,
            FECHA_DE_HECHOS: document.getElementById('fecha_hechos').value,
            HECHOS: document.getElementById('hechos').value,
            NUMER_DOSAJE: document.getElementById('num_dosaje').value,
            RESULTADO_DOSAJE: document.getElementById('res_dosaje').value + " G/L",
            RESULTADO_DOSAJE_LETRAS: convertirDosajeALetras(document.getElementById('res_dosaje').value),
            
            // Lógica condicional del punto 2
            mostrar_vehiculo: document.getElementById('check_vehiculo').checked,
            VEHICULO: document.getElementById('vehiculo').value.toUpperCase(),
            PLACA: document.getElementById('placa').value.toUpperCase()
        };

        try {
            // Descarga del modelo desde el servidor/GitHub
            const response = await fetch(archivoModelo);
            if (!response.ok) throw new Error("No se pudo hallar el archivo .docx");
            
            const content = await response.arrayBuffer();
            
            // Inicializar PizZip
            const zip = new PizZip(content);
            
            // Configurar Docxtemplater
            const doc = new window.docxtemplater(zip, { 
                paragraphLoop: true, 
                linebreaks: true 
            });

            // Renderizar datos en el Word
            doc.render(data);

            // Generar el archivo final (Corrección para Celulares)
            const out = doc.getZip().generate({ 
                type: "blob",
                mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                compression: "DEFLATE" // Obliga al móvil a reconocer el formato comprimido de Word
            });

            // Descargar con FileSaver.js
            const nombreArchivoFinal = `CCE LIBERTAD ${nombre}.docx`;
            saveAs(out, nombreArchivoFinal);

        } catch (error) {
            console.error(error);
            alert("❌ ERROR: No se pudo generar el documento. Verifica que los archivos MODELO_3.docx y MODELO_3_FIRMADO.docx estén en la carpeta principal de tu GitHub.");
        }
    }
</script>
