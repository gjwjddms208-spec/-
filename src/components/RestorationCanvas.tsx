import React, { useState, useRef, useEffect, useCallback } from 'react';
import type { ChordLine, DrawingData, Point } from '../types';
import { TraditionalTileGraphic } from './TraditionalTileGraphic';
import confetti from 'canvas-confetti';
import {
  Compass,
  RotateCcw,
  CheckCircle2,
  HelpCircle,
  Eye,
  ArrowRight,
  Info,
  Sparkles,
} from 'lucide-react';

interface Props {
  drawingData: DrawingData;
  setDrawingData: React.Dispatch<React.SetStateAction<DrawingData>>;
  onComplete: () => void;
}

const CENTER_TRUE: Point = { x: 250, y: 250 };
const RADIUS_TRUE = 170; // SVG coordinate units
const UNITS_PER_CM = 17; // 17 units = 1 cm (radius 170 units = 10 cm)
const RADIUS_TRUE_CM = 10; // 10 cm

// Intact circular arc angle range in degrees (from ~195 deg to 345 deg)
const MIN_DEG = 195;
const MAX_DEG = 345;

function degToRad(deg: number) {
  return (deg * Math.PI) / 180;
}

function radToDeg(rad: number) {
  return (rad * 180) / Math.PI;
}

function getPointOnArc(deg: number): Point {
  const rad = degToRad(deg);
  return {
    x: Math.round((CENTER_TRUE.x + RADIUS_TRUE * Math.cos(rad)) * 10) / 10,
    y: Math.round((CENTER_TRUE.y + RADIUS_TRUE * Math.sin(rad)) * 10) / 10,
  };
}

