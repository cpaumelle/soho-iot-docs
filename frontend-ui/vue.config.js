module.exports = {
  devServer: {
    proxy: {
      '/v1': {
        target: 'http://localhost:9000',  // your backend device manager API
        changeOrigin: true,
        secure: false,
      },
    },
  },
}
