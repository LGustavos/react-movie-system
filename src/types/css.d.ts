/**
 * O Next declara apenas `*.module.css`, entao `import './globals.css'` fica sem
 * tipo e o TypeScript 5.9+ reclama com ts(2882).
 * Sem `import`/`export` no topo: precisa ser script global, nao modulo.
 */
declare module '*.css';
