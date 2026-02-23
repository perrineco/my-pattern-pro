import { ReactNode } from "react";
import { Category } from "@/types/sloper";

export interface BodyPositions {
  centerX: number;
  headCenterY: number;
  neckBaseY: number;
  shoulderY: number;
  bustY: number;
  backWidthY: number;
  waistY: number;
  hipY: number;
  hemY: number;
  ankleY: number;
  shoulderWidth: number;
  bustWidth: number;
  waistWidth: number;
  hipWidth: number;
  underarmY: number;
  elbowY: number;
  wristY: number;
  armWidth: number;
  wristWidth: number;
  leftShoulderX: number;
  rightShoulderX: number;
}

function getPositions(category: Category): BodyPositions {
  const centerX = 120;

  if (category === "kids") {
    return {
      centerX,
      headCenterY: 46,
      neckBaseY: 108,
      shoulderY: 115,
      bustY: 145,
      backWidthY: 130,
      waistY: 180,
      hipY: 218,
      hemY: 298,
      ankleY: 318,
      shoulderWidth: 90,
      bustWidth: 88,
      waistWidth: 84,
      hipWidth: 90,
      underarmY: 130,
      elbowY: 178,
      wristY: 222,
      armWidth: 20,
      wristWidth: 16,
      leftShoulderX: centerX - 45,
      rightShoulderX: centerX + 45,
    };
  }

  if (category === "men") {
    return {
      centerX,
      headCenterY: 25,
      neckBaseY: 58,
      shoulderY: 52,
      bustY: 100,
      backWidthY: 78,
      waistY: 150,
      hipY: 180,
      hemY: 280,
      ankleY: 310,
      shoulderWidth: 100,
      bustWidth: 90,
      waistWidth: 78,
      hipWidth: 76,
      underarmY: 85,
      elbowY: 170,
      wristY: 260,
      armWidth: 26,
      wristWidth: 18,
      leftShoulderX: centerX - 50,
      rightShoulderX: centerX + 50,
    };
  }

  // Women
  return {
    centerX,
    headCenterY: 25,
    neckBaseY: 58,
    shoulderY: 53,
    bustY: 105,
    backWidthY: 80,
    waistY: 150,
    hipY: 182,
    hemY: 280,
    ankleY: 310,
    shoulderWidth: 80,
    bustWidth: 82,
    waistWidth: 56,
    hipWidth: 86,
    underarmY: 85,
    elbowY: 168,
    wristY: 255,
    armWidth: 22,
    wristWidth: 14,
    leftShoulderX: centerX - 40,
    rightShoulderX: centerX + 40,
  };
}

// ─── Defs partagés (dégradés + ombre) ────────────────────────────────────────

function SharedDefs() {
  return (
    <defs>
      <linearGradient id="skinWomen" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#e8c9a8" stopOpacity={0.95} />
        <stop offset="45%" stopColor="#f2d9bc" />
        <stop offset="100%" stopColor="#e0b896" stopOpacity={0.95} />
      </linearGradient>

      <linearGradient id="skinMen" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#d9b898" stopOpacity={0.95} />
        <stop offset="45%" stopColor="#eacaaa" />
        <stop offset="100%" stopColor="#d0a882" stopOpacity={0.95} />
      </linearGradient>

      <linearGradient id="skinKids" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#efd4b6" stopOpacity={0.95} />
        <stop offset="45%" stopColor="#fae2c8" />
        <stop offset="100%" stopColor="#e8c0a0" stopOpacity={0.95} />
      </linearGradient>

      <filter id="shadow" x="-12%" y="-5%" width="124%" height="118%">
        <feDropShadow dx={0} dy={2} stdDeviation={2.5} floodColor="#00000020" />
      </filter>
    </defs>
  );
}

// ─── Silhouette Femme ─────────────────────────────────────────────────────────

