import { useState, useEffect, useRef } from 'react';
import './AccessibilityWidget.css';

const STORAGE_KEY = 'chinatravel_a11y';

const DEFAULT_SETTINGS = {
  fontSize: 0,        // -2 to +4 steps
  highContrast: false,
  largePointer: false,
  lineSpacing: false,
  dyslexicFont: false,
  highlightLinks: false,
  pauseAnimations: false,
  readingGuide: false,
};

function loadSettings() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : { ...DEFAULT_SETTINGS };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

export default function AccessibilityWidget() {
  const [open, setOpen] = useState(false);
  const [settings, setSettings] = useState(loadSettings);
  const panelRef = useRef(null);
  const guideRef = useRef(null);

  // Persist and apply settings
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    applySettings(settings);
  }, [settings]);

  // Reading guide follows mouse
  useEffect(() => {
    if (!settings.readingGuide) {
      guideRef.current?.remove();
      guideRef.current = null;
      return;
    }
    if (!guideRef.current) {
      const el = document.createElement('div');
      el.className = 'a11y-reading-guide';
      el.setAttribute('aria-hidden', 'true');
      document.body.appendChild(el);
      guideRef.current = el;
    }
    const move = (e) => {
      if (guideRef.current) {
        guideRef.current.style.top = `${e.clientY - 20}px`;
      }
    };
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, [settings.readingGuide]);

  // Close panel on click outside
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open]);

  const update = (key, value) => setSettings((prev) => ({ ...prev, [key]: value }));

  const resetAll = () => {
    setSettings({ ...DEFAULT_SETTINGS });
    // Clean up reading guide
    guideRef.current?.remove();
    guideRef.current = null;
  };

  const hasChanges = JSON.stringify(settings) !== JSON.stringify(DEFAULT_SETTINGS);

  return (
    <div className="a11y-widget" ref={panelRef}>
      <button
        className="a11y-widget__toggle"
        onClick={() => setOpen(!open)}
        aria-label="Opciones de accesibilidad"
        aria-expanded={open}
        aria-controls="a11y-panel"
        title="Accesibilidad"
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="4.5" r="2.5" />
          <path d="M12 7v5" />
          <path d="M8 9l4 1 4-1" />
          <path d="M9 21l3-7 3 7" />
        </svg>
        {hasChanges && <span className="a11y-widget__indicator" aria-hidden="true" />}
      </button>

      {open && (
        <div className="a11y-panel" id="a11y-panel" role="region" aria-label="Panel de accesibilidad">
          <div className="a11y-panel__header">
            <h3>Accesibilidad</h3>
            {hasChanges && (
              <button className="a11y-panel__reset" onClick={resetAll} aria-label="Restaurar valores predeterminados">
                Restablecer
              </button>
            )}
          </div>

          {/* Font size */}
          <div className="a11y-panel__section">
            <label className="a11y-panel__label">Tamaño de texto</label>
            <div className="a11y-panel__font-controls">
              <button
                onClick={() => update('fontSize', Math.max(-2, settings.fontSize - 1))}
                disabled={settings.fontSize <= -2}
                aria-label="Reducir tamaño de texto"
                className="a11y-panel__font-btn"
              >
                A-
              </button>
              <span className="a11y-panel__font-value" aria-live="polite">
                {settings.fontSize === 0 ? 'Normal' : `${settings.fontSize > 0 ? '+' : ''}${settings.fontSize}`}
              </span>
              <button
                onClick={() => update('fontSize', Math.min(4, settings.fontSize + 1))}
                disabled={settings.fontSize >= 4}
                aria-label="Aumentar tamaño de texto"
                className="a11y-panel__font-btn"
              >
                A+
              </button>
            </div>
          </div>

          {/* Toggle options */}
          <div className="a11y-panel__section">
            <ToggleOption
              label="Alto contraste"
              description="Mejora la visibilidad de textos y fondos"
              checked={settings.highContrast}
              onChange={(v) => update('highContrast', v)}
              icon="◑"
            />
            <ToggleOption
              label="Cursor grande"
              description="Aumenta el tamaño del puntero del ratón"
              checked={settings.largePointer}
              onChange={(v) => update('largePointer', v)}
              icon="🖱"
            />
            <ToggleOption
              label="Interlineado amplio"
              description="Más espacio entre líneas de texto"
              checked={settings.lineSpacing}
              onChange={(v) => update('lineSpacing', v)}
              icon="☰"
            />
            <ToggleOption
              label="Fuente legible"
              description="Tipografía diseñada para facilitar la lectura"
              checked={settings.dyslexicFont}
              onChange={(v) => update('dyslexicFont', v)}
              icon="Aa"
            />
            <ToggleOption
              label="Resaltar enlaces"
              description="Los enlaces se subrayan y destacan en color"
              checked={settings.highlightLinks}
              onChange={(v) => update('highlightLinks', v)}
              icon="🔗"
            />
            <ToggleOption
              label="Pausar animaciones"
              description="Detiene movimientos y transiciones"
              checked={settings.pauseAnimations}
              onChange={(v) => update('pauseAnimations', v)}
              icon="⏸"
            />
            <ToggleOption
              label="Guía de lectura"
              description="Una barra horizontal sigue al cursor"
              checked={settings.readingGuide}
              onChange={(v) => update('readingGuide', v)}
              icon="—"
            />
          </div>
        </div>
      )}
    </div>
  );
}

function ToggleOption({ label, description, checked, onChange, icon }) {
  const id = `a11y-${label.replace(/\s+/g, '-').toLowerCase()}`;
  return (
    <div className="a11y-toggle" onClick={() => onChange(!checked)} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onChange(!checked); } }} tabIndex={0} role="switch" aria-checked={checked} aria-labelledby={`${id}-label`} aria-describedby={`${id}-desc`}>
      <span className="a11y-toggle__icon" aria-hidden="true">{icon}</span>
      <div className="a11y-toggle__text">
        <span id={`${id}-label`} className="a11y-toggle__label">{label}</span>
        <span id={`${id}-desc`} className="a11y-toggle__desc">{description}</span>
      </div>
      <div className={`a11y-toggle__switch ${checked ? 'a11y-toggle__switch--on' : ''}`} aria-hidden="true">
        <div className="a11y-toggle__knob" />
      </div>
    </div>
  );
}

function applySettings(s) {
  const root = document.documentElement;
  const body = document.body;

  // Font size: each step = 2px on base 16px
  const baseFontSize = 16 + s.fontSize * 2;
  root.style.fontSize = `${baseFontSize}px`;

  // High contrast
  body.classList.toggle('a11y-high-contrast', s.highContrast);

  // Large pointer
  body.classList.toggle('a11y-large-pointer', s.largePointer);

  // Line spacing
  body.classList.toggle('a11y-line-spacing', s.lineSpacing);

  // Dyslexic font
  body.classList.toggle('a11y-dyslexic-font', s.dyslexicFont);

  // Highlight links
  body.classList.toggle('a11y-highlight-links', s.highlightLinks);

  // Pause animations
  body.classList.toggle('a11y-pause-animations', s.pauseAnimations);
}
