export default {
  // Configurazione basilare per evitare errori
  input: 'src/main.tsx', // punto di ingresso dell'app
  output: {
    dir: 'dist',
    format: 'es',
    sourcemap: true
  },
  // Indica a rollup di saltare il caricamento dei plugin nativi
  skipLoadNativePlugin: true,
  // Disabilita i plugin built-in per evitare errori
  experimentalCacheExpiry: 0
}; 