function WomenBody() {
  return (
    <g id="women">
      {/* Bras gauche */}
      <path
        d="M 69 53 C 67 95 66 153 66 168 C 67 188 72 245 72 255
           C 73 263 87 263 86 255 C 86 245 92 188 92 168
           C 92 158 91 93 91 85 Z"
        fill="url(#skinWomen)"
        stroke="#b8845a"
        strokeWidth={0.8}
        strokeLinejoin="round"
      />
      <path d="M 67 164 Q 79 172 91 164" fill="none" stroke="#c49070" strokeWidth={0.6} strokeOpacity={0.5} />

      {/* Bras droit */}
      <path
        d="M 171 53 C 173 95 174 153 174 168 C 173 188 168 245 168 255
           C 167 263 153 263 154 255 C 154 245 148 188 148 168
           C 148 158 149 93 149 85 Z"
        fill="url(#skinWomen)"
        stroke="#b8845a"
        strokeWidth={0.8}
        strokeLinejoin="round"
      />
      <path d="M 149 164 Q 161 172 173 164" fill="none" stroke="#c49070" strokeWidth={0.6} strokeOpacity={0.5} />

      {/* Corps */}
      <path
        d="M 112 58 C 108 56 74 52 80 53 C 85 56 85 91 79 105
           C 75 113 84 138 92 150 C 96 160 71 170 77 182
           L 79 280 C 79 288 110 294 112 300 L 114 310 L 126 310
           L 128 300 C 130 294 161 288 161 280 L 163 182
           C 169 170 144 160 148 150 C 156 138 165 113 161 105
           C 155 91 155 56 160 53 C 166 52 132 56 128 58
           C 128 54 112 54 112 58 Z"
        fill="url(#skinWomen)"
        stroke="#b8845a"
        strokeWidth={1}
        strokeLinejoin="round"
        filter="url(#shadow)"
      />

      {/* Courbes poitrine */}
      <path d="M 82 101 Q 100 115 118 109" fill="none" stroke="#c49070" strokeWidth={0.7} strokeOpacity={0.4} />
      <path d="M 122 109 Q 140 115 158 101" fill="none" stroke="#c49070" strokeWidth={0.7} strokeOpacity={0.4} />

      {/* Ligne centrale */}
      <line
        x1="120"
        y1="62"
        x2="120"
        y2="276"
        stroke="#c49070"
        strokeWidth={0.5}
        strokeOpacity={0.3}
        strokeDasharray="3,4"
      />

      {/* Cou */}
      <path
        d="M 114 46 C 114 52 112 54 112 58 L 128 58 C 128 54 126 52 126 46 Z"
        fill="url(#skinWomen)"
        stroke="#b8845a"
        strokeWidth={0.8}
      />

      {/* Tête */}
      <ellipse
        cx={120}
        cy={25}
        rx={18}
        ry={23}
        fill="url(#skinWomen)"
        stroke="#b8845a"
        strokeWidth={0.9}
        filter="url(#shadow)"
      />
      {/* Oreilles */}
      <ellipse cx={103} cy={28} rx={2.5} ry={4} fill="#e0b896" stroke="#b8845a" strokeWidth={0.6} />
      <ellipse cx={137} cy={28} rx={2.5} ry={4} fill="#e0b896" stroke="#b8845a" strokeWidth={0.6} />

      {/* Séparation jambes */}
      <path d="M 120 194 L 114 310" stroke="#b8845a" strokeWidth={0.7} strokeOpacity={0.45} fill="none" />
      <path d="M 120 194 L 126 310" stroke="#b8845a" strokeWidth={0.7} strokeOpacity={0.45} fill="none" />

      {/* Pieds */}
      <ellipse cx={113} cy={316} rx={8} ry={4} fill="#e0b896" stroke="#b8845a" strokeWidth={0.7} />
      <ellipse cx={127} cy={316} rx={8} ry={4} fill="#e0b896" stroke="#b8845a" strokeWidth={0.7} />

      {/* Label */}
      <text
        x="120"
        y="334"
        textAnchor="middle"
        fontFamily="Georgia, serif"
        fontSize={9}
        fill="#9a6040"
        letterSpacing={1.5}
      >
        FEMME
      </text>
    </g>
  );
}

// ─── Silhouette Homme ─────────────────────────────────────────────────────────