export const RestorationCanvas: React.FC<Props> = ({
  drawingData,
  setDrawingData,
  onComplete,
}) => {
  // Angle states for handles
  const [angleA, setAngleA] = useState<number>(215); // Chord 1 Start
  const [angleB, setAngleB] = useState<number>(260); // Chord 1 End
  const [angleC, setAngleC] = useState<number>(280); // Chord 2 Start
  const [angleD, setAngleD] = useState<number>(335); // Chord 2 End

  // Active step in interactive construction
  // step 1: Draw Chord 1 (AB)
  // step 2: Draw Chord 2 (CD)
  // step 3: Check Bisectors & Find Center
  const [step, setStep] = useState<1 | 2 | 3>(
    drawingData.isRestored ? 3 : drawingData.chord1 ? (drawingData.chord2 ? 3 : 2) : 1
  );

  const [activeHandle, setActiveHandle] = useState<'A' | 'B' | 'C' | 'D' | null>(null);
  const [showProofGuide, setShowProofGuide] = useState<boolean>(false);
  const [showRulerGuide, setShowRulerGuide] = useState<boolean>(true);
  const svgRef = useRef<SVGSVGElement>(null);

  // Compute coordinates for Points A, B, C, D
  const ptA = getPointOnArc(angleA);
  const ptB = getPointOnArc(angleB);
  const ptC = getPointOnArc(angleC);
  const ptD = getPointOnArc(angleD);

  // Midpoints
  const mid1: Point = {
    x: Math.round(((ptA.x + ptB.x) / 2) * 10) / 10,
    y: Math.round(((ptA.y + ptB.y) / 2) * 10) / 10,
  };
  const mid2: Point = {
    x: Math.round(((ptC.x + ptD.x) / 2) * 10) / 10,
    y: Math.round(((ptC.y + ptD.y) / 2) * 10) / 10,
  };

  // Calculate length in cm (1 cm = 17 SVG units)
  const len1Cm = Math.round((Math.hypot(ptB.x - ptA.x, ptB.y - ptA.y) / UNITS_PER_CM) * 10) / 10;
  const len2Cm = Math.round((Math.hypot(ptD.x - ptC.x, ptD.y - ptC.y) / UNITS_PER_CM) * 10) / 10;

  // Update DrawingData whenever points change
  const updateDrawingState = useCallback(
    (isRestoredValue: boolean) => {
      const chord1Obj: ChordLine = {
        id: 'chord-1',
        p1: ptA,
        p2: ptB,
        midpoint: mid1,
        length: len1Cm,
        color: '#c04000',
        label: '현 AB',
      };
      const chord2Obj: ChordLine = {
        id: 'chord-2',
        p1: ptC,
        p2: ptD,
        midpoint: mid2,
        length: len2Cm,
        color: '#2e5a59',
        label: '현 CD',
      };

      setDrawingData({
        chord1: chord1Obj,
        chord2: chord2Obj,
        centerFound: CENTER_TRUE,
        radiusFound: RADIUS_TRUE_CM,
        isRestored: isRestoredValue,
      });
    },
    [ptA, ptB, ptC, ptD, mid1, mid2, len1Cm, len2Cm, setDrawingData]
  );

  // Keep drawingData in sync
  useEffect(() => {
    if (step >= 2) {
      updateDrawingState(drawingData.isRestored);
    }
  }, [angleA, angleB, angleC, angleD, step, updateDrawingState, drawingData.isRestored]);

  // Handle Dragging along circular arc
  const handlePointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!activeHandle || !svgRef.current) return;

    const rect = svgRef.current.getBoundingClientRect();
    const clientX = e.clientX;
    const clientY = e.clientY;

    // Convert client coordinates to SVG viewBox (0..500)
    const svgX = ((clientX - rect.left) / rect.width) * 500;
    const svgY = ((clientY - rect.top) / rect.height) * 500;

    // Calculate angle relative to CENTER_TRUE
    let deg = radToDeg(Math.atan2(svgY - CENTER_TRUE.y, svgX - CENTER_TRUE.x));
    if (deg < 0) deg += 360;

    // Clamp within intact arc range [MIN_DEG, MAX_DEG]
    deg = Math.max(MIN_DEG + 3, Math.min(MAX_DEG - 3, deg));
    deg = Math.round(deg * 2) / 2;

    if (activeHandle === 'A') {
      if (deg < angleB - 10) setAngleA(deg);
    } else if (activeHandle === 'B') {
      if (deg > angleA + 10 && deg < angleC - 5) setAngleB(deg);
    } else if (activeHandle === 'C') {
      if (deg > angleB + 5 && deg < angleD - 10) setAngleC(deg);
    } else if (activeHandle === 'D') {
      if (deg > angleC + 10) setAngleD(deg);
    }
  };

  const handlePointerUp = () => {
    setActiveHandle(null);
  };

  const triggerRestoration = () => {
    updateDrawingState(true);
    setStep(3);

    // Celebratory confetti
    confetti({
      particleCount: 70,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#b83a2b', '#c49a45', '#2e6b5e', '#d5c8b5'],
    });
  };

  const resetRestoration = () => {
    setAngleA(215);
    setAngleB(260);
    setAngleC(280);
    setAngleD(335);
    setStep(1);
    setDrawingData({
      chord1: null,
      chord2: null,
      centerFound: null,
      radiusFound: null,
      isRestored: false,
    });
  };

  // Helper to draw right angle marker (L shaped) at midpoint M
  const renderRightAngle = (mid: Point, pEnd: Point, color: string) => {
    // Vector from mid to pEnd (along chord)
    const vx = (pEnd.x - mid.x) / Math.hypot(pEnd.x - mid.x, pEnd.y - mid.y);
    const vy = (pEnd.y - mid.y) / Math.hypot(pEnd.x - mid.x, pEnd.y - mid.y);

    // Perpendicular vector towards center
    const px = (CENTER_TRUE.x - mid.x) / Math.hypot(CENTER_TRUE.x - mid.x, CENTER_TRUE.y - mid.y);
    const py = (CENTER_TRUE.y - mid.y) / Math.hypot(CENTER_TRUE.x - mid.x, CENTER_TRUE.y - mid.y);

    const s = 10;
    const p1 = { x: mid.x + vx * s, y: mid.y + vy * s };
    const p2 = { x: mid.x + vx * s + px * s, y: mid.y + vy * s + py * s };
    const p3 = { x: mid.x + px * s, y: mid.y + py * s };

    return (
      <polyline
        points={`${p1.x},${p1.y} ${p2.x},${p2.y} ${p3.x},${p3.y}`}
        fill="none"
        stroke={color}
        strokeWidth={1.5}
      />
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Banner & Instructions */}
      <div className="bg-[#f9f7f2] p-5 sm:p-6 rounded-2xl border border-[#2d2926]/10 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-[#8b4513] uppercase tracking-wider mb-1">
            <Compass className="w-4 h-4" />
            <span>탐구 모듈 1: 수막새 디지털 작도실</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-batang font-bold text-[#2d2926]">
            깨진 수막새의 원형 중심(복원점 O) 작도하기
          </h2>
          <p className="text-xs sm:text-sm text-[#726960] mt-1">
            수학적 원리: <strong className="text-[#8b4513]">"현의 수직이등분선은 그 원의 중심을 지난다."</strong>
            {' '}서로 다른 두 현의 수직이등분선의 교점을 구하면 원래 원의 중심이 복원됩니다.
          </p>
        </div>

        {/* Step Indicator Buttons */}
        <div className="flex items-center space-x-2 text-xs font-medium">
          <button
            onClick={() => setStep(1)}
            className={`px-3 py-1.5 rounded-lg border transition-all ${
              step === 1
                ? 'bg-[#c04000] text-white border-[#c04000]'
                : 'bg-white/70 text-[#2d2926]/75 border border-[#2d2926]/10 hover:bg-[#f5f2ed]'
            }`}
          >
            1단계: 현 AB
          </button>
          <button
            onClick={() => setStep(2)}
            className={`px-3 py-1.5 rounded-lg border transition-all ${
              step === 2
                ? 'bg-[#2e5a59] text-white border-[#2e5a59]'
                : 'bg-white/70 text-[#2d2926]/75 border border-[#2d2926]/10 hover:bg-[#f5f2ed]'
            }`}
          >
            2단계: 현 CD
          </button>
          <button
            onClick={() => {
              setStep(3);
              if (!drawingData.isRestored) triggerRestoration();
            }}
            className={`px-3 py-1.5 rounded-lg border transition-all ${
              step === 3
                ? 'bg-[#8b4513] text-white border-[#8b4513]'
                : 'bg-white/70 text-[#2d2926]/75 border border-[#2d2926]/10 hover:bg-[#f5f2ed]'
            }`}
          >
            3단계: 중심 복원
          </button>
        </div>
      </div>

      {/* Main Grid: Interactive Canvas on Left, Math Control Panel on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Canvas Area (7 cols on large screens) */}
        <div className="lg:col-span-7 bg-[#f9f7f2] rounded-2xl border border-[#2d2926]/10 p-4 sm:p-6 shadow-xs flex flex-col items-center relative select-none">
          {/* Canvas Toolbar Top */}
          <div className="w-full flex items-center justify-between text-xs text-[#726960] mb-2 pb-2 border-b border-[#2d2926]/10">
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-[#2d2926]">
                수막새 가상 복원대 (디지털 캔버스)
              </span>
              {drawingData.isRestored && (
                <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-[#2e5a59]/15 text-[#2e5a59] text-[11px] font-semibold border border-[#2e5a59]/20">
                  <CheckCircle2 className="w-3 h-3 text-[#2e5a59]" />
                  <span>원형 복원 완료</span>
                </span>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowRulerGuide(!showRulerGuide)}
                className="text-[11px] px-2.5 py-1 rounded bg-white/80 hover:bg-[#f5f2ed] text-[#2d2926] border border-[#2d2926]/10 flex items-center space-x-1 transition-colors shadow-xs"
              >
                <Eye className="w-3 h-3 text-[#8b4513]" />
                <span>{showRulerGuide ? '보조선 숨기기' : '보조선 보기'}</span>
              </button>
              <button
                onClick={resetRestoration}
                className="text-[11px] px-2.5 py-1 rounded bg-white/80 hover:bg-[#f5f2ed] text-[#2d2926] border border-[#2d2926]/10 flex items-center space-x-1 transition-colors shadow-xs"
                title="작도 초기화"
              >
                <RotateCcw className="w-3 h-3 text-[#8b4513]" />
                <span>초기화</span>
              </button>
            </div>
          </div>

          {/* SVG Interactive Drawing Board (500x500 viewBox) */}
          <div className="relative w-full aspect-square max-w-[480px] bg-[#22201e] rounded-xl overflow-hidden shadow-inner border-2 border-[#3d3834]">
            <svg
              ref={svgRef}
              viewBox="0 0 500 500"
              className="w-full h-full cursor-crosshair touch-none"
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerLeave={handlePointerUp}
            >
              <defs>
                {/* Background Grid Pattern */}
                <pattern id="mathGrid" width="25" height="25" patternUnits="userSpaceOnUse">
                  <path d="M 25 0 L 0 0 0 25" fill="none" stroke="#2e2b27" strokeWidth="0.75" />
                </pattern>
                {/* Glow Filter */}
                <filter id="goldGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Coordinate Grid */}
              <rect width="500" height="500" fill="#24211e" />
              <rect width="500" height="500" fill="url(#mathGrid)" />

              {/* Center Axes & Scale Guide (Subtle) */}
              {showRulerGuide && (
                <g>
                  <g stroke="#3d3833" strokeWidth={0.8} strokeDasharray="3 3">
                    <line x1={0} y1={250} x2={500} y2={250} />
                    <line x1={250} y1={0} x2={250} y2={500} />
                  </g>
                  {/* Artifact Archaeological Scale Bar (5 cm = 85 units) */}
                  <g transform="translate(20, 460)" opacity={0.85}>
                    <rect x={-4} y={-16} width={93} height={24} rx={4} fill="#1f1c1a" opacity={0.6} />
                    <line x1={0} y1={0} x2={85} y2={0} stroke="#c49a45" strokeWidth={1.5} />
                    <line x1={0} y1={-4} x2={0} y2={4} stroke="#c49a45" strokeWidth={1.5} />
                    <line x1={42.5} y1={-2.5} x2={42.5} y2={2.5} stroke="#c49a45" strokeWidth={1} />
                    <line x1={85} y1={-4} x2={85} y2={4} stroke="#c49a45" strokeWidth={1.5} />
                    <text x={42.5} y={-6} textAnchor="middle" fill="#f5f2ed" fontSize={9} fontWeight="600" fontFamily="sans-serif">
                      축척: 5 cm
                    </text>
                  </g>
                </g>
              )}

              {/* 1. Traditional Korean Tile Graphic Layer */}
              <TraditionalTileGraphic
                isRestored={drawingData.isRestored}
                highlightCenter={step === 3}
                highlightChords={true}
              />

              {/* 2. Chord 1 (AB) - Terracotta Vermilion */}
              <g className="chord-1-layer">
                {/* Line AB */}
                <line
                  x1={ptA.x}
                  y1={ptA.y}
                  x2={ptB.x}
                  y2={ptB.y}
                  stroke="#c04000"
                  strokeWidth={3.5}
                  strokeLinecap="round"
                />
                {/* Midpoint M1 */}
                <circle cx={mid1.x} cy={mid1.y} r={4.5} fill="#ffffff" stroke="#c04000" strokeWidth={2} />
                {/* Midpoint Label */}
                <text
                  x={mid1.x}
                  y={mid1.y - 9}
                  textAnchor="middle"
                  fill="#ffffff"
                  fontSize={11}
                  fontWeight={600}
                >
                  M₁
                </text>

                {/* Perpendicular Bisector of Chord 1 extending to Center O */}
                {(step >= 2 || drawingData.isRestored) && (
                  <g>
                    {/* Line from M1 down through Center O */}
                    <line
                      x1={mid1.x}
                      y1={mid1.y}
                      x2={CENTER_TRUE.x}
                      y2={CENTER_TRUE.y}
                      stroke="#c04000"
                      strokeWidth={2}
                      strokeDasharray="4 3"
                    />
                    {/* Right angle symbol */}
                    {renderRightAngle(mid1, ptB, '#c04000')}
                    <text
                      x={(mid1.x + CENTER_TRUE.x) / 2 - 12}
                      y={(mid1.y + CENTER_TRUE.y) / 2}
                      fill="#fca5a5"
                      fontSize={10}
                      fontFamily="Noto Sans KR"
                    >
                      L₁ (수직이등분선)
                    </text>
                  </g>
                )}

                {/* Draggable Handle A */}
                <g
                  className="cursor-pointer"
                  onPointerDown={(e) => {
                    e.stopPropagation();
                    setActiveHandle('A');
                  }}
                >
                  <circle
                    cx={ptA.x}
                    cy={ptA.y}
                    r={activeHandle === 'A' ? 12 : 9}
                    fill="#c04000"
                    stroke="#ffffff"
                    strokeWidth={2.5}
                  />
                  <text
                    x={ptA.x - 14}
                    y={ptA.y + 4}
                    fill="#ffffff"
                    fontSize={12}
                    fontWeight={700}
                  >
                    A
                  </text>
                </g>

                {/* Draggable Handle B */}
                <g
                  className="cursor-pointer"
                  onPointerDown={(e) => {
                    e.stopPropagation();
                    setActiveHandle('B');
                  }}
                >
                  <circle
                    cx={ptB.x}
                    cy={ptB.y}
                    r={activeHandle === 'B' ? 12 : 9}
                    fill="#c04000"
                    stroke="#ffffff"
                    strokeWidth={2.5}
                  />
                  <text
                    x={ptB.x}
                    y={ptB.y - 12}
                    textAnchor="middle"
                    fill="#ffffff"
                    fontSize={12}
                    fontWeight={700}
                  >
                    B
                  </text>
                </g>
              </g>

              {/* 3. Chord 2 (CD) - Celadon Pine Deep Teal */}
              {(step >= 2 || drawingData.isRestored) && (
                <g className="chord-2-layer">
                  {/* Line CD */}
                  <line
                    x1={ptC.x}
                    y1={ptC.y}
                    x2={ptD.x}
                    y2={ptD.y}
                    stroke="#2e5a59"
                    strokeWidth={3.5}
                    strokeLinecap="round"
                  />
                  {/* Midpoint M2 */}
                  <circle cx={mid2.x} cy={mid2.y} r={4.5} fill="#ffffff" stroke="#2e5a59" strokeWidth={2} />
                  <text
                    x={mid2.x}
                    y={mid2.y - 9}
                    textAnchor="middle"
                    fill="#ffffff"
                    fontSize={11}
                    fontWeight={600}
                  >
                    M₂
                  </text>

                  {/* Perpendicular Bisector of Chord 2 extending to Center O */}
                  <g>
                    <line
                      x1={mid2.x}
                      y1={mid2.y}
                      x2={CENTER_TRUE.x}
                      y2={CENTER_TRUE.y}
                      stroke="#2e5a59"
                      strokeWidth={2}
                      strokeDasharray="4 3"
                    />
                    {/* Right angle symbol */}
                    {renderRightAngle(mid2, ptD, '#2e5a59')}
                    <text
                      x={(mid2.x + CENTER_TRUE.x) / 2 + 12}
                      y={(mid2.y + CENTER_TRUE.y) / 2}
                      fill="#99f6e4"
                      fontSize={10}
                      fontFamily="Noto Sans KR"
                    >
                      L₂ (수직이등분선)
                    </text>
                  </g>

                  {/* Draggable Handle C */}
                  <g
                    className="cursor-pointer"
                    onPointerDown={(e) => {
                      e.stopPropagation();
                      setActiveHandle('C');
                    }}
                  >
                    <circle
                      cx={ptC.x}
                      cy={ptC.y}
                      r={activeHandle === 'C' ? 12 : 9}
                      fill="#2e5a59"
                      stroke="#ffffff"
                      strokeWidth={2.5}
                    />
                    <text
                      x={ptC.x}
                      y={ptC.y - 12}
                      textAnchor="middle"
                      fill="#ffffff"
                      fontSize={12}
                      fontWeight={700}
                    >
                      C
                    </text>
                  </g>

                  {/* Draggable Handle D */}
                  <g
                    className="cursor-pointer"
                    onPointerDown={(e) => {
                      e.stopPropagation();
                      setActiveHandle('D');
                    }}
                  >
                    <circle
                      cx={ptD.x}
                      cy={ptD.y}
                      r={activeHandle === 'D' ? 12 : 9}
                      fill="#2e5a59"
                      stroke="#ffffff"
                      strokeWidth={2.5}
                    />
                    <text
                      x={ptD.x + 14}
                      y={ptD.y + 4}
                      fill="#ffffff"
                      fontSize={12}
                      fontWeight={700}
                    >
                      D
                    </text>
                  </g>
                </g>
              )}

              {/* 4. Intersection & Center Point O (The Restored Center) */}
              {(step === 3 || drawingData.isRestored) && (
                <g filter="url(#goldGlow)">
                  {/* Concentric Golden Radar Pulse */}
                  <circle
                    cx={CENTER_TRUE.x}
                    cy={CENTER_TRUE.y}
                    r={22}
                    fill="none"
                    stroke="#ffd700"
                    strokeWidth={1.5}
                    strokeDasharray="4 4"
                    className="animate-spin origin-center"
                    style={{ transformOrigin: '250px 250px' }}
                  />
                  <circle
                    cx={CENTER_TRUE.x}
                    cy={CENTER_TRUE.y}
                    r={12}
                    fill="none"
                    stroke="#ffd700"
                    strokeWidth={2}
                  />
                  <circle
                    cx={CENTER_TRUE.x}
                    cy={CENTER_TRUE.y}
                    r={5}
                    fill="#ffd700"
                    stroke="#ffffff"
                    strokeWidth={2}
                  />

                  {/* Label O */}
                  <rect
                    x={CENTER_TRUE.x - 30}
                    y={CENTER_TRUE.y + 16}
                    width={60}
                    height={20}
                    rx={4}
                    fill="#2d2926"
                    stroke="#ffd700"
                    strokeWidth={1}
                  />
                  <text
                    x={CENTER_TRUE.x}
                    y={CENTER_TRUE.y + 30}
                    textAnchor="middle"
                    fill="#ffd700"
                    fontSize={11}
                    fontWeight={700}
                  >
                    복원점 O
                  </text>
                </g>
              )}
            </svg>

            {/* Bottom Bar On Canvas */}
            <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 bg-[#2d2926]/90 text-[#f5f2ed] text-xs flex items-center justify-between backdrop-blur-xs">
              <div className="flex items-center space-x-2.5">
                <span className="text-[#c04000] font-semibold">● 현 AB</span>
                <span className="text-[#2e5a59] font-semibold">● 현 CD</span>
                <span className="text-white/60 hidden sm:inline text-[11px]">| 점을 드래그해 이동</span>
              </div>
              <span className="text-[#ffd700] font-mono font-semibold">반지름 r = {RADIUS_TRUE_CM} cm</span>
            </div>
          </div>

          <p className="text-[11px] text-[#726960] mt-3 text-center">
            * 원 둘레의 호 위에 놓인 두 현의 수직이등분선은 항상 원의 중심을 통과합니다.
          </p>
        </div>

        {/* Math Analysis & Restoration Controller (5 cols on large screens) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Construction Status Card */}
          <div className="bg-[#f9f7f2] rounded-2xl border border-[#2d2926]/10 p-5 shadow-xs">
            <h3 className="font-batang font-bold text-base text-[#2d2926] mb-3 flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-[#8b4513]" />
              <span>작도 측정치 및 기하 분석</span>
            </h3>

            <div className="space-y-3 text-xs">
              {/* Chord 1 measurement */}
              <div className="p-3 rounded-xl bg-[#c04000]/10 border border-[#c04000]/20">
                <div className="flex items-center justify-between font-semibold text-[#c04000] mb-1">
                  <span>현 1: 선분 AB</span>
                  <span>길이: 약 {len1Cm} cm</span>
                </div>
                <div className="text-[11px] text-[#2d2926]/80 space-y-0.5">
                  <p>• 중점 M₁ 좌표: ({mid1.x}, {mid1.y})</p>
                  <p>• 성질: 현 AB의 수직이등분선 L₁은 원의 중심을 지남</p>
                </div>
              </div>

              {/* Chord 2 measurement */}
              <div className="p-3 rounded-xl bg-[#2e5a59]/10 border border-[#2e5a59]/20">
                <div className="flex items-center justify-between font-semibold text-[#2e5a59] mb-1">
                  <span>현 2: 선분 CD</span>
                  <span>길이: 약 {len2Cm} cm</span>
                </div>
                <div className="text-[11px] text-[#2d2926]/80 space-y-0.5">
                  <p>• 중점 M₂ 좌표: ({mid2.x}, {mid2.y})</p>
                  <p>• 성질: 현 CD의 수직이등분선 L₂은 원의 중심을 지남</p>
                </div>
              </div>

              {/* Intersection / Center Status */}
              <div className="p-3 rounded-xl bg-[#8b4513]/10 border border-[#8b4513]/20 text-[#8b4513]">
                <div className="flex items-center justify-between font-bold text-[#8b4513] mb-1">
                  <span>두 수직이등분선의 교점 (O)</span>
                  <span className="font-mono">좌표: (250, 250)</span>
                </div>
                <p className="text-[11px] text-[#2d2926]/80">
                  현 AB와 현 CD의 수직이등분선이 만나는 유일한 한 점이 바로 깨진 삼국시대 수막새의 원래 원의 중심입니다!
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-5 space-y-2">
              {!drawingData.isRestored ? (
                <button
                  type="button"
                  onClick={triggerRestoration}
                  className="w-full py-3 px-4 rounded-xl bg-[#8b4513] hover:bg-[#703810] text-white font-bold text-xs sm:text-sm flex items-center justify-center space-x-2 shadow-lg shadow-[#8b4513]/20 transition-all"
                >
                  <Sparkles className="w-4 h-4 text-[#ffd700]" />
                  <span>수막새 원형 중심 복원하기</span>
                </button>
              ) : (
                <div className="space-y-2">
                  <div className="p-3 rounded-xl bg-[#2e5a59]/15 border border-[#2e5a59]/25 text-[#2e5a59] text-xs flex items-center space-x-2 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-[#2e5a59] shrink-0" />
                    <span>
                      수막새 중심 복원 성공! 원형 형태가 완벽하게 복원되었습니다.
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={onComplete}
                    className="w-full py-3 px-4 rounded-xl bg-[#2d2926] hover:bg-[#1f1c1a] text-[#f5f2ed] font-bold text-xs sm:text-sm flex items-center justify-center space-x-2 shadow-md transition-all"
                  >
                    <span>2단계: 계산 문제 풀고 성찰일지 작성하기</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mathematical Reasoning Card (Accordion/Collapsible) */}
          <div className="bg-[#f9f7f2] rounded-2xl border border-[#2d2926]/10 p-5 shadow-xs">
            <button
              onClick={() => setShowProofGuide(!showProofGuide)}
              className="w-full flex items-center justify-between text-left"
            >
              <div className="flex items-center space-x-2">
                <Info className="w-4 h-4 text-[#8b4513]" />
                <span className="font-batang font-bold text-sm text-[#2d2926]">
                  수학적 증명: 왜 두 수직이등분선의 교점이 중심인가?
                </span>
              </div>
              <span className="text-xs text-[#726960]">
                {showProofGuide ? '닫기 ▲' : '자세히 보기 ▼'}
              </span>
            </button>

            {showProofGuide && (
              <div className="mt-4 pt-3 border-t border-[#2d2926]/10 text-xs text-[#2d2926]/85 space-y-2.5 leading-relaxed">
                <div className="p-2.5 rounded-lg bg-white/70 border border-[#2d2926]/10">
                  <strong className="text-[#c04000]">정리 1 (원의 현의 수직이등분선):</strong>
                  <p className="mt-0.5 text-[#2d2926]/80">
                    선분 AB의 수직이등분선 위의 모든 점은 점 A와 점 B로부터 거리가 같습니다 (PA = PB).
                    원의 중심 O 역시 원의 정의에 의해 OA = OB = r이므로, 반드시 현 AB의 수직이등분선 위에 존재합니다.
                  </p>
                </div>
                <div className="p-2.5 rounded-lg bg-white/70 border border-[#2d2926]/10">
                  <strong className="text-[#2e5a59]">정리 2 (두 현의 교점):</strong>
                  <p className="mt-0.5 text-[#2d2926]/80">
                    마찬가지로 원의 중심 O는 현 CD의 수직이등분선 위에도 존재합니다 (OC = OD = r).
                    따라서 두 수직이등분선의 교점은 오직 하나(O)뿐이며, 이 점이 바로 원래 원의 유일한 중심이 됩니다.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
