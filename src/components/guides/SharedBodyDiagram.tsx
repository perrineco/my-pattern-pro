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
        d="M 27.9613 208.355
C 27.9546 208.333 25.6698 200.986 25.1125 200.169
C 24.7578 199.65 25.2724 197.648 26.0247 194.718
C 26.7609 191.851 27.7447 188.019 28.5005 184.197
C 29.6371 178.445 30.0625 172.53 30.2157 170.39
L 30.2444 169.991
C 31.1918 157.153 36.9761 148.193 37.9357 146.784
C 38.0828 144.976 39.2863 133.187 46.3578 120.397
C 46.5882 115.748 47.4785 112.194 48.5821 109.509
C 50.5011 104.842 53.0916 102.752 54.0383 102.11
C 54.3281 101.914 54.7202 101.93 54.9951 102.174
C 55.3308 102.472 55.3703 102.996 55.0832 103.344
C 54.7725 103.718 55.5579 103.281 55.8288 103.804
C 56.822 105.72 58.7137 109.37 59.9534 113.43
C 60.6876 115.837 61.1985 118.378 61.537 120.651
C 62.036 124.012 62.1549 126.829 62.0628 127.743
C 61.5115 133.18 60.6503 137.797 58.9592 142.105
C 57.283 146.377 54.7978 150.328 51.0005 154.446
C 50.3925 156.829 44.5788 179.057 37.346 186.243
C 37.8001 187.257 38.1213 188.363 38.2434 189.419
C 38.3824 190.623 38.2657 191.784 37.8011 192.723
C 37.2164 193.904 37.0457 195.816 36.8963 197.496
C 36.8085 198.482 36.7272 199.394 36.5717 200.106
C 36.2836 201.414 35.7458 202.17 34.6385 201.909
C 33.6233 201.669 33.047 200.377 32.7204 198.986
L 32.2808 200.377
C 32.8159 201.167 33.7019 203.061 32.9742 206.314
C 31.8038 211.547 28.2552 208.775 28.2467 208.767
C 28.1162 208.668 28.015 208.527 27.9613 208.355
Z"
        fill="url(#skinKids)"
        stroke="#9a6040"
        strokeWidth={1.2}
        strokeLinejoin="round"
      />

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

      {/* ── Corps enfant (torse + jambes) ── */}
      <path
        d="M 62.5774 96.2869