function MenBody() {
  return (
    <g id="men">
      {/* Bras gauche */}
      <path
        d="M 57 52 C 55 95 53 155 53 170 C 54 190 60 250 60 260
           C 61 268 79 268 78 260 C 78 250 84 190 84 170
           C 84 160 83 93 83 85 Z"
        fill="url(#skinMen)"
        stroke="#a07050"
        strokeWidth={0.8}
        strokeLinejoin="round"
      />
      <path d="M 54 166 Q 68 175 83 166" fill="none" stroke="#b07848" strokeWidth={0.6} strokeOpacity={0.5} />

      {/* Bras droit */}
      <path
        d="M 183 52 C 185 95 187 155 187 170 C 186 190 180 250 180 260
           C 179 268 161 268 162 260 C 162 250 156 190 156 170
           C 156 160 157 93 157 85 Z"
        fill="url(#skinMen)"
        stroke="#a07050"
        strokeWidth={0.8}
        strokeLinejoin="round"
      />
      <path d="M 157 166 Q 171 175 186 166" fill="none" stroke="#b07848" strokeWidth={0.6} strokeOpacity={0.5} />

      {/* Corps */}
      <path
        d="M 110 58 C 106 56 62 50 70 52 C 74 54 77 90 75 100
           C 73 112 77 142 81 150 C 83 160 80 172 82 180
           L 84 280 C 84 288 110 294 112 300 L 114 310 L 126 310
           L 128 300 C 130 294 156 288 156 280 L 158 180
           C 160 172 157 160 159 150 C 163 142 167 112 165 100
           C 163 90 166 54 170 52 C 178 50 134 56 130 58
           C 130 54 110 54 110 58 Z"
        fill="url(#skinMen)"
        stroke="#a07050"
        strokeWidth={1}
        strokeLinejoin="round"
        filter="url(#shadow)"
      />

      {/* Ligne centrale */}
      <line
        x1="120"
        y1="62"
        x2="120"
        y2="276"
        stroke="#b07848"
        strokeWidth={0.5}
        strokeOpacity={0.3}
        strokeDasharray="3,4"
      />

      {/* Cou */}
      <path
        d="M 112 46 C 112 52 110 54 110 58 L 130 58 C 130 54 128 52 128 46 Z"
        fill="url(#skinMen)"
        stroke="#a07050"
        strokeWidth={0.8}
      />

      {/* Tête */}
      <ellipse
        cx={120}
        cy={25}
        rx={18}
        ry={23}
        fill="url(#skinMen)"
        stroke="#a07050"
        strokeWidth={0.9}
        filter="url(#shadow)"
      />
      {/* Oreilles */}
      <ellipse cx={103} cy={28} rx={2.5} ry={4} fill="#d0a882" stroke="#a07050" strokeWidth={0.6} />
      <ellipse cx={137} cy={28} rx={2.5} ry={4} fill="#d0a882" stroke="#a07050" strokeWidth={0.6} />

      {/* Séparation jambes */}
      <path d="M 120 192 L 114 310" stroke="#a07050" strokeWidth={0.7} strokeOpacity={0.45} fill="none" />
      <path d="M 120 192 L 126 310" stroke="#a07050" strokeWidth={0.7} strokeOpacity={0.45} fill="none" />

      {/* Pieds */}
      <ellipse cx={113} cy={316} rx={8} ry={4} fill="#d0a882" stroke="#a07050" strokeWidth={0.7} />
      <ellipse cx={127} cy={316} rx={8} ry={4} fill="#d0a882" stroke="#a07050" strokeWidth={0.7} />

      {/* Label */}
      <text
        x="120"
        y="334"
        textAnchor="middle"
        fontFamily="Georgia, serif"
        fontSize={9}
        fill="#7a5030"
        letterSpacing={1.5}
      >
        HOMME
      </text>
    </g>
  );
}

// ─── Silhouette Enfant (bébé/tout-petit) ─────────────────────────────────────

