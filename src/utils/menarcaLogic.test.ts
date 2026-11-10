import test from 'node:test';
import assert from 'node:assert/strict';
import {
  isAppAnniversary,
  isBirthdayUnlockedToday,
  detectActiveHoliday,
  getActiveYearForHoliday,
  getHolidayRewards,
  claimDailyWallpaperGift,
  buildHistoryExportJson,
  VIRTUAL_PETS,
  DAILY_WALLPAPERS,
  HOLIDAYS,
  SYMPTOM_OPTIONS,
  calcularPronostico,
  calcularEstimacionMenarca,
  extractTipKeys,
  obtenerTipsEducativos,
} from './menarcaLogic.ts';

test('Bloqueo de sorpresas: Cumpleaños y eventos solo se desbloquean en la fecha exacta (nunca antes de tiempo)', () => {
  const nov7 = new Date('2026-11-07T12:00:00');
  const nov8 = new Date('2026-11-08T12:00:00');
  const nov9 = new Date('2026-11-09T12:00:00');
  const dec24 = new Date('2026-12-24T12:00:00');
  const dec25 = new Date('2026-12-25T12:00:00');

  assert.equal(isAppAnniversary(nov7), false);
  assert.equal(isAppAnniversary(nov8), true);
  assert.equal(isAppAnniversary(nov9), false);

  assert.equal(detectActiveHoliday(nov7), null);
  assert.equal(detectActiveHoliday(dec24), null);

  const activeAnniv = detectActiveHoliday(nov8);
  assert.ok(activeAnniv);
  assert.equal(activeAnniv.holiday.id, 'aniversario');
  assert.equal(getHolidayRewards(activeAnniv.holiday).length, 4);

  const navidad = HOLIDAYS.find((h) => h.id === 'navidad')!;
  assert.equal(getActiveYearForHoliday(navidad, dec24), null);
  assert.equal(getActiveYearForHoliday(navidad, dec25), 2026);

  assert.equal(isBirthdayUnlockedToday({ d: 15, m: 5 }, new Date('2026-05-14T12:00:00')), false);
  assert.equal(isBirthdayUnlockedToday({ d: 15, m: 5 }, new Date('2026-05-15T12:00:00')), true);
});

test('10 Fondos Diarios y 21 Mascotas Decorativas con nuevas imágenes Photoroom', () => {
  assert.equal(DAILY_WALLPAPERS.length, 10);

  let claims: Record<string, string> = {};
  const giftedIds = new Set<string>();
  for (let i = 1; i <= 10; i++) {
    const dayIso = `2026-11-${String(i).padStart(2, '0')}`;
    const res = claimDailyWallpaperGift(dayIso, claims);
    assert.equal(res.isNewToday, true);
    assert.equal(res.streakCount, i);
    giftedIds.add(res.wallpaper.id);
    claims = res.updatedClaims;
  }
  assert.equal(giftedIds.size, 10);

  assert.equal(VIRTUAL_PETS.length, 21);
  assert.ok(VIRTUAL_PETS.every((p) => p.image.includes('-Photoroom')));
});

test('Selección múltiple de Estados de Ánimo y Nuevos Síntomas conectados a Estimar y Pronóstico en PerDay', () => {
  const symptomIds = SYMPTOM_OPTIONS.map((s) => s.id);
  for (const required of [
    'Dolor de cabeza',
    'Dolor de panza',
    'Sensibilidad',
    'Cansancio',
    'Granitos',
    'Cólicos',
    'Mamas sensibles',
    'Hinchazón',
  ]) {
    assert.ok(symptomIds.includes(required), `Missing symptom: ${required}`);
  }

  const today = '2026-11-10';
  const entries = [
    {
      d: today,
      moods: [0, 2, 7], // Feliz + Cansada + Sensible simultáneamente
      m: 0,
      dolor: ['Dolor de cabeza', 'Dolor de panza', 'Sensibilidad', 'Cansancio', 'Granitos'],
      flujo: 'blanco',
      periodo: 'no' as const,
      peso: 45.0,
      nota: 'Varios ánimos y síntomas hoy',
    },
  ];

  const forecast = calcularPronostico(entries, today, null);
  assert.equal(forecast.matchedSymptoms.length, 5);
  assert.ok(forecast.pct > 10);

  // Verificar que calcularEstimacionMenarca tome en cuenta los síntomas registrados
  const formAnswers = {
    edad: '12',
    meses: '6',
    mamas: 'si',
    vello: 'axilas',
    crece: 'm4a7',
    piel: 'si',
    forma: 'si',
    familia: '11a12',
    flujo: 'no',
  };
  const estWithoutSymptoms = calcularEstimacionMenarca(formAnswers, [], today);
  const estWithSymptoms = calcularEstimacionMenarca(formAnswers, entries, today);
  assert.ok(estWithSymptoms.symptomCountUsed > 0);
  assert.ok(estWithSymptoms.wMax <= estWithoutSymptoms.wMax);

  const tips = obtenerTipsEducativos(
    extractTipKeys({
      dolor: entries[0].dolor,
      flujo: 'blanco',
      per: 'no',
      moodNames: ['Feliz', 'Cansada', 'Sensible'],
    }),
    6
  );
  assert.ok(tips.length >= 4);

  const jsonStr = buildHistoryExportJson({
    entries,
    profileNick: 'Luna',
    petId: VIRTUAL_PETS[0].id,
    exportedAtIso: '2026-11-10T12:00:00Z',
  });
  const parsed = JSON.parse(jsonStr);
  assert.equal(parsed.app, 'PerDay');
  assert.deepEqual(parsed.historialDiario[0].animosIndices, [0, 2, 7]);
});
