import React from 'react';
import { Icons } from './Icons';
import {
  StatusPillWrap, StatusPillDot,
  SectionLabelRoot, SectionLabelText, SectionLabelRight,
  DividerEl,
  KbdEl,
  PropertyChipRoot, PropertyChipIcon,
  ComplexityBadgeRoot, ComplexityBadgeLabel, ComplexityBadgeValue,
  StatRoot, StatLabel, StatValue,
} from './Primitives.styled';

export { BtnGhost, BtnIcon, CtrlBtn } from './Primitives.styled';

export const StatusPill: React.FC<{
  kind?: 'running' | 'done' | 'paused' | 'error' | 'default' | 'no-path';
  children: React.ReactNode;
  dot?: boolean;
}> = ({ kind = 'running', children, dot = true }) => (
  <StatusPillWrap $kind={kind}>
    {dot && <StatusPillDot $kind={kind} />}
    {children}
  </StatusPillWrap>
);

export const SectionLabel: React.FC<{
  children: React.ReactNode;
  right?: React.ReactNode;
  accent?: string;
}> = ({ children, right, accent }) => (
  <SectionLabelRoot>
    <SectionLabelText $accent={accent}>{children}</SectionLabelText>
    {right && <SectionLabelRight>{right}</SectionLabelRight>}
  </SectionLabelRoot>
);

export const Divider: React.FC<{ m?: string }> = ({ m }) => (
  <DividerEl $m={m} />
);

export const Kbd: React.FC<{ children: React.ReactNode; w?: number }> = ({ children, w }) => (
  <KbdEl $w={w}>{children}</KbdEl>
);

export const PropertyChip: React.FC<{ ok: boolean; label: string }> = ({ ok, label }) => (
  <PropertyChipRoot $ok={ok}>
    <PropertyChipIcon>{ok ? Icons.check : Icons.x}</PropertyChipIcon>
    {label}
  </PropertyChipRoot>
);

export const ComplexityBadge: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <ComplexityBadgeRoot>
    <ComplexityBadgeLabel>{label}</ComplexityBadgeLabel>
    <ComplexityBadgeValue>{value}</ComplexityBadgeValue>
  </ComplexityBadgeRoot>
);

export const Stat: React.FC<{ label: string; v: string | number; accent?: string }> = ({ label, v, accent }) => (
  <StatRoot>
    <StatLabel>{label}</StatLabel>
    <StatValue $accent={accent}>{v}</StatValue>
  </StatRoot>
);
