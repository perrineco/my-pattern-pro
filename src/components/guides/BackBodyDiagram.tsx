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
      <line
        x1={cx}
        y1="62"
        x2={cx}
        y2="276"
        stroke="#c49070"
        strokeWidth={0.5}
        strokeOpacity={0.3}
        strokeDasharray="3,4"
      />

      {/* Bras gauche */}
      <path
        d={`M 436.703 769.504
C 435.877 769.771 433.389 770.288 431.4 770.797
C 429.965 771.164 428.724 771.633 427.742 772.424
C 421.232 777.674 423.796 791.339 422.24 799.197
C 420.394 808.523 419.223 819.299 419.193 820.215
C 419.109 822.817 414.991 827.105 415.385 837.783
C 415.728 847.09 414.889 854.282 414.764 859.742
C 414.708 862.164 414.705 861.951 412.721 864.627
C 411.462 867.242 410.144 870.271 408.744 873.201
C 408.522 873.667 408.297 874.068 408.273 874.564
L 408.393 875.395
C 408.517 875.831 408.674 876.218 408.824 876.576
L 408.816 876.584
L 409.037 877.088
L 409.043 877.104
L 411.787 883.385
C 411.787 883.385 413.002 882.35 412.176 880.098
C 411.507 878.272 411.023 876.579 410.602 875.201
C 410.618 875.181 410.682 875.108 410.691 875.096
C 412.344 872.625 415.013 870.026 416.746 870.916
C 418.627 871.882 416.628 875.329 416.592 876.965
C 416.511 880.61 417.997 878.162 418.979 875.434
C 419.593 873.724 420.736 872.535 420.803 872.457
C 423.284 869.595 420.036 865.887 420.609 862.682
L 427.385 824.809
L 435.145 790.024
Z

M 408.393 875.395
C 408.327 875.164 408.277 874.949 408.264 874.779
C 408.258 874.703 408.27 874.636 408.274 874.564
L 408.268 874.523
C 407.074 876.862 405.114 880.112 403.785 881.836
C 403.785 881.836 404.451 882.031 405.227 881.625
C 405.867 881.29 407.485 879.161 408.707 877.586
Z`}
        fill="url(#skinWomenBack)"
        stroke="#b8845a"
        strokeWidth={0.8}
        strokeLinejoin="round"
      />

      {/* Bras droit */}
      <path
        d={`M 467.805 769.504
L 469.363 790.023
L 477.123 824.809
L 483.898 862.682
C 484.472 865.887 481.224 869.595 483.705 872.457
C 483.772 872.534 484.914 873.724 485.529 875.434
C 486.511 878.162 487.998 880.61 487.918 876.965
C 487.882 875.329 485.881 871.882 487.762 870.916
C 489.495 870.026 492.165 872.624 493.818 875.096
C 493.833 875.114 493.925 875.22 493.957 875.258
C 493.525 876.632 492.968 878.364 492.332 880.098
C 491.507 882.35 492.721 883.385 492.721 883.385
L 495.465 877.102
L 495.467 877.104
C 495.475 877.087 495.5 877.023 495.51 877.002
L 495.691 876.584
L 495.685 876.576
C 495.915 876.028 496.205 875.27 496.244 874.779
C 496.292 874.175 496.018 873.734 495.764 873.201
C 494.363 870.271 493.045 867.241 491.787 864.627
C 489.803 861.951 489.8 862.164 489.744 859.742
C 489.619 854.282 488.78 847.09 489.123 837.783
C 489.516 827.105 485.401 822.816 485.316 820.215
C 485.287 819.299 484.114 808.523 482.268 799.197
C 480.712 791.339 483.275 777.673 476.766 772.424
C 475.784 771.633 474.541 771.164 473.105 770.797
C 471.116 770.288 468.631 769.771 467.805 769.504
Z

M 496.723 875.152
C 496.427 876.066 495.986 877.143 495.801 877.586
C 497.024 879.161 498.642 881.29 499.283 881.625
C 500.059 882.031 500.723 881.836 500.723 881.836
C 499.394 880.112 497.916 877.491 496.723 875.152
Z

M 495.377 877.807
C 495.374 878.072 495.308 878.326 495.297 878.486
C 495.167 880.319 494.655 886.204 496.516 886.025
L 497.407 879.807`}
        fill="url(#skinWomenBack)"
        stroke="#b8845a"
        strokeWidth={0.8}
        strokeLinejoin="round"
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
        fill="url(#skinWomenBack)"
        stroke="#b8845a"
        strokeWidth={1}
        strokeLinejoin="round"
        filter="url(#shadowBack)"
      />

      {/* Cou */}
      <path
        d={`M 457.728 753.011
C 457.728 753.011 456.848 762.746 458.784 765.137
C 459.646 766.203 462.956 767.472 466.36 768.552
C 469.53 780.74 457.518 788.539 450.185 785.085
C 435.39 778.116 432.583 777.463 436.41 768.611
C 439.879 767.519 443.297 766.223 444.176 765.137
C 446.111 762.746 445.231 753.011 445.231 753.011
L 448.684 752.415
L 453.443 752.372
Z`}
        fill="url(#skinWomenBack)"
        stroke="#b8845a"
        strokeWidth={0.8}
      />

      {/* corps */}
      <path
        d={`M 464.492 767.934
C 469.192 769.558 474.963 771.425 474.963 771.425
C 473.875 777.021 467.526 820.319 468.459 821.888
C 470.117 824.673 476.722 832.257 477.916 843.855
C 474.19 859.519 461.824 858.73 453.152 858.73
L 451.968 858.73
L 450.784 858.73
C 443.733 858.73 431.302 855.655 426.019 843.855
C 427.214 832.257 433.819 824.673 435.476 821.888
C 436.218 820.641 430.197 776.618 429.185 771.41
C 429.185 771.41 434.863 769.24 439.562 767.616
C 441.104 772.412 462.671 771.363 464.492 767.934
Z`}
        fill="url(#skinWomenBack)"
        stroke="#b8845a"
        strokeWidth={0.8}
      />

      {/* jambe gauche */}
      <path
        d={`M 475.237 839.066
C 475.237 839.066 483.057 847.404 478.91 873.745
C 474.763 900.086 468.781 920.367 468.781 920.367
C 468.781 920.367 474.895 933.032 471.63 954.597
C 471.573 954.974 460.561 998.589 463.242 1001.29
C 465.226 1003.29 469.31 1007.41 469.149 1009.4
C 468.987 1011.4 459.317 1010.9 457.492 1010.75
C 455.666 1010.6 453.244 1011.99 454.101 1005.29
C 455.995 990.462 454.749 971.653 454.773 953.716
C 454.788 942.351 456.196 931.337 456.417 921.908
C 456.417 921.908 452.732 901.624 451.884 882.359
C 451.238 867.701 453.074 853.681 454.515 849.354
C 457.848 839.342 475.237 839.066 475.237 839.066
Z`}
        fill="url(#skinWomenBack)"
        stroke="#b8845a"
        strokeWidth={0.8}
      />
      {/* jambe droite */}
      <path
        d={`M 428.811 839.066
C 428.811 839.066 420.959 847.404 425.003 873.745
C 429.048 900.086 434.951 920.367 434.951 920.367
C 434.951 920.367 428.788 933.032 431.97 954.597
C 432.025 954.974 442.867 998.589 440.176 1001.29
C 438.185 1003.29 434.084 1007.41 434.238 1009.4
C 434.392 1011.4 444.064 1010.9 445.89 1010.75
C 447.715 1010.6 450.133 1011.99 449.302 1005.29
C 447.465 990.462 448.784 971.653 448.829 953.716
C 448.858 942.351 447.493 931.337 447.309 921.908
C 447.309 921.908 451.073 901.624 451.996 882.359
C 452.698 867.701 450.917 853.681 449.493 849.354
C 446.199 839.342 428.811 839.066 428.811 839.066
Z`}
        fill="url(#skinWomenBack)"
        stroke="#b8845a"
        strokeWidth={0.8}
      />

      {/* Cheveux (vue arrière) */}
      <path
        d="M 442.256 785.731
