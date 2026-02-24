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
        d="M 54.0921 209.081
C 54.0854 209.059 51.8006 201.712 51.2433 200.895
C 50.8886 200.376 51.4032 198.374 52.1555 195.444
C 52.8917 192.577 53.8755 188.745 54.6313 184.923
C 55.7679 179.171 56.1933 173.256 56.3465 171.116
L 56.3752 170.717
C 57.3226 157.879 63.1069 148.919 64.0665 147.51
C 64.2136 145.702 65.4171 133.913 72.4886 121.123
C 72.719 116.474 73.6093 112.92 74.7129 110.235
C 76.6319 105.568 79.2224 103.478 80.1691 102.836
C 80.4589 102.64 80.851 102.656 81.1259 102.9
C 81.4616 103.198 81.5011 103.722 81.214 104.07
C 80.9033 104.444 81.6887 104.007 81.9596 104.53
C 82.9528 106.446 84.8445 110.096 86.0842 114.156
C 86.8184 116.563 87.3293 119.104 87.6678 121.377
C 88.1668 124.738 88.2857 127.555 88.1936 128.469
C 87.6423 133.906 86.7811 138.523 85.09 142.831
C 83.4138 147.103 80.9286 151.054 77.1313 155.172
C 76.5233 157.555 70.7096 179.783 63.4768 186.969
C 63.9309 187.983 64.2521 189.089 64.3742 190.145
C 64.5132 191.349 64.3965 192.51 63.9319 193.449
C 63.3472 194.63 63.1765 196.542 63.0271 198.222
C 62.9393 199.208 62.858 200.12 62.7025 200.832
C 62.4144 202.14 61.8766 202.896 60.7693 202.635
C 59.7541 202.395 59.1778 201.103 58.8512 199.712
L 58.4116 201.103
C 58.9467 201.893 59.8327 203.787 59.105 207.04
C 57.9346 212.273 54.386 209.501 54.3775 209.493
C 54.247 209.394 54.1458 209.253 54.0921 209.081
Z"
        fill="url(#skinKids)"
        stroke="#9a6040"
        strokeWidth={1.2}
        strokeLinejoin="round"
      />

      {/* ── Bras droit (path SVG fourni, normalisé dans l'espace kids) ── */}
      <path
        d="M 142.292 102.643
C 142.842 102.97 145.806 104.917 147.966 110.037
C 149.108 112.744 150.037 116.359 150.273 121.122
C 157.322 133.871 158.54 145.623 158.694 147.491
C 159.787 148.95 166.084 157.893 166.388 170.759
C 166.475 174.528 166.597 177.281 166.717 179.289
C 166.834 181.275 166.947 182.501 167.024 183.269
L 167.107 184.155
C 167.254 184.395 167.308 184.583 167.315 184.608
C 167.329 184.65 172.125 199.389 171.607 200.726
C 171.211 201.746 168.668 209.089 168.661 209.11
C 168.602 209.28 168.493 209.417 168.361 209.511
C 168.045 209.744 164.772 212.026 163.657 207.04
C 162.929 203.787 163.815 201.893 164.35 201.103
L 163.911 199.712
C 163.584 201.103 163.008 202.395 161.992 202.635
C 160.885 202.897 160.347 202.14 160.059 200.832
C 159.903 200.12 159.822 199.208 159.735 198.222
C 159.585 196.543 159.415 194.63 158.83 193.449
C 158.366 192.51 158.249 191.349 158.387 190.145
C 158.51 189.089 158.831 187.983 159.286 186.969
C 152.051 179.784 146.239 157.557 145.631 155.172
C 141.885 151.111 139.369 147.14 137.65 142.845
C 135.913 138.51 134.997 133.861 134.449 128.469
C 133.718 121.262 138.192 110.464 140.22 105.569
C 140.72 104.36 141.567 104.225 141.299 103.915
C 141.006 103.575 141.034 103.052 141.363 102.746
C 141.625 102.504 142 102.473 142.29 102.646
L 142.29 102.643
Z"
        fill="url(#skinKids)"
        stroke="#9a6040"
        strokeWidth={1.2}
        strokeLinejoin="round"
      />

      {/* ── Corps enfant (torse + jambes) ── */}
      <path
        d="M 88.7082 97.0128
