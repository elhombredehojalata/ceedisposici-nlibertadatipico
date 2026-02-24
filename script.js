/**
 * Convierte el resultado numérico del dosaje a letras legalmente aceptables.
 * Basado en el formato de tu Modelo 3.
 */
function convertirDosajeALetras(num) {
    const valor = parseFloat(num);
    if (isNaN(valor)) return "";

    const partes = valor.toFixed(2).split('.');
    const enteros = parseInt(partes[0]);
    const decimales = parseInt(partes[1]);

    const unidades = ["cero", "un", "dos", "tres", "cuatro", "cinco", "seis", "siete", "ocho", "nueve"];
    
    // Diccionario simple para centigramos comunes (puedes ampliarlo)
    const nombresDecimales = {
        47: "cuarenta y siete",
        25: "veinticinco",
        50: "cincuenta",
        10: "diez",
        20: "veinte",
        30: "treinta",
        40: "cuarenta"
    };

    let textoEnteros = enteros === 0 ? "cero" : unidades[enteros] || enteros;
    let textoDecimales = nombresDecimales[decimales] || decimales.toString();

    return `${textoEnteros} gramos con ${textoDecimales} centigramos de alcohol por litro de sangre`;
}

/**
 * Función principal que procesa el Word
 */
async function generarDocumento() {
    const resNum = document.getElementById('res_dosaje').value;
    
    [cite_start]// Mapeo exacto de las variables del MODELO 3 [cite: 63-93]
    const data = {
        NUMERO_DISPOSICION: document.getElementById('num_disp').value,
        FECHA_DISPOSICION: document.getElementById('fecha_disp').value,
        NOMBRE_IMPUTADO: document.getElementById('nombre').value.toUpperCase(),
        HECHOS: document.getElementById('hechos').value,
        FECHA_DE_HECHOS: document.getElementById('fecha_hechos').value,
        FECHA_DE_INTERVENCION_POLICIAL: document.getElementById('fecha_int').value,
        NUMER_DOSAJE: document.getElementById('num_dosaje').value,
        RESULTADO_DOSAJE: resNum + " G/L",
        RESULTADO_DOSAJE_LETRAS: convertirDosajeALetras(resNum),
        VEHICULO: document.getElementById('vehiculo').value.toUpperCase(),
        PLACA: document.getElementById('placa').value.toUpperCase()
    };

    // Validar campos vacíos
    if (Object.values(data).some(v => v === "" || v === " G/L")) {
        alert("Por favor, complete todos los campos antes de continuar.");
        return;
    }

    try {
        // Cargar el archivo MODELO 3.docx desde el servidor/github
        const response = await fetch('MODELO_3.docx');
        if (!response.ok) throw new Error("No se encontró el archivo MODELO_3.docx");
        
        const content = await response.arrayBuffer();
        const zip = new PizZip(content);
        
        const doc = new window.docxtemplater(zip, {
            paragraphLoop: true,
            linebreaks: true,
        });

        // Reemplazar las etiquetas {VARIABLE}
        doc.render(data);

        // Generar el blob para descarga
        const out = doc.getZip().generate({
            type: "blob",
            mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        });

        // Descargar el archivo usando FileSaver.js
        saveAs(out, `Libertad_${data.NOMBRE_IMPUTADO.replace(/ /g, "_")}.docx`);

    } catch (error) {
        console.error(error);
        alert("Error al generar el documento. Asegúrese de que 'MODELO_3.docx' esté en la carpeta del proyecto.");
    }
}
