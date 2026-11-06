// Configuración de la app. Solo hay que tocar este archivo.
window.CRM_CONFIG = {
  // Dirección del flujo «CRM móvil · API web (app)» de n8n (la de producción, sin "-test").
  api: "https://grupotrimodos.app.n8n.cloud/webhook/crm-movil-api",

  // Datos del registro de la app en Azure (Microsoft Entra ID → Registros de aplicaciones).
  // «Id. de aplicación (cliente)» y «Id. de directorio (inquilino)». No son secretos.
  clientId: "64eca31c-6ff3-4657-b081-067ef6ab84f9",
  tenantId: "aaed6d29-37bb-4d74-9b79-44acde258be3",

  // Dirección exacta en la que se publica la app (tiene que coincidir con la de Azure).
  redirectUri: "https://elomarmu.github.io/crm-movil/"
};
