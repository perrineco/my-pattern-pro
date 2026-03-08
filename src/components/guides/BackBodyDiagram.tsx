import { ReactNode } from "react";
import { Category } from "@/types/sloper";
import { BodyPositions, getPositions } from "./SharedBodyDiagram";

// ─── Defs partagés (dégradés + ombre) ────────────────────────────────────────

function SharedDefs() {
  return (
    <defs>
      <linearGradient id="skinWomenBack" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#e8c9a8" stopOpacity={0.95} />
        <stop offset="45%" stopColor="#f2d9bc" />
        <stop offset="100%" stopColor="#e0b896" stopOpacity={0.95} />
      </linearGradient>
      <linearGradient id="skinMenBack" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#d9b898" stopOpacity={0.95} />
        <stop offset="45%" stopColor="#eacaaa" />
        <stop offset="100%" stopColor="#d0a882" stopOpacity={0.95} />
      </linearGradient>
      <linearGradient id="skinKidsBack" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#efd4b6" stopOpacity={0.95} />
        <stop offset="45%" stopColor="#fae2c8" />
        <stop offset="100%" stopColor="#e8c0a0" stopOpacity={0.95} />
      </linearGradient>
      <filter id="shadowBack" x="-12%" y="-5%" width="124%" height="118%">
        <feDropShadow dx={0} dy={2} stdDeviation={2.5} floodColor="#00000020" />
      </filter>
    </defs>
  );
}

// ─── Silhouette Femme (vue de dos) ───────────────────────────────────────────

function WomenBodyBack() {
  const cx = 120;
  return (
    <g id="women-back">
      {/* Ligne centrale / colonne vertébrale */}
      <line x1={cx} y1="62" x2={cx} y2="276" stroke="#c49070" strokeWidth={0.5} strokeOpacity={0.3} strokeDasharray="3,4" />

      {/* Bras gauche */}
      <path
        d={`M 80 56 C 74 64, 68 90, 66 120 C 64 150, 66 175, 68 200 C 70 220, 72 240, 74 252
            C 75 256, 77 257, 79 254 C 81 251, 80 245, 79 238
            L 76 200 C 74 175, 73 150, 74 125 C 75 100, 79 78, 83 65`}
        fill="url(#skinWomenBack)" stroke="#b8845a" strokeWidth={0.8} strokeLinejoin="round"
      />

      {/* Bras droit */}
      <path
        d={`M 160 56 C 166 64, 172 90, 174 120 C 176 150, 174 175, 172 200 C 170 220, 168 240, 166 252
            C 165 256, 163 257, 161 254 C 159 251, 160 245, 161 238
            L 164 200 C 166 175, 167 150, 166 125 C 165 100, 161 78, 157 65`}
        fill="url(#skinWomenBack)" stroke="#b8845a" strokeWidth={0.8} strokeLinejoin="round"
      />

      {/* Corps principal */}
      <path
        d={`M 80 55 C 88 52, 105 50, ${cx} 50 C 135 50, 152 52, 160 55
            L 160 70 C 158 82, 155 95, 153 108 C 151 120, 149 135, 148 150
            C 148 160, 150 170, 153 182
            C 155 195, 152 210, 148 230 L 145 260 C 143 280, 141 300, 140 312
            C 140 316, 137 318, 134 318 C 131 318, 130 316, 130 312
            L 128 280 C 126 260, 124 240, 122 220
            L ${cx} 200
            L 118 220 C 116 240, 114 260, 112 280
            L 110 312 C 110 316, 109 318, 106 318 C 103 318, 100 316, 100 312
            L 97 260 C 95 230, 92 195, 87 182
            C 90 170, 92 160, 92 150
            C 91 135, 89 120, 87 108 C 85 95, 82 82, 80 70
            Z`}
        fill="url(#skinWomenBack)" stroke="#b8845a" strokeWidth={1} strokeLinejoin="round" filter="url(#shadowBack)"
      />

      {/* Cou */}
      <path
        d={`M 112 48 L 112 58 C 112 63, 116 66, ${cx} 66 C 124 66, 128 63, 128 58 L 128 48`}
        fill="url(#skinWomenBack)" stroke="#b8845a" strokeWidth={0.8}
      />

      {/* Tête (vue de dos) */}
      <ellipse cx={cx} cy="35" rx="18" ry="22" fill="url(#skinWomenBack)" stroke="#b8845a" strokeWidth={0.8} />

      {/* Oreilles */}
      <path d="M 101 32 C 98 30, 96 33, 96 37 C 96 41, 98 44, 101 42" fill="url(#skinWomenBack)" stroke="#b8845a" strokeWidth={0.8} />
      <path d="M 139 32 C 142 30, 144 33, 144 37 C 144 41, 142 44, 139 42" fill="url(#skinWomenBack)" stroke="#b8845a" strokeWidth={0.8} />

      {/* Cheveux (vue arrière) */}
      <path
        d={`M 102 28 C 102 10, 138 10, 138 28
            C 138 42, 135 52, 130 58
            C 127 62, 124 65, ${cx} 68
            C 116 65, 113 62, 110 58
            C 105 52, 102 42, 102 28 Z`}
        fill="#5a3e2a" stroke="#4a2e1a" strokeWidth={0.6}
      />

      {/* Indication nuque */}
      <circle cx={cx} cy="53" r="2.5" fill="#c49070" fillOpacity={0.6} />

      {/* Omoplates */}
      <path d="M 100 82 C 105 78, 113 82, 111 90" fill="none" stroke="#c49070" strokeWidth={0.6} strokeOpacity={0.4} />
      <path d="M 140 82 C 135 78, 127 82, 129 90" fill="none" stroke="#c49070" strokeWidth={0.6} strokeOpacity={0.4} />

      {/* Label */}
      <text x={cx} y="334" textAnchor="middle" fontFamily="Georgia, serif" fontSize={9} fill="#9a6040" letterSpacing={1.5}>
        FEMME · DOS
      </text>
    </g>
  );
}

