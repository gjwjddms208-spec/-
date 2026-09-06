import React from 'react';

interface Props {
  isRestored?: boolean;
  highlightCenter?: boolean;
  highlightChords?: boolean;
}

/**
 * 삼국시대 연화문 수막새 (Lotus Pattern Roof-End Tile)
 * 실제 경주/부여 출토 고대 기와 유물의 질감과 문양을 고증하여
 * 깨진 유물 조각(Broken Artifact)과 복원된 완전체(Restored Artifact)를 렌더링합니다.
 */
export const TraditionalTileGraphic: React.FC<Props> = ({
  isRestored = false,
}) => {
  const cx = 250;
  const cy = 250;
  const r = 170;

  // 8개의 연꽃잎 (Lotus Petals) 각도
  const petalAngles = [0, 45, 90, 135, 180, 225, 270, 315];

  return (
    <g className="select-none pointer-events-none">
      {/* 1. 배경 그림자 */}
      <circle
        cx={cx}
        cy={cy + 6}
        r={r}
        fill="rgba(20, 18, 16, 0.25)"
        filter="blur(8px)"
      />

      {/* 2. 유실된(깨진) 영역의 안내 가이드 원 (복원 전에는 점선, 복원 후에는 황금빛 복원 원) */}
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill={isRestored ? '#433f3b' : 'none'}
        stroke={isRestored ? '#c49a45' : '#8c857b'}
        strokeWidth={isRestored ? 3 : 1.5}
        strokeDasharray={isRestored ? 'none' : '5 5'}
        opacity={isRestored ? 0.95 : 0.4}
        className={isRestored ? 'transition-all duration-1000' : ''}
      />

      {/* 복원 시 유실되었던 영역에 채워지는 고대 기와 텍스처 */}
      {isRestored && (
        <g className="transition-opacity duration-1000 opacity-90">
          <circle cx={cx} cy={cy} r={r - 18} fill="#4f4b46" />
          <circle cx={cx} cy={cy} r={r - 35} fill="#58544e" />
          {/* 복원된 연꽃잎 8장 */}
          {petalAngles.map((deg, idx) => {
            const rad = (deg * Math.PI) / 180;
            const px = cx + Math.cos(rad) * 75;
            const py = cy + Math.sin(rad) * 75;
            return (
              <ellipse
                key={'restored-petal-' + idx}
                cx={px}
                cy={py}
                rx={24}
                ry={14}
                transform={`rotate(${deg}, ${px}, ${py})`}
                fill="#6e6860"
                stroke="#c49a45"
                strokeWidth={1}
                opacity={0.8}
              />
            );
          })}
        </g>
      )}

      {/* 3. 실제 남아있는 깨진 수막새 조각 (고대 삼국시대 연화문 수막새 본체) */}
      {/* 상단 및 우측 원호(약 120~150도)가 온전히 남아있고 하단이 깨져나간 형태 */}
      <clipPath id="brokenTileClip">
        {/* 상단 원호와 깨진 울퉁불퉁한 단면 패스 */}
        <path d="M 125,200 C 130,220 160,210 190,235 C 220,260 250,230 280,240 C 310,250 330,225 360,245 C 380,255 405,220 415,200 L 420,180 A 170 170 0 0 0 85,210 Z" />
      </clipPath>

      {/* 깨진 수막새 단면의 입체 음영 */}
      <path
        d="M 125,200 C 130,220 160,210 190,235 C 220,260 250,230 280,240 C 310,250 330,225 360,245 C 380,255 405,220 415,200 L 415,206 C 405,226 380,261 360,251 C 330,231 310,256 280,246 C 250,236 220,266 190,241 C 160,216 130,226 125,206 Z"
        fill="#2a2725"
      />

      {/* 깨진 수막새 본체 (클립 마스크 적용) */}
      <g clipPath="url(#brokenTileClip)">
        {/* 외곽 림 (주연부: 테두리 기와) */}
        <circle cx={cx} cy={cy} r={r} fill="#3d3a36" />
        <circle cx={cx} cy={cy} r={r - 14} fill="#4b4742" stroke="#2c2a27" strokeWidth={2} />
        
        {/* 연주문 (작은 원형 구슬 문양 장식) */}
        <circle
          cx={cx}
          cy={cy}
          r={r - 22}
          fill="none"
          stroke="#736d65"
          strokeWidth={4}
          strokeDasharray="3 7"
        />

        {/* 내구(안쪽 원형 바닥) */}
        <circle cx={cx} cy={cy} r={r - 32} fill="#54504a" stroke="#363330" strokeWidth={2} />

        {/* 연꽃잎 (삼국시대 고구려/백제/신라 양식의 단판 연화문) */}
        {petalAngles.map((deg, idx) => {
          const rad = (deg * Math.PI) / 180;
          const px = cx + Math.cos(rad) * 75;
          const py = cy + Math.sin(rad) * 75;
          return (
            <g key={'petal-' + idx}>
              <ellipse
                cx={px}
                cy={py}
                rx={25}
                ry={15}
                transform={`rotate(${deg}, ${px}, ${py})`}
                fill="#666057"
                stroke="#3a3733"
                strokeWidth={1.5}
              />
              {/* 꽃잎 중심 융기선 */}
              <line
                x1={cx + Math.cos(rad) * 55}
                y1={cy + Math.sin(rad) * 55}
                x2={cx + Math.cos(rad) * 95}
                y2={cy + Math.sin(rad) * 95}
                stroke="#847c71"
                strokeWidth={1.5}
              />
            </g>
          );
        })}

        {/* 중앙 자방 (Lotus Seed Pod) 및 연자(씨앗) */}
        <circle cx={cx} cy={cy} r={32} fill="#3d3935" stroke="#282624" strokeWidth={2} />
        <circle cx={cx} cy={cy} r={6} fill="#787166" />
        {[0, 60, 120, 180, 240, 300].map((deg, i) => {
          const rad = (deg * Math.PI) / 180;
          return (
            <circle
              key={'seed-' + i}
              cx={cx + Math.cos(rad) * 16}
              cy={cy + Math.sin(rad) * 16}
              r={3.5}
              fill="#7a7368"
              stroke="#2e2b28"
              strokeWidth={1}
            />
          );
        })}

        {/* 자연스러운 유적 토양 및 세월의 풍화 크랙(균열선) */}
        <path
          d="M 210,140 Q 230,170 245,190 T 260,225"
          fill="none"
          stroke="#262422"
          strokeWidth={1}
          opacity={0.7}
        />
        <path
          d="M 285,115 Q 295,140 280,165"
          fill="none"
          stroke="#262422"
          strokeWidth={0.8}
          opacity={0.6}
        />
      </g>

      {/* 4. 온전하게 남아있는 상단 외곽 원호 강조선 (학생들이 현을 그릴 원 둘레 호) */}
      <path
        d="M 85,210 A 170 170 0 0 1 415,200"
        fill="none"
        stroke="#b83a2b"
        strokeWidth={3.5}
        strokeLinecap="round"
        opacity={0.9}
      />

      {/* 깨진 단면 라인 강조 (흙빛/암회색) */}
      <path
        d="M 125,200 C 130,220 160,210 190,235 C 220,260 250,230 280,240 C 310,250 330,225 360,245 C 380,255 405,220 415,200"
        fill="none"
        stroke="#824c30"
        strokeWidth={2}
        strokeLinecap="round"
      />

      {/* 깨진 단면 레이블 */}
      <g transform="translate(180, 275)">
        <rect
          x={-4}
          y={-14}
          width={150}
          height={20}
          rx={4}
          fill="rgba(44, 40, 37, 0.85)"
        />
        <text
          x={70}
          y={0}
          textAnchor="middle"
          fill="#d5c8b5"
          fontSize={11}
          fontFamily="Noto Sans KR"
          fontWeight={500}
        >
          깨진 단면 (원형 유실 구역)
        </text>
      </g>

      {/* 온전한 원호 테두리 안내 레이블 */}
      <g transform="translate(250, 60)">
        <rect
          x={-75}
          y={-14}
          width={150}
          height={22}
          rx={4}
          fill="rgba(184, 58, 43, 0.9)"
        />
        <text
          x={0}
          y={1}
          textAnchor="middle"
          fill="#ffffff"
          fontSize={11.5}
          fontFamily="Noto Sans KR"
          fontWeight={600}
        >
          원 둘레 호 (현 작도 구간)
        </text>
      </g>
    </g>
  );
};
