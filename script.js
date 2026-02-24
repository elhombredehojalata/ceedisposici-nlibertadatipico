/**
 * Convierte el número de dosaje (ej. 0.47) a formato legal escrito.
 */
function convertirDosajeALetras(num) {
    const valor = parseFloat(num);
    if (isNaN(valor)) return "";
    const partes = valor.toFixed(2).split('.');
    const enteros = parseInt(partes[0]);
    const decimales = parseInt(partes[1]);
    const unidades = ["cero", "un", "dos", "tres", "cuatro", "cinco", "seis", "siete", "ocho", "nueve"];
    
    let textoEnteros = enteros === 0 ? "cero" : unidades[enteros] || enteros;
    return `${textoEnteros} gramos con ${decimales} centigramos de alcohol por litro de sangre`;
}

/**
 * Función principal para generar el documento Word.
 */
async function generarDocumento() {
    // 1. Extraemos los valores de los inputs del HTML
    const resNum = document.getElementById('res_dosaje').value;
    const dniValor = document.getElementById('dni').value; // <--- CAPTURA EL DNI

    // 2. Creamos el objeto 'data' que mapea las llaves { } del Word
    const data = {
        NUMERO_DISPOSICION: document.getElementById('num_disp').value,
        FECHA_DISPOSICION: document.getElementById('fecha_disp').value,
        NOMBRE_IMPUTADO: document.getElementById('nombre').value.toUpperCase(),
        
        // ESTA ES LA VARIABLE CLAVE PARA TU NUEVO MODELO
        NUMERO_DNI: dniValor, 

        HECHOS: document.getElementById('hechos').value,
        FECHA_DE_HECHOS: document.getElementById('fecha_hechos').value,
        FECHA_DE_INTERVENCION_POLICIAL: document.getElementById('fecha_int').value,
        NUMER_DOSAJE: document.getElementById('num_dosaje').value,
        RESULTADO_DOSAJE: resNum + " G/L",
        RESULTADO_DOSAJE_LETRAS: convertirDosajeALetras(resNum),
        VEHICULO: document.getElementById('vehiculo').value.toUpperCase(),
        PLACA: document.getElementById('placa').value.toUpperCase()
    };

    // 3. Verificación de seguridad
    if (Object.values(data).some(v => v === "" || v === " G/L")) {
        alert("Por favor, completa todos los campos, incluyendo el DNI.");
        return;
    }

    try {
        // 4. Cargamos el archivo desde la raíz de tu GitHub
        const response = await fetch('MODELO_3.docx');
        if (!response.ok) throw new Error("No se encontró MODELO_3.docx");
        
        const content = await response.arrayBuffer();
        const zip = new PizZip(content);
        const doc = new window.docxtemplater(zip, {
            paragraphLoop: true,
            linebreaks: true,
        });

        // 5. El motor reemplaza {NUMERO_DNI} por el valor de 'dniValor'
        doc.render(data);

        // 6. Creamos el archivo final
        const out = doc.getZip().generate({
            type: "blob",
            mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        });

        // 7. Descargamos el archivo
        saveAs(out, `Libertad_DNI_${data.NUMERO_DNI}.docx`);

    } catch (error) {
        console.error(error);
        alert("Error: Revisa que el archivo MODELO_3.docx esté en tu repositorio.");
    }
}
