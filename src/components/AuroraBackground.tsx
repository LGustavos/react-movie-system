/**
 * Fundo ambiente: manchas desfocadas derivando atras do conteudo.
 * So anima `transform`, entao nao dispara reflow - o blur e rasterizado uma
 * unica vez e quem se move e a camada pronta, composta pela GPU.
 */
export function AuroraBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="animate-aurora absolute -left-[10%] -top-[15%] h-[45rem] w-[45rem] rounded-full bg-brand-500/20 blur-[120px] will-change-transform" />
      <div className="animate-aurora-slow absolute -right-[15%] top-[8%] h-[40rem] w-[40rem] rounded-full bg-lilac-400/15 blur-[120px] will-change-transform" />
      <div
        className="animate-aurora absolute -bottom-[20%] left-[28%] h-[35rem] w-[35rem] rounded-full bg-accent-500/10 blur-[120px] will-change-transform"
        /* Defasagem negativa: entra ja no meio do ciclo, sem sincronizar com a primeira. */
        style={{ animationDelay: '-12s' }}
      />
    </div>
  );
}
