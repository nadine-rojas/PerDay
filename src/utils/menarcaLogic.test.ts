import test from 'node:test';
import assert from 'node:assert/strict';
import {
  isAppAnniversary,
  detectActiveHoliday,
  getHolidayRewards,
  claimDailyWallpaperGift,
  buildHistoryExportJson,
  VIRTUAL_PETS,
  HOLIDAYS,
  SYMPTOM_OPTIONS,
  calcularPronostico,
  extractTipKeys,
  obtenerTipsEducativos,
} from './menarcaLogic.ts';

test('Aniversario de la App (8 de Noviembre + tolerancia 9 de Noviembre): detecta ambos días y entrega exactamente 4 recompensas', () => {
  const nov8 = new Date('2026-11-08T12:00:00');
  const nov9 = new Date('2026-11-09T12:00:00');
  const nov10 = new Date('2026-11-10T12:00:00');

  assert.equal(isAppAnniversary(nov8), true);
  assert.equal(isAppAnniversary(nov9), true);
  assert.equal(isAppAnniversary(nov10), false);

  const detected8 = detectActiveHoliday(nov8);
  const detected9 = detectActiveHoliday(nov9);
  assert.ok(detected8);
  assert.ok(detected9);
  assert.equal(detected8.holiday.id, 'aniversario');
  assert.equal(detected9.holiday.id, 'aniversario');

  const rewards = getHolidayRewards(detected8.holiday);
  assert.equal(rewards.length, 4);
});

test('Límites de Celebraciones Normales: Navidad, Halloween, San Valentín y Primavera entregan máximo 3 recompensas por evento', () => {
  const normalHolidays = HOLIDAYS.filter((h) => !h.isGrandAnniversary);
  assert.equal(normalHolidays.length, 4);

  for (const h of normalHolidays) {
    const rewards = getHolidayRewards(h);
    assert.ok(rewards.length > 0 && rewards.length <= 3, `Expected <= 3 rewards for ${h.id}, got ${rewards.length}`);
  }
});

test('Regalo Diario y Mascotas Virtuales: regala un fondo nuevo por día y carga imágenes locales de mascotas', () => {
  const day1 = claimDailyWallpaperGift('2026-11-10', {});
  assert.equal(day1.isNewToday, true);
  assert.ok(day1.wallpaper.id);

  // Reopening on the same day does not duplicate gift
  const day1Again = claimDailyWallpaperGift('2026-11-10', day1.updatedClaims);
  assert.equal(day1Again.isNewToday, false);
  assert.equal(day1Again.wallpaper.id, day1.wallpaper.id);

  // Opening next day gifts a different wallpaper
  const day2 = claimDailyWallpaperGift('2026-11-11', day1.updatedClaims);
  assert.equal(day2.isNewToday, true);
  assert.notEqual(day2.wallpaper.id, day1.wallpaper.id);

  assert.ok(VIRTUAL_PETS.length >= 8);
  assert.ok(VIRTUAL_PETS.some((p) => p.codeName === 'mascota_gato.jpg'));
  assert.ok(VIRTUAL_PETS.some((p) => p.codeName === 'mascota_perro.jpg'));
});

test('Nuevos Registros de Salud (Peso y Agua), Pronóstico, Tips Educativos y Exportación JSON', () => {
  const symptomIds = SYMPTOM_OPTIONS.map((s) => s.id);
  assert.ok(symptomIds.includes('Panza revuelta o gases'));
  assert.ok(symptomIds.includes('Dormí mal'));
  assert.ok(symptomIds.includes('Dolor en la espalda baja o calambres'));
  assert.ok(symptomIds.includes('Sofocos / mucho calor'));
  assert.ok(symptomIds.includes('Antojos fuertes'));

  const today = '2026-11-10';
  const entries = [
    {
      d: today,
      m: 0,
      dolor: ['Panza revuelta o gases', 'Dormí mal', 'Antojos fuertes'],
      flujo: 'blanco',
      periodo: 'no' as const,
      peso: 44.5,
      agua: 6,
      nota: 'Día tranquilo',
    },
  ];

  const forecast = calcularPronostico(entries, today, null);
  assert.equal(forecast.matchedSymptoms.length, 3);

  const tips = obtenerTipsEducativos(
    extractTipKeys({ dolor: entries[0].dolor, flujo: 'blanco', per: 'no' }),
    6
  );
  assert.ok(tips.length >= 3);

  const jsonStr = buildHistoryExportJson({
    entries,
    profileNick: 'Luna',
    petId: 'mascota_gato_chef',
    exportedAtIso: '2026-11-10T12:00:00Z',
  });
  const parsed = JSON.parse(jsonStr);
  assert.equal(parsed.usuario, 'Luna');
  assert.equal(parsed.totalRegistros, 1);
  assert.equal(parsed.historialDiario[0].pesoKg, 44.5);
  assert.equal(parsed.historialDiario[0].vasosAgua, 6);
});
