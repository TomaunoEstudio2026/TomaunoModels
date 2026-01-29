
const GAS_URL = "https://script.google.com/macros/s/AKfycbyxQCPTYDei7H5sK8K-7SqrS_KZH3ZY8TIjH20ZJiwXPnZUSWuxBgzXS3HyqWTqZDnj/exec";

export const apiService = {
  async request(action: string, payload: any = {}) {
    try {
      const response = await fetch(GAS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({ action, ...payload })
      });

      if (!response.ok) throw new Error("Servidor no responde");
      const rawData = await response.json();
      
      if (action === 'getInitialData' && rawData?.models) {
        rawData.models = rawData.models.map((m: any) => ({
          ...m,
          dni: String(m.dni),
          beauty: m.beauty === 'Si' || m.beauty === true,
          staff: m.staff === 'Si' || m.staff === true,
          quals: Array.isArray(m.quals) ? m.quals : (m.quals ? String(m.quals).split(',') : [])
        }));
      }
      return rawData;
    } catch (e) {
      console.error("[TOMAUNO API ERROR]", e);
      return null;
    }
  }
};
