# CRM comercial · Grupo Trimodos

Aplicación web instalable (PWA) del CRM de STINSA y TRANSARGI.
- Lee y escribe en **Odoo** a través de n8n.
- Usa el **Outlook** de cada comercial (correo y calendario).

Dirección de la app: **https://elomarmu.github.io/crm-movil/**

## Cómo funciona

| Pieza | Dónde está | Qué hace |
|---|---|---|
| La app (esta carpeta) | GitHub Pages | Pantallas, caché, inicio de sesión con Microsoft |
| «CRM móvil · API web (app)» | n8n | Comprueba quién eres (con tu sesión de Microsoft) y llama al motor |
| «CRM móvil · Motor Odoo (sub-flujo)» | n8n | Lee y escribe en Odoo con el usuario técnico; aplica las reglas de costes |
| Registro «CRM Movil» | Azure (Microsoft Entra ID) | Permite entrar con la cuenta de Microsoft de la empresa |

- **Quién entra.** Cada comercial entra con su cuenta de Microsoft. n8n busca su usuario de Odoo por el correo y solo le deja ver las empresas que tiene en Odoo. Lo que guarda queda a su nombre.
- **Si el correo de Microsoft no coincide con el login de Odoo**, añade la equivalencia en el nodo «Configuración» del motor: `usuariosAlias: { 'correo@microsoft': 'login@odoo' }`.
- **Correos y citas.** Se crean directamente en el Outlook del comercial (Microsoft Graph). Los correos quedan siempre como **borrador**: nunca se envía nada sin revisarlo.
- **Redacción.** La hace Claude a través de n8n, con la credencial de Anthropic.

## Instalarla en el móvil

- **iPhone (Safari):** abre la dirección, pulsa *Compartir* y luego *Añadir a pantalla de inicio*.
- **Android (Chrome):** abre la dirección, pulsa el menú ⋮ y luego *Instalar aplicación*.

Se abre a pantalla completa, sin la barra del navegador. Los enlaces de llamada abren el teléfono, los de WhatsApp abren el chat y «Ver borrador» abre la app de Outlook.

## Registro en Azure (ya hecho)

En *Microsoft Entra ID → Registros de aplicaciones → CRM Movil*:
- **Plataforma:** «Aplicación de página única (SPA)», con URI de redirección `https://elomarmu.github.io/crm-movil/`.
- **Permisos delegados de Microsoft Graph:** User.Read, Calendars.ReadWrite, Mail.ReadWrite, offline_access, openid y profile. Concede el consentimiento de administrador para no tener que aceptarlo usuario a usuario.
- Los identificadores están en `config.js`. No son secretos.

## Cambiar algo

- **Configuración** (dirección de la API, identificadores de Azure): `config.js`.
- **Pantallas:** `index.html`.
- **Después de cambiar archivos**, sube el número de `VERSION` en `sw.js` para que los móviles descarguen la versión nueva. La recibirán la próxima vez que abran la app.

## Probar sin Microsoft (solo para desarrollo)

Si en el navegador existe `localStorage['crm.devKey']`, la app no pide entrar con Microsoft. En su lugar envía esa clave a n8n en la cabecera `X-Clave-Pruebas`.

En uso normal el flujo de n8n tiene la clave de pruebas vacía, así que esta vía no funciona.

## Archivos

- `index.html`: la app completa.
- `config.js`: la configuración.
- `sw.js`: la caché para abrir rápido y sin conexión. No guarda datos de Odoo ni de Outlook.
- `manifest.webmanifest` e `icons/`: el nombre y el icono al instalarla.
- `img/`: los logotipos.
- `vendor/msal-browser.min.js`: la librería de Microsoft para iniciar sesión (MSAL 3.30.0, licencia MIT).
