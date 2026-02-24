async function generarDocumento() {
    // 1. Verificar si quiere firma o no
    const incluirFirma = document.getElementById('check_firma').checked;
    
    // 2. Elegir el archivo según la elección del usuario
    const archivoElegido = incluirFirma ? 'MODELO_3_FIRMADO.docx' : 'MODELO_3.docx';

    // 3. Recopilar los datos del formulario
    const data = {
        NUMERO_DISPOSICION: document.getElementById('num_disp').value,
        FECHA_DISPOSICION: document.getElementById('fecha_disp').value,
        NOMBRE_IMPUTADO: document.getElementById('nombre').value.toUpperCase(),
        NUMERO_DNI: document.getElementById('dni').value,
        HECHOS: document.getElementById('hechos').value,
        FECHA_DE_HECHOS: document.getElementById('fecha_hechos').value,
        FECHA_DE_INTERVENCION_POLICIAL: document.getElementById('fecha_int').value,
        NUMER_DOSAJE: document.getElementById('num_dosaje').value,
        RESULTADO_DOSAJE: document.getElementById('res_dosaje').value + " G/L",
        RESULTADO_DOSAJE_LETRAS: convertirDosajeALetras(document.getElementById('res_dosaje').value),
        VEHICULO: document.getElementById('vehiculo').value.toUpperCase(),
        PLACA: document.getElementById('placa').value.toUpperCase()
    };

    try {
        // 4. Cargar el archivo correspondiente
        const response = await fetch(archivoElegido);
        if (!response.ok) throw new Error("No se encontró el archivo: " + archivoElegido);
        
        const content = await response.arrayBuffer();
        const zip = new PizZip(content);
        const doc = new window.docxtemplater(zip, {
            paragraphLoop: true,
            linebreaks: true,
        });

        // 5. Llenar los datos
        doc.render(data);

        // 6. Descargar
        const out = doc.getZip().generate({
            type: "blob",
            mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        });

        const prefijo = incluirFirma ? "FIRMADO_" : "";
        saveAs(out, `${prefijo}Libertad_${data.NUMERO_DNI}.docx`);

    } catch (error) {
        console.error(error);
        alert("Error: Asegúrate de que ambos archivos .docx estén en tu GitHub.");
    }
}async function generarDocumento() {
    // 1. Verificar si quiere firma o no
    const incluirFirma = document.getElementById('check_firma').checked;
    
    // 2. Elegir el archivo según la elección del usuario
    const archivoElegido = incluirFirma ? 'MODELO_3_FIRMADO.docx' : 'MODELO_3.docx';

    // 3. Recopilar los datos del formulario
    const data = {
        NUMERO_DISPOSICION: document.getElementById('num_disp').value,
        FECHA_DISPOSICION: document.getElementById('fecha_disp').value,
        NOMBRE_IMPUTADO: document.getElementById('nombre').value.toUpperCase(),
        NUMERO_DNI: document.getElementById('dni').value,
        HECHOS: document.getElementById('hechos').value,
        FECHA_DE_HECHOS: document.getElementById('fecha_hechos').value,
        FECHA_DE_INTERVENCION_POLICIAL: document.getElementById('fecha_int').value,
        NUMER_DOSAJE: document.getElementById('num_dosaje').value,
        RESULTADO_DOSAJE: document.getElementById('res_dosaje').value + " G/L",
        RESULTADO_DOSAJE_LETRAS: convertirDosajeALetras(document.getElementById('res_dosaje').value),
        VEHICULO: document.getElementById('vehiculo').value.toUpperCase(),
        PLACA: document.getElementById('placa').value.toUpperCase()
    };

    try {
        // 4. Cargar el archivo correspondiente
        const response = await fetch(archivoElegido);
        if (!response.ok) throw new Error("No se encontró el archivo: " + archivoElegido);
        
        const content = await response.arrayBuffer();
        const zip = new PizZip(content);
        const doc = new window.docxtemplater(zip, {
            paragraphLoop: true,
            linebreaks: true,
        });

        // 5. Llenar los datos
        doc.render(data);

        // 6. Descargar
        const out = doc.getZip().generate({
            type: "blob",
            mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        });

        const prefijo = incluirFirma ? "FIRMADO_" : "";
        saveAs(out, `${prefijo}Libertad_${data.NUMERO_DNI}.docx`);

    } catch (error) {
        console.error(error);
        alert("Error: Asegúrate de que ambos archivos .docx estén en tu GitHub.");
    }
}