C 69.1482 93.5621 74.0194 91.37 74.4363 91.1456
C 74.6041 91.0458 74.8069 91.0077 75.0107 91.0545
L 85.1897 93.065
L 95.3866 90.6517
C 95.5642 90.6105 95.7577 90.6319 95.9313 90.7263
C 95.9456 90.7342 100.939 93.44 107.803 96.2869
C 114.518 99.072 117.17 102.558 117.449 102.945
C 117.69 103.252 117.69 103.703 117.431 104.012
C 117.406 104.043 108.568 114.364 109.909 127.574
C 110.663 135.006 112.181 143.492 113.68 151.872
C 114.912 158.766 116.132 165.589 116.911 171.728
C 118.502 184.267 117.955 192.243 117.319 201.505
L 117.148 204.04
C 116.503 213.735 115.259 223.091 115.092 224.326
C 115.39 225.869 117.922 239.812 115.179 253.802
C 114.444 257.549 113.734 260.458 113.166 262.785
C 112.724 264.597 112.368 266.055 112.164 267.237
C 111.797 269.368 111.827 270.738 112.164 271.87
C 112.502 273.007 113.179 274.002 114.08 275.318
L 115.175 276.902
C 117.216 279.852 120.389 286.382 120.458 287.532
C 120.713 291.728 114.438 291.294 108.993 291.232
C 103.884 291.174 99.6281 291.628 98.5713 291.005
C 97.8071 290.555 97.199 289.792 96.8819 288.617
C 96.6099 287.613 96.5529 286.293 96.8034 284.589
C 97.7896 277.89 96.7915 268.878 96.7241 268.293
C 96.5433 267.337 92.0228 243.3 94.023 233.207
C 91.6034 229.31 89.8323 222.42 88.7192 215.354
C 87.3723 206.792 86.9846 197.899 87.5831 193.772
C 86.6326 193.8 85.8921 193.815 85.1913 193.815
C 84.492 193.815 83.7506 193.8 82.8018 193.772
C 83.3991 197.899 83.0122 206.792 81.6645 215.354
C 80.5528 222.42 78.7812 229.31 76.3616 233.207
C 78.3665 243.327 73.8156 267.472 73.6587 268.304
C 73.5818 269.032 72.6826 277.897 73.6619 284.539
C 74.0303 287.044 74.0973 288.733 71.4951 290.267
C 70.1791 291.025 66.3274 291.161 62.1967 291.109
C 56.1121 291.035 50.0284 290.598 51.8468 285.184
C 52.9807 281.755 55.5581 277.003 57.8841 274.184
C 58.6885 273.209 59.0384 272.52 59.0248 271.495
C 59.01 270.333 58.5773 268.642 57.8336 265.753
C 57.5023 264.467 57.1167 262.871 56.6755 260.886
C 56.2467 258.957 55.7578 256.625 55.2052 253.803
C 52.4625 239.812 54.9942 225.869 55.2911 224.326
C 55.1246 223.091 53.8816 213.735 53.2368 204.041
L 53.0648 201.506
C 52.4298 192.244 51.8819 184.267 53.4727 171.729
C 54.2524 165.59 55.4717 158.767 56.7044 151.873
C 58.2035 143.492 59.7209 135.007 60.4747 127.575
C 61.8167 114.36 53.2294 104.299 53.2051 104.27
C 52.9822 104.005 52.9386 103.612 53.1231 103.297
C 53.1289 103.285 55.442 99.2473 62.5794 96.2869
Z"
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
        d="M 74.1072 84.4015
C 74.1072 84.4015 74.8417 90.3362 72.8805 92.7106
C 73.6472 95.4133 79.3458 98.3784 85.1381 98.4394
C 91.1475 98.5028 97.2584 95.5607 98.0687 92.7106
C 96.1065 90.3362 96.8414 84.4015 96.8414 84.4015
L 84.7116 90.4654
Z"
        fill="url(#skinKids)"
        stroke="#9a6040"
        strokeWidth={1.1}
        strokeLinejoin="round"
      />
      <path d="M 111 96 Q 120 99 129 96" fill="none" stroke="#9a6040" strokeWidth={0.7} strokeOpacity={0.35} />

      {/* ── Tête (grosse, ronde — proportions bébé) ── */}
      <path
        d="M 61.3408 58.8157
C 60.7776 55.7194 59.9083 47.5996 63.9933 39.0064
C 65.7363 35.3405 68.7399 32.5763 72.3867 30.7126
C 76.1643 28.7819 80.6351 27.8164 85.0969 27.8164
C 89.5572 27.8164 94.0286 28.7819 97.8062 30.7126
C 101.452 32.5763 104.456 35.3409 106.199 39.0064
C 110.284 47.5996 109.414 55.7194 108.852 58.8157
C 110.615 58.5962 113.193 59.1725 110.254 65.6645
C 107.615 71.496 105.281 73.3108 104.296 73.8497
C 102.653 81.3874 98.9304 86.6291 94.4012 89.568
C 91.517 91.4406 88.3069 92.3761 85.0969 92.3761
C 81.8857 92.3761 78.676 91.4398 75.7916 89.568
C 71.2626 86.6291 67.54 81.3868 65.897 73.8497
C 64.912 73.3108 62.5783 71.496 59.9385 65.6645
C 56.9997 59.1725 59.578 58.5962 61.3408 58.8157
Z"
        fill="url(#skinKids)"
        stroke="#9a6040"
        strokeWidth={1.2}
        strokeLinejoin="round"
      />

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