// ─── Silhouette Homme (vue de dos) ───────────────────────────────────────────

function MenBodyBack() {
  const cx = 120;
  return (
    <g id="men-back">
      <line x1={cx} y1="58" x2={cx} y2="276" stroke="#b8945a" strokeWidth={0.5} strokeOpacity={0.3} strokeDasharray="3,4" />

      {/* Bras gauche */}
      <path
        d={`M 70 54 C 62 62, 55 95, 52 130 C 50 160, 52 190, 55 220 C 57 240, 58 255, 60 262
            C 61 266, 63 267, 65 264 C 67 261, 66 255, 65 248
            L 62 215 C 60 190, 59 160, 60 130 C 62 100, 66 75, 73 62`}
        fill="url(#skinMenBack)" stroke="#b8845a" strokeWidth={0.8} strokeLinejoin="round"
      />

      {/* Bras droit */}
      <path
        d={`M 170 54 C 178 62, 185 95, 188 130 C 190 160, 188 190, 185 220 C 183 240, 182 255, 180 262
            C 179 266, 177 267, 175 264 C 173 261, 174 255, 175 248
            L 178 215 C 180 190, 181 160, 180 130 C 178 100, 174 75, 167 62`}
        fill="url(#skinMenBack)" stroke="#b8845a" strokeWidth={0.8} strokeLinejoin="round"
      />

      {/* Corps principal (épaules larges, hanches étroites) */}
      <path
        d={`M 70 53 C 80 49, 100 47, ${cx} 47 C 140 47, 160 49, 170 53
            L 170 70 C 168 85, 163 100, 160 115 C 157 130, 155 142, 153 150
            C 152 158, 152 168, 153 180
            C 154 195, 152 210, 148 235 L 146 265 C 144 285, 142 300, 141 312
            C 141 316, 138 318, 135 318 C 132 318, 131 316, 131 312
            L 129 280 C 127 260, 125 240, 123 220
            L ${cx} 198
            L 117 220 C 115 240, 113 260, 111 280
            L 109 312 C 109 316, 108 318, 105 318 C 102 318, 99 316, 99 312
            L 97 265 C 95 235, 92 195, 87 180
            C 88 168, 88 158, 87 150
            C 85 142, 83 130, 80 115 C 77 100, 72 85, 70 70
            Z`}
        fill="url(#skinMenBack)" stroke="#b8845a" strokeWidth={1} strokeLinejoin="round" filter="url(#shadowBack)"
      />

      {/* Cou (plus épais que femme) */}
      <path
        d={`M 108 45 L 108 55 C 108 60, 113 63, ${cx} 63 C 127 63, 132 60, 132 55 L 132 45`}
        fill="url(#skinMenBack)" stroke="#b8845a" strokeWidth={0.8}
      />

      {/* Tête */}
      <ellipse cx={cx} cy="32" rx="19" ry="21" fill="url(#skinMenBack)" stroke="#b8845a" strokeWidth={0.8} />

      {/* Oreilles */}
      <path d="M 100 29 C 97 27, 95 30, 95 34 C 95 38, 97 41, 100 39" fill="url(#skinMenBack)" stroke="#b8845a" strokeWidth={0.8} />
      <path d="M 140 29 C 143 27, 145 30, 145 34 C 145 38, 143 41, 140 39" fill="url(#skinMenBack)" stroke="#b8845a" strokeWidth={0.8} />

      {/* Cheveux courts (vue arrière) */}
      <path
        d={`M 101 26 C 101 10, 139 10, 139 26 C 139 32, 137 36, 135 38
            L 105 38 C 103 36, 101 32, 101 26 Z`}
        fill="#3a2a1a" stroke="#2a1a0a" strokeWidth={0.6}
      />

      {/* Nuque */}
      <circle cx={cx} cy="50" r="2.5" fill="#b8945a" fillOpacity={0.6} />

      {/* Omoplates (plus marquées) */}
      <path d="M 95 78 C 102 72, 112 78, 108 88" fill="none" stroke="#b8945a" strokeWidth={0.7} strokeOpacity={0.4} />
      <path d="M 145 78 C 138 72, 128 78, 132 88" fill="none" stroke="#b8945a" strokeWidth={0.7} strokeOpacity={0.4} />

      {/* Label */}
      <text x={cx} y="334" textAnchor="middle" fontFamily="Georgia, serif" fontSize={9} fill="#8a6040" letterSpacing={1.5}>
        HOMME · DOS
      </text>
    </g>
  );
}

