
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/PROYECTO/',
  locale: undefined,
  routes: [
  {
    "renderMode": 2,
    "route": "/PROYECTO"
  }
],
  entryPointToBrowserMapping: undefined,
  assets: {
    'index.csr.html': {size: 3529, hash: '636a74115c0bb5a35fb8a5ea71e4ba7876b1ff82a03b70d4179fb8443e3a2e66', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 3470, hash: 'f34be6e8ff3b61617f9c6bded1abda99720a70a31b97ace91c269666441f1b0b', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'index.html': {size: 10006, hash: 'b66eb8f271e73307d571c706707567f3685095abdabe2507455b7214f61bb7bc', text: () => import('./assets-chunks/index_html.mjs').then(m => m.default)},
    'styles-AOAACF65.css': {size: 452, hash: '01z1YOjTBLY', text: () => import('./assets-chunks/styles-AOAACF65_css.mjs').then(m => m.default)}
  },
};