function KidsBody() {
  return (
    <g id="kids">
      {/* ── Bras gauche (épais, coude visible) ── */}
      <path
        d="M 74 122 C 65 122 57 128 55 138 C 53 148 52 162 54 172
           C 55 178 53 184 51 194 C 49 204 50 214 53 220
           C 55 224 61 226 66 224 C 70 222 71 218 70 214
           C 68 208 67 202 68 194 C 70 186 73 180 73 172
           C 74 162 76 150 77 140 C 78 132 77 124 74 122 Z"
        fill="url(#skinKids)"
        stroke="#9a6040"
        strokeWidth={1.2}
        strokeLinejoin="round"
      />
      {/* Bosse coude gauche */}
      <path d="M 52 178 Q 48 186 52 194" fill="none" stroke="#9a6040" strokeWidth={1} strokeOpacity={0.4} />
      {/* Main gauche */}
      <ellipse cx={60} cy={228} rx={9} ry={7} fill="url(#skinKids)" stroke="#9a6040" strokeWidth={1.1} />
      <path d="M 53 224 C 51 220 50 215 53 213" fill="none" stroke="#9a6040" strokeWidth={0.8} />
      <path d="M 52 227 C 49 224 48 219 51 217" fill="none" stroke="#9a6040" strokeWidth={0.8} />

      {/* ── Bras droit (path SVG fourni, normalisé dans l'espace kids) ── */}
      <path
        d="M 26.8065 432.536
C 28.2842 434.697 33.7658 452.333 33.7658 452.333
C 33.7658 452.333 39.8432 457.092 41.9406 447.694
C 44.0458 438.296 40.0339 434.554 40.0339 434.554
L 44.0458 421.843
C 44.0458 421.843 44.0697 434.895 48.1134 435.857
C 52.1491 436.81 50.0597 422.137 53.4758 415.241
C 55.3825 411.372 54.2464 405.239 51.7598 400.425
C 69.8016 384.25 84.5305 325.008 84.5305 325.008
C 102.437 305.735 107.839 288.162 110.405 262.915
C 110.747 259.491 109.714 243.769 105.504 230.001
C 101.373 216.44 94.0637 204.81 94.4133 204.397
C 91.0766 206.661 78.4768 217.1 77.1501 246.375
C 59.0846 278.828 57.2971 308.643 57.2971 308.643
C 57.2971 308.643 41.6228 330.371 39.2315 362.744
C 38.9376 366.772 37.9843 381.779 35.0846 396.436
C 31.597 414.097 26.1312 431.543 26.8065 432.536
Z"
        fill="url(#skinKids)"
        stroke="#9a6040"
        strokeWidth={1.2}
        strokeLinejoin="round"
      />

      {/* ── Corps (torse + jambes) ── */}
      <path
        d="M 112 108 C 109 106 78 112 74 122 C 70 132 72 152 74 164
           C 76 174 76 184 74 194 C 72 202 72 210 76 218
           C 80 226 92 232 104 234 C 108 236 110 244 110 254
           C 110 262 108 272 107 280 C 106 286 105 292 107 298
           C 108 302 112 306 116 307 C 118 308 120 308 120 308
           C 120 308 122 308 124 307 C 128 306 132 302 133 298
           C 135 292 134 286 133 280 C 132 272 130 262 130 254
           C 130 244 132 236 136 234 C 148 232 160 226 164 218
           C 168 210 168 202 166 194 C 164 184 164 174 166 164
           C 168 152 170 132 166 122 C 162 112 131 106 128 108
           C 128 104 112 104 112 108 Z"
        fill="url(#skinKids)"
        stroke="#9a6040"
        strokeWidth={1.3}
        strokeLinejoin="round"
        filter="url(#shadow)"
      />
      {/* Pli entrejambe */}
      <path d="M 120 234 C 118 240 117 246 117 252" fill="none" stroke="#9a6040" strokeWidth={1} strokeOpacity={0.5} />

      {/* ── Cou (court, large) ── */}
      <path
        d="M 142.771 164.508
C 142.954 168.981 142.747 176.456 139.879 180.921
C 141.087 183.408 144.463 186.029 148.999 188.15
C 153.996 190.486 160.296 192.099 166.628 192.17
C 173.269 192.234 179.974 190.677 185.305 188.317
C 190.088 186.204 193.671 183.527 194.926 180.929
C 192.01 176.377 191.843 168.726 192.042 164.285
L 166.421 177.092
C 165.857 177.378 165.214 177.338 164.705 177.052
Z"
        fill="url(#skinKids)"
        stroke="#9a6040"
        strokeWidth={1.1}
        strokeLinejoin="round"
      />
      <path d="M 111 96 Q 120 99 129 96" fill="none" stroke="#9a6040" strokeWidth={0.7} strokeOpacity={0.35} />

      {/* ── Tête (grosse, ronde — proportions bébé) ── */}
      <path
        d="M 120.198 55.893
C 108.6 80.2854 114.857 102.817 114.876 102.882
C 115.151 103.92 114.564 104.995 113.562 105.282
C 113.176 105.392 112.786 105.37 112.436 105.241
C 112.415 105.233 104.786 102.277 110.679 115.288
C 118.122 131.733 123.386 132.927 123.402 132.931
C 124.152 133.128 124.681 133.766 124.798 134.509
C 128.333 151.607 136.565 163.402 146.592 169.909
C 152.774 173.919 159.645 175.925 166.513 175.925
C 173.381 175.925 180.252 173.919 186.434 169.909
C 196.478 163.392 204.722 151.567 208.245 134.421
C 208.4 133.669 208.952 133.111 209.626 132.932
C 209.639 132.924 214.903 131.733 222.348 115.288
C 228.238 102.277 220.613 105.236 220.59 105.244
C 219.61 105.602 218.532 105.068 218.188 104.051
C 218.044 103.628 218.049 103.188 218.174 102.793
C 218.581 101.249 224.022 79.4409 212.828 55.8938
C 209.116 48.0844 202.651 42.1627 194.775 38.1373
C 186.416 33.8656 176.474 31.7293 166.513 31.7293
C 156.55 31.7293 146.608 33.8656 138.25 38.1373
C 130.376 42.1619 123.912 48.0836 120.198 55.893
Z

M 110.575 100.811
C 109.249 93.52 107.202 74.4002 116.821 54.1658
C 120.925 45.5335 127.998 39.0246 136.585 34.6361
C 145.48 30.0899 156.007 27.8164 166.513 27.8164
C 177.017 27.8164 187.545 30.0899 196.441 34.6361
C 205.026 39.0246 212.099 45.5343 216.203 54.1658
C 225.823 74.4002 223.775 93.52 222.449 100.811
C 226.601 100.294 232.672 101.651 225.752 116.938
C 219.537 130.669 214.04 134.943 211.722 136.212
C 207.853 153.961 199.089 166.304 188.422 173.224
C 181.63 177.633 174.072 179.837 166.513 179.837
C 158.953 179.837 151.395 177.632 144.602 173.224
C 133.938 166.304 125.172 153.96 121.303 136.212
C 118.984 134.942 113.489 130.669 107.273 116.938
C 100.353 101.651 106.424 100.294 110.575 100.811
Z"
      />
      {/* Oreille gauche */}
      <ellipse cx={81} cy={50} rx={5} ry={7} fill="#fae2c8" stroke="#9a6040" strokeWidth={1} />
      {/* Oreille droite */}
      <ellipse cx={159} cy={50} rx={5} ry={7} fill="#fae2c8" stroke="#9a6040" strokeWidth={1} />

      {/* ── Pied gauche ── */}
      <path
        d="M 103 307 C 99 307 93 308 89 311 C 85 314 84 318 86 321
           C 88 324 96 326 106 326 C 112 326 116 324 117 321
           C 118 318 116 312 110 309 C 108 308 106 307 103 307 Z"
        fill="url(#skinKids)"
        stroke="#9a6040"
        strokeWidth={1.1}
        strokeLinejoin="round"
      />
      <path d="M 86 316 C 84 312 85 308 88 308" fill="none" stroke="#9a6040" strokeWidth={0.9} />
      <path d="M 87 320 C 84 317 84 312 86 311" fill="none" stroke="#9a6040" strokeWidth={0.9} />

      {/* ── Pied droit ── */}
      <path
        d="M 137 307 C 141 307 147 308 151 311 C 155 314 156 318 154 321
           C 152 324 144 326 134 326 C 128 326 124 324 123 321
           C 122 318 124 312 130 309 C 132 308 134 307 137 307 Z"
        fill="url(#skinKids)"
        stroke="#9a6040"
        strokeWidth={1.1}
        strokeLinejoin="round"
      />
      <path d="M 154 316 C 156 312 155 308 152 308" fill="none" stroke="#9a6040" strokeWidth={0.9} />
      <path d="M 153 320 C 156 317 156 312 154 311" fill="none" stroke="#9a6040" strokeWidth={0.9} />

      {/* Label */}
      <text
        x="120"
        y="338"
        textAnchor="middle"
        fontFamily="Georgia, serif"
        fontSize={9}
        fill="#7a5030"
        letterSpacing={1.5}
      >
        ENFANT
      </text>
    </g>
  );
}

