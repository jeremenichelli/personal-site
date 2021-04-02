const { CONTEXT, DEPLOY_PRIME_URL } = process.env;

const PRODUCTION_URL = 'https://jeremenichelli.io';
const URL = CONTEXT === 'deploy-preview' ? DEPLOY_PRIME_URL : PRODUCTION_URL;

module.exports = {
  title: 'Jeremias Menichelli',
  description:
    'Personal site of Jeremias Menichelli — Curious mind, developer and writer',
  author: 'Jeremias Menichelli',
  authorImage: `${URL}/assets/images/og-me.jpg`,
  url: URL,
  logo: `${URL}/assets/images/site-logo.jpg`
};