C 95.279 94.288 100.15 92.0959 100.567 91.8715
C 100.735 91.7717 100.938 91.7336 101.141 91.7804
L 111.32 93.7909
L 121.517 91.3776
C 121.695 91.3364 121.888 91.3578 122.062 91.4522
C 122.076 91.4601 127.07 94.1659 133.934 97.0128
C 140.649 99.7979 143.301 103.284 143.58 103.671
C 143.821 103.978 143.821 104.429 143.562 104.738
C 143.537 104.769 134.699 115.09 136.04 128.3
C 136.794 135.732 138.312 144.218 139.811 152.598
C 141.043 159.492 142.263 166.315 143.042 172.454
C 144.633 184.993 144.086 192.969 143.45 202.231
L 143.279 204.766
C 142.634 214.461 141.39 223.817 141.223 225.052
C 141.521 226.595 144.053 240.538 141.31 254.528
C 140.575 258.275 139.865 261.184 139.297 263.511
C 138.855 265.323 138.499 266.781 138.295 267.963
C 137.928 270.094 137.958 271.464 138.295 272.596
C 138.633 273.733 139.31 274.728 140.211 276.044
L 141.306 277.628
C 143.347 280.578 146.52 287.108 146.589 288.258
C 146.844 292.454 140.569 292.02 135.124 291.958
C 130.015 291.9 125.759 292.354 124.702 291.731
C 123.938 291.281 123.33 290.518 123.013 289.343
C 122.741 288.339 122.684 287.019 122.934 285.315
C 123.92 278.616 122.922 269.604 122.855 269.019
C 122.674 268.063 118.154 244.026 120.154 233.933
C 117.734 230.036 115.963 223.146 114.85 216.08
C 113.503 207.518 113.115 198.625 113.714 194.498
C 112.763 194.526 112.023 194.541 111.322 194.541
C 110.623 194.541 109.881 194.526 108.933 194.498
C 109.53 198.625 109.143 207.518 107.795 216.08
C 106.684 223.146 104.912 230.036 102.492 233.933
C 104.497 244.053 99.9464 268.198 99.7895 269.03
C 99.7126 269.758 98.8134 278.623 99.7927 285.265
C 100.161 287.77 100.228 289.459 97.6259 290.993
C 96.3099 291.751 92.4582 291.887 88.3275 291.835
C 82.2429 291.761 76.1592 291.324 77.9776 285.91
C 79.1115 282.481 81.6889 277.729 84.0149 274.91
C 84.8193 273.935 85.1692 273.246 85.1556 272.221
C 85.1408 271.059 84.7081 269.368 83.9644 266.479
C 83.6331 265.193 83.2475 263.597 82.8063 261.612
C 82.3775 259.683 81.8886 257.351 81.336 254.529
C 78.5933 240.538 81.125 226.595 81.4219 225.052
C 81.2554 223.817 80.0124 214.461 79.3676 204.767
L 79.1956 202.232
C 78.5606 192.97 78.0127 184.993 79.6035 172.455
C 80.3832 166.316 81.6025 159.493 82.8352 152.599
C 84.3343 144.218 85.8517 135.733 86.6055 128.301
C 87.9475 115.086 79.3602 105.025 79.3359 104.996
C 79.113 104.731 79.0694 104.338 79.2539 104.023
C 79.2597 104.011 81.5728 99.9732 88.7102 97.0128
Z"
        fill="url(#skinKids)"
        stroke="#9a6040"
        strokeWidth={1.3}
        strokeLinejoin="round"
        filter="url(#shadow)"
      />

      {/* ── Cou (court, large) ── */}
      <path
        d="M 100.238 85.1274
C 100.238 85.1274 100.972 91.0621 99.0113 93.4365
C 99.778 96.1392 105.477 99.1043 111.269 99.1653
C 117.278 99.2287 123.389 96.2866 124.2 93.4365
C 122.237 91.0621 122.972 85.1274 122.972 85.1274
L 110.842 91.1913
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
