const Avatar = (() => {
  let seq = 0;
  const skins = ["#f8d7b8", "#efc09a", "#d9a06c", "#c4844a", "#8d5a34", "#5c3a24"];
  const hairs = ["#2a211c", "#6a3e2a", "#d25a2b", "#e2b15c", "#3e4658", "#c43b68", "#f4f1ea", "#3c8f62", "#3a6fd8", "#7a4bb8"];
  const irises = ["#4a3428", "#2c6bed", "#1f8a4c", "#7a4a1e", "#6d4ca8", "#222"];
  const counts = {
    skin: skins.length,
    eyes: 6,
    eyeColor: irises.length,
    hair: 16,
    hairColor: hairs.length,
    hat: 11,
    brows: 5,
    facial: 4,
    ears: 4,
    patch: 3,
    glasses: 4,
    mouth: 5,
    frame: 8,
    extra: 6,
  };

  function pick(value, size) {
    const number = Number(value);
    return Number.isInteger(number) && number >= 0 && number < size ? number : 0;
  }

  function eye(x, y, style, color, shut) {
    if (shut) {
      return `<path d="M${x - 14} ${y} Q ${x} ${y + 12} ${x + 14} ${y}" fill="none" stroke="#2b2118" stroke-width="3.2" stroke-linecap="round"/>`;
    }
    if (style === 5) {
      return `<path d="M${x} ${y - 10} L${x + 5} ${y - 2} L${x + 13} ${y} L${x + 5} ${y + 2} L${x} ${y + 10} L${x - 5} ${y + 2} L${x - 13} ${y} L${x - 5} ${y - 2} Z" fill="${color}"/>`;
    }
    const rx = style === 2 ? 13 : 9;
    const ry = style === 4 ? 5 : rx;
    return `
      <ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="#fff"/>
      <circle cx="${x + 1}" cy="${y + 1}" r="${style === 2 ? 6 : 4.4}" fill="${color}"/>
      <circle cx="${x - 3}" cy="${y - 3}" r="2" fill="#fff"/>
    `;
  }

  function mouth(style) {
    if (style === 1) return `<path d="M78 142 Q100 162 122 142 Q100 152 78 142 Z" fill="#c44b55"/>`;
    if (style === 2) return `<ellipse cx="100" cy="146" rx="7" ry="9" fill="#c44b55"/>`;
    if (style === 3) return `<path d="M82 144 Q100 150 124 136" fill="none" stroke="#6d3b3b" stroke-width="3.4" stroke-linecap="round"/>`;
    if (style === 4) return `<path d="M84 146 H116" stroke="#6d3b3b" stroke-width="3.4" stroke-linecap="round"/>`;
    return `<path d="M80 140 Q100 156 120 140" fill="none" stroke="#6d3b3b" stroke-width="3.6" stroke-linecap="round"/>`;
  }

  function hairBack(style, color) {
    if (style === 3 || style === 11) {
      return `<path d="M48 118 C44 70 70 48 100 48 C130 48 156 70 152 118 L146 176 C132 160 120 168 100 168 C80 168 68 160 54 176 Z" fill="${color}"/>`;
    }
    if (style === 4) return `<circle cx="100" cy="104" r="78" fill="${color}"/>`;
    if (style === 6) return `<circle cx="138" cy="78" r="22" fill="${color}"/><circle cx="150" cy="66" r="12" fill="${color}"/>`;
    if (style === 8) return `<path d="M52 108 C54 64 146 64 148 108 C140 150 122 162 100 162 C78 162 60 150 52 108 Z" fill="${color}"/>`;
    if (style === 9) {
      return `<path d="M62 108 H78 V188 Q70 196 62 188 Z" fill="${color}"/><path d="M122 108 H138 V188 Q130 196 122 188 Z" fill="${color}"/><path d="M66 128 H74 M66 148 H74 M66 168 H74 M126 128 H134 M126 148 H134 M126 168 H134" stroke="#000" stroke-opacity=".18" stroke-width="2"/>`;
    }
    if (style === 10) return `<ellipse cx="150" cy="118" rx="22" ry="34" fill="${color}"/><circle cx="118" cy="78" r="16" fill="${color}"/>`;
    if (style === 13) return `<circle cx="42" cy="118" r="18" fill="${color}"/><circle cx="158" cy="118" r="18" fill="${color}"/>`;
    if (style === 15) return `<path d="M58 120 C52 70 78 52 100 60 C122 52 148 70 142 120 L136 186 C120 170 108 176 100 176 C92 176 80 170 64 186 Z" fill="${color}"/>`;
    return "";
  }

  function hairFront(style, color) {
    if (style === 1) return `<path d="M48 112 C50 62 150 62 152 112 C132 96 112 108 100 92 C84 110 64 98 48 112 Z" fill="${color}"/>`;
    if (style === 2) return `<path d="M46 108 C58 52 150 58 156 104 C128 78 108 96 86 74 C70 96 54 86 46 108 Z" fill="${color}"/>`;
    if (style === 5 || style === 8) return `<path d="M50 116 C54 64 146 64 150 116 C136 98 128 112 116 90 C108 112 96 100 86 116 C74 98 62 110 50 116 Z" fill="${color}"/>`;
    if (style === 7) return `<path d="M54 108 L70 48 L84 100 L100 36 L116 100 L132 46 L148 108 C132 90 114 100 100 86 C84 102 68 90 54 108 Z" fill="${color}"/>`;
    if (style === 11) return `<path d="M48 120 C60 58 140 58 152 120 C138 96 124 118 112 88 C100 116 86 96 70 120 C60 100 52 112 48 120 Z" fill="${color}"/>`;
    if (style === 12) return `<path d="M88 112 C90 40 110 40 112 112 C108 70 92 70 88 112 Z" fill="${color}"/><path d="M78 100 H122" stroke="${color}" stroke-width="8" stroke-linecap="round"/>`;
    if (style === 14) return `<path d="M56 108 C70 58 150 70 146 104 C130 88 110 98 96 78 C80 100 64 90 56 108 Z" fill="${color}"/>`;
    if (style === 15) return `<path d="M54 112 C70 58 96 78 100 96 C104 78 130 58 146 112 C130 92 112 104 100 88 C88 104 70 92 54 112 Z" fill="${color}"/>`;
    return "";
  }

  function brows(style) {
    if (style === 1) return `<path d="M60 96 Q76 88 92 98 M108 98 Q124 88 140 96" fill="none" stroke="#3a2a22" stroke-width="3" stroke-linecap="round"/>`;
    if (style === 2) return `<path d="M58 98 Q76 86 94 100 M106 100 Q124 86 142 98" fill="none" stroke="#3a2a22" stroke-width="5" stroke-linecap="round"/>`;
    if (style === 3) return `<path d="M58 92 L94 104 M142 92 L106 104" fill="none" stroke="#3a2a22" stroke-width="3.4" stroke-linecap="round"/>`;
    if (style === 4) return `<path d="M60 90 Q76 78 92 92 M108 92 Q124 78 140 90" fill="none" stroke="#3a2a22" stroke-width="3" stroke-linecap="round"/>`;
    return "";
  }

  function facial(style, color) {
    if (style === 1) return `<path d="M78 150 Q100 160 122 150 Q100 156 78 150 Z" fill="#3a2a22"/>`;
    if (style === 2) return `<path d="M62 132 Q70 168 100 176 Q130 168 138 132 Q120 150 100 154 Q80 150 62 132 Z" fill="${color}" opacity=".9"/>`;
    if (style === 3) return `<path d="M90 150 Q100 176 110 150 Q100 166 90 150 Z" fill="#3a2a22"/>`;
    return "";
  }

  function earrings(style) {
    if (style === 1) return `<circle cx="40" cy="126" r="7" fill="none" stroke="#e2b22a" stroke-width="3"/><circle cx="160" cy="126" r="7" fill="none" stroke="#e2b22a" stroke-width="3"/>`;
    if (style === 2) return `<circle cx="40" cy="124" r="4" fill="#f0c84b"/><circle cx="160" cy="124" r="4" fill="#f0c84b"/>`;
    if (style === 3) return `<path d="M30 118 L42 132 L54 118 Z" fill="#e23b6a"/><path d="M146 118 L158 132 L170 118 Z" fill="#e23b6a"/>`;
    return "";
  }

  function hat(style) {
    if (style === 1) {
      return `<ellipse cx="108" cy="78" rx="58" ry="14" fill="#2747c7"/><path d="M62 78 Q104 28 150 74 L156 84 Q108 62 70 90 Z" fill="#1d36a8"/>`;
    }
    if (style === 2) {
      return `<path d="M58 86 L74 40 L90 82 L100 28 L112 82 L128 38 L144 86 Z" fill="#f0c84b"/><rect x="56" y="82" width="90" height="12" rx="4" fill="#e2b22a"/>`;
    }
    if (style === 3) {
      return `<path d="M52 96 C58 48 142 48 148 96 Z" fill="#d64545"/><rect x="50" y="90" width="100" height="16" rx="8" fill="#f0d2b0"/>`;
    }
    if (style === 4) {
      return `<path d="M100 18 L132 92 H68 Z" fill="#3c2a6e"/><ellipse cx="100" cy="92" rx="48" ry="10" fill="#2a1d4e"/><rect x="92" y="8" width="16" height="14" fill="#f0c84b"/>`;
    }
    if (style === 5) {
      return `<path d="M46 100 C70 58 150 70 160 96 L150 108 C120 86 78 96 52 112 Z" fill="#b4233a"/><circle cx="78" cy="90" r="5" fill="#f0c84b"/>`;
    }
    if (style === 6) {
      return `<rect x="70" y="58" width="60" height="36" fill="#222"/><rect x="62" y="90" width="76" height="10" fill="#222"/><rect x="96" y="34" width="8" height="28" fill="#222"/><circle cx="100" cy="30" r="8" fill="#ef4b4b"/>`;
    }
    if (style === 7) {
      return `<path d="M48 96 L70 48 L86 92 Z" fill="#f2b6cf"/><path d="M152 96 L130 48 L114 92 Z" fill="#f2b6cf"/><ellipse cx="70" cy="94" rx="16" ry="8" fill="#e889a8"/><ellipse cx="130" cy="94" rx="16" ry="8" fill="#e889a8"/>`;
    }
    if (style === 8) {
      return `<path d="M70 78 Q100 48 130 78 Q100 66 70 78 Z" fill="#e23b6a"/><circle cx="100" cy="74" r="8" fill="#ffd1e1"/>`;
    }
    if (style === 9) {
      return `<circle cx="128" cy="70" r="14" fill="#ff5a7a"/><circle cx="118" cy="60" r="8" fill="#ff8aa0"/><circle cx="140" cy="62" r="8" fill="#ff8aa0"/><circle cx="128" cy="70" r="4" fill="#ffe08a"/>`;
    }
    if (style === 10) {
      return `<ellipse cx="100" cy="86" rx="46" ry="12" fill="#2a9d8f"/><path d="M58 86 Q100 48 142 86" fill="#21867a"/>`;
    }
    return "";
  }

  function patch(style) {
    if (style === 1) {
      return `<path d="M58 108 Q78 96 96 112 Q78 128 58 120 Z" fill="#2b241c"/><path d="M96 112 H146" stroke="#2b241c" stroke-width="3"/>`;
    }
    if (style === 2) {
      return `<path d="M142 108 Q122 96 104 112 Q122 128 142 120 Z" fill="#2b241c"/><path d="M54 112 H104" stroke="#2b241c" stroke-width="3"/>`;
    }
    return "";
  }

  function glasses(style) {
    if (style === 1) {
      return `<circle cx="76" cy="116" r="16" fill="none" stroke="#243044" stroke-width="3.4"/><circle cx="124" cy="116" r="16" fill="none" stroke="#243044" stroke-width="3.4"/><path d="M92 116 H108" stroke="#243044" stroke-width="3"/>`;
    }
    if (style === 2) {
      return `<rect x="58" y="102" width="32" height="26" rx="4" fill="none" stroke="#243044" stroke-width="3.4"/><rect x="110" y="102" width="32" height="26" rx="4" fill="none" stroke="#243044" stroke-width="3.4"/><path d="M90 114 H110" stroke="#243044" stroke-width="3"/>`;
    }
    if (style === 3) {
      return `<rect x="56" y="104" width="36" height="24" rx="8" fill="#243044"/><rect x="108" y="104" width="36" height="24" rx="8" fill="#243044"/><path d="M92 116 H108" stroke="#243044" stroke-width="3"/>`;
    }
    return "";
  }

  function extra(style) {
    if (style === 1) {
      return `<ellipse cx="66" cy="136" rx="10" ry="6" fill="#e88990" opacity=".7"/><ellipse cx="134" cy="136" rx="10" ry="6" fill="#e88990" opacity=".7"/>`;
    }
    if (style === 2) {
      return `<g fill="#b6794f">${[0, 1, 2, 3, 4, 5].map((dot) => `<circle cx="${70 + (dot % 3) * 8}" cy="${128 + Math.floor(dot / 3) * 7}" r="1.5"/><circle cx="${122 + (dot % 3) * 8}" cy="${128 + Math.floor(dot / 3) * 7}" r="1.5"/>`).join("")}</g>`;
    }
    if (style === 3) {
      return `<path d="M118 128 L132 148" stroke="#b96a62" stroke-width="2.4" stroke-linecap="round"/>`;
    }
    if (style === 4) {
      return `<rect x="112" y="96" width="22" height="10" rx="3" fill="#f4d2b0" transform="rotate(28 123 101)"/><rect x="118" y="98" width="10" height="6" fill="#e7b89a" transform="rotate(28 123 101)"/>`;
    }
    if (style === 5) {
      return `<path d="M58 128 L70 140 L62 146 Z" fill="#ff8fab"/><path d="M142 128 L130 140 L138 146 Z" fill="#ff8fab"/>`;
    }
    return "";
  }

  function frame(style, id) {
    if (style === 1) {
      return `<circle cx="100" cy="118" r="84" fill="none" stroke="#f0c84b" stroke-width="6"/><circle cx="100" cy="118" r="74" fill="none" stroke="#fff4c8" stroke-width="2"/>`;
    }
    if (style === 2) {
      return `<circle cx="100" cy="118" r="84" fill="none" stroke="#3ee0ff" stroke-width="5" filter="url(#${id}glow)"/>`;
    }
    if (style === 3) {
      return `<circle cx="100" cy="118" r="84" fill="none" stroke="#8d6bff" stroke-width="6" stroke-dasharray="8 10"/>`;
    }
    if (style === 4) {
      return `<g fill="#ffd45a">${[[100, 28], [168, 70], [176, 140], [100, 198], [24, 140], [32, 70]].map(([x, y]) => `<path d="M${x} ${y - 8} L${x + 3} ${y - 2} L${x + 9} ${y} L${x + 3} ${y + 2} L${x} ${y + 8} L${x - 3} ${y + 2} L${x - 9} ${y} L${x - 3} ${y - 2} Z"/>`).join("")}</g>`;
    }
    if (style === 5) {
      return `<circle cx="100" cy="118" r="84" fill="none" stroke="url(#${id}fire)" stroke-width="7"/>`;
    }
    if (style === 6) {
      return `<circle cx="100" cy="118" r="84" fill="none" stroke="url(#${id}rainbow)" stroke-width="7"/>`;
    }
    if (style === 7) {
      return `<g fill="#ff6b93">${[[36, 70], [164, 70], [28, 150], [172, 150]].map(([x, y]) => `<path d="M${x} ${y + 4} C${x - 8} ${y - 8} ${x + 8} ${y - 8} ${x} ${y + 4} C${x - 8} ${y - 8} ${x + 8} ${y - 8} ${x} ${y + 4}"/>`).join("")}</g>`;
    }
    return "";
  }

  function render(config) {
    const style = {
      skin: pick(config && config.skin, counts.skin),
      eyes: pick(config && config.eyes, counts.eyes),
      eyeColor: pick(config && config.eyeColor, counts.eyeColor),
      hair: pick(config && config.hair, counts.hair),
      hairColor: pick(config && config.hairColor, counts.hairColor),
      hat: pick(config && config.hat, counts.hat),
      brows: pick(config && config.brows, counts.brows),
      facial: pick(config && config.facial, counts.facial),
      ears: pick(config && config.ears, counts.ears),
      patch: pick(config && config.patch, counts.patch),
      glasses: pick(config && config.glasses, counts.glasses),
      mouth: pick(config && config.mouth, counts.mouth),
      frame: pick(config && config.frame, counts.frame),
      extra: pick(config && config.extra, counts.extra),
    };
    const id = `av${++seq}`;
    const color = irises[style.eyeColor];
    const leftShut = style.eyes === 1 || style.eyes === 3;
    const rightShut = style.eyes === 1;
    return `<svg class="avatar-svg" viewBox="0 0 200 220" aria-hidden="true">
      <defs>
        <clipPath id="${id}face"><circle cx="100" cy="118" r="58"/></clipPath>
        <filter id="${id}glow"><feDropShadow dx="0" dy="0" stdDeviation="2.5" flood-color="#3ee0ff"/></filter>
        <linearGradient id="${id}fire" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#ff5a36"/><stop offset="1" stop-color="#ffd15a"/>
        </linearGradient>
        <linearGradient id="${id}rainbow" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#ff5a7a"/><stop offset=".5" stop-color="#ffd45a"/><stop offset="1" stop-color="#3ee0ff"/>
        </linearGradient>
      </defs>
      <circle cx="100" cy="118" r="90" fill="#efe7ff"/>
      ${frame(style.frame, id)}
      ${hairBack(style.hair, hairs[style.hairColor])}
      <g clip-path="url(#${id}face)">
        <circle cx="100" cy="118" r="58" fill="${skins[style.skin]}"/>
        ${extra(style.extra)}
        ${mouth(style.mouth)}
        ${facial(style.facial, hairs[style.hairColor])}
        ${brows(style.brows)}
        ${eye(76, 114, style.eyes, color, leftShut)}
        ${eye(124, 114, style.eyes, color, rightShut)}
        ${hairFront(style.hair, hairs[style.hairColor])}
      </g>
      ${earrings(style.ears)}
      ${patch(style.patch)}
      ${glasses(style.glasses)}
      ${hat(style.hat)}
    </svg>`;
  }

  function randomConfig() {
    const config = {};
    Object.entries(counts).forEach(([key, size]) => {
      config[key] = Math.floor(Math.random() * size);
    });
    return config;
  }

  return { render, randomConfig, counts };
})();
