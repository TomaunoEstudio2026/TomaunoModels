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
        // Mapeo Ultra-Seguro: Si falta un dato, ponemos un valor vacío en lugar de romper la web
        data.models = (data.models || []).map((m: any) => ({
          timestamp: m[0] || "",
          dni: String(m[1] || ""),
          nombre: m[2] || "",
          genero: m[3] || "Femenino",
          edad: Number(m[4] || 0),
          altura: m[5] || "",
          medidas: m[6] || "",
          ojos: m[7] || "",
          pelo: m[8] || "",
          calzado: m[9] || "",
          localidad: m[10] || "",
          wa: m[11] || "",
          ig: m[12] || "",
          tutor: m[13] || "",
          exp: m[14] || "",
          agencia: m[15] || "",
          cat: m[16] || "New Face",
          quals: m[17] ? String(m[17]).split(',').filter((q:any)=>q) : [],
          beauty: String(m[18]).toLowerCase() === 'si',
          postu: m[19] || "",
          foto1: m[20] || "", foto2: m[21] || "", foto3: m[22] || "", foto4: m[23] || "",
          composite: m[24] || "",
          staff: String(m[25]).toLowerCase() === 'si',
          video1: m[26] || "",
          video2: m[27] || "",
          isPublic: String(m[28]).toLowerCase() === 'si',
          isCollaborator: String(m[29]).toLowerCase() === 'si'
        }));

        data.muro = (data.muro || []).map((p: any, idx: number) => ({
          id: `p-${idx}`,
          timestamp: p[0] || "",
          dni: String(p[1] || ""),
          nombre: p[2] || "Anónimo",
          mensaje: p[3] || "",
          // Generamos un color único basado en el DNI para diferenciar usuarios
          color: `hsl(${(parseInt(p[1]) % 360) || 0}, 60%, 15%)` 
        })).reverse();
      }
      return data;
    } catch (e) {
      console.error("Error en Puente:", e);
      return null;
    }
  }
};