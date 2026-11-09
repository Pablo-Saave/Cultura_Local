/**
 * auth.config.js - Configuración centralizada de JWT
 * Única fuente del secreto: ya no existen valores por defecto hardcodeados.
 */

const MIN_SECRET_LENGTH = 32;

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;

  if (!secret || secret.length < MIN_SECRET_LENGTH) {
    throw new Error(
      `JWT_SECRET no está definido o tiene menos de ${MIN_SECRET_LENGTH} caracteres. ` +
      "Genera uno con: node -e \"console.log(require('crypto').randomBytes(48).toString('hex'))\""
    );
  }

  return secret;
}

const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

module.exports = { getJwtSecret, JWT_EXPIRES_IN };