// ─── Silhouette Enfant (vue de dos) ──────────────────────────────────────────

function KidsBodyBack() {
  const cx = 120;
  return (
    <g id="kids-back">
      <line x1={cx} y1="110" x2={cx} y2="290" stroke="#b89470" strokeWidth={0.4} strokeOpacity={0.3} strokeDasharray="3,4" />

      {/* Bras gauche */}
      <path
        d={`M 75 117 C 70 125, 66 145, 65 165 C 64 185, 66 200, 68 218
            C 69 222, 71 223, 73 220 C 74 217, 73 212, 72 208
            L 70 185 C 69 170, 70 150, 72 135 C 74 125, 77 118, 79 115`}
        fill="url(#skinKidsBack)" stroke="#9a6040" strokeWidth={0.8} strokeLinejoin="round"
      />

      {/* Bras droit */}
      <path
        d={`M 165 117 C 170 125, 174 145, 175 165 C 176 185, 174 200, 172 218
            C 171 222, 169 223, 167 220 C 166 217, 167 212, 168 208
            L 170 185 C 171 170, 170 150, 168 135 C 166 125, 163 118, 161 115`}
        fill="url(#skinKidsBack)" stroke="#9a6040" strokeWidth={0.8} strokeLinejoin="round"
      />

      {/* Corps principal */}
      <path
        d={`M 75 115 C 85 112, 100 110, ${cx} 110 C 140 110, 155 112, 165 115
            L 165 128 C 163 138, 160 148, 158 155
            C 157 162, 157 170, 158 180
            C 160 192, 157 205, 154 225 L 152 255 C 151 270, 150 285, 149 295
            C 149 298, 147 300, 144 300 C 141 300, 140 298, 140 295
            L 138 270 C 136 255, 132 240, 128 225
            L ${cx} 210
            L 112 225 C 108 240, 104 255, 102 270
            L 100 295 C 100 298, 99 300, 96 300 C 93 300, 91 298, 91 295
            L 89 255 C 87 225, 84 192, 82 180
            C 83 170, 83 162, 82 155
            C 80 148, 77 138, 75 128
            Z`}
        fill="url(#skinKidsBack)" stroke="#9a6040" strokeWidth={1} strokeLinejoin="round" filter="url(#shadowBack)"
      />

      {/* Cou */}
      <path
        d={`M 112 100 L 112 110 C 112 114, 116 116, ${cx} 116 C 124 116, 128 114, 128 110 L 128 100`}
        fill="url(#skinKidsBack)" stroke="#9a6040" strokeWidth={0.8}
      />

      {/* Tête */}
      <ellipse cx={cx} cy="82" rx="20" ry="24" fill="url(#skinKidsBack)" stroke="#9a6040" strokeWidth={0.8} />

      {/* Oreilles */}
      <path d="M 99 80 C 96 78, 94 80, 94 84 C 94 88, 96 90, 99 88" fill="url(#skinKidsBack)" stroke="#9a6040" strokeWidth={0.8} />
      <path d="M 141 80 C 144 78, 146 80, 146 84 C 146 88, 144 90, 141 88" fill="url(#skinKidsBack)" stroke="#9a6040" strokeWidth={0.8} />

      {/* Cheveux (vue arrière) */}
      <path
        d={`M 100 75 C 100 55, 140 55, 140 75 C 140 85, 137 92, 133 96
            L 107 96 C 103 92, 100 85, 100 75 Z`}
        fill="#5a3e2a" stroke="#4a2e1a" strokeWidth={0.6}
      />

      {/* Nuque */}
      <circle cx={cx} cy="105" r="2" fill="#9a6040" fillOpacity={0.5} />

      {/* Label */}
      <text x={cx} y="320" textAnchor="middle" fontFamily="Georgia, serif" fontSize={9} fill="#7a5030" letterSpacing={1.5}>
        ENFANT · DOS
      </text>
    </g>
  );
}