C 445.284 791.481 440.49 794.648 440.49 794.648
C 440.49 794.648 443.686 794.065 445.116 790.565
C 446.714 794.064 440.541 801.031 440.541 801.031
C 440.541 801.031 448.078 801.792 451.845 795.315
C 454.936 799.216 460.268 796.454 459.154 796.243
C 458.531 796.125 457.25 795.878 455.809 793.899
C 455.303 793.204 453.627 788.932 456.093 783.562
C 459.71 775.687 458.676 763.671 453.794 760.149
C 451.571 758.546 449.933 758.749 448.266 760.695
C 444.587 764.992 437.917 777.491 442.256 785.731
Z

M 461.436 730.781
C 461.436 730.781 467.522 733.073 466.929 741.382
C 466.335 749.691 463.868 751.406 456.881 756.831
C 455.205 758.132 452.599 759.744 450.996 760.526
C 448.913 761.543 447.594 758.07 444.752 756.213
C 441.975 754.398 434.253 752.14 435.166 742.561
C 436.098 732.779 449.741 715.951 461.436 730.781
Z"
        fill="url(#skinWomenBack)"
        stroke="#b8845a"
        strokeWidth={0.8}
      />

      {/* Indication nuque */}
      <circle cx={cx} cy="53" r="2.5" fill="#c49070" fillOpacity={0.6} />

      {/* Omoplates */}
      <path d="M 100 82 C 105 78, 113 82, 111 90" fill="none" stroke="#c49070" strokeWidth={0.6} strokeOpacity={0.4} />
      <path d="M 140 82 C 135 78, 127 82, 129 90" fill="none" stroke="#c49070" strokeWidth={0.6} strokeOpacity={0.4} />

      {/* Label */}
      <text
        x={cx}
        y="334"
        textAnchor="middle"
        fontFamily="Georgia, serif"
        fontSize={9}
        fill="#9a6040"
        letterSpacing={1.5}
      >
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
      <line
        x1={cx}
        y1="58"
        x2={cx}
        y2="276"
        stroke="#b8945a"
        strokeWidth={0.5}
        strokeOpacity={0.3}
        strokeDasharray="3,4"
      />

      {/* Bras gauche */}
      <path
        d={`M 70 54 C 62 62, 55 95, 52 130 C 50 160, 52 190, 55 220 C 57 240, 58 255, 60 262
            C 61 266, 63 267, 65 264 C 67 261, 66 255, 65 248
            L 62 215 C 60 190, 59 160, 60 130 C 62 100, 66 75, 73 62`}
        fill="url(#skinMenBack)"
        stroke="#b8845a"
        strokeWidth={0.8}
        strokeLinejoin="round"
      />

      {/* Bras droit */}
      <path
        d={`M 170 54 C 178 62, 185 95, 188 130 C 190 160, 188 190, 185 220 C 183 240, 182 255, 180 262
            C 179 266, 177 267, 175 264 C 173 261, 174 255, 175 248
            L 178 215 C 180 190, 181 160, 180 130 C 178 100, 174 75, 167 62`}
        fill="url(#skinMenBack)"
        stroke="#b8845a"
        strokeWidth={0.8}
        strokeLinejoin="round"
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
        fill="url(#skinMenBack)"
        stroke="#b8845a"
        strokeWidth={1}
        strokeLinejoin="round"
        filter="url(#shadowBack)"
      />

      {/* Cou (plus épais que femme) */}
      <path
        d={`M 108 45 L 108 55 C 108 60, 113 63, ${cx} 63 C 127 63, 132 60, 132 55 L 132 45`}
        fill="url(#skinMenBack)"
        stroke="#b8845a"
        strokeWidth={0.8}
      />

      {/* Tête */}
      <ellipse cx={cx} cy="32" rx="19" ry="21" fill="url(#skinMenBack)" stroke="#b8845a" strokeWidth={0.8} />

      {/* Oreilles */}
      <path
        d="M 100 29 C 97 27, 95 30, 95 34 C 95 38, 97 41, 100 39"
        fill="url(#skinMenBack)"
        stroke="#b8845a"
        strokeWidth={0.8}
      />
      <path
        d="M 140 29 C 143 27, 145 30, 145 34 C 145 38, 143 41, 140 39"
        fill="url(#skinMenBack)"
        stroke="#b8845a"
        strokeWidth={0.8}
      />

      {/* Cheveux courts (vue arrière) */}
      <path
        d={`M 101 26 C 101 10, 139 10, 139 26 C 139 32, 137 36, 135 38
            L 105 38 C 103 36, 101 32, 101 26 Z`}
        fill="#3a2a1a"
        stroke="#2a1a0a"
        strokeWidth={0.6}
      />

      {/* Nuque */}
      <circle cx={cx} cy="50" r="2.5" fill="#b8945a" fillOpacity={0.6} />

      {/* Omoplates (plus marquées) */}
      <path d="M 95 78 C 102 72, 112 78, 108 88" fill="none" stroke="#b8945a" strokeWidth={0.7} strokeOpacity={0.4} />
      <path d="M 145 78 C 138 72, 128 78, 132 88" fill="none" stroke="#b8945a" strokeWidth={0.7} strokeOpacity={0.4} />

      {/* Label */}
      <text
        x={cx}
        y="334"
        textAnchor="middle"
        fontFamily="Georgia, serif"
        fontSize={9}
        fill="#8a6040"
        letterSpacing={1.5}
      >
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
      <line
        x1={cx}
        y1="110"
        x2={cx}
        y2="290"
        stroke="#b89470"
        strokeWidth={0.4}
        strokeOpacity={0.3}
        strokeDasharray="3,4"
      />

      {/* Bras gauche */}
      <path
        d={`M 75 117 C 70 125, 66 145, 65 165 C 64 185, 66 200, 68 218
            C 69 222, 71 223, 73 220 C 74 217, 73 212, 72 208
            L 70 185 C 69 170, 70 150, 72 135 C 74 125, 77 118, 79 115`}
        fill="url(#skinKidsBack)"
        stroke="#9a6040"
        strokeWidth={0.8}
        strokeLinejoin="round"
      />

      {/* Bras droit */}
      <path
        d={`M 165 117 C 170 125, 174 145, 175 165 C 176 185, 174 200, 172 218
            C 171 222, 169 223, 167 220 C 166 217, 167 212, 168 208
            L 170 185 C 171 170, 170 150, 168 135 C 166 125, 163 118, 161 115`}
        fill="url(#skinKidsBack)"
        stroke="#9a6040"
        strokeWidth={0.8}
        strokeLinejoin="round"
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
        fill="url(#skinKidsBack)"
        stroke="#9a6040"
        strokeWidth={1}
        strokeLinejoin="round"
        filter="url(#shadowBack)"
      />

      {/* Cou */}
      <path
        d={`M 112 100 L 112 110 C 112 114, 116 116, ${cx} 116 C 124 116, 128 114, 128 110 L 128 100`}
        fill="url(#skinKidsBack)"
        stroke="#9a6040"
        strokeWidth={0.8}
      />

      {/* Tête */}
      <ellipse cx={cx} cy="82" rx="20" ry="24" fill="url(#skinKidsBack)" stroke="#9a6040" strokeWidth={0.8} />

      {/* Oreilles */}
      <path
        d="M 99 80 C 96 78, 94 80, 94 84 C 94 88, 96 90, 99 88"
        fill="url(#skinKidsBack)"
        stroke="#9a6040"
        strokeWidth={0.8}
      />
      <path
        d="M 141 80 C 144 78, 146 80, 146 84 C 146 88, 144 90, 141 88"
        fill="url(#skinKidsBack)"
        stroke="#9a6040"
        strokeWidth={0.8}
      />

      {/* Cheveux (vue arrière) */}
      <path
        d={`M 100 75 C 100 55, 140 55, 140 75 C 140 85, 137 92, 133 96
            L 107 96 C 103 92, 100 85, 100 75 Z`}
        fill="#5a3e2a"
        stroke="#4a2e1a"
        strokeWidth={0.6}
      />

      {/* Nuque */}
      <circle cx={cx} cy="105" r="2" fill="#9a6040" fillOpacity={0.5} />

      {/* Label */}
      <text
        x={cx}
        y="320"
        textAnchor="middle"
        fontFamily="Georgia, serif"
        fontSize={9}
        fill="#7a5030"
        letterSpacing={1.5}
      >
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