// ─── Composant principal (usage isolé par catégorie) ─────────────────────────

interface SharedBodyDiagramProps {
  category: Category;
  /** Rendu de l'overlay de mesures. Reçoit les positions du corps. */
  renderOverlay?: (pos: BodyPositions) => ReactNode;
  /** Hauteur du viewBox (optionnel, calculée automatiquement sinon). */
  viewBoxHeight?: number;
  className?: string;
}

export function SharedBodyDiagram({ category, renderOverlay, viewBoxHeight, className }: SharedBodyDiagramProps) {
  const pos = getPositions(category);
  const vbHeight = viewBoxHeight ?? (category === "kids" ? 345 : 340);

  return (
    <svg
      viewBox={`0 0 240 ${vbHeight}`}
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ overflow: "visible" }}
    >
      <SharedDefs />
      {category === "women" && <WomenBody />}
      {category === "men" && <MenBody />}
      {category === "kids" && <KidsBody />}
      {renderOverlay?.(pos)}
    </svg>
  );
}

// ─── Vue combinée (les trois silhouettes côte à côte) ────────────────────────

export function AllBodiesDiagram({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 780 345" xmlns="http://www.w3.org/2000/svg" className={className} style={{ overflow: "visible" }}>
      <SharedDefs />

      {/* Femme — x offset +10 */}
      <g transform="translate(10, 2)">
        <WomenBody />
      </g>

      {/* Homme — x offset +280 */}
      <g transform="translate(280, 2)">
        <MenBody />
      </g>

      {/* Enfant — x offset +540 */}
      <g transform="translate(540, 0)">
        <KidsBody />
      </g>
    </svg>
  );
}

export { getPositions };
