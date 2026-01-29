/**
 * TOMAUNO MODELS - ECOSISTEMA DIGITAL 2026 (ULTRA-FINAL V27.0 - FIXED)
 * Gestión Integral: Excel + Drive + Google Docs (Prisma)
 */

const FOLDER_ID = "1-KHpXFiUuWWC8vpbEiyJy38goHTHO2Fz";
const DB_MODELOS_ID = SpreadsheetApp.getActiveSpreadsheet().getId();
const DB_CURSOS_ID = "1NOgVQFUaWQi1ls59EeBy9yBJ8Oo8MWvSwiwRMb7KNKI";
const DOC_MEMORIA_ID = "10x4QDRn2RjEeQlJFtI7gogvT5XzDG5TBIRxcxSTuoZQ";
const SHEET_NAME = "Modelos";

function doGet() {
  return HtmlService.createTemplateFromFile('index')
    .evaluate()
    .setTitle("Tomauno Model's | Elite Management")
    .addMetaTag('viewport', 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function doPost(e) {
  let request;
  try {
    request = JSON.parse(e.postData.contents);
  } catch (err) {
    return jsonResponse({ error: "Invalid JSON" });
  }
  
  const action = request.action;
  let result;

  try {
    switch (action) {
      case 'getInitialData': result = getInitialData(); break;
      case 'saveModel': result = saveModel(request.data || request); break;
      case 'uploadFile': result = { url: uploadFile(request.base64, request.dni, request.nombre, request.tipo, request.oldUrl) }; break;
      case 'preRegister': result = preRegister(request.reg); break;
      case 'deleteModel': result = deleteModel(request.dni); break;
      case 'updateAdminToggle': result = updateAdminToggle(request.dni, request.col, request.currentVal); break;
      case 'saveGlobalNews': result = saveGlobalNews(request.txt); break;
      case 'addMuroPost': result = addMuroPost(request.dni, request.nombre, request.txt); break;
      case 'deleteMuroPost': result = deleteMuroPost(request.id); break;
      default: result = { error: 'Acción no reconocida' };
    }
  } catch (error) {
    result = { error: error.toString() };
  }
  return jsonResponse(result);
}

function jsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

function getInitialData() {
  const ss = SpreadsheetApp.openById(DB_MODELOS_ID);
  let sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
  
  const data = sheet.getDataRange().getDisplayValues();
  const models = data.slice(1).map(r => ({
    timestamp: r[0], dni: r[1], nombre: r[2], genero: r[3], edad: r[4], altura: r[5],
    medidas: r[6], ojos: r[7], pelo: r[8], calzado: r[9], localidad: r[10],
    wa: r[11], ig: r[12], tutor: r[13], exp: r[14], agencia: r[15], cat: r[16],
    quals: r[17], beauty: r[18], postu: r[19], 
    foto1: r[20], foto2: r[21], foto3: r[22], composite: r[23], 
    staff: r[24], video: r[25], isPublic: r[26]
  })).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  let prismaMemory = "";
  try { prismaMemory = DocumentApp.openById(DOC_MEMORIA_ID).getBody().getText(); } catch(e) {}

  const muro = (ss.getSheetByName("Muro")?.getDataRange().getDisplayValues() || []).slice(1);
  
  return { success: true, models, prismaMemory, muro, news: prismaMemory.substring(0, 200) + "..." };
}

function preRegister(reg) {
  try {
    const ssCursos = SpreadsheetApp.openById(DB_CURSOS_ID);
    const sheet = ssCursos.getSheetByName(reg.cursoId) || ssCursos.getSheets()[0]; 
    sheet.appendRow([new Date(), reg.dni, reg.nombre, reg.wa, "Pendiente"]);
    return { success: true };
  } catch(e) { return { error: e.toString() }; }
}

// ... Las demás funciones (uploadFile, saveModel, etc.) se mantienen igual a como las tenías
// pero asegúrate de que saveModel use el objeto que le llega correctamente.