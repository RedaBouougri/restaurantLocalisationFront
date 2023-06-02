const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://restaurantlocalisationback-production.up.railway.app:8050',
      changeOrigin: true,
    })
  );
};