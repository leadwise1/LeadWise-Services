'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  MessageSquare,
  ArrowBigUp,
  Share2,
  Trash2,
  Sparkles,
  HelpCircle,
  CircleHelp,
  Trophy,
  Flame,
  Send,
  MoreVertical,
  SlidersHorizontal,
  X,
  CheckCircle2,
  AlertTriangle,
  TriangleAlert,
  Code2,
  Volume2,
  VolumeX,
  Bookmark
} from 'lucide-react';

declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext;
  }
}

// Safe icon fallbacks across different versions of lucide-react
const QuestionIcon = CircleHelp || HelpCircle;
const WarningIcon = TriangleAlert || AlertTriangle;

const playHoloTone = (freq = 520, type = 'sine', duration = 0.08, enabled = true) => {
  if (!enabled || typeof window === 'undefined') return;
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(0.04, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch {
    // Ignore audio restrictions gracefully in restricted browser policies
  }
};
