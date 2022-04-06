module.exports = {
  images: {
    domains: ['media.steampowered.com']
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/usage',
        permanent: false,
      },
    ]
  },
}