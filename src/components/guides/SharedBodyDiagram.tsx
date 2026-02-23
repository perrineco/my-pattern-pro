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
        d="M 1753.28 1459.47
C 1755.14 1462.19 1762.04 1484.39 1762.04 1484.39
C 1762.04 1484.39 1769.69 1490.38 1772.33 1478.55
C 1774.98 1466.72 1769.93 1462.01 1769.93 1462.01
L 1774.98 1446.01
C 1774.98 1446.01 1775.01 1462.44 1780.1 1463.65
C 1785.18 1464.85 1782.55 1446.38 1786.85 1437.7
C 1789.25 1432.83 1787.82 1425.11 1784.69 1419.05
C 1807.4 1398.69 1825.94 1324.12 1825.94 1324.12
C 1848.48 1299.86 1855.28 1277.74 1858.51 1245.96
C 1858.94 1241.65 1857.64 1221.86 1852.34 1204.53
C 1847.14 1187.46 1837.94 1172.82 1838.38 1172.3
C 1834.18 1175.15 1818.32 1188.29 1816.65 1225.14
C 1793.91 1265.99 1791.66 1303.52 1791.66 1303.52
C 1791.66 1303.52 1771.93 1330.87 1768.92 1371.62
C 1768.55 1376.69 1767.35 1395.58 1763.7 1414.03
C 1759.31 1436.26 1752.43 1458.22 1753.28 1459.47
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
        d="M 111 102 C 111 96 112 92 112 88 L 128 88 C 128 92 129 96 129 102 Z"
        fill="url(#skinKids)"
        stroke="#9a6040"
        strokeWidth={1.1}
        strokeLinejoin="round"
      />
      <path d="M 111 96 Q 120 99 129 96" fill="none" stroke="#9a6040" strokeWidth={0.7} strokeOpacity={0.35} />

      {/* ── Tête (grosse, ronde — proportions bébé) ── */}
      <ellipse
        cx={120}
        cy={46}
        rx={40}
        ry={44}
        fill="url(#skinKids)"
        stroke="#9a6040"
        strokeWidth={1.3}
        filter="url(#shadow)"
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
