/* Creative Dentistry — Tweaks panel (drives the vanilla site via CSS vars + classes) */
const { useEffect } = React;

const ACCENTS = {
  "Bridge Gold":     { accent: "#F5B800", ink: "#7a5c00" },
  "Brownstone Sand": { accent: "#C9A87C", ink: "#7a5630" },
  "Hudson Blue":     { accent: "#4A7BA7", ink: "#2c587b" },
};

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "Bridge Gold",
  "heroMedia": "Editorial photo",
  "motion": true
}/*EDITMODE-END*/;

function App(){
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  useEffect(() => {
    const root = document.documentElement;
    const a = ACCENTS[t.accent] || ACCENTS["Bridge Gold"];
    root.style.setProperty('--accent', a.accent);
    root.style.setProperty('--accent-ink', a.ink);
  }, [t.accent]);

  useEffect(() => {
    const hero = document.querySelector('.hero');
    if (hero) hero.classList.toggle('skyline-mode', t.heroMedia === 'Skyline mark');
  }, [t.heroMedia]);

  useEffect(() => {
    document.body.classList.toggle('motion-off', !t.motion);
  }, [t.motion]);

  return (
    <TweaksPanel title="Tweaks">
      <TweakSection label="Brand accent" />
      <TweakColor label="Accent color"
        value={(ACCENTS[t.accent]||{}).accent}
        options={Object.values(ACCENTS).map(v => v.accent)}
        onChange={(v) => {
          const name = Object.keys(ACCENTS).find(k => ACCENTS[k].accent === v) || 'Bridge Gold';
          setTweak('accent', name);
        }} />
      <TweakSection label="Hero" />
      <TweakRadio label="Hero media" value={t.heroMedia}
        options={["Editorial photo", "Skyline mark"]}
        onChange={(v) => setTweak('heroMedia', v)} />
      <TweakSection label="Motion" />
      <TweakToggle label="Scroll animations" value={t.motion}
        onChange={(v) => setTweak('motion', v)} />
    </TweaksPanel>
  );
}

ReactDOM.createRoot(document.getElementById('tweaks-root')).render(<App />);
