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
        d="M 116.161 101.917
C 116.711 102.244 119.675 104.191 121.835 109.311
C 122.977 112.018 123.906 115.633 124.142 120.396
C 131.191 133.145 132.409 144.897 132.563 146.765
C 133.656 148.224 139.953 157.167 140.257 170.033
C 140.344 173.802 140.466 176.555 140.586 178.563
C 140.703 180.549 140.816 181.775 140.893 182.543
L 140.976 183.429
C 141.123 183.669 141.177 183.857 141.184 183.882
C 141.198 183.924 145.994 198.663 145.476 200
C 145.08 201.02 142.537 208.363 142.53 208.384
C 142.471 208.554 142.362 208.691 142.23 208.785
C 141.914 209.018 138.641 211.3 137.526 206.314
C 136.798 203.061 137.684 201.167 138.219 200.377
L 137.78 198.986
C 137.453 200.377 136.877 201.669 135.861 201.909
C 134.754 202.171 134.216 201.414 133.928 200.106
C 133.772 199.394 133.691 198.482 133.604 197.496
C 133.454 195.817 133.284 193.904 132.699 192.723
C 132.235 191.784 132.118 190.623 132.256 189.419
C 132.379 188.363 132.7 187.257 133.155 186.243
C 125.92 179.058 120.108 156.831 119.5 154.446
C 115.754 150.385 113.238 146.414 111.519 142.119
C 109.782 137.784 108.866 133.135 108.318 127.743
C 107.587 120.536 112.061 109.738 114.089 104.843
C 114.589 103.634 115.436 103.499 115.168 103.189
C 114.875 102.849 114.903 102.326 115.232 102.02
C 115.494 101.778 115.869 101.747 116.159 101.92
L 116.159 101.917
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

      {/* ── Tête (grosse, ronde — proportions bébé) ── */}
      <path
        d="M 87.4716 59.5416
C 86.9084 56.4453 86.0391 48.3255 90.1241 39.7323
C 91.8671 36.0664 94.8707 33.3022 98.5175 31.4385
C 102.295 29.5078 106.766 28.5423 111.228 28.5423
C 115.688 28.5423 120.159 29.5078 123.937 31.4385
C 127.583 33.3022 130.587 36.0668 132.33 39.7323
C 136.415 48.3255 135.545 56.4453 134.983 59.5416
C 136.746 59.3221 139.324 59.8984 136.385 66.3904
C 133.746 72.2219 131.412 74.0367 130.427 74.5756
C 128.784 82.1133 125.061 87.355 120.532 90.2939
C 117.648 92.1665 114.438 93.102 111.228 93.102
C 108.016 93.102 104.807 92.1657 101.922 90.2939
C 97.3934 87.355 93.6708 82.1127 92.0278 74.5756
C 91.0428 74.0367 88.7091 72.2219 86.0693 66.3904
C 83.1305 59.8984 85.7088 59.3221 87.4716 59.5416
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
