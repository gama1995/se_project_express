const { NOD_ENV, JWT_SECTRET } = process.env;

module.exports = {
    JWT_SECTRET: NOD_ENV === "production" ? JWT_SECTRET : "dev-secret",
};