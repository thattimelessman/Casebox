import { useState, useEffect } from "react";

/* ═══════════════════════════════════════════════════════
   SKETCH ILLUSTRATIONS  — pencil / etching style
═══════════════════════════════════════════════════════ */

const SketchScales = ({ size = 120 }) => (
  <svg width={size} height={size} viewBox="0 0 120 120" fill="none">
    <line x1="60" y1="18" x2="60" y2="95" stroke="#4a7c6f" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="2,1.2" />
    <path d="M40 95 Q60 99 80 95" stroke="#4a7c6f" strokeWidth="1.8" strokeLinecap="round" fill="none" />
    <line x1="36" y1="100" x2="84" y2="100" stroke="#4a7c6f" strokeWidth="1.6" strokeLinecap="round" />
    <line x1="22" y1="30" x2="98" y2="30" stroke="#4a7c6f" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="28" y1="30" x2="18" y2="56" stroke="#4a7c6f" strokeWidth="1" strokeLinecap="round" strokeDasharray="1.5,1" />
    <line x1="92" y1="30" x2="102" y2="56" stroke="#4a7c6f" strokeWidth="1" strokeLinecap="round" strokeDasharray="1.5,1" />
    <path d="M10 56 Q18 62 26 56" stroke="#4a7c6f" strokeWidth="1.6" fill="rgba(74,124,111,0.07)" strokeLinecap="round" />
    <path d="M94 56 Q102 62 110 56" stroke="#4a7c6f" strokeWidth="1.6" fill="rgba(74,124,111,0.07)" strokeLinecap="round" />
    <polygon points="52,6 60,18 68,6" stroke="#b8922a" strokeWidth="1.1" fill="rgba(184,146,42,0.12)" strokeLinejoin="round" />
    <line x1="12" y1="58" x2="24" y2="58" stroke="#4a7c6f" strokeWidth="0.7" strokeOpacity="0.4" />
    <line x1="96" y1="58" x2="108" y2="58" stroke="#4a7c6f" strokeWidth="0.7" strokeOpacity="0.4" />
  </svg>
);

