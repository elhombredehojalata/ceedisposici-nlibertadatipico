<script>
    // 1. Inicialización de la Fecha de Hoy
    window.onload = function() {
        const meses = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
        const f = new Date();
        const fechaTexto = `Piura, ${f.getDate()} de ${meses[f.getMonth()]} de ${f.getFullYear()}`;
        document.getElementById('fecha_disp').value = fechaTexto;
    };

    // 2. Lógica del Modal
    function abrirResumen() {
        const nombre = document.getElementById('nombre').value.trim();
        if (!nombre) { alert("⚠️ Ingrese el nombre del imputado"); return; }

        const dataResumen = [
            { l: "Imputado", v: nombre.toUpperCase() },
            { l: "DNI", v: document.getElementById('dni').value || "---" },
            { l: "N° Disposición", v: document.getElementById('num_disp').value },
            { l: "Vehículo", v: document.getElementById('check_vehiculo').checked ? "SÍ" : "NO" }
        ];

        document.getElementById('listaResumen').innerHTML = dataResumen.map(i => `
            <div class="resumen-item"><span class="resumen-label">${i.l}</span><span class="resumen-val">${i.v}</span></div>
        `).join('');
        document.getElementById('modalResumen').style.display = 'flex';
    }

    function cerrarResumen() { document.getElementById('modalResumen').style.display = 'none'; }

    // 3. Conversor de Dosaje
    function convertirDosajeALetras(num) {
        const valor = parseFloat(num) || 0;
        const partes = valor.toFixed(2).split('.');
        const unidades = ["cero", "un", "dos", "tres", "cuatro", "cinco", "seis", "siete", "ocho", "nueve"];
        return `${unidades[parseInt(partes[0])] || partes[0]} gramos con ${partes[1]} centigramos de alcohol por litro de sangre`;
    }

    // 4. FUNCIÓN MAESTRA CON PARCHE PARA MÓVILES
    async function procesarWord() {
        cerrarResumen();
        const conFirma = document.getElementById('check_firma').checked;
        const nombreRaw = document.getElementById('nombre').value.toUpperCase().trim();
        const archivoModelo = conFirma ? 'MODELO_3_FIRMADO.docx' : 'MODELO_3.docx';

        const data = {
            NUMERO_DISPOSICION: document.getElementById('num_disp').value,
            FECHA_DISPOSICION: document.getElementById('fecha_disp').value,
            NOMBRE_IMPUTADO: nombreRaw,
            NUMERO_DNI: document.getElementById('dni').value,
            FECHA_DE_HECHOS: document.getElementById('fecha_hechos').value,
            HECHOS: document.getElementById('hechos').value,
            NUMER_DOSAJE: document.getElementById('num_dosaje').value,
            RESULTADO_DOSAJE: document.getElementById('res_dosaje').value + " G/L",
            RESULTADO_DOSAJE_LETRAS: convertirDosajeALetras(document.getElementById('res_dosaje').value),
            mostrar_vehiculo: document.getElementById('check_vehiculo').checked,
            VEHICULO: document.getElementById('vehiculo').value.toUpperCase(),
            PLACA: document.getElementById('placa').value.toUpperCase()
        };

        try {
            const response = await fetch(archivoModelo);
            if (!response.ok) throw new Error("Modelo no encontrado");
            const content = await response.arrayBuffer();
            
            const zip = new PizZip(content);
            const doc = new window.docxtemplater(zip, { paragraphLoop: true, linebreaks: true });
            doc.render(data);

            // GENERACIÓN DEL ARCHIVO
            const out = doc.getZip().generate({ 
                type: "blob",
                mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                compression: "DEFLATE"
            });

            // --- PARCHE DE COMPATIBILIDAD ANDROID/IOS ---
            // Creamos un objeto File a partir del Blob, esto "fuerza" la extensión correcta
            const nombreArchivo = `CCE_LIBERTAD_${nombreRaw.replace(/\s+/g, '_')}.docx`;
            const file = new File([out], nombreArchivo, { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" });
            
            // Usamos saveAs con el objeto File corregido
            saveAs(file, nombreArchivo);

        } catch (error) {
            console.error(error);
            alert("❌ Error al generar. Asegúrate de que los archivos .docx están en la raíz de tu GitHub.");
        }
    }
</script>
