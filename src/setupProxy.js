const { createProxyMiddleware } = require('http-proxy-middleware');
module.exports = function (app) {
    app.use(createProxyMiddleware('/api', {
        target: process.env.Proxy,
        changeOrigin: true,
    }));
    app.use(createProxyMiddleware('/sso', {
        target: process.env.Proxy,
        changeOrigin: true,
    }));
};