const SketchFlower = ({ size = 100 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
    {/* stem */}
    <path d="M50 78 Q48 88 46 96" stroke="#4a7c6f" strokeWidth="1.4" strokeLinecap="round" />
    <path d="M50 78 Q54 86 52 96" stroke="#4a7c6f" strokeWidth="0.8" strokeLinecap="round" strokeOpacity="0.5" />
    {/* leaf */}
    <path d="M48 85 Q40 80 36 72 Q44 74 48 85Z" stroke="#4a7c6f" strokeWidth="1.1" fill="rgba(74,124,111,0.1)" strokeLinejoin="round" />
    {/* petals */}
    {[0,45,90,135,180,225,270,315].map((angle, i) => {
      const rad = (angle * Math.PI) / 180;
      const cx = 50 + Math.cos(rad) * 18;
      const cy = 40 + Math.sin(rad) * 18;
      return (
        <ellipse key={i} cx={cx} cy={cy} rx="9" ry="14"
          transform={`rotate(${angle} ${cx} ${cy})`}
          stroke={i % 2 === 0 ? "#b8922a" : "#9b4444"}
          strokeWidth="1" fill={i % 2 === 0 ? "rgba(184,146,42,0.1)" : "rgba(155,68,68,0.08)"} />
      );
    })}
    {/* center */}
    <circle cx="50" cy="40" r="8" stroke="#b8922a" strokeWidth="1.3" fill="rgba(184,146,42,0.15)" />
    <circle cx="50" cy="40" r="3.5" stroke="#b8922a" strokeWidth="0.8" fill="rgba(184,146,42,0.25)" />
    {/* pollen dots */}
    {[0,60,120,180,240,300].map((a,i) => {
      const r2 = (a * Math.PI) / 180;
      return <circle key={i} cx={50 + Math.cos(r2)*5.5} cy={40 + Math.sin(r2)*5.5} r="0.8" fill="#b8922a" opacity="0.7" />;
    })}
  </svg>
);

const SketchPen = ({ size = 90 }) => (
  <svg width={size} height={size} viewBox="0 0 90 90" fill="none">
    <path d="M15 72 L18 65 L65 18 L72 25 L25 72 Z"
      stroke="#243460" strokeWidth="1.3" fill="rgba(36,52,96,0.06)" strokeLinejoin="round" />
    <path d="M65 18 L72 25 L78 16 L68 10 Z"
      stroke="#4a7c6f" strokeWidth="1.2" fill="rgba(74,124,111,0.12)" strokeLinejoin="round" />
    <path d="M18 65 L15 72 L10 75 L13 70 Z"
      stroke="#b8922a" strokeWidth="1.1" fill="rgba(184,146,42,0.15)" strokeLinejoin="round" />
    <line x1="12" y1="73" x2="8" y2="80" stroke="#b8922a" strokeWidth="0.9" strokeLinecap="round" />
    <line x1="25" y1="65" x2="62" y2="28" stroke="#ffffff" strokeWidth="1.2" strokeOpacity="0.2" strokeLinecap="round" />
    <line x1="22" y1="68" x2="59" y2="31" stroke="#4a7c6f" strokeWidth="0.6" strokeOpacity="0.3" strokeLinecap="round" />
    {/* ink swirl */}
    <path d="M6 82 Q14 78 18 82 Q22 86 28 80" stroke="#b8922a" strokeWidth="0.9" strokeLinecap="round" fill="none" strokeDasharray="2,1.5" />
  </svg>
);

const SketchNotepad = ({ size = 95 }) => (
  <svg width={size} height={size} viewBox="0 0 95 95" fill="none">
    {/* shadow */}
    <rect x="14" y="14" width="64" height="72" rx="3" fill="rgba(36,52,96,0.05)" />
    {/* body */}
    <rect x="12" y="12" width="64" height="72" rx="3" stroke="#243460" strokeWidth="1.4" fill="rgba(248,244,237,0.8)" />
    {/* spiral binding */}
    {[18,26,34,42,50,58,66,74].map((y,i) => (
      <path key={i} d={`M10 ${y} Q14 ${y-3} 18 ${y} Q22 ${y+3} 26 ${y}`}
        stroke="#4a7c6f" strokeWidth="1.1" fill="none" strokeLinecap="round" />
    ))}
    {/* lines */}
    {[30,38,46,54,62,70].map((y,i) => (
      <line key={i} x1="28" y1={y} x2={i===4?60:68} y2={y}
        stroke="#4a7c6f" strokeWidth="0.9" strokeOpacity="0.4" strokeLinecap="round" />
    ))}
    {/* checkmark */}
    <path d="M30 46 L35 51 L44 41" stroke="#4a7c6f" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    {/* title bar */}
    <rect x="28" y="18" width="40" height="6" rx="1" fill="rgba(74,124,111,0.12)" stroke="#4a7c6f" strokeWidth="0.7" />
    {/* red bookmark */}
    <path d="M68 12 L68 28 L63 24 L58 28 L58 12" stroke="#9b4444" strokeWidth="1" fill="rgba(155,68,68,0.12)" strokeLinejoin="round" />
  </svg>
);

const SketchTree = ({ size = 130 }) => (
  <svg width={size} height={size * 1.1} viewBox="0 0 130 145" fill="none">
    {/* trunk */}
    <path d="M60 110 Q58 122 56 138" stroke="#b8922a" strokeWidth="3" strokeLinecap="round" />
    <path d="M65 110 Q67 122 69 138" stroke="#b8922a" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.5" />
    {/* ground */}
    <path d="M44 138 Q62 142 80 138" stroke="#4a7c6f" strokeWidth="1.3" strokeLinecap="round" fill="none" />
    {/* roots */}
    <path d="M56 136 Q50 138 44 135" stroke="#b8922a" strokeWidth="1.1" strokeLinecap="round" strokeOpacity="0.5" />
    <path d="M69 136 Q75 139 80 136" stroke="#b8922a" strokeWidth="1.1" strokeLinecap="round" strokeOpacity="0.5" />
    {/* canopy layers — bottom */}
    <path d="M20 105 Q30 88 45 92 Q40 75 62 72 Q80 75 78 92 Q94 88 102 105 Q85 100 62 104 Q40 100 20 105Z"
      stroke="#4a7c6f" strokeWidth="1.4" fill="rgba(74,124,111,0.12)" strokeLinejoin="round" />
    {/* canopy mid */}
    <path d="M30 90 Q38 72 52 76 Q46 58 62 54 Q78 58 74 76 Q88 72 96 90 Q80 86 62 88 Q44 86 30 90Z"
      stroke="#4a7c6f" strokeWidth="1.2" fill="rgba(74,124,111,0.1)" strokeLinejoin="round" />
    {/* canopy top */}
    <path d="M38 72 Q44 54 56 56 Q52 40 62 36 Q72 40 70 56 Q82 54 88 72 Q76 68 62 70 Q48 68 38 72Z"
      stroke="#4a7c6f" strokeWidth="1.1" fill="rgba(74,124,111,0.09)" strokeLinejoin="round" />
    {/* crown */}
    <path d="M48 52 Q54 36 62 32 Q70 36 74 52 Q68 48 62 50 Q56 48 48 52Z"
      stroke="#4a7c6f" strokeWidth="1" fill="rgba(74,124,111,0.14)" strokeLinejoin="round" />
    {/* fruit/berries */}
    <circle cx="42" cy="88" r="3.5" stroke="#9b4444" strokeWidth="1" fill="rgba(155,68,68,0.15)" />
    <circle cx="80" cy="82" r="3" stroke="#9b4444" strokeWidth="1" fill="rgba(155,68,68,0.15)" />
    <circle cx="58" cy="68" r="2.5" stroke="#b8922a" strokeWidth="0.9" fill="rgba(184,146,42,0.2)" />
    {/* sketch hatching on canopy */}
    <line x1="35" y1="95" x2="50" y2="90" stroke="#4a7c6f" strokeWidth="0.5" strokeOpacity="0.25" />
    <line x1="70" y1="90" x2="88" y2="96" stroke="#4a7c6f" strokeWidth="0.5" strokeOpacity="0.25" />
  </svg>
);

const SketchClassicCar = ({ size = 180 }) => (
  <svg width={size} height={size * 0.55} viewBox="0 0 180 99" fill="none">
    {/* shadow */}
    <ellipse cx="90" cy="93" rx="70" ry="5" fill="rgba(36,52,96,0.06)" />
    {/* body lower */}
    <path d="M14 72 Q14 58 28 58 L152 58 Q166 58 166 72 L166 82 Q166 88 160 88 L20 88 Q14 88 14 82 Z"
      stroke="#243460" strokeWidth="1.4" fill="rgba(248,244,237,0.7)" strokeLinejoin="round" />
    {/* body upper / cabin */}
    <path d="M44 58 Q50 36 72 32 L116 32 Q138 32 144 58 Z"
      stroke="#243460" strokeWidth="1.3" fill="rgba(217,237,232,0.5)" strokeLinejoin="round" />
    {/* windscreen */}
    <path d="M72 56 Q74 40 84 36 L96 36 Q106 40 108 56 Z"
      stroke="#4a7c6f" strokeWidth="1" fill="rgba(74,124,111,0.1)" strokeLinejoin="round" />
    {/* rear window */}
    <path d="M112 56 Q116 42 128 38 L140 38 Q148 44 144 56 Z"
      stroke="#4a7c6f" strokeWidth="1" fill="rgba(74,124,111,0.1)" strokeLinejoin="round" />
    {/* front window */}
    <path d="M44 56 Q46 44 54 40 L68 38 Q76 40 72 56 Z"
      stroke="#4a7c6f" strokeWidth="1" fill="rgba(74,124,111,0.1)" strokeLinejoin="round" />
    {/* front bumper / hood */}
    <path d="M14 68 Q10 65 8 62 Q12 58 24 58" stroke="#243460" strokeWidth="1.2" fill="none" strokeLinecap="round" />
    {/* rear bumper */}
    <path d="M166 68 Q170 65 172 62 Q168 58 156 58" stroke="#243460" strokeWidth="1.2" fill="none" strokeLinecap="round" />
    {/* headlight */}
    <ellipse cx="18" cy="68" rx="5" ry="4" stroke="#b8922a" strokeWidth="1.1" fill="rgba(184,146,42,0.15)" />
    {/* tail light */}
    <ellipse cx="162" cy="68" rx="4" ry="3.5" stroke="#9b4444" strokeWidth="1.1" fill="rgba(155,68,68,0.15)" />
    {/* wheels */}
    <circle cx="42" cy="86" r="14" stroke="#243460" strokeWidth="1.4" fill="rgba(248,244,237,0.4)" />
    <circle cx="42" cy="86" r="8" stroke="#243460" strokeWidth="1" fill="rgba(36,52,96,0.06)" />
    <circle cx="42" cy="86" r="3" stroke="#4a7c6f" strokeWidth="0.8" fill="rgba(74,124,111,0.15)" />
    <circle cx="138" cy="86" r="14" stroke="#243460" strokeWidth="1.4" fill="rgba(248,244,237,0.4)" />
    <circle cx="138" cy="86" r="8" stroke="#243460" strokeWidth="1" fill="rgba(36,52,96,0.06)" />
    <circle cx="138" cy="86" r="3" stroke="#4a7c6f" strokeWidth="0.8" fill="rgba(74,124,111,0.15)" />
    {/* spoke lines */}
    {[0,60,120,180,240,300].map((a,i) => {
      const r = (a*Math.PI)/180;
      return <line key={i} x1={42+Math.cos(r)*3} y1={86+Math.sin(r)*3} x2={42+Math.cos(r)*8} y2={86+Math.sin(r)*8}
        stroke="#243460" strokeWidth="0.7" strokeOpacity="0.5" />;
    })}
    {[0,60,120,180,240,300].map((a,i) => {
      const r = (a*Math.PI)/180;
      return <line key={i} x1={138+Math.cos(r)*3} y1={86+Math.sin(r)*3} x2={138+Math.cos(r)*8} y2={86+Math.sin(r)*8}
        stroke="#243460" strokeWidth="0.7" strokeOpacity="0.5" />;
    })}
    {/* door line */}
    <path d="M82 58 Q82 72 90 78 Q98 72 98 58" stroke="#243460" strokeWidth="0.8" fill="none" strokeOpacity="0.4" />
    {/* door handle */}
    <line x1="86" y1="70" x2="94" y2="70" stroke="#b8922a" strokeWidth="1.2" strokeLinecap="round" />
    {/* chrome strip */}
    <line x1="28" y1="73" x2="152" y2="73" stroke="#b8922a" strokeWidth="0.8" strokeOpacity="0.4" strokeLinecap="round" />
  </svg>
);

const SketchManSuit = ({ size = 110 }) => (
  <svg width={size} height={size * 1.3} viewBox="0 0 110 143" fill="none">
    {/* head */}
    <ellipse cx="55" cy="20" rx="13" ry="15" stroke="#243460" strokeWidth="1.3" fill="rgba(248,244,237,0.8)" />
    {/* hair */}
    <path d="M42 16 Q44 8 55 7 Q66 8 68 16" stroke="#243460" strokeWidth="1.2" fill="rgba(36,52,96,0.1)" strokeLinejoin="round" />
    {/* neck */}
    <line x1="55" y1="35" x2="55" y2="42" stroke="#243460" strokeWidth="1.8" strokeLinecap="round" />
    {/* jacket body */}
    <path d="M30 42 Q22 48 20 80 L90 80 Q88 48 80 42 L55 38 Z"
      stroke="#243460" strokeWidth="1.3" fill="rgba(36,52,96,0.08)" strokeLinejoin="round" />
    {/* lapels */}
    <path d="M55 38 L46 48 L50 56 L55 52 L60 56 L64 48 Z"
      stroke="#243460" strokeWidth="1.1" fill="rgba(248,244,237,0.6)" strokeLinejoin="round" />
    {/* shirt/tie */}
    <path d="M55 52 L52 68 L55 76 L58 68 Z"
      stroke="#b8922a" strokeWidth="1" fill="rgba(184,146,42,0.15)" strokeLinejoin="round" />
    {/* pocket square */}
    <path d="M34 50 L34 46 L40 46 L38 50 Z" stroke="#4a7c6f" strokeWidth="0.9" fill="rgba(74,124,111,0.2)" />
    {/* arms */}
    <path d="M30 42 Q18 56 20 78" stroke="#243460" strokeWidth="6" strokeLinecap="round" fill="none" />
    <path d="M80 42 Q92 56 90 78" stroke="#243460" strokeWidth="6" strokeLinecap="round" fill="none" />
    {/* hands */}
    <ellipse cx="20" cy="80" rx="5" ry="4" stroke="#243460" strokeWidth="1" fill="rgba(248,244,237,0.8)" />
    <ellipse cx="90" cy="80" rx="5" ry="4" stroke="#243460" strokeWidth="1" fill="rgba(248,244,237,0.8)" />
    {/* briefcase in right hand */}
    <rect x="84" y="78" width="18" height="13" rx="2" stroke="#b8922a" strokeWidth="1.2" fill="rgba(184,146,42,0.12)" />
    <path d="M88 78 Q88 74 90 74 L96 74 Q98 74 98 78" stroke="#b8922a" strokeWidth="1" fill="none" />
    <line x1="84" y1="84" x2="102" y2="84" stroke="#b8922a" strokeWidth="0.7" strokeOpacity="0.4" />
    {/* trousers */}
    <path d="M36 80 L32 120 L50 120 L55 100 L60 120 L78 120 L74 80 Z"
      stroke="#243460" strokeWidth="1.2" fill="rgba(36,52,96,0.07)" strokeLinejoin="round" />
    {/* shoes */}
    <path d="M32 120 Q28 130 25 132 L50 132 L50 120 Z" stroke="#243460" strokeWidth="1.1" fill="rgba(36,52,96,0.12)" strokeLinejoin="round" />
    <path d="M78 120 Q82 130 85 132 L60 132 L60 120 Z" stroke="#243460" strokeWidth="1.1" fill="rgba(36,52,96,0.12)" strokeLinejoin="round" />
    {/* sketch detail lines */}
    <line x1="38" y1="60" x2="44" y2="60" stroke="#243460" strokeWidth="0.6" strokeOpacity="0.25" />
    <line x1="66" y1="60" x2="72" y2="60" stroke="#243460" strokeWidth="0.6" strokeOpacity="0.25" />
  </svg>
);

const SketchWomanSuit = ({ size = 100 }) => (
  <svg width={size} height={size * 1.35} viewBox="0 0 100 135" fill="none">
    {/* head */}
    <ellipse cx="50" cy="18" rx="12" ry="14" stroke="#243460" strokeWidth="1.3" fill="rgba(248,244,237,0.8)" />
    {/* hair long */}
    <path d="M38 14 Q36 30 38 42 Q44 48 50 50 Q56 48 62 42 Q64 30 62 14 Q56 8 50 8 Q44 8 38 14Z"
      stroke="#243460" strokeWidth="1" fill="rgba(36,52,96,0.08)" strokeLinejoin="round" />
    {/* face detail */}
    <path d="M44 20 Q50 24 56 20" stroke="#243460" strokeWidth="0.7" fill="none" strokeOpacity="0.4" />
    {/* neck */}
    <line x1="50" y1="32" x2="50" y2="38" stroke="#243460" strokeWidth="1.6" strokeLinecap="round" />
    {/* blazer */}
    <path d="M28 38 Q22 44 20 72 L80 72 Q78 44 72 38 L50 34 Z"
      stroke="#4a7c6f" strokeWidth="1.3" fill="rgba(74,124,111,0.09)" strokeLinejoin="round" />
    {/* blouse */}
    <path d="M50 34 L44 46 L48 54 L50 50 L52 54 L56 46 Z"
      stroke="#9b4444" strokeWidth="1" fill="rgba(155,68,68,0.1)" strokeLinejoin="round" />
    {/* necklace */}
    <path d="M44 36 Q50 40 56 36" stroke="#b8922a" strokeWidth="0.9" fill="none" strokeLinecap="round" />
    <circle cx="50" cy="40" r="1.5" fill="#b8922a" opacity="0.7" />
    {/* arms */}
    <path d="M28 38 Q18 52 22 72" stroke="#4a7c6f" strokeWidth="5.5" strokeLinecap="round" fill="none" />
    <path d="M72 38 Q82 52 78 72" stroke="#4a7c6f" strokeWidth="5.5" strokeLinecap="round" fill="none" />
    {/* hands */}
    <ellipse cx="22" cy="73" rx="4.5" ry="4" stroke="#243460" strokeWidth="1" fill="rgba(248,244,237,0.8)" />
    <ellipse cx="78" cy="73" rx="4.5" ry="4" stroke="#243460" strokeWidth="1" fill="rgba(248,244,237,0.8)" />
    {/* folder in left hand */}
    <rect x="6" y="66" width="18" height="24" rx="2" stroke="#b8922a" strokeWidth="1.1" fill="rgba(184,146,42,0.1)" />
    <line x1="8" y1="74" x2="22" y2="74" stroke="#b8922a" strokeWidth="0.7" strokeOpacity="0.4" />
    <line x1="8" y1="79" x2="22" y2="79" stroke="#b8922a" strokeWidth="0.7" strokeOpacity="0.4" />
    {/* skirt */}
    <path d="M30 72 Q26 100 28 115 L72 115 Q74 100 70 72 Z"
      stroke="#4a7c6f" strokeWidth="1.2" fill="rgba(74,124,111,0.07)" strokeLinejoin="round" />
    {/* skirt pleat lines */}
    <line x1="42" y1="72" x2="40" y2="115" stroke="#4a7c6f" strokeWidth="0.6" strokeOpacity="0.3" />
    <line x1="58" y1="72" x2="60" y2="115" stroke="#4a7c6f" strokeWidth="0.6" strokeOpacity="0.3" />
    {/* shoes */}
    <path d="M28 115 Q24 122 22 124 L42 124 L42 115 Z" stroke="#243460" strokeWidth="1" fill="rgba(36,52,96,0.1)" strokeLinejoin="round" />
    <path d="M72 115 Q76 122 78 124 L58 124 L58 115 Z" stroke="#243460" strokeWidth="1" fill="rgba(36,52,96,0.1)" strokeLinejoin="round" />
    {/* heel detail */}
    <line x1="22" y1="120" x2="22" y2="124" stroke="#243460" strokeWidth="1.2" strokeLinecap="round" />
    <line x1="78" y1="120" x2="78" y2="124" stroke="#243460" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
);

const SketchCourt = ({ size = 140 }) => (
  <svg width={size} height={size * 0.75} viewBox="0 0 140 105" fill="none">
    <line x1="5" y1="98" x2="135" y2="98" stroke="#4a7c6f" strokeWidth="1.2" strokeLinecap="round" />
    <rect x="20" y="45" width="100" height="53" stroke="#243460" strokeWidth="1.4"
      fill="rgba(248,244,237,0.6)" strokeDasharray="4,0.5" />
    <path d="M15 45 L70 12 L125 45" stroke="#243460" strokeWidth="1.4" fill="rgba(248,244,237,0.5)" strokeLinejoin="round" />
    <path d="M55 12 Q70 2 85 12" stroke="#b8922a" strokeWidth="1.2" fill="none" strokeLinecap="round" />
    {[32, 48, 64, 80, 96, 108].map((x, i) => (
      <line key={i} x1={x} y1="45" x2={x} y2="98" stroke="#4a7c6f" strokeWidth="1.3" strokeLinecap="round" strokeDasharray="1,1" />
    ))}
    {[32, 48, 64, 80, 96, 108].map((x, i) => (
      <line key={i} x1={x - 4} y1="46" x2={x + 4} y2="46" stroke="#4a7c6f" strokeWidth="1.5" strokeLinecap="round" />
    ))}
    <rect x="56" y="70" width="28" height="28" rx="14" stroke="#9b4444" strokeWidth="1.2"
      fill="rgba(155,68,68,0.06)" />
    <rect x="28" y="55" width="14" height="18" rx="7" stroke="#4a6fa5" strokeWidth="1"
      fill="rgba(74,111,165,0.08)" />
    <rect x="98" y="55" width="14" height="18" rx="7" stroke="#4a6fa5" strokeWidth="1"
      fill="rgba(74,111,165,0.08)" />
    <circle cx="70" cy="28" r="2" stroke="#b8922a" strokeWidth="1" fill="rgba(184,146,42,0.2)" />
    <line x1="56" y1="35" x2="84" y2="35" stroke="#b8922a" strokeWidth="0.7" strokeOpacity="0.5" />
    <line x1="14" y1="98" x2="126" y2="98" stroke="#243460" strokeWidth="2" strokeLinecap="round" />
    <line x1="10" y1="102" x2="130" y2="102" stroke="#243460" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

/* decorative triangle */
const Tri = ({ size = 22, color = "#4a7c6f", opacity = 0.3, rotation = 0, filled = false }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={{ transform: `rotate(${rotation}deg)`, opacity }}>
    <polygon points="12,3 21,20 3,20" stroke={color} strokeWidth="1.5"
      fill={filled ? `${color}18` : "none"} strokeLinejoin="round" />
  </svg>
);

/* ═══════════════════════════════════════════════════════
   MAIN LANDING PAGE
═══════════════════════════════════════════════════════ */
export default function CaseBoxLanding({ onLogin }) {
  const [scrollY, setScrollY]   = useState(0);
  const [vis, setVis]           = useState({});
  const [activeCard, setActiveCard] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const io = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) setVis(v => ({ ...v, [e.target.dataset.id]: true }));
      }),
      { threshold: 0.12 }
    );
    document.querySelectorAll("[data-id]").forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);

  const rv = (id, delay = 0) => ({
    "data-id": id,
    style: {
      opacity:    vis[id] ? 1 : 0,
      transform:  vis[id] ? "none" : "translateY(30px)",
      transition: `opacity 0.8s ${delay}s cubic-bezier(.4,0,.2,1), transform 0.8s ${delay}s cubic-bezier(.4,0,.2,1)`,
    },
  });

  /* ── what we offer cards (replacing stats bar) ── */
  const offers = [
    {
      icon: <SketchFlower size={72} />,
      title: "Peace of Mind",
      sub: "Every hearing, every update — delivered to you without chasing anyone.",
    },
    {
      icon: <SketchPen size={66} />,
      title: "Your Voice, Heard",
      sub: "Every document you sign, every note you leave — tracked and preserved.",
    },
    {
      icon: <SketchNotepad size={72} />,
      title: "Nothing Slips",
      sub: "Deadlines remembered. Reminders sent. You focus on what matters.",
    },
  ];

  /* ── trust numbers (replacing tech terms) ── */
  const trustStats = [
    { val: "3.5 Cr+", label: "Cases pending in Indian courts today" },
    { val: "1 in 3",  label: "Cases miss a hearing due to miscommunication" },
    { val: "78%",     label: "Clients feel left in the dark about their case" },
    { val: "Day 1",   label: "You'll have full clarity from the moment you join" },
  ];

  /* ── service cards (replacing roles) ── */
  const services = [
    {
      icon: <SketchScales size={64} />,
      title: "For Advocates",
      color: "#4a7c6f",
      desc: "Manage every case in one place. Add hearing notes on the go, share documents securely, and never miss a next date.",
    },
    {
      icon: <SketchNotepad size={64} />,
      title: "For Clients",
      color: "#b8922a",
      desc: "See exactly where your case stands — today, right now. No more waiting for a callback to know what happened.",
    },
    {
      icon: <SketchFlower size={64} />,
      title: "For Courts & Judges",
      color: "#243460",
      desc: "A clean, read-only window into every assigned case. The right information, presented with clarity.",
    },
    {
      icon: <SketchPen size={60} />,
      title: "For Law Firms",
      color: "#9b4444",
      desc: "Onboard your entire team. Assign matters, track workloads, and keep partners and clients on the same page.",
    },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400;1,600&family=DM+Sans:wght@300;400;500&family=JetBrains+Mono:wght@400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --navy:       #1a2744;
          --navy-mid:   #243460;
          --cream:      #f8f4ed;
          --cream-dark: #ede8df;
          --mint:       #d9ede8;
          --mint-mid:   #b8ddd5;
          --sage:       #4a7c6f;
          --sage-light: #6aad9c;
          --gold:       #b8922a;
          --gold-light: #d4aa47;
          --rose:       #9b4444;
          --blush:      #fce8e8;
          --slate:      #4a6fa5;
          --muted:      #7a7a8a;
          --border:     #d6cfc2;
          --ink:        #1a1a2e;
        }

        html { scroll-behavior: smooth; font-size: 15px; }
        body {
          font-family: 'DM Sans', sans-serif;
          background: var(--cream);
          color: var(--ink);
          line-height: 1.6;
          -webkit-font-smoothing: antialiased;
          overflow-x: hidden;
        }

        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: var(--cream-dark); }
        ::-webkit-scrollbar-thumb { background: var(--mint-mid); border-radius: 2px; }

        /* NAV */
        nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 100;
          display: flex; align-items: center; justify-content: space-between;
          padding: 18px 52px;
          transition: background 0.4s, box-shadow 0.4s;
        }
        nav.scrolled {
          background: rgba(248,244,237,0.94);
          backdrop-filter: blur(14px);
          box-shadow: 0 1px 0 var(--border);
        }
        .nav-logo {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.55rem; font-weight: 600; color: var(--navy); letter-spacing: 0.02em;
        }
        .nav-logo span { color: var(--sage); font-style: italic; }
        .nav-links { display: flex; gap: 36px; list-style: none; }
        .nav-links a {
          font-size: 0.78rem; font-weight: 400; letter-spacing: 0.1em;
          text-transform: uppercase; color: var(--muted);
          text-decoration: none; transition: color 0.2s;
        }
        .nav-links a:hover { color: var(--navy); }
        .nav-cta {
          padding: 9px 24px; border: 1.5px solid var(--navy);
          background: transparent; cursor: pointer;
          font-family: 'DM Sans', sans-serif; font-size: 0.78rem;
          letter-spacing: 0.08em; text-transform: uppercase;
          color: var(--navy); border-radius: 2px; transition: all 0.25s;
        }
        .nav-cta:hover { background: var(--navy); color: var(--cream); }

        /* HERO */
        .hero {
          min-height: 100vh; display: grid; grid-template-columns: 1fr 1fr;
          position: relative; overflow: hidden;
        }
        .hero-left {
          display: flex; flex-direction: column; justify-content: center;
          padding: 120px 64px 80px; position: relative; z-index: 2;
        }
        .eyebrow {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.72rem; letter-spacing: 0.18em; text-transform: uppercase;
          color: var(--sage); margin-bottom: 22px;
          display: flex; align-items: center; gap: 12px;
        }
        .eyebrow::before { content:''; width:32px; height:1px; background:var(--sage); display:block; }
        .hero-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(3rem, 5.2vw, 4.8rem);
          font-weight: 300; line-height: 1.1; color: var(--navy); margin-bottom: 26px;
        }
        .hero-title em { font-style: italic; color: var(--sage); }
        .hero-title strong { font-weight: 600; }
        .hero-desc {
          font-size: 0.97rem; color: var(--muted); line-height: 1.85;
          max-width: 430px; margin-bottom: 40px; font-weight: 300;
        }
        .hero-actions { display: flex; gap: 14px; }
        .btn-primary {
          padding: 13px 32px; background: var(--navy); color: var(--cream);
          border: none; cursor: pointer; font-family: 'DM Sans', sans-serif;
          font-size: 0.82rem; letter-spacing: 0.08em; text-transform: uppercase;
          border-radius: 2px; transition: all 0.25s;
        }
        .btn-primary:hover { background: var(--sage); transform: translateY(-1px); }
        .btn-ghost {
          padding: 13px 28px; background: transparent; color: var(--navy);
          border: 1.5px solid var(--border); cursor: pointer;
          font-family: 'DM Sans', sans-serif; font-size: 0.82rem;
          letter-spacing: 0.08em; text-transform: uppercase;
          border-radius: 2px; transition: all 0.25s;
        }
        .btn-ghost:hover { border-color: var(--sage); color: var(--sage); }

        /* hero quote */
        .hero-quote {
          margin-top: 52px; padding-top: 28px;
          border-top: 1px solid var(--border);
          max-width: 420px;
        }
        .hero-quote blockquote {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.05rem; font-style: italic; font-weight: 300;
          color: var(--navy); line-height: 1.6;
        }
        .hero-quote cite {
          display: block; margin-top: 8px;
          font-size: 0.72rem; letter-spacing: 0.08em; text-transform: uppercase;
          color: var(--muted); font-style: normal;
        }

        /* hero right */
        .hero-right {
          background: var(--mint); position: relative; overflow: hidden;
          display: flex; align-items: center; justify-content: center;
        }
        .hero-court-wrap {
          position: absolute;
          animation: floatUp 5.5s ease-in-out infinite;
        }
        @keyframes floatUp {
          0%,100% { transform: translateY(0); }
          50%      { transform: translateY(-14px); }
        }
        .float-el { position: absolute; }
        .float-el-1 { animation: floatUp 7s ease-in-out infinite; }
        .float-el-2 { animation: floatUp 6s ease-in-out infinite 1.5s; }
        .float-el-3 { animation: floatUp 8s ease-in-out infinite 0.8s; }
        .deco { position: absolute; pointer-events: none; }
        .vert-label {
          position: absolute; right: 26px; top: 50%; transform: translateY(-50%);
          writing-mode: vertical-rl; text-orientation: mixed;
          font-family: 'Cormorant Garamond', serif; font-size: 0.68rem;
          letter-spacing: 0.2em; color: rgba(74,124,111,0.35); text-transform: uppercase;
        }

        /* CONTAINER */
        .container { max-width: 1180px; margin: 0 auto; padding: 0 52px; }
        section { padding: 104px 0; }
        .s-label {
          font-family: 'JetBrains Mono', monospace; font-size: 0.68rem;
          letter-spacing: 0.18em; text-transform: uppercase; color: var(--sage);
          margin-bottom: 12px; display: flex; align-items: center; gap: 10px;
        }
        .s-label::before { content:''; width:22px; height:1px; background:var(--sage); display:block; }
        .s-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(1.9rem, 3.2vw, 2.9rem); font-weight: 300;
          line-height: 1.2; color: var(--navy);
        }
        .s-title em { font-style: italic; color: var(--sage); }

        /* OFFER CARDS (replacing stats strip) */
        .offers-section { background: var(--cream-dark); padding: 80px 0; }
        .offers-grid {
          display: grid; grid-template-columns: repeat(3, 1fr);
          gap: 0; border: 1px solid var(--border); margin-top: 52px;
        }
        .offer-card {
          padding: 44px 40px; border-right: 1px solid var(--border);
          transition: background 0.25s; cursor: default;
        }
        .offer-card:last-child { border-right: none; }
        .offer-card:hover { background: rgba(217,237,232,0.35); }
        .offer-icon { margin-bottom: 22px; transition: transform 0.35s; }
        .offer-card:hover .offer-icon { transform: scale(1.06) rotate(-2deg); }
        .offer-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.35rem; font-weight: 600; color: var(--navy); margin-bottom: 10px;
        }
        .offer-desc { font-size: 0.88rem; color: var(--muted); line-height: 1.8; font-weight: 300; }

        /* TRUST NUMBERS (replacing tech strip) */
        .trust-section { background: var(--mint); padding: 72px 0; }
        .trust-inner {
          display: grid; grid-template-columns: repeat(4,1fr);
          border: 1px solid rgba(74,124,111,0.2);
        }
        .trust-cell {
          padding: 40px 28px; border-right: 1px solid rgba(74,124,111,0.15); text-align: center;
        }
        .trust-cell:last-child { border-right: none; }
        .trust-val {
          font-family: 'Cormorant Garamond', serif;
          font-size: 2.6rem; font-weight: 300; color: var(--navy); line-height: 1;
        }
        .trust-val em { font-style: italic; color: var(--sage); }
        .trust-label { font-size: 0.78rem; color: var(--sage); margin-top: 10px; line-height: 1.5; font-weight: 300; }

        /* SERVICES (replacing roles) */
        .services-section { background: var(--navy); padding: 104px 0; }
        .services-section .s-label { color: var(--mint-mid); }
        .services-section .s-label::before { background: var(--mint-mid); }
        .services-section .s-title { color: var(--cream); }
        .services-section .s-title em { color: var(--gold-light); }
        .services-grid {
          display: grid; grid-template-columns: repeat(4,1fr);
          gap: 1px; background: rgba(255,255,255,0.05); margin-top: 56px;
        }
        .service-card {
          background: var(--navy); padding: 44px 28px;
          transition: background 0.22s; position: relative; overflow: hidden;
        }
        .service-card:hover { background: rgba(255,255,255,0.03); }
        .service-icon { margin-bottom: 20px; transition: transform 0.3s; }
        .service-card:hover .service-icon { transform: scale(1.05) rotate(-3deg); }
        .service-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.25rem; font-weight: 600; margin-bottom: 14px;
        }
        .service-desc { font-size: 0.83rem; color: rgba(248,244,237,0.5); line-height: 1.8; font-weight: 300; }

        /* HOW */
        .how-section { background: var(--cream); }
        .how-grid {
          display: grid; grid-template-columns: repeat(3,1fr);
          border-top: 1px solid var(--border); margin-top: 60px;
        }
        .how-step {
          padding: 48px 40px; border-right: 1px solid var(--border); position: relative;
        }
        .how-step:last-child { border-right: none; }
        .how-num {
          font-family: 'Cormorant Garamond', serif;
          font-size: 4.5rem; font-weight: 300; color: rgba(26,39,68,0.07);
          position: absolute; top: 20px; right: 24px; line-height: 1;
        }
        .how-icon { margin-bottom: 20px; }
        .how-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.3rem; font-weight: 600; color: var(--navy); margin-bottom: 10px;
        }
        .how-desc { font-size: 0.86rem; color: var(--muted); line-height: 1.8; font-weight: 300; }

        /* CTA */
        .cta-section {
          background: var(--navy); padding: 130px 0;
          text-align: center; position: relative; overflow: hidden;
        }
        .cta-section::before {
          content: ''; position: absolute; inset: 0;
          background: radial-gradient(ellipse at 30% 60%, rgba(74,124,111,0.18) 0%, transparent 65%);
          pointer-events: none;
        }
        .cta-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(2.4rem, 4vw, 3.8rem); font-weight: 300;
          color: var(--cream); line-height: 1.15; margin-bottom: 18px;
        }
        .cta-title em { font-style: italic; color: var(--gold-light); }
        .cta-desc {
          font-size: 0.92rem; color: rgba(248,244,237,0.48);
          max-width: 500px; margin: 0 auto 48px; line-height: 1.85; font-weight: 300;
        }
        .btn-sage {
          padding: 14px 40px; background: var(--sage); color: var(--cream);
          border: none; cursor: pointer; font-family: 'DM Sans', sans-serif;
          font-size: 0.82rem; letter-spacing: 0.1em; text-transform: uppercase;
          border-radius: 2px; transition: all 0.25s; margin: 0 8px;
        }
        .btn-sage:hover { background: var(--sage-light); transform: translateY(-2px); }
        .btn-outline-cream {
          padding: 14px 40px; background: transparent;
          color: rgba(248,244,237,0.55); border: 1.5px solid rgba(248,244,237,0.18);
          cursor: pointer; font-family: 'DM Sans', sans-serif;
          font-size: 0.82rem; letter-spacing: 0.1em; text-transform: uppercase;
          border-radius: 2px; transition: all 0.25s; margin: 0 8px;
        }
        .btn-outline-cream:hover { border-color: rgba(248,244,237,0.45); color: var(--cream); }

        /* journey illustrations row */
        .journey-row {
          display: flex; align-items: flex-end; justify-content: center;
          gap: 40px; margin-top: 80px; padding-top: 56px;
          border-top: 1px solid rgba(255,255,255,0.07);
          position: relative; z-index: 2;
        }
        .journey-label {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.05rem; font-style: italic; font-weight: 300;
          color: rgba(248,244,237,0.5); text-align: center; margin-top: 10px;
        }

        /* FOOTER */
        footer {
          background: var(--cream-dark); padding: 36px 52px;
          display: flex; align-items: center; justify-content: space-between;
          border-top: 1px solid var(--border);
        }
        .footer-logo {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.2rem; font-weight: 600; color: var(--navy);
        }
        .footer-logo span { color: var(--sage); font-style: italic; }
        .footer-tagline {
          font-size: 0.75rem; color: var(--muted); letter-spacing: 0.06em;
          font-style: italic;
        }
        .footer-links { display: flex; gap: 24px; }
        .footer-links a {
          font-size: 0.72rem; color: var(--muted); text-decoration: none;
          letter-spacing: 0.06em; text-transform: uppercase; transition: color 0.2s;
        }
        .footer-links a:hover { color: var(--sage); }

        @media (max-width: 900px) {
          .hero { grid-template-columns: 1fr; }
          .hero-right { display: none; }
          .hero-left { padding: 100px 28px 60px; }
          .offers-grid, .how-grid { grid-template-columns: 1fr; }
          .offer-card { border-right: none; border-bottom: 1px solid var(--border); }
          .trust-inner { grid-template-columns: 1fr 1fr; }
          .services-grid { grid-template-columns: 1fr 1fr; }
          .container { padding: 0 24px; }
          nav { padding: 16px 24px; }
          .nav-links { display: none; }
          footer { flex-direction: column; gap: 14px; text-align: center; }
          .journey-row { flex-wrap: wrap; }
        }
      `}</style>

      {/* ── NAV ── */}
      <nav className={scrollY > 40 ? "scrolled" : ""}>
        <div className="nav-logo">Case<span>Box</span></div>
        <ul className="nav-links">
          <li><a href="#offer">What We Do</a></li>
          <li><a href="#who">Who It's For</a></li>
          <li><a href="#how">How It Works</a></li>
        </ul>
        <button className="nav-cta" onClick={onLogin}>
  Get Started
</button>
      </nav>

      {/* ── HERO ── */}
      <section className="hero">
        <div className="hero-left">
          <div className="eyebrow" {...rv("h-eyebrow")}>Clarity for Every Case</div>

          <h1 className="hero-title" {...rv("h-title", 0.08)}>
            Your case,<br /><em>always</em><br /><strong>within reach.</strong>
          </h1>

          <p className="hero-desc" {...rv("h-desc", 0.16)}>
            Millions of cases wait in silence while clients wait for a phone call.
            CaseBox brings your legal journey into the open — every hearing,
            every document, every update — in one secure place.
          </p>

          <div className="hero-actions" {...rv("h-actions", 0.22)}>
            <button className="btn-primary" onClick={onLogin}>
  Start Today
</button>
            <button className="btn-ghost" onClick={() => document.getElementById("who").scrollIntoView({ behavior: "smooth" })}>
              Who It's For
            </button>
          </div>

          <div className="hero-quote" {...rv("h-quote", 0.3)}>
            <blockquote>
              "Justice delayed is justice denied — but information delayed makes it worse."
            </blockquote>
            <cite>The access-to-justice gap, India 2024</cite>
          </div>
        </div>

        {/* right illustration panel */}
        <div className="hero-right">
          {/* background blobs */}
          <div style={{ position:"absolute", width:280, height:280, borderRadius:"50%", background:"rgba(184,221,213,0.45)", top:"8%", right:"-50px" }} />
          <div style={{ position:"absolute", width:160, height:160, borderRadius:"50%", background:"rgba(184,221,213,0.3)", bottom:"12%", left:"5%" }} />

          {/* decorative triangles */}
          <div className="deco" style={{ top:"12%", left:"9%" }}><Tri size={22} color="#4a7c6f" opacity={0.38} rotation={15} /></div>
          <div className="deco" style={{ top:"22%", right:"16%" }}><Tri size={14} color="#b8922a" opacity={0.32} rotation={-12} filled /></div>
          <div className="deco" style={{ bottom:"26%", left:"7%" }}><Tri size={18} color="#4a7c6f" opacity={0.28} rotation={32} /></div>
          <div className="deco" style={{ bottom:"14%", right:"11%" }}><Tri size={12} color="#9b4444" opacity={0.22} rotation={-25} filled /></div>

          {/* main court */}
          <div className="hero-court-wrap"><SketchCourt size={300} /></div>

          {/* floating elements */}
          <div className="float-el float-el-1" style={{ top:"17%", right:"9%" }}><SketchScales size={74} /></div>
          <div className="float-el float-el-2" style={{ bottom:"24%", left:"6%" }}><SketchFlower size={68} /></div>
          <div className="float-el float-el-3" style={{ bottom:"30%", right:"7%" }}><SketchPen size={56} /></div>

          {/* vertical label */}
          <div className="vert-label">
            Case<span style={{ color:"var(--gold)", margin:"0 2px" }}>·</span>Box<span style={{ color:"var(--gold)", margin:"0 2px" }}>·</span>2026
          </div>
        </div>
      </section>

      {/* ── WHAT WE OFFER (replacing stat bar) ── */}
      <section className="offers-section" id="offer">
        <div className="container">
          <div {...rv("off-label")}>
            <div className="s-label">What We Offer</div>
            <h2 className="s-title">You deserve to know<br /><em>exactly</em> what's happening.</h2>
          </div>
          <div className="offers-grid">
            {offers.map((o, i) => (
              <div key={i} className="offer-card" {...rv(`off-${i}`, i * 0.1)}>
                <div className="offer-icon">{o.icon}</div>
                <div className="offer-title">{o.title}</div>
                <div className="offer-desc">{o.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TRUST NUMBERS (replacing token/JWT/AI pills) ── */}
      <div className="trust-section">
        <div className="container">
          <div className="trust-inner" {...rv("trust-grid")}>
            {trustStats.map((s, i) => (
              <div key={i} className="trust-cell">
                <div className="trust-val">
                  {i === 3 ? <em>{s.val}</em> : s.val}
                </div>
                <div className="trust-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── WHO IT'S FOR (replacing roles) ── */}
      <section className="services-section" id="who">
        <div className="container">
          <div {...rv("svc-label")}>
            <div className="s-label">Who It's For</div>
            <h2 className="s-title">
              Built for everyone<br /><em>in the room.</em>
            </h2>
          </div>
          <div className="services-grid">
            {services.map((s, i) => (
              <div key={i} className="service-card" {...rv(`svc-${i}`, i * 0.08)}>
                <div style={{ position:"absolute", top:0, left:0, right:0, height:2, background:s.color, opacity:0.55 }} />
                <div className="service-icon">{s.icon}</div>
                <div className="service-title" style={{ color:s.color }}>{s.title}</div>
                <div className="service-desc">{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="how-section" id="how">
        <div className="container">
          <div {...rv("how-label")}>
            <div className="s-label">How It Works</div>
            <h2 className="s-title">Simple from <em>day one.</em></h2>
          </div>
          <div className="how-grid">
            {[
              {
                num:"01", icon:<SketchNotepad size={66} />,
                title:"Register in Minutes",
                desc:"Sign up and your advocate links you to your case. No forms, no offices, no waiting room.",
              },
              {
                num:"02", icon:<SketchFlower size={66} />,
                title:"Your Case, Live",
                desc:"See every hearing, every document, every update the moment it happens. Translated into plain language.",
              },
              {
                num:"03", icon:<SketchScales size={66} />,
                title:"Stay Ahead, Always",
                desc:"Get reminders before hearings. Download your documents. Ask questions directly through the platform.",
              },
            ].map((s, i) => (
              <div key={i} className="how-step" {...rv(`how-${i}`, i * 0.12)}>
                <div className="how-num">{s.num}</div>
                <div className="how-icon">{s.icon}</div>
                <div className="how-title">{s.title}</div>
                <div className="how-desc">{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="cta-section" id="cta">
        {/* decorative faded illustrations */}
        <div style={{ position:"absolute", top:"15%", left:"6%", opacity:0.1 }}><SketchTree size={100} /></div>
        <div style={{ position:"absolute", bottom:"15%", right:"6%", opacity:0.08 }}><SketchClassicCar size={140} /></div>
        <div style={{ position:"absolute", top:"14%", right:"13%", opacity:0.09 }}><Tri size={30} color="#d9ede8" opacity={1} rotation={18} /></div>
        <div style={{ position:"absolute", bottom:"14%", left:"14%", opacity:0.09 }}><Tri size={20} color="#d9ede8" opacity={1} rotation={-14} filled /></div>

        <div className="container" style={{ position:"relative", zIndex:2 }}>
          <div className="s-label" style={{ color:"var(--mint-mid)", justifyContent:"center" }} {...rv("cta-label")}>
            <span style={{ width:22, height:1, background:"var(--mint-mid)", display:"block" }} />
            Your journey starts here
            <span style={{ width:22, height:1, background:"var(--mint-mid)", display:"block" }} />
          </div>

          <h2 className="cta-title" {...rv("cta-title", 0.1)}>
            Bring your practice<br />into the <em>digital age.</em>
          </h2>

          <p className="cta-desc" {...rv("cta-desc", 0.18)}>
            Thousands of hearings happen every day. Thousands of clients sit in uncertainty.
            CaseBox closes that gap — one case at a time.
          </p>

          <div {...rv("cta-btns", 0.24)}>
            <button className="btn-sage" onClick={onLogin}>Request Access</button>
            <button className="btn-outline-cream">Contact Us</button>
          </div>

          {/* journey illustrations */}
          <div className="journey-row" {...rv("cta-illu", 0.3)}>
            <div style={{ textAlign:"center" }}>
              <SketchTree size={90} />
              <div className="journey-label">Roots run deep</div>
            </div>
            <div style={{ textAlign:"center", display:"flex", flexDirection:"column", alignItems:"center" }}>
              <div style={{ display:"flex", gap:"-10px", alignItems:"flex-end" }}>
                <SketchManSuit size={72} />
                <SketchWomanSuit size={66} />
              </div>
              <div className="journey-label">Side by side</div>
            </div>
            <div style={{ textAlign:"center" }}>
              <SketchClassicCar size={120} />
              <div className="journey-label">Moving forward</div>
            </div>
          </div>

          <p style={{ marginTop:40, fontSize:"0.76rem", color:"rgba(248,244,237,0.18)", letterSpacing:"0.1em", textTransform:"uppercase" }}>
            Trusted · Secure · Transparent
          </p>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer>
        <div className="footer-logo">Case<span>Box</span></div>
        <div className="footer-tagline">"Clarity for every case, dignity for every client."</div>
        <div className="footer-links">
          <a href="#offer">What We Do</a>
          <a href="#who">Who It's For</a>
          <a href="#how">How It Works</a>
          <a href="#cta">Get Started</a>
        </div>
      </footer>
    </>
  );
}