export type CoverSlot = 'center' | 'left' | 'right' | 'hiddenLeft' | 'hiddenRight';

export function coverflowSlot(index: number, active: number, count: number): CoverSlot {
  if (count < 2) return 'center';
  const rel = (index - active + count) % count;
  if (rel === 0) return 'center';
  if (rel === 1) return 'right';
  if (rel === count - 1) return 'left';
  return rel < count / 2 ? 'hiddenRight' : 'hiddenLeft';
}

type SlotLook = {
  transform: string;
  filter: string;
  opacity: number;
  zIndex: number;
};

export function coverflowLook(slot: CoverSlot, tilt: number, centerScale = 1.05, sideScale = 0.8): SlotLook {
  const sideOffset = `${(centerScale / 2 + sideScale * 0.35) * 100}%`;
  const farOffset = `${(centerScale / 2 + sideScale * 0.95) * 100}%`;
  const looks: Record<CoverSlot, SlotLook> = {
    center: {
      transform: `perspective(1400px) translateX(0) rotateY(0deg) scale(${centerScale})`,
      filter: 'blur(0px)',
      opacity: 1,
      zIndex: 3,
    },
    left: {
      transform: `perspective(1400px) translateX(-${sideOffset}) rotateY(-${tilt}deg) scale(${sideScale})`,
      filter: 'blur(3px)',
      opacity: 0.85,
      zIndex: 2,
    },
    right: {
      transform: `perspective(1400px) translateX(${sideOffset}) rotateY(${tilt}deg) scale(${sideScale})`,
      filter: 'blur(3px)',
      opacity: 0.85,
      zIndex: 2,
    },
    hiddenLeft: {
      transform: `perspective(1400px) translateX(-${farOffset}) rotateY(-${tilt}deg) scale(${sideScale * 0.85})`,
      filter: 'blur(6px)',
      opacity: 0,
      zIndex: 1,
    },
    hiddenRight: {
      transform: `perspective(1400px) translateX(${farOffset}) rotateY(${tilt}deg) scale(${sideScale * 0.85})`,
      filter: 'blur(6px)',
      opacity: 0,
      zIndex: 1,
    },
  };
  return looks[slot];
}

export function isCoverHidden(slot: CoverSlot) {
  return slot === 'hiddenLeft' || slot === 'hiddenRight';
}