// ─── Composant principal ─────────────────────────────────────────────────────

interface BackBodyDiagramProps {
  category: Category;
  renderOverlay?: (pos: BodyPositions) => ReactNode;
  viewBoxHeight?: number;
  className?: string;
}

export function BackBodyDiagram({ category, renderOverlay, viewBoxHeight, className }: BackBodyDiagramProps) {
  const pos = getPositions(category);
  const vbHeight = viewBoxHeight ?? (category === "kids" ? 345 : 340);

  const kidsScale = 0.75;
  const kidsTranslateX = (240 * (1 - kidsScale)) / 2;
  const kidsTranslateY = 10;

  return (
    <svg
      viewBox={`0 0 240 ${vbHeight}`}
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ overflow: "visible" }}
    >
      <SharedDefs />
      {category === "women" && (
        <>
          <WomenBodyBack />
          {renderOverlay?.(pos)}
        </>
      )}
      {category === "men" && (
        <>
          <MenBodyBack />
          {renderOverlay?.(pos)}
        </>
      )}
      {category === "kids" && (
        <g transform={`translate(${kidsTranslateX}, ${kidsTranslateY}) scale(${kidsScale})`}>
          <KidsBodyBack />
          {renderOverlay?.(pos)}
        </g>
      )}
    </svg>
  );
}
