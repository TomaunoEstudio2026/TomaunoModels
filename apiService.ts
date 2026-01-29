
const GAS_URL = "https://script.google.com/macros/s/AKfycbyxQCPTYDei7H5sK8K-7SqrS_KZH3ZY8TIjH20ZJiwXPnZUSWuxBgzXS3HyqWTqZDnj/exec";

export const apiService = {
  async request(action: string, payload: any = {}) {
    try {
      const response = await fetch(GAS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({ action, ...payload })
      });
      const data = await response.json();

      if (action === 'getInitialData' && data.success) {
        data.models = (data.models || []).map((m: any) => ({
          timestamp: m[0] || "",
          dni: String(m[1] || ""),
          nombre: m[2] || "",
          genero: m[3] || "Femenino",
          edad: Number(m[4] || 0),
          altura: String(m[5] || "").replace('.', ','),
          medidas: m[6] || "",
          ojos: m[7] || "",
          pelo: m[8] || "",
          calzado: m[9] || "",
          localidad: m[10] || "",
          wa: String(m[11] || ""),
          ig: String(m[12] || ""),
          waTutor: String(m[13] || ""),
          exp: m[14] || "",
          cat: m[16] || "New Face",
          quals: m[17] ? String(m[17]).split(',').map(s=>s.trim()).filter(q=>q) : [],
          beauty: String(m[18]).toLowerCase() === 'si',
          foto1: m[20] || "", 
          foto2: m[21] || "", 
          foto3: m[22] || "", 
          composite: m[23] || "",
          staff: String(m[24]).toLowerCase() === 'si',
          video1: m[25] || "",
          video2: m[29] || "",
          isPublic: String(m[26]).toLowerCase() === 'si',
          lastUpdate: m[0] || ""
        }));

        data.muro = (data.muro || []).map((p: any, idx: number) => ({
          id: String(idx),
          timestamp: p[0] || "",
          dni: String(p[1] || ""),
          nombre: p[2] || "Anónimo",
          mensaje: p[3] || "",
          color: `hsl(${(parseInt(p[1]) % 360) || 0}, 60%, 15%)` 
        })).reverse();
      }
      return data;
    } catch (e) {
      console.error("Error API:", e);
      return { success: false, error: String(e) };
    }
  }
};
