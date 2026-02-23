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
        d="M 87.8604 108.601
C 87.8604 108.601 81.4651 111.548 72.7745 115.152
C 64.0827 118.756 61.3306 123.563 61.3306 123.563
C 61.3306 123.563 72.4847 136.63 70.7475 153.752
C 69.0087 170.875 64.0832 192.353 61.9107 209.475
C 59.7378 226.597 60.7519 236.96 61.6213 250.028
C 62.4895 263.095 64.2279 275.711 64.2279 275.711
C 64.2279 275.711 60.4625 294.185 64.0827 312.659
C 65.4546 319.656 66.5473 324.412 67.3857 327.669
C 69.3018 335.102 69.6136 336.377 67.24 339.252
C 64.3785 342.721 60.2723 351.457 59.8153 352.787
C 57.8432 358.532 68.2888 357.933 73.5952 358.205
C 76.5371 358.355 81.0987 358.451 83.6145 356.934
C 85.2381 355.954 85.6931 354.136 85.3769 351.79
C 84.1816 342.913 85.3769 330.982 85.3769 330.982
C 85.3769 330.982 91.4609 299.141 88.7093 286.675
C 95.8064 275.861 98.5594 243.569 96.676 236.06
C 100.205 236.181 101.639 236.181 105.168 236.06
C 103.285 243.569 106.037 275.861 113.135 286.675
C 110.382 299.141 116.467 330.982 116.467 330.982
C 116.467 330.982 117.87 342.991 116.567 351.853
C 116.292 353.717 116.642 355.942 117.514 356.934
C 120.127 359.908 127.104 358.649 133.352 358.189
C 139.149 357.761 144.616 359.08 144.399 355.471
C 144.317 354.114 139.38 344.761 136.54 340.61
C 134.157 337.13 132.96 335.356 133.95 329.626
C 134.541 326.196 136.135 320.947 137.761 312.658
C 141.382 294.185 137.616 275.711 137.616 275.711
C 137.616 275.711 139.353 263.095 140.223 250.028
C 141.093 236.96 142.106 226.596 139.933 209.475
C 137.761 192.352 132.836 170.874 131.097 153.751
C 129.359 136.63 140.826 123.238 140.826 123.238
C 140.826 123.238 137.761 118.756 129.069 115.152
C 120.377 111.547 114.003 108.092 114.003 108.092
L 100.921 111.188
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
        d="M 75.9939 42.8563
C 69.7812 55.9226 73.1329 67.9921 73.1431 68.027
C 73.2904 68.583 72.9759 69.1588 72.4392 69.3126
C 72.2325 69.3715 72.0235 69.3597 71.8361 69.2906
C 71.8248 69.2863 67.7381 67.7029 70.8949 74.6725
C 74.8819 83.4817 77.7017 84.121 77.7099 84.1231
C 78.1121 84.2289 78.3953 84.5705 78.4578 84.9685
C 80.3515 94.1278 84.761 100.446 90.1322 103.931
C 93.4439 106.079 97.1248 107.154 100.804 107.154
C 104.482 107.154 108.163 106.079 111.474 103.931
C 116.855 100.441 121.271 94.1058 123.158 84.9218
C 123.242 84.519 123.537 84.22 123.898 84.1237
C 123.905 84.1196 126.725 83.4817 130.713 74.6725
C 133.868 67.7029 129.783 69.2879 129.771 69.2922
C 129.246 69.484 128.668 69.1979 128.484 68.6532
C 128.407 68.4265 128.41 68.1908 128.476 67.9793
C 128.695 67.1522 131.609 55.4702 125.613 42.8567
C 123.625 38.6734 120.161 35.5013 115.943 33.345
C 111.464 31.0568 106.139 29.9124 100.803 29.9124
C 95.4664 29.9124 90.1407 31.0568 85.6638 33.345
C 81.4454 35.5009 77.9831 38.673 75.9935 42.8563
Z

M 70.8392 66.9175
C 70.1288 63.0119 69.0323 52.77 74.1849 41.931
C 76.3834 37.307 80.1721 33.8203 84.772 31.4695
C 89.5369 29.0342 95.1761 27.8164 100.804 27.8164
C 106.43 27.8164 112.07 29.0342 116.835 31.4695
C 121.434 33.8203 125.223 37.3074 127.421 41.931
C 132.574 52.77 131.477 63.0119 130.767 66.9175
C 132.991 66.6406 136.243 67.3675 132.536 75.5563
C 129.207 82.9119 126.263 85.2009 125.021 85.8807
C 122.948 95.3884 118.253 102 112.54 105.707
C 108.902 108.069 104.853 109.249 100.804 109.249
C 96.7536 109.249 92.705 108.068 89.0667 105.707
C 83.354 102 78.6585 95.3877 76.5861 85.8807
C 75.3437 85.2009 72.4001 82.9119 69.0703 75.5563
C 65.3635 67.3676 68.6156 66.6406 70.8392 66.9175
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
