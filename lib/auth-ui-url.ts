/**
 * Login vive en gr-auth-ui (GR-154): gr-common-ui ya no tiene su propia
 * pagina de login (GR-155).
 */
export const authUiUrl = process.env.NEXT_PUBLIC_AUTH_UI_URL || "http://localhost:3002";
