import { describe, expect, it } from 'vitest';
import { packCart } from './packing-engine';
import type { ShippingCartItem } from './types';

const item = (overrides: Partial<ShippingCartItem> = {}): ShippingCartItem => ({ variantId: 'v1', title: 'Painel', quantity: 1, family: 'ABSORPTIVE_PANEL_RECT', lengthCm: 120, widthCm: 60, thicknessCm: 5, unitWeightKg: 3.5, validationStatus: 'validated', ...overrides });

describe('packCart', () => {
  it('embala painéis 120x60x5 em até quatro por volume', () => {
    const one = packCart([item()]);
    expect(one.volumes[0]).toMatchObject({ lengthCm: 122, widthCm: 62, heightCm: 7, weightKg: 3.55 });
    expect(packCart([item({ quantity: 4 })]).volumes).toHaveLength(1);
    expect(packCart([item({ quantity: 5 })]).volumes.map(v => v.items[0].quantity)).toEqual([4, 1]);
    expect(packCart([item({ quantity: 8 })]).volumes.map(v => v.items[0].quantity)).toEqual([4, 4]);
  });

  it('reduz capacidade de painel espesso pela geometria', () => {
    expect(packCart([item({ thicknessCm: 10, quantity: 2 })]).volumes).toHaveLength(1);
    expect(packCart([item({ thicknessCm: 10, quantity: 3 })]).volumes.map(v => v.items[0].quantity)).toEqual([2, 1]);
  });

  it('empacota 60x60 em camadas de duas unidades', () => {
    const result = packCart([item({ family: 'PANEL_60X60', quantity: 8, lengthCm: 60, widthCm: 60 })]);
    expect(result.volumes[0]).toMatchObject({ lengthCm: 122, widthCm: 62, heightCm: 22 });
    expect(packCart([item({ family: 'PANEL_60X60', quantity: 9, lengthCm: 60, widthCm: 60 })]).volumes).toHaveLength(2);
  });

  it('aplica regras de Skyline, Bass Trap e espuma', () => {
    expect(packCart([item({ family: 'DIFFUSER_SKYLINE_50', quantity: 5, lengthCm: 50, widthCm: 50, thicknessCm: 12, unitWeightKg: 6 })]).volumes.map(v => v.items[0].quantity)).toEqual([2, 2, 1]);
    expect(packCart([item({ family: 'BASS_TRAP_CORNER', quantity: 5, lengthCm: 100, widthCm: 42, thicknessCm: 20, unitWeightKg: 4 })]).volumes.map(v => v.items[0].quantity)).toEqual([4, 1]);
    expect(packCart([item({ family: 'BASS_TRAP_CORNER', quantity: 5, lengthCm: 120, widthCm: 42, thicknessCm: 20, unitWeightKg: 4 })]).volumes.map(v => v.items[0].quantity)).toEqual([2, 2, 1]);
    expect(packCart([item({ family: 'EXPANDING_FOAM', quantity: 25, lengthCm: 10, widthCm: 10, thicknessCm: 20, unitWeightKg: 0.5 })]).volumes.map(v => v.items[0].quantity)).toEqual([12, 12, 1]);
  });

  it('preserva consulta manual quando a operação não é segura', () => {
    const door = packCart([item({ family: 'ACOUSTIC_DOOR', quantity: 1 })]);
    expect(door.volumes).toHaveLength(0);
    expect(door.manualQuoteItems[0]?.reason).toBe('FRETE_SOB_CONSULTA');
    const curtain = packCart([item({ family: 'ACOUSTIC_CURTAIN', quantity: 1, validationStatus: 'manual_review' })]);
    expect(curtain.manualQuoteItems).toHaveLength(1);
  });

  it('mantém volumes exclusivos para membrana e biombos, e pacote fechado para lã de rocha', () => {
    const membrane = packCart([item({ family: 'BASS_TRAP_MEMBRANE', quantity: 3, lengthCm: 120, widthCm: 60, thicknessCm: 20, unitWeightKg: 12 })]);
    expect(membrane.volumes).toHaveLength(3);
    expect(membrane.volumes.every((volume) => volume.exclusive && volume.weightKg === 12.05)).toBe(true);
    expect(packCart([item({ family: 'RETRACTABLE_SCREEN', quantity: 2, packedLengthCm: 180, packedWidthCm: 60, packedHeightCm: 15, unitWeightKg: 12 })]).volumes).toHaveLength(2);
    expect(packCart([item({ family: 'MOBILE_SCREEN_TRESTLE', quantity: 2, packedLengthCm: 180, packedWidthCm: 60, packedHeightCm: 10, unitWeightKg: 12 })]).volumes).toHaveLength(2);
    expect(packCart([item({ family: 'ROCK_WOOL', quantity: 3, lengthCm: 120, widthCm: 60, thicknessCm: 5, unitWeightKg: 8, validationStatus: 'validated' })]).volumes).toHaveLength(3);
  });
});
