
/**
 * TOMAUNO MODELS - API CONNECTOR 2026
 * Conecta la web con el ecosistema Google Sheets usando tu URL de implementación.
 */

// TU URL REAL DE LA CAPTURA DE PANTALLA:
const GAS_URL = "https://script.google.com/macros/s/AKfycbxQCPTYDei7H5sK8K-7SqrS_KZH3ZY8TljH20ZJiwXPnZUSWuxBgzXS3HyqWTqZDnj/exec";

export const apiService = {
  async request(action: string, payload: any = {}) {
    try {
      const response = await fetch(GAS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({ action, ...payload })
      });
      const data = await response.json();
      
      // Adaptamos la respuesta de tu GAS actual al formato de la Web
      if (action === 'getInitialData') {
        return {
          models: data.models || [],
          news: data.news || "Sin casting activo.",
          logo: data.logo || "",
          posts: data.muro ? data.muro.map((r: any, i: number) => ({
            id: i.toString(),
            nombre: r[2],
            mensaje: r[3],
            timestamp: r[0]
          })) : []
        };
      }
      return data;
    } catch (e) {
      console.error("Error de conexión con Tomauno Cloud:", e);
      return null;
    }
  }
};
