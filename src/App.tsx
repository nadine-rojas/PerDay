import { useEffect, useRef } from 'react';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleAuthProvider } from './lib/firebase';
import {
  SYMPTOM_OPTIONS,
  HOLIDAYS,
  DAILY_WALLPAPERS,
  VIRTUAL_PETS,
  HolidayEvent,
  BadgeAsset,
  DayEntry,
  MenarcaEstimate,
  isAppAnniversary,
  isBirthdayUnlockedToday,
  getHolidayRewards,
  claimDailyWallpaperGift,
  buildHistoryExportJson,
  getActiveYearForHoliday,
  detectActiveHoliday,
  daysUntilHoliday,
  extractTipKeys,
  obtenerTipsEducativos,
  getEntryMoodIndices,
  calcularEstimacionMenarca,
  calcularPronostico,
} from './utils/menarcaLogic';

interface StoredGift {
  k?: string;
  y: number;
  marco: string;
  fondo: string;
  wallpapers?: string[];
  badges?: BadgeAsset[];
  badge?: number;
  ins?: [string, string, string?];
  msg?: number;
  t?: number;
}

interface PetState {
  id: string;
}

interface CloudAccountInfo {
  uid: string;
  email: string;
  authType: string;
  lastSyncIso?: string;
}

export default function App() {
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const $ = <T extends Element = HTMLElement>(s: string, r: Document | Element = document) =>
      r.querySelector<T>(s);
    const $$ = <T extends Element = HTMLElement>(s: string, r: Document | Element = document) =>
      Array.from(r.querySelectorAll<T>(s));

    const store = {
      get<T>(k: string, d: T): T {
        try {
          const v = localStorage.getItem(k);
          return v === null ? d : (JSON.parse(v) as T);
        } catch {
          return d;
        }
      },
      set(k: string, v: unknown): boolean {
        try {
          localStorage.setItem(k, JSON.stringify(v));
          return true;
        } catch {
          return false;
        }
      },
      del(k: string) {
        try {
          localStorage.removeItem(k);
        } catch {
          // ignore
        }
      },
    };

    const RM = matchMedia('(prefers-reduced-motion: reduce)');
    const iso = (d: Date) => new Date(d.getTime() - d.getTimezoneOffset() * 6e4).toISOString().slice(0, 10);
    const uniq = <T,>(a: T[]) => a.filter((k, i) => a.indexOf(k) === i);

    const NAV: Array<[string, string, string]> = [
      ['inicio', 'Calendario', 'i-cal'],
      ['estimar', 'Estimar', 'i-spark'],
      ['queesperar', 'Qué esperar', 'i-book'],
      ['preguntas', 'Preguntas', 'i-help'],
      ['perfil', 'Mi perfil', 'i-user'],
    ];

    const MOODS = [
      { n: 'Feliz', e: '😊', v: 6 },
      { n: 'Tranquila', e: '🌷', v: 5 },
      { n: 'Cansada', e: '😴', v: 2 },
      { n: 'Nerviosa', e: '😬', v: 3 },
      { n: 'Triste', e: '😢', v: 1 },
      { n: 'Enojada', e: '😠', v: 2 },
      { n: 'Confundida', e: '🤔', v: 3 },
      { n: 'Sensible', e: '🥺', v: 2 },
    ];

    const CARDS = [
      {
        id: 'mamas',
        t: 'Crecimiento de mamas',
        p: 'Suele ser uno de los primeros cambios. Pueden crecer poco a poco, a veces una más que la otra, y dar un poco de sensibilidad. Es normal.',
      },
      {
        id: 'vello',
        t: 'Vello',
        p: 'Pueden salir vellitos en las axilas o en la zona púbica, al principio finitos y claros. Con el tiempo crecen y es parte del desarrollo.',
      },
      {
        id: 'sudor',
        t: 'Sudoración y olor',
        p: 'El cuerpo suda más y el olor cambia un poco. Bañarte a diario y usar desodorante ayuda mucho.',
      },
      {
        id: 'humor',
        t: 'Cambios de humor y sueño',
        p: 'Las hormonas pueden hacer que tus ánimos o tu sueño cambien: un día con mucha energía y otro día más sensible o cansada. Si te sientes mal por mucho tiempo, cuéntaselo a alguien de confianza.',
      },
      {
        id: 'flujo',
        t: 'Flujo blanco o transparente',
        p: 'Puede aparecer un flujo blanco o transparente en la ropa interior. Es señal de que el cuerpo se está preparando. Si cambia de color, huele fuerte o te molesta, consulta a tu pediatra.',
      },
      {
        id: 'toallas',
        t: 'Cómo usar una toalla sanitaria',
        p: 'Pégala en el centro del calzón y cámbiala cada 4 a 6 horas o cuando se llene. Lávate las manos antes y después, y guarda una en tu mochila para estar tranquila.',
      },
    ];

    const STAGES = ['Inicio', 'En camino', 'Cerca'];
    const STAGE_TXT = [
      'Los cambios pueden estar empezando.',
      'El cuerpo se está preparando poco a poco.',
      'La menstruación podría llegar en los próximos meses.',
    ];
    const DIAS = ['D', 'L', 'M', 'X', 'J', 'V', 'S'];

    const star = (cx: number, cy: number, R: number, r: number, f: string) => {
      const p: string[] = [];
      for (let i = 0; i < 10; i++) {
        const a = -Math.PI / 2 + (i * Math.PI) / 5;
        const q = i % 2 ? r : R;
        p.push((cx + q * Math.cos(a)).toFixed(1) + ',' + (cy + q * Math.sin(a)).toFixed(1));
      }
      return `<polygon points="${p.join(' ')}" fill="${f}" stroke="#fff" stroke-width="1"/>`;
    };

    const heart = (x: number | string, y: number | string, s: number, f: string) =>
      `<path transform="translate(${x},${y}) scale(${s})" d="M10 18C-2 10 0 2 5 3c2 0 4 2 5 3 1-1 3-3 5-3 5-1 7 7-5 15z" fill="${f}"/>`;

    const FR: Record<string, { l: string; s: string }> = {
      none: { l: 'Sin marco', s: '' },
      circulo: { l: 'Círculo', s: '<circle cx="50" cy="50" r="46" fill="none" stroke="#9B8CF0" stroke-width="4"/>' },
      flores: {
        l: 'Flores',
        s: [0, 60, 120, 180, 240, 300]
          .map((a) => {
            const r = (a * Math.PI) / 180;
            return `<circle cx="${(50 + 47 * Math.cos(r)).toFixed(1)}" cy="${(50 + 47 * Math.sin(r)).toFixed(1)}" r="8" fill="#F9A8D4" stroke="#fff" stroke-width="1.5"/>`;
          })
          .join(''),
      },
      estrellas: {
        l: 'Estrellas',
        s: [0, 72, 144, 216, 288]
          .map((a) => {
            const r = ((a - 90) * Math.PI) / 180;
            return star(50 + 48 * Math.cos(r), 50 + 48 * Math.sin(r), 7, 3.2, '#FFD97A');
          })
          .join(''),
      },
      corazon: {
        l: 'Corazón',
        s: [45, 135, 225, 315]
          .map((a) => {
            const r = (a * Math.PI) / 180;
            return heart((50 + 48 * Math.cos(r) - 10).toFixed(1), (50 + 48 * Math.sin(r) - 10).toFixed(1), 0.9, '#F06292');
          })
          .join(''),
      },
      luna: {
        l: 'Luna',
        s: '<path d="M86 6a9 9 0 1 0 8 14 7 7 0 1 1-8-14z" fill="#FFD97A"/><circle cx="8" cy="20" r="2.5" fill="#fff"/><circle cx="14" cy="80" r="2" fill="#fff"/><circle cx="90" cy="78" r="2.5" fill="#fff"/>',
      },
      mariposa: {
        l: 'Mariposa',
        s: '<ellipse cx="10" cy="22" rx="10" ry="13" transform="rotate(-30 10 22)" fill="#C4B5FD"/><ellipse cx="90" cy="22" rx="10" ry="13" transform="rotate(30 90 22)" fill="#C4B5FD"/><ellipse cx="14" cy="72" rx="7" ry="9" transform="rotate(25 14 72)" fill="#F9A8D4"/><ellipse cx="86" cy="72" rx="7" ry="9" transform="rotate(-25 86 72)" fill="#F9A8D4"/>',
      },
      corona: {
        l: 'Corona',
        s: '<circle cx="50" cy="50" r="46" fill="none" stroke="#F7DC8A" stroke-width="3"/><path d="M34 14l7 8 9-13 9 13 7-8-3 15H37z" fill="#F9E4A0" stroke="#fff" stroke-width="1.5"/>',
      },
      arcoiris: {
        l: 'Arcoíris',
        s: '<circle cx="50" cy="50" r="47.5" fill="none" stroke="#F7B8C8" stroke-width="2.5"/><circle cx="50" cy="50" r="45" fill="none" stroke="#FBE0A8" stroke-width="2.5"/><circle cx="50" cy="50" r="42.5" fill="none" stroke="#BFE6CF" stroke-width="2.5"/><circle cx="50" cy="50" r="40" fill="none" stroke="#BCD6F2" stroke-width="2.5"/>',
      },
      globos: {
        l: 'Globos',
        s: '<ellipse cx="18" cy="16" rx="8" ry="10" fill="#F7B8C8"/><ellipse cx="34" cy="8" rx="7" ry="9" fill="#BCD6F2"/><ellipse cx="82" cy="14" rx="8" ry="10" fill="#FBE0A8"/><ellipse cx="68" cy="7" rx="7" ry="9" fill="#BFE6CF"/><path d="M18 26q4 14 10 22M34 17q6 16 8 28M82 24q-4 14-10 24M68 16q-6 16-8 28" stroke="#fff" stroke-width="1.2" fill="none"/>',
      },
      confeti: {
        l: 'Confeti',
        s: (
          [
            [10, 30, '#F7B8C8'],
            [20, 12, '#BCD6F2'],
            [50, 3, '#FBE0A8'],
            [80, 10, '#BFE6CF'],
            [92, 32, '#F7B8C8'],
            [94, 60, '#BCD6F2'],
            [85, 86, '#FBE0A8'],
            [55, 94, '#BFE6CF'],
            [25, 88, '#F7B8C8'],
            [4, 64, '#BCD6F2'],
          ] as Array<[number, number, string]>
        )
          .map(([x, y, c]) => `<rect x="${x}" y="${y}" width="6" height="6" rx="1.5" fill="${c}" transform="rotate(${x * 3} ${x} ${y})"/>`)
          .join(''),
      },
      nubes: {
        l: 'Nubes',
        s: '<ellipse cx="14" cy="60" rx="14" ry="8" fill="#fff" stroke="#BCD6F2" stroke-width="1.5"/><ellipse cx="88" cy="30" rx="14" ry="8" fill="#fff" stroke="#BCD6F2" stroke-width="1.5"/><ellipse cx="80" cy="88" rx="12" ry="7" fill="#fff" stroke="#BCD6F2" stroke-width="1.5"/>',
      },
      lazo: {
        l: 'Lazo',
        s: '<circle cx="50" cy="50" r="46" fill="none" stroke="#F7B8C8" stroke-width="3"/><ellipse cx="40" cy="8" rx="11" ry="6" fill="#F7B8C8" transform="rotate(-20 40 8)"/><ellipse cx="60" cy="8" rx="11" ry="6" fill="#F7B8C8" transform="rotate(20 60 8)"/><circle cx="50" cy="8" r="4.5" fill="#EE92AE"/>',
      },
      f_aniversario: {
        l: 'Corona 8 Nov',
        s:
          '<circle cx="50" cy="50" r="46.5" fill="none" stroke="#F3C66F" stroke-width="3.5"/>' +
          '<path d="M32 13l8 9 10-14 10 14 8-9-3 15H35z" fill="#FFD97A" stroke="#fff" stroke-width="1.5"/>' +
          [35, 145, 215, 325]
            .map((a) => {
              const r = (a * Math.PI) / 180;
              return star(50 + 46 * Math.cos(r), 50 + 46 * Math.sin(r), 6.5, 3, '#F06292');
            })
            .join(''),
      },
      f_navidad: {
        l: 'Navidad',
        s:
          '<circle cx="50" cy="50" r="46" fill="none" stroke="#8CCB9B" stroke-width="3.5"/>' +
          [20, 70, 120, 200, 250, 310]
            .map((a) => {
              const r = (a * Math.PI) / 180;
              return `<circle cx="${(50 + 46 * Math.cos(r)).toFixed(1)}" cy="${(50 + 46 * Math.sin(r)).toFixed(1)}" r="4" fill="#F28B9B" stroke="#fff" stroke-width="1"/>`;
            })
            .join('') +
          '<ellipse cx="42" cy="5" rx="9" ry="5" fill="#F28B9B" transform="rotate(-20 42 5)"/><ellipse cx="58" cy="5" rx="9" ry="5" fill="#F28B9B" transform="rotate(20 58 5)"/><circle cx="50" cy="6" r="4" fill="#E26A7E"/>',
      },
      f_halloween: {
        l: 'Halloween',
        s: '<circle cx="50" cy="50" r="46" fill="none" stroke="#F7B27A" stroke-width="3.5"/><ellipse cx="50" cy="7" rx="11" ry="8" fill="#F7A55E" stroke="#fff" stroke-width="1.2"/><rect x="48" y="-2" width="4" height="6" rx="1.5" fill="#8CCB9B"/><path d="M6 76q5-9 10 0q3-4 6 2q-8 4-16-2z" fill="#9B8CC4"/><path d="M78 76q5-9 10 0q3-4 6 2q-8 4-16-2z" fill="#9B8CC4"/>',
      },
      f_sanvalentin: {
        l: 'San Valentín',
        s:
          '<circle cx="50" cy="50" r="46" fill="none" stroke="#F7B8C8" stroke-width="3"/>' +
          (
            [
              [50, 2, '#F06292'],
              [2, 38, '#F8A5C2'],
              [88, 38, '#F8A5C2'],
              [14, 78, '#F06292'],
              [76, 78, '#F06292'],
            ] as Array<[number, number, string]>
          )
            .map(([x, y, c]) => heart(x - 5, y - 5, 0.8, c))
            .join(''),
      },
      f_primavera: {
        l: 'Primavera',
        s:
          '<circle cx="50" cy="50" r="46" fill="none" stroke="#A7E0B5" stroke-width="3"/>' +
          (
            [
              [50, 4],
              [8, 34],
              [92, 34],
              [18, 84],
              [82, 84],
            ] as Array<[number, number]>
          )
            .map(
              ([x, y]) =>
                [0, 72, 144, 216, 288]
                  .map((a) => {
                    const r = (a * Math.PI) / 180;
                    return `<circle cx="${(x + 5 * Math.cos(r)).toFixed(1)}" cy="${(y + 5 * Math.sin(r)).toFixed(1)}" r="3.4" fill="#F9A8D4"/>`;
                  })
                  .join('') + `<circle cx="${x}" cy="${y}" r="2.6" fill="#FFD97A"/>`
            )
            .join(''),
      },
    };

    const FR_BASE = ['none', 'circulo', 'flores', 'estrellas', 'corazon', 'luna', 'mariposa'];

    // 4. Ajustes en Fondos: Bloquear subidas de usuario (sin 'propio')
    const BG: Record<string, { l: string; v: string; img?: string }> = {
      lavanda: { l: 'Lavanda', v: '#F9F7FD' },
      crema: { l: 'Crema', v: '#FBF6EC' },
      'lila-rosa': { l: 'Lila a rosa', v: 'linear-gradient(160deg,#EFE9FF,#FDE7F1)' },
      'menta-azul': { l: 'Menta a azul', v: 'linear-gradient(160deg,#E3F8EF,#E2EEFB)' },
      atardecer: { l: 'Atardecer', v: 'linear-gradient(160deg,#FFE5D6,#F9D2E6 55%,#DCD3F7)' },
      nube: { l: 'Nube', v: 'linear-gradient(160deg,#F2F8FF,#E3EEFB)' },
      durazno: { l: 'Durazno', v: 'linear-gradient(160deg,#FFF1E3,#FFD9D2)' },
      helado: { l: 'Helado', v: 'linear-gradient(160deg,#FFE3F1,#E1F5EA 55%,#E3ECFF)' },
      bosque: { l: 'Bosque', v: 'linear-gradient(160deg,#E7F6E8,#D8EEE9)' },
      oceano: { l: 'Océano', v: 'linear-gradient(160deg,#DFF1FB,#D8DDF8)' },
    };

    const BG_BASE = ['lavanda', 'crema', 'lila-rosa', 'menta-azul'];

    // Registrar fondos de celebraciones y Regalos Diarios
    HOLIDAYS.forEach((h) => {
      h.wallpapers.forEach((w) => {
        BG[w.id] = {
          l: w.label,
          v: w.value,
          img: w.image,
        };
      });
    });

    DAILY_WALLPAPERS.forEach((w) => {
      BG[w.id] = {
        l: w.label,
        v: w.value,
        img: w.image,
      };
    });

    const YN3: Array<[string, string]> = [
      ['si', 'Sí'],
      ['no', 'No'],
      ['nose', 'No sé'],
    ];
    const YN: Array<[string, string]> = [
      ['si', 'Sí'],
      ['no', 'No'],
    ];
    const QS: Array<[string, string, Array<[string, string]>]> = [
      ['mamas', '¿Ya notas que te están creciendo las mamas?', YN3],
      [
        'vello',
        '¿En qué zona te ha salido vello?',
        [
          ['ninguno', 'Todavía no'],
          ['axilas', 'Solo en las axilas'],
          ['publica', 'Solo en la zona púbica'],
          ['ambas', 'En axilas y zona púbica'],
          ['nose', 'No sé'],
        ],
      ],
      [
        'crece',
        '¿Cuánto creciste de estatura en el último año?',
        [
          ['menos4', 'Menos de 4 cm'],
          ['m4a7', 'De 4 a 7 cm'],
          ['mas7', 'Más de 7 cm'],
          ['nose', 'No sé'],
        ],
      ],
      ['piel', '¿Te han salido granitos o notas más olor corporal?', YN3],
      ['forma', '¿Tu cuerpo ha empezado a cambiar de forma (caderas o cintura)?', YN3],
      [
        'familia',
        '¿A qué edad le llegó la menstruación a tu mamá o a tu hermana mayor?',
        [
          ['menor11', 'Antes de los 11 años'],
          ['11a12', 'Entre 11 y 12 años'],
          ['mas13', 'A los 13 años o después'],
          ['nose', 'No sé'],
        ],
      ],
      ['flujo', '¿Has notado flujo o manchas en tu ropa interior?', YN],
    ];

    /* ---------- Estado general ---------- */
    let regMoods: number[] = [];
    let calMonth = new Date();
    let selDay = iso(new Date());

    // Token en memoria (nunca en localStorage según directriz de seguridad)
    let sessionAuthToken: string | null = null;
    let accountInfo = store.get<CloudAccountInfo | null>('menarca_account_info', null);

    let prof = Object.assign(
      { nick: '', frame: 'none', bg: 'lavanda', sparkle: false, activeBadge: '' },
      store.get<Record<string, unknown>>('menarca_perfil', {})
    ) as {
      nick: string;
      frame: string;
      bg: string;
      sparkle: boolean;
      activeBadge: string;
    };
    if (prof.bg === 'propio' || !BG[prof.bg]) {
      prof.bg = 'lavanda';
    }

    let foto = store.get<string | null>('menarca_foto', null);
    let bday = store.get<{ d: number; m: number } | null>('menarca_bday', null);
    let regalos = store.get<StoredGift[]>('menarca_regalos', []);
    let dailyClaims = store.get<Record<string, string>>('menarca_daily_wallpapers', {});
    let todayDailyWpId = '';

    const storedPet = store.get<Partial<PetState>>('menarca_mascota', {});
    const validPetId = VIRTUAL_PETS.some((p) => p.id === storedPet.id)
      ? storedPet.id!
      : VIRTUAL_PETS[0].id;
    let petState: PetState = {
      id: validPetId,
    };

    const saveProf = () => {
      store.set('menarca_perfil', prof);
      triggerCloudSync();
    };

    const savePet = () => {
      store.set('menarca_mascota', petState);
      triggerCloudSync();
    };

    /* ---------- 4. Regalo Diario de Fondo de Pantalla ---------- */
    function checkDailyWallpaperGift() {
      const todayKey = iso(new Date());
      const res = claimDailyWallpaperGift(todayKey, dailyClaims);
      dailyClaims = res.updatedClaims;
      todayDailyWpId = res.wallpaper.id;
      store.set('menarca_daily_wallpapers', dailyClaims);
      if (res.isNewToday) {
        triggerCloudSync();
      }
      return res;
    }

    const dailyGiftInfo = checkDailyWallpaperGift();

    /* ---------- 1. Sincronización en la Nube y Sistema de Cuentas ---------- */
    function buildCloudPayload() {
      return {
        animo: store.get<DayEntry[]>('menarca_animo', []),
        perfil: prof,
        regalos,
        etapa: store.get<MenarcaEstimate | null>('menarca_etapa', null),
        bday,
        mascota: petState,
        dailyClaims,
        foto,
        updatedAt: new Date().toISOString(),
      };
    }

    function applyCloudPayload(payload: Record<string, any>) {
      if (!payload || typeof payload !== 'object') return;
      if (Array.isArray(payload.animo)) {
        store.set('menarca_animo', payload.animo);
      }
      if (payload.perfil && typeof payload.perfil === 'object') {
        prof = Object.assign(
          { nick: '', frame: 'none', bg: 'lavanda', sparkle: false, activeBadge: '' },
          payload.perfil
        );
        if (!BG[prof.bg]) prof.bg = 'lavanda';
        store.set('menarca_perfil', prof);
      }
      if (Array.isArray(payload.regalos)) {
        regalos = payload.regalos;
        store.set('menarca_regalos', regalos);
      }
      if (payload.etapa) {
        store.set('menarca_etapa', payload.etapa);
      }
      if (payload.bday) {
        bday = payload.bday;
        store.set('menarca_bday', bday);
      }
      if (payload.mascota && typeof payload.mascota === 'object') {
        petState = Object.assign(petState, payload.mascota);
        if (!VIRTUAL_PETS.some((p) => p.id === petState.id)) {
          petState.id = VIRTUAL_PETS[0].id;
        }
        store.set('menarca_mascota', petState);
      }
      if (payload.dailyClaims && typeof payload.dailyClaims === 'object') {
        dailyClaims = { ...payload.dailyClaims, ...dailyClaims };
        store.set('menarca_daily_wallpapers', dailyClaims);
      }
      if (typeof payload.foto === 'string') {
        foto = payload.foto;
        store.set('menarca_foto', foto);
      }
      renderPerfil();
      renderHome();
    }

    let syncTimer: any = null;
    function triggerCloudSync() {
      if (!sessionAuthToken) return;
      if (syncTimer) clearTimeout(syncTimer);
      syncTimer = setTimeout(async () => {
        try {
          const res = await fetch('/api/sync', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${sessionAuthToken}`,
            },
            body: JSON.stringify({ payload: buildCloudPayload() }),
          });
          if (res.ok && accountInfo) {
            accountInfo.lastSyncIso = new Date().toLocaleTimeString('es', {
              hour: '2-digit',
              minute: '2-digit',
            });
            store.set('menarca_account_info', accountInfo);
            renderAccountStatus();
          }
        } catch {
          // Falla silenciosa sin interrumpir la experiencia de la usuaria
        }
      }, 300);
    }

    function renderAccountStatus() {
      const badgeTop = $('#btn-cloud-top .bi-txt');
      if (badgeTop) {
        badgeTop.textContent = accountInfo ? accountInfo.email.split('@')[0] : 'Mi Cuenta';
      }
      const statusBoxes = $$('.acct-status-box');
      statusBoxes.forEach((box) => {
        if (accountInfo) {
          box.innerHTML = `<div class="acct-connected">
            <div>
              <b>☁️ Cuenta conectada: ${esc(accountInfo.email)}</b>
              <p class="muted" style="margin:2px 0 0;font-size:13px">Tus registros diarios, insignias, fondos, mascota y progreso están sincronizados${accountInfo.lastSyncIso ? ` (última sincr. ${accountInfo.lastSyncIso})` : ''}.</p>
            </div>
            <div style="display:flex;gap:8px;flex-wrap:wrap">
              <button class="btn ghost btn-sync-now" type="button">Sincronizar ahora</button>
              <button class="btn ghost btn-acct-open" type="button">Cambiar cuenta</button>
              <button class="btn ghost btn-acct-logout" type="button">Cerrar sesión</button>
            </div>
          </div>`;
        } else {
          box.innerHTML = `<div class="acct-disconnected">
            <div>
              <b>☁️ Sincronización en la nube disponible</b>
              <p class="muted" style="margin:2px 0 0;font-size:13px">Inicia sesión o regístrate con tu correo y contraseña o patrón para guardar tus registros, insignias, fondos y progreso en cualquier dispositivo.</p>
            </div>
            <button class="btn btn-acct-open" type="button">Iniciar sesión / Crear cuenta</button>
          </div>`;
        }
      });
    }

    /* ---------- 4. Exportar historial a JSON descargable ---------- */
    function exportHistoryToJson() {
      const entries = store.get<DayEntry[]>('menarca_animo', []);
      const jsonContent = buildHistoryExportJson({
        entries,
        profileNick: prof.nick || accountInfo?.email || 'Usuaria',
        petId: petState.id,
        exportedAtIso: new Date().toISOString(),
      });
      const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `perday-historial-${iso(new Date())}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 1500);
      showTip('📥 Se descargó tu copia de seguridad de PerDay en formato JSON.');
    }

    /* ---------- 3. Mascotas Decorativas en el Inicio (21 nuevas imágenes) ---------- */
    function renderPetSection() {
      const host = $('#pet-section-host');
      if (!host) return;
      const currentPet = VIRTUAL_PETS.find((p) => p.id === petState.id) || VIRTUAL_PETS[0];

      host.innerHTML = `<div class="pet-showcase decorative-only">
        <div class="pet-main decorative">
          <div class="pet-avatar-wrap">
            <img src="${currentPet.image}" alt="${esc(currentPet.defaultName)}" class="pet-img" referrerpolicy="no-referrer"/>
          </div>
          <div class="pet-info">
            <div class="pet-title-row">
              <h3>${currentPet.emoji} ${esc(currentPet.defaultName)}</h3>
              <span class="pet-species-tag">Mascota decorativa · ${currentPet.species}</span>
            </div>
            <p class="muted" style="margin:4px 0 0;font-size:14px">${esc(currentPet.caption)}</p>
          </div>
        </div>
        <div class="pet-picker-wrap">
          <p class="muted" style="margin:0 0 8px;font-size:13px;font-weight:600">Elige tu mascota decorativa para adornar el Inicio (${VIRTUAL_PETS.length} disponibles):</p>
          <div class="pet-picker" id="pet-picker">
            ${VIRTUAL_PETS.map(
              (p) => `<button type="button" class="pet-opt${p.id === currentPet.id ? ' on' : ''}" data-pet-id="${p.id}" aria-pressed="${p.id === currentPet.id}" title="${p.defaultName}">
                <img src="${p.image}" alt="${p.defaultName}" referrerpolicy="no-referrer"/>
                <span>${p.defaultName}</span>
              </button>`
            ).join('')}
          </div>
        </div>
      </div>`;

      const picker = $('#pet-picker');
      if (picker) {
        picker.onclick = (ev) => {
          const btn = (ev.target as HTMLElement).closest<HTMLElement>('[data-pet-id]');
          if (!btn) return;
          petState.id = btn.dataset.petId!;
          savePet();
          renderPetSection();
        };
      }
    }

    /* ---------- Navegación ---------- */
    function go(v: string) {
      const reg = v === 'registro';
      if (reg) v = 'inicio';
      if (!$('#v-' + v)) return;
      $$('.view').forEach((s) => s.classList.toggle('on', s.id === 'v-' + v));
      $$('.navbtn').forEach((b) => b.classList.toggle('on', (b as HTMLElement).dataset.go === v));
      window.scrollTo(0, 0);
      if (v === 'inicio') renderHome();
      if (v === 'perfil') renderPerfil();
      if (reg) {
        $('#day-card')?.scrollIntoView({ behavior: RM.matches ? 'auto' : 'smooth', block: 'start' });
      }
    }

    function mkNav([v, t, i]: [string, string, string]) {
      const b = document.createElement('button');
      b.className = 'navbtn' + (v === 'inicio' ? ' on' : '');
      b.type = 'button';
      b.dataset.go = v;
      if (v === 'queesperar') b.classList.add('mid');
      b.innerHTML = `<svg class="i"><use href="#${i}"/></svg><span>${t}</span>`;
      return b;
    }

    /* ---------- Estimación ---------- */
    const addM = (d: Date, m: number) => new Date(d.getTime() + m * 30.44 * 864e5);
    const monthYear = (d: Date) => d.toLocaleDateString('es', { month: 'long', year: 'numeric' });

    function fechasTxt(a: number, b: number) {
      const now = new Date();
      if (b <= 0) return 'Podría llegar en cualquier momento.';
      if (b <= 1) return 'Podría llegar en las próximas semanas.';
      return a <= 0.5
        ? `Más o menos desde ya hasta ${monthYear(addM(now, b))}.`
        : `Más o menos entre ${monthYear(addM(now, a))} y ${monthYear(addM(now, b))}.`;
    }

    function rangoTxt(a: number, b: number) {
      if (b <= 24) return `entre ${Math.round(a)} y ${Math.round(b)} meses`;
      const f = (x: number) => (Math.round(x / 6) / 2).toString().replace('.', ',');
      return `entre ${f(a)} y ${f(b)} años`;
    }

    function estimar(d: Record<string, string>) {
      const history = store.get<DayEntry[]>('menarca_animo', []);
      return calcularEstimacionMenarca(d, history, iso(new Date()));
    }

    function mapaSvg(r: { wMin: number; wMax: number }) {
      const x0 = 24;
      const x1 = 296;
      const M = Math.max(24, Math.ceil((r.wMax + 6) / 6) * 6);
      const X = (m: number) => x0 + ((x1 - x0) * Math.min(m, M)) / M;
      const lab = (m: number) => {
        if (m === 0) return 'Hoy';
        if (m >= 12 && m % 6 === 0) {
          const y = m / 12;
          return y === 1 ? '1 año' : `${String(y).replace('.', ',')} años`;
        }
        return `${m} meses`;
      };
      const a = X(r.wMin);
      const b = X(r.wMax);
      return `<svg class="mapa" viewBox="0 0 320 130" role="img" aria-label="Mapa de cuándo podría llegar tu periodo">
<defs><linearGradient id="gm" x1="0" x2="1"><stop offset="0" stop-color="#6FD3A4"/><stop offset="1" stop-color="#6FA8D6"/></linearGradient></defs>
<rect x="${x0}" y="58" width="${x1 - x0}" height="14" rx="7" fill="url(#gm)" opacity=".55"/>
<rect x="${a}" y="42" width="${Math.max(12, b - a)}" height="46" rx="12" fill="#F06292" fill-opacity=".35" stroke="#F06292" stroke-width="2"/>
<circle cx="${x0}" cy="65" r="7" fill="#A99BE0"/>
<text x="${(a + b) / 2}" y="34" text-anchor="middle">Ventana probable</text>
<text x="${x0}" y="108" text-anchor="start">${lab(0)}</text>
<text x="${(x0 + x1) / 2}" y="108" text-anchor="middle">${lab(M / 2)}</text>
<text x="${x1}" y="108" text-anchor="end">${lab(M)}</text>
</svg>`;
    }

    function showResult(
      r: {
        etapa: number;
        wMin: number;
        wMax: number;
        flujo: boolean;
        rango: string;
        symptomCountUsed?: number;
        matchedSymptoms?: string[];
      },
      edad: number
    ) {
      const box = $('#resultado')!;
      const sent = r.flujo
        ? 'Es probable que tu primera menstruación ya haya empezado o esté muy cerca.'
        : `Es probable que tu primera menstruación llegue ${r.rango}.`;
      const symNote =
        r.matchedSymptoms && r.matchedSymptoms.length
          ? `<p style="margin:6px 0 0;font-size:14px">✨ Se incluyeron tus síntomas físicos registrados (${r.matchedSymptoms.join(', ')}) para afinar esta predicción.</p>`
          : `<p style="margin:6px 0 0;font-size:14px">💡 Registra tus síntomas físicos en el calendario para afinar aún más tu predicción.</p>`;
      box.innerHTML =
        (r.flujo
          ? '<div class="card warn"><p style="margin:0">Probablemente ya estás cerca o ya empezó tu primera menstruación. Conviene hablar con un adulto de confianza, como tu mamá, tu papá o una maestra.</p></div>'
          : '') +
        `<div class="res"><p>Tu estimación en PerDay</p><p class="est">${sent}</p><p>${fechasTxt(r.wMin, r.wMax)}</p>${symNote}<p>Cada cuerpo tiene su propio ritmo. No existe una fecha "correcta" para que llegue.</p></div>` +
        `<div class="card"><h2>Tu mapa</h2>${mapaSvg(r)}<p class="muted" style="margin:6px 0 0;font-size:14px">La zona rosa muestra cuándo podría llegar según tus respuestas y tus síntomas registrados.</p></div>` +
        `<div class="card"><h2>Etapa de la pubertad</h2><div class="stages">${[0, 1, 2].map((i) => `<div class="stage${i <= r.etapa ? ' on' : ''}"></div>`).join('')}</div><div class="stage-lbl">${STAGES.map((s, i) => `<span class="${i === r.etapa ? 'on' : ''}">${s}</span>`).join('')}</div><p class="muted" style="margin:0">${STAGE_TXT[r.etapa]}</p></div>` +
        (edad >= 15 && !r.flujo
          ? '<div class="card"><p style="margin:0">Si ya tienes 15 años o más y todavía no te ha llegado la menstruación, conviene comentarlo con tu pediatra.</p></div>'
          : '') +
        '<div class="card disc"><p>Esta es una estimación, no un diagnóstico. Si tienes dudas sobre tu desarrollo, habla con un adulto de confianza o con tu pediatra.</p></div>' +
        '<button class="btn ghost block" id="again" type="button">Hacer otra estimación</button>';
      box.hidden = false;
      $('#card-form')!.hidden = true;
      $('#again')!.onclick = () => {
        box.hidden = true;
        $('#card-form')!.hidden = false;
        window.scrollTo(0, 0);
      };
      window.scrollTo(0, 0);
    }

    /* ---------- Inicio: hoy y Banner de Aniversario / Regalo Diario (10 Fondos) ---------- */
    function renderHoy() {
      const h = store.get<DayEntry[]>('menarca_animo', []);
      const todayKey = iso(new Date());
      const t = h.find((x) => x.d === todayKey);
      const moodIdxs = t ? getEntryMoodIndices(t) : [];
      $('#hoy-animo')!.textContent = moodIdxs.length
        ? moodIdxs
            .filter((idx) => Boolean(MOODS[idx]))
            .map((idx) => `${MOODS[idx].e} ${MOODS[idx].n}`)
            .join(' · ')
        : 'Aún sin registrar';
      const e = store.get<MenarcaEstimate | null>('menarca_etapa', null);
      $('#hoy-etapa')!.textContent = e ? 'Etapa: ' + STAGES[e.etapa] : 'Haz una estimación';

      const healthEl = $('#hoy-salud');
      if (healthEl) {
        const symsCount = t?.dolor?.length || 0;
        const symTxt = symsCount
          ? `🩺 ${symsCount} ${symsCount === 1 ? 'síntoma registrado' : 'síntomas registrados'}`
          : '🩺 Sin síntomas hoy';
        const pesoTxt = t?.peso ? ` · ⚖️ ${t.peso} kg` : '';
        healthEl.textContent = `${symTxt}${pesoTxt}`;
      }

      const bi = bdayInfo();
      const bl = $('#hoy-bday')!;
      if (bi && bi.diff >= 0) {
        bl.hidden = false;
        bl.textContent =
          bi.diff === 0
            ? '🎂 ¡Hoy es tu cumpleaños! Tu sorpresa está desbloqueada'
            : `🎂 Faltan ${bi.diff} ${bi.diff === 1 ? 'día' : 'días'} para tu cumple (sorpresa bloqueada hasta ese día)`;
      } else {
        bl.hidden = true;
      }

      const bannerHost = $('#aniv-banner-host');
      if (bannerHost) {
        const active = detectActiveHoliday(new Date());
        const dailyWp = DAILY_WALLPAPERS.find((w) => w.id === todayDailyWpId) || dailyGiftInfo.wallpaper;
        const streakDay = ((dailyGiftInfo.streakCount - 1) % 10) + 1;
        let html = '';

        if (active) {
          const hEv = active.holiday;
          const rewards = getHolidayRewards(hEv);
          const badgeImgs = rewards
            .filter((r) => r.kind === 'badge' && r.image)
            .map(
              (r) =>
                `<span class="aniv-mini-badge" title="${r.label}"><img src="${r.image}" alt="${r.label}" referrerpolicy="no-referrer"/></span>`
            )
            .join('');
          html += `<div class="card span3 aniv-banner" style="margin-bottom:16px">
            <div style="display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap">
              <div style="flex:1;min-width:240px">
                <h2 style="margin:0 0 6px">${hEv.title}</h2>
                <p class="muted" style="margin:0 0 10px">${hEv.message}</p>
                <div class="aniv-preview-strip">${badgeImgs}</div>
              </div>
              <div style="display:flex;gap:10px;flex-wrap:wrap">
                <button class="btn" type="button" id="btn-open-aniv">Ver mis ${rewards.length} recompensas 🎁</button>
                <button class="btn ghost" type="button" data-go="perfil">Personalizar mi perfil</button>
              </div>
            </div>
          </div>`;
        }

        // Tarjeta de Regalo Diario: 1 de 10 fondos nuevos por cada día seguido
        html += `<div class="card span3 daily-gift-strip" style="margin-bottom:16px">
          <div style="display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap">
            <div style="display:flex;align-items:center;gap:12px">
              <span class="daily-gift-icon" aria-hidden="true">🎁</span>
              <div>
                <b style="font-size:15px">Regalo Diario (${streakDay}/10 días seguidos): ${esc(dailyWp.label)}</b>
                <p class="muted" style="margin:2px 0 0;font-size:13px">Entra cada día seguido a PerDay para coleccionar los 10 fondos diarios exclusivos (${dailyGiftInfo.totalUnlocked}/10 desbloqueados).</p>
              </div>
            </div>
            <button class="btn ghost" type="button" id="btn-use-daily-wp">Usar fondo de hoy ✨</button>
          </div>
        </div>`;

        bannerHost.innerHTML = html;
        const btnOpen = $('#btn-open-aniv');
        if (btnOpen && active) {
          btnOpen.onclick = () => celebHol(active.holiday, active.year, false);
        }
        const btnUseDaily = $('#btn-use-daily-wp');
        if (btnUseDaily) {
          btnUseDaily.onclick = () => {
            prof.bg = dailyWp.id;
            saveProf();
            applyBg();
            renderPerfil();
            showTip(`✨ Aplicaste tu Regalo Diario: ${dailyWp.label}`);
          };
        }
      }
    }

    /* ---------- Ánimo de la semana ---------- */
    function renderHistory() {
      const h = store.get<DayEntry[]>('menarca_animo', []);
      const box = $('#chart')!;
      box.innerHTML = '';
      for (let k = 6; k >= 0; k--) {
        const d = new Date();
        d.setDate(d.getDate() - k);
        const e = h.find((x) => x.d === iso(d));
        const bar = document.createElement('div');
        bar.className = 'bar';
        const em = document.createElement('em');
        const i = document.createElement('i');
        const s = document.createElement('span');
        s.textContent = DIAS[d.getDay()];
        const moodIdxs = e ? getEntryMoodIndices(e) : [];
        if (moodIdxs.length > 0 && MOODS[moodIdxs[0]]) {
          em.textContent = moodIdxs
            .slice(0, 2)
            .map((idx) => MOODS[idx]?.e || '')
            .join('');
          const avgV =
            moodIdxs.reduce((acc, idx) => acc + (MOODS[idx]?.v || 3), 0) / moodIdxs.length;
          i.style.height = Math.round(avgV * 14) + 'px';
        } else {
          i.style.height = '6px';
          i.style.opacity = '.35';
        }
        bar.append(em, i, s);
        box.appendChild(bar);
      }
      $('#hist-vacio')!.hidden = h.some((x) => getEntryMoodIndices(x).length > 0);
    }

    /* ---------- Perfil, Fondos e Insignias ---------- */
    const BADGES: Array<[string, string]> = [
      ['🎂', 'Pastelito'],
      ['🌈', 'Arcoíris'],
      ['🦄', 'Unicornio'],
      ['🌟', 'Estrella'],
      ['🍓', 'Fresita'],
      ['🦋', 'Mariposa'],
      ['🐱', 'Gatito'],
      ['🍭', 'Paleta'],
      ['🌸', 'Flor'],
      ['🎀', 'Lazo'],
      ['☁️', 'Nubecita'],
      ['🍉', 'Sandía'],
    ];

    function getUnlockedBadges(): BadgeAsset[] {
      const list: BadgeAsset[] = [];
      const seen = new Set<string>();
      regalos.forEach((g) => {
        if (g.badges && Array.isArray(g.badges)) {
          g.badges.forEach((b) => {
            if (!seen.has(b.id)) {
              seen.add(b.id);
              list.push(b);
            }
          });
        } else if (g.ins) {
          const id = 'legacy_' + (g.k || g.y) + '_' + g.ins[1];
          if (!seen.has(id)) {
            seen.add(id);
            list.push({
              id,
              name: g.ins[1],
              emoji: g.ins[0],
              image: g.ins[2],
              eventName: g.k || String(g.y),
            });
          }
        } else if (g.badge != null && BADGES[g.badge]) {
          const [em, nm] = BADGES[g.badge];
          const id = 'bday_' + g.y;
          if (!seen.has(id)) {
            seen.add(id);
            list.push({
              id,
              name: nm,
              emoji: em,
              eventName: `Cumple ${g.y}`,
            });
          }
        }
      });
      return list;
    }

    function getUnlockedWallpaperKeys(): string[] {
      const keys: string[] = [...BG_BASE];
      // Añadir fondos ganados por Regalo Diario
      Object.values(dailyClaims).forEach((wId) => {
        if (BG[wId] && !keys.includes(wId)) keys.push(wId);
      });
      // Añadir fondos ganados en Celebraciones / Cumpleaños
      regalos.forEach((g) => {
        if (g.wallpapers && Array.isArray(g.wallpapers)) {
          g.wallpapers.forEach((wId) => {
            if (BG[wId] && !keys.includes(wId)) keys.push(wId);
          });
        }
        if (g.fondo && BG[g.fondo] && !keys.includes(g.fondo)) {
          keys.push(g.fondo);
        }
      });
      return keys;
    }

    function frameSvg(k: string) {
      return `<svg viewBox="0 0 100 100" aria-hidden="true">${(FR[k] || FR.none).s}</svg>`;
    }

    function renderAvatar() {
      const av = $('#av')!;
      av.innerHTML = '';
      if (foto) {
        const im = new Image();
        im.src = foto;
        im.alt = 'Tu foto';
        av.appendChild(im);
      } else {
        av.textContent = prof.nick.trim() ? prof.nick.trim()[0].toUpperCase() : '🌙';
      }
      $('#av-frame')!.innerHTML = frameSvg(prof.frame);

      const ab = $('#av-badge')!;
      const unlocked = getUnlockedBadges();
      const chosen =
        unlocked.find((b) => b.id === prof.activeBadge) || unlocked[unlocked.length - 1] || null;
      if (chosen && prof.activeBadge !== 'none') {
        ab.hidden = false;
        if (chosen.image) {
          ab.innerHTML = `<img src="${chosen.image}" alt="Insignia ${chosen.name}" referrerpolicy="no-referrer"/>`;
        } else {
          ab.textContent = chosen.emoji;
        }
      } else {
        ab.hidden = true;
        ab.innerHTML = '';
      }
    }

    function renderBadgesSelector() {
      const host = $('#badges-sel');
      if (!host) return;
      const unlocked = getUnlockedBadges();
      if (!unlocked.length) {
        host.innerHTML =
          '<p class="muted" style="margin:0">Desbloquea insignias entrando en fechas festivas o en el Aniversario (8 y 9 de noviembre).</p>';
        return;
      }
      const activeId =
        prof.activeBadge || (unlocked[unlocked.length - 1] ? unlocked[unlocked.length - 1].id : 'none');
      host.innerHTML =
        `<button class="bdg-btn" type="button" data-bdg="none" aria-pressed="${activeId === 'none'}"><span class="bdg-thumb">🚫</span><span>Sin insignia</span></button>` +
        unlocked
          .map(
            (b) =>
              `<button class="bdg-btn" type="button" data-bdg="${b.id}" aria-pressed="${activeId === b.id}">
                <span class="bdg-thumb">${
                  b.image
                    ? `<img src="${b.image}" alt="${b.name}" referrerpolicy="no-referrer"/>`
                    : b.emoji
                }</span>
                <span>${b.name}</span>
              </button>`
          )
          .join('');
    }

    function renderFrames() {
      const frameKeys = FR_BASE.concat(uniq(regalos.map((g) => g.marco))).filter(
        (k, i, a) => Boolean(FR[k]) && a.indexOf(k) === i
      );
      $('#frames')!.innerHTML = frameKeys
        .map(
          (k) =>
            `<button class="fr" type="button" data-f="${k}" aria-pressed="${prof.frame === k}"><svg viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="42" fill="#C9C2EE"/>${FR[k].s}</svg><span>${FR[k].l}</span></button>`
        )
        .join('');
    }

    function renderBgs() {
      const bgKeys = getUnlockedWallpaperKeys();
      $('#bgs')!.innerHTML = bgKeys
        .map((k) => {
          const item = BG[k];
          if (!item) return '';
          const bgStyle = item.img
            ? `background-image:url('${item.img}');background-size:cover;background-position:center`
            : `background:${item.v}`;
          return `<button class="bgo" type="button" data-bg="${k}" aria-pressed="${prof.bg === k}" style="${bgStyle}"><span>${item.l}</span></button>`;
        })
        .join('');
    }

    function renderPerfil() {
      renderFrames();
      renderBgs();
      renderBadgesSelector();
      renderAvatar();
      ($('#nick') as HTMLInputElement).value = prof.nick;
      $$('.fr').forEach((b) =>
        b.setAttribute('aria-pressed', String((b as HTMLElement).dataset.f === prof.frame))
      );
      $$('.bgo').forEach((b) =>
        b.setAttribute('aria-pressed', String((b as HTMLElement).dataset.bg === prof.bg))
      );
      $('#sw-sp')!.setAttribute('aria-checked', String(!!prof.sparkle));
      renderSpark();
      applyBg();
      renderBday();
      renderFest();
      renderAccountStatus();
    }

    function renderSpark() {
      const L = $('#sparkles')!;
      L.innerHTML = '';
      if (!prof.sparkle || RM.matches) return;
      for (let i = 0; i < 16; i++) {
        const s = document.createElement('span');
        s.className = 'sp' + (i % 2 ? ' l' : '');
        const z = 4 + Math.random() * 4;
        Object.assign(s.style, {
          left: Math.random() * 100 + '%',
          top: Math.random() * 100 + '%',
          width: z + 'px',
          height: z + 'px',
          animationDelay: Math.random() * 4 + 's',
        });
        L.appendChild(s);
      }
    }

    function applyBg() {
      const b = $('#bgfx')!;
      const v = $('#veil')!;
      const dark = document.documentElement.dataset.theme === 'dark';
      b.style.background = '';
      v.style.display = 'none';
      if (BG[prof.bg]?.img) {
        b.style.background = `url("${BG[prof.bg].img}") center/cover fixed no-repeat`;
        v.style.background = dark ? 'rgba(24,20,52,.66)' : 'rgba(255,255,255,.68)';
        v.style.display = 'block';
      } else if (!dark && prof.bg !== 'lavanda' && BG[prof.bg]) {
        b.style.background = BG[prof.bg].v;
      }
    }

    /* Recorte de foto de avatar */
    const S = 240;
    let crop: {
      img: HTMLImageElement;
      w: number;
      h: number;
      z: number;
      x: number;
      y: number;
      s?: number;
    } | null = null;
    let drag: { x: number; y: number; ox: number; oy: number } | null = null;

    function openCrop(src: string) {
      const img = new Image();
      img.onload = () => {
        crop = { img, w: img.naturalWidth, h: img.naturalHeight, z: 1, x: 0, y: 0 };
        ($('#crop-img') as HTMLImageElement).src = src;
        ($('#zoom') as HTMLInputElement).value = '1';
        $('#crop-box')!.hidden = false;
        layoutCrop();
      };
      img.onerror = () => showTip('No pude abrir esa imagen. Prueba con otra.');
      img.src = src;
    }

    function layoutCrop() {
      if (!crop) return;
      const s = Math.max(S / crop.w, S / crop.h) * crop.z;
      const W = crop.w * s;
      const H = crop.h * s;
      const mx = (W - S) / 2;
      const my = (H - S) / 2;
      crop.x = Math.max(-mx, Math.min(mx, crop.x));
      crop.y = Math.max(-my, Math.min(my, crop.y));
      crop.s = s;
      const el = $('#crop-img')!;
      Object.assign(el.style, {
        width: W + 'px',
        height: H + 'px',
        left: (S - W) / 2 + crop.x + 'px',
        top: (S - H) / 2 + crop.y + 'px',
      });
    }

    function closeCrop() {
      crop = null;
      $('#crop-box')!.hidden = true;
      ($('#f-up') as HTMLInputElement).value = '';
      ($('#f-cam') as HTMLInputElement).value = '';
    }

    function readFile(file: File, cb: (res: string) => void) {
      const r = new FileReader();
      r.onload = () => cb(String(r.result));
      r.readAsDataURL(file);
    }

    /* ---------- Instalar y modo oscuro ---------- */
    let defer: any = null;
    let installed =
      matchMedia('(display-mode: standalone)').matches || (navigator as any).standalone === true;

    function paintInstall() {
      $$<HTMLButtonElement>('.btn-install-pwa').forEach((b) => {
        b.querySelector('.bi-txt')!.textContent = installed ? 'App instalada' : 'Instalar app';
        b.disabled = installed;
      });
    }

    function showTip(t: string) {
      $('#tip-txt')!.textContent = t;
      $('#tip')!.hidden = false;
    }

    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      defer = e;
    });
    window.addEventListener('appinstalled', () => {
      installed = true;
      defer = null;
      paintInstall();
    });

    function setTheme(t: string, save = true) {
      document.documentElement.dataset.theme = t;
      if (save) store.set('menarca_tema', t);
      $$<HTMLElement>('.toggle').forEach((b) => {
        b.dataset.mode = t;
        b.setAttribute('aria-checked', String(t === 'dark'));
        b.querySelector('.tl')!.textContent = t === 'dark' ? 'Oscuro' : 'Claro';
      });
      applyBg();
    }

    let ICON: string | null = null;
    function setupPwa() {
      try {
        const c = document.createElement('canvas');
        c.width = c.height = 180;
        const g = c.getContext('2d')!;
        const gr = g.createLinearGradient(0, 0, 180, 180);
        gr.addColorStop(0, '#6FD3A4');
        gr.addColorStop(1, '#6FA8D6');
        g.fillStyle = gr;
        g.beginPath();
        g.arc(90, 90, 90, 0, Math.PI * 2);
        g.fill();
        g.fillStyle = '#fff';
        g.beginPath();
        g.arc(86, 92, 52, 0, Math.PI * 2);
        g.fill();
        g.fillStyle = gr;
        g.beginPath();
        g.arc(112, 72, 44, 0, Math.PI * 2);
        g.fill();
        ICON = c.toDataURL('image/png');
      } catch {
        // ignore
      }
    }

    /* ---------- Registro diario (con Peso y Agua), Pronóstico y Tips Educativos ---------- */
    const FLU: Array<[string, string, string]> = [
      ['ninguno', 'Nada', '🚫'],
      ['blanco', 'Blanco o cremoso', '🥛'],
      ['claro', 'Transparente', '💧'],
      ['manchas', 'Manchas rosadas', '🩷'],
      ['cafe', 'Manchas café', '🤎'],
    ];
    const INT: Array<[string, string]> = [
      ['ligera', 'Ligera'],
      ['normal', 'Normal'],
      ['fuerte', 'Fuerte'],
    ];

    const entryOf = (d: string): DayEntry =>
      store.get<DayEntry[]>('menarca_animo', []).find((x) => x.d === d) || { d };
    const fmtDay = (d: string) =>
      new Date(d + 'T12:00').toLocaleDateString('es', { day: 'numeric', month: 'long' });
    const T12 = (d: string) => new Date(d + 'T12:00');
    const fmtShort = (d: Date) => d.toLocaleDateString('es', { day: 'numeric', month: 'short' });

    function periodStarts() {
      const set = new Set(
        store
          .get<DayEntry[]>('menarca_animo', [])
          .filter((x) => x.periodo === 'si')
          .map((x) => x.d)
          .sort()
      );
      return [...set].filter((d) => {
        const p = new Date(d + 'T12:00');
        p.setDate(p.getDate() - 1);
        return !set.has(iso(p));
      });
    }

    function predWin() {
      const s = periodStarts();
      if (s.length < 2) return null;
      const gaps: number[] = [];
      for (let i = 1; i < s.length; i++) {
        gaps.push(Math.round((T12(s[i]).getTime() - T12(s[i - 1]).getTime()) / 864e5));
      }
      let lo = Math.min(...gaps);
      let hi = Math.max(...gaps);
      if (lo === hi) {
        lo = Math.max(1, lo - 2);
        hi += 2;
      }
      const last = T12(s[s.length - 1]);
      const a = new Date(last);
      a.setDate(a.getDate() + lo);
      const b = new Date(last);
      b.setDate(b.getDate() + hi);
      return { a, b, gaps, last };
    }

    function periodLen() {
      const set = new Set(
        store
          .get<DayEntry[]>('menarca_animo', [])
          .filter((x) => x.periodo === 'si')
          .map((x) => x.d)
      );
      const lens = periodStarts().map((st) => {
        let n = 0;
        const d = T12(st);
        while (set.has(iso(d))) {
          n++;
          d.setDate(d.getDate() + 1);
        }
        return n;
      });
      return lens.length ? Math.round(lens.reduce((x, y) => x + y, 0) / lens.length) : 0;
    }

    function renderMenarca() {
      const el = $('#menarca')!;
      const e = store.get<MenarcaEstimate | null>('menarca_etapa', null);
      const st = periodStarts();
      if (st.length) {
        const f = T12(st[0]);
        el.innerHTML = `<p style="margin:0 0 10px">¡Ya marcaste tu primera menstruación! 🌸</p><div class="stats"><div class="stat wide"><b>${f.toLocaleDateString('es', { day: 'numeric', month: 'long', year: 'numeric' })}</b><span>fue tu primera vez</span></div></div>`;
        return;
      }
      if (!e || e.wMax == null) {
        el.innerHTML =
          '<p style="margin:0 0 12px">Aún no tienes una estimación. Responde unas preguntas y calculo más o menos cuándo podría llegar.</p><button class="btn block" data-go="estimar" type="button">Calcular ahora</button>';
        return;
      }
      const now = new Date();
      const el0 = Math.max(0, (now.getTime() - T12(e.fecha).getTime()) / (30.44 * 864e5));
      const a = Math.max(0, e.wMin - el0);
      const b = Math.max(0, e.wMax - el0);
      const mid = (a + b) / 2;
      const M = Math.max(12, Math.ceil(b) + 3);
      const L = (a / M) * 100;
      const W = Math.max(6, ((b - a) / M) * 100);
      const sg: Record<string, boolean> = (e.sig as Record<string, boolean>) || {};
      const pasos: Array<[string, string]> = [
        ['mamas', '🌸 Mamas'],
        ['vello', '🌿 Vello'],
        ['crece', '📏 Estirón'],
        ['flujo', '💧 Flujo'],
        ['sintomas', '✨ Síntomas'],
        ['x', '🌷 Primera menstruación'],
      ];
      const cuando =
        b <= 0
          ? 'En cualquier momento'
          : b <= 1
            ? 'En las próximas semanas'
            : (a <= 0.5 ? 'Desde ya hasta ' : 'Entre ') +
              (a <= 0.5 ? monthYear(addM(now, b)) : monthYear(addM(now, a)) + ' y ' + monthYear(addM(now, b)));
      el.innerHTML = `<div class="stats"><div class="stat wide"><b>${cuando}</b><span>cuándo podría llegar</span></div>${b > 1 ? `<div class="stat wide"><b>${monthYear(addM(now, mid))}</b><span>lo más probable</span></div>` : ''}</div>
<div class="tl" aria-hidden="true"><i class="tl-w" style="left:${L}%;width:${Math.min(W, 100 - L)}%"></i><b class="tl-n"></b></div><div class="tl-l"><span>Hoy</span><span>${M} meses</span></div>
<p style="margin:0 0 6px;font-weight:600">Mi camino:</p><div class="steps">${pasos.map(([k, t]) => `<span class="${sg[k] ? 'ok' : ''}">${sg[k] ? '✓ ' : ''}${t}</span>`).join(' · ')}</div>
<p class="muted" style="margin:0 0 12px;font-size:13px">Calculado el ${fmtDay(e.fecha)} con tus respuestas y tu edad. Se va actualizando con el tiempo. Es solo una aproximación.</p>
<button class="btn ghost block" data-go="estimar" type="button">Volver a calcular</button>`;
    }

    function faseTxt(n: number, cyc: number, plen: number) {
      const L = cyc || 28;
      const P = plen || 5;
      if (n < 1 || n > L + 10) return null;
      if (n <= P)
        return ['🌸 Menstruación', 'Es normal sentir cansancio o cólicos. Descansar y tomar agua ayuda.'];
      if (n < L - 14) return ['🌱 Renovación', 'Muchas chicas sienten más energía en estos días.'];
      if (n <= L - 12) return ['✨ Mitad del ciclo', 'Puede aparecer más flujo claro. Es señal de salud.'];
      return ['🌙 Días previos', 'Pueden aparecer sensibilidad, antojos o cambios de humor.'];
    }

    function renderRitmo() {
      const s = periodStarts();
      const el = $('#ritmo')!;
      if (!s.length) {
        el.innerHTML =
          '<p style="margin:0 0 10px">Aún no tienes una menstruación marcada. Cuando la marques en el calendario, aquí verás cómo va tu ritmo ✨</p>';
        return;
      }
      const last = T12(s[s.length - 1]);
      const today = new Date();
      today.setHours(12, 0, 0, 0);
      const dayN = Math.round((today.getTime() - last.getTime()) / 864e5) + 1;
      const w = predWin();
      const plen = periodLen();
      const cyc = w ? Math.round(w.gaps.reduce((x, y) => x + y, 0) / w.gaps.length) : 0;
      const stats = [
        [dayN > 0 ? 'Día ' + dayN : '—', 'del ciclo'],
        [w ? fmtShort(w.a) + ' – ' + fmtShort(w.b) : '—', 'próxima posible'],
        [plen ? plen + (plen === 1 ? ' día' : ' días') : '—', 'dura tu periodo'],
        [cyc ? cyc + ' días' : '—', 'entre periodos'],
      ];
      let txt = 'Tu última menstruación empezó el ' + fmtDay(iso(last)) + '.';
      if (!w) txt += ' Con dos menstruaciones marcadas podremos calcular tu ritmo.';
      else {
        const dd = Math.round((w.a.getTime() - today.getTime()) / 864e5);
        if (dd > 0) txt += ` Según tus registros, faltan unos ${dd} ${dd === 1 ? 'día' : 'días'} para la próxima.`;
        else if (today <= w.b) txt += ' Según tus registros, la próxima podría llegar en estos días.';
        else txt += ' Ya pasó la fecha estimada. Al principio es normal que los ciclos sean irregulares.';
      }
      const fz = faseTxt(dayN, cyc, plen);
      el.innerHTML = `<div class="stats">${stats.map(([b, l]) => `<div class="stat"><b>${b}</b><span>${l}</span></div>`).join('')}${fz ? `<div class="stat wide"><b>${fz[0]}</b><span>${fz[1]}</span></div>` : ''}</div><p style="margin:0 0 10px">${txt}</p>`;
    }

    function renderCal() {
      const y = calMonth.getFullYear();
      const m = calMonth.getMonth();
      $('#cal-title')!.textContent = calMonth.toLocaleDateString('es', { month: 'long', year: 'numeric' });
      const offset = (new Date(y, m, 1).getDay() + 6) % 7;
      const n = new Date(y, m + 1, 0).getDate();
      const today = iso(new Date());
      const hist = store.get<DayEntry[]>('menarca_animo', []);
      const w = predWin();
      const pa = w ? iso(w.a) : null;
      const pb = w ? iso(w.b) : null;
      let html = '';
      for (let i = 0; i < offset; i++) html += '<span></span>';
      for (let d = 1; d <= n; d++) {
        const key = iso(new Date(y, m, d));
        const e = hist.find((x) => x.d === key) || ({} as DayEntry);
        const pred = pa && pb && key >= pa && key <= pb && e.periodo !== 'si';
        const hasSy = (e.dolor || []).length > 0;
        const isAnivDay = m + 1 === 11 && d === 8;
        const isBdayDay = bday && bday.d === d && bday.m === m + 1;
        const moodIdxs = getEntryMoodIndices(e);
        const moodEm = moodIdxs.length && MOODS[moodIdxs[0]] ? MOODS[moodIdxs[0]].e : '';
        html += `<button class="day${key === today ? ' today' : ''}${key === selDay ? ' sel' : ''}${pred ? ' pred' : ''}" type="button" data-d="${key}" aria-label="${fmtDay(key)}${e.periodo === 'si' ? ', con menstruación' : ''}${pred ? ', posible próxima menstruación' : ''}${isAnivDay ? ', Aniversario de PerDay' : ''}">${isBdayDay ? '<span class="bd" aria-hidden="true">🎂</span>' : isAnivDay ? '<span class="bd" aria-hidden="true">👑</span>' : ''}${d}${moodEm ? `<em aria-hidden="true">${moodEm}</em>` : ''}${e.periodo === 'si' ? `<span class="per ${e.intensidad || 'normal'}"></span>` : ''}${e.flujo && e.flujo !== 'ninguno' ? '<span class="fl"></span>' : ''}${hasSy ? '<span class="sy"></span>' : ''}</button>`;
      }
      $('#cal')!.innerHTML = html;
    }

    function syncInt() {
      const p = $<HTMLInputElement>('#reg-per input:checked');
      $('#int-box')!.hidden = !p || p.value !== 'si';
    }

    function renderDay() {
      const e = entryOf(selDay);
      $('#day-title')!.textContent = new Date(selDay + 'T12:00').toLocaleDateString('es', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
      });
      regMoods = [...getEntryMoodIndices(e)];

      $('#reg-per')!.innerHTML = [
        ['no', 'No'],
        ['si', 'Sí'],
      ]
        .map(
          ([v, l]) =>
            `<label><input type="radio" name="per" value="${v}"${(e.periodo || 'no') === v ? ' checked' : ''}><span>${l}</span></label>`
        )
        .join('');
      $('#reg-int')!.innerHTML = INT.map(
        ([v, l]) =>
          `<label><input type="radio" name="int" value="${v}"${(e.intensidad || 'normal') === v ? ' checked' : ''}><span>${l}</span></label>`
      ).join('');

      // 4. Estados de ánimo con Selección Múltiple tipo etiquetas (tags)
      $('#reg-moods')!.innerHTML = MOODS.map((m, i) => {
        const isSel = regMoods.includes(i);
        return `<button class="mood mood-tag${isSel ? ' on' : ''}" type="button" data-rm="${i}" aria-pressed="${isSel}"><b aria-hidden="true">${m.e}</b><span>${m.n}</span></button>`;
      }).join('');

      // 4. Nuevos Síntomas físicos con Selección Múltiple tipo etiquetas (tags)
      $('#reg-mol')!.innerHTML = SYMPTOM_OPTIONS.map(
        (sym) =>
          `<label class="tile sym-tag"><input type="checkbox" value="${sym.id}"${(e.dolor || []).includes(sym.id) ? ' checked' : ''}><span><small class="sym-cat">${sym.category}</small><b aria-hidden="true">${sym.icon}</b>${sym.label}</span></label>`
      ).join('');

      $('#reg-flu')!.innerHTML = FLU.map(
        ([v, l, ic]) =>
          `<label class="tile"><input type="radio" name="flu" value="${v}"${(e.flujo || 'ninguno') === v ? ' checked' : ''}><span><b aria-hidden="true">${ic}</b>${l}</span></label>`
      ).join('');

      const pesoInp = $<HTMLInputElement>('#reg-peso');
      if (pesoInp) {
        pesoInp.value = e.peso != null ? String(e.peso) : '';
      }

      ($('#reg-nota') as HTMLTextAreaElement).value = e.nota || '';
      $('#reg-ok')!.hidden = true;
      syncInt();
      liveTips();
    }

    function readForm() {
      const per = ($<HTMLInputElement>('#reg-per input:checked')?.value || 'no') as 'si' | 'no';
      const rawPeso = $<HTMLInputElement>('#reg-peso')?.value.trim() || '';
      const parsedPeso = rawPeso ? parseFloat(rawPeso) : null;
      return {
        per,
        inten:
          per === 'si'
            ? (($<HTMLInputElement>('#reg-int input:checked')?.value || 'normal') as
                | 'ligera'
                | 'normal'
                | 'fuerte')
            : null,
        flujo: $<HTMLInputElement>('#reg-flu input:checked')?.value || 'ninguno',
        dolor: $$<HTMLInputElement>('#reg-mol input:checked').map((i) => i.value),
        moods: [...regMoods],
        m: regMoods.length > 0 ? regMoods[0] : null,
        peso: parsedPeso != null && !isNaN(parsedPeso) && parsedPeso > 0 ? Math.round(parsedPeso * 10) / 10 : null,
      };
    }

    function formatTipsHtml(keys: string[], max = 6) {
      const tips = obtenerTipsEducativos(keys, max);
      return tips
        .map(
          (t) =>
            `<div class="tipc"><small class="tip-cat">${t.category}</small><b>${t.title}</b><p>${t.body}</p></div>`
        )
        .join('');
    }

    function liveTips() {
      const el = $('#day-tips');
      if (!el) return;
      const f = readForm();
      const moodNames = f.moods.map((idx) => MOODS[idx]?.n).filter(Boolean) as string[];
      const keys = extractTipKeys({
        per: f.per,
        inten: f.inten,
        flujo: f.flujo,
        dolor: f.dolor,
        moodNames,
      });
      const h = formatTipsHtml(keys, 6);
      el.innerHTML = h
        ? `<h3 style="margin:0 0 10px;font-size:16px">Tips educativos: por qué tus hormonas causan esto 💡</h3>${h}`
        : '';
    }

    function renderTips() {
      const h = store.get<DayEntry[]>('menarca_animo', []);
      const now = T12(iso(new Date()));
      let ks: string[] = [];
      h.forEach((e) => {
        const ago = Math.round((now.getTime() - T12(e.d).getTime()) / 864e5);
        if (ago >= 0 && ago < 7) {
          const moodNames = getEntryMoodIndices(e)
            .map((idx) => MOODS[idx]?.n)
            .filter(Boolean) as string[];
          ks = ks.concat(
            extractTipKeys({
              per: e.periodo,
              inten: e.intensidad,
              flujo: e.flujo,
              dolor: e.dolor,
              moodNames,
            })
          );
        }
      });
      const html = formatTipsHtml(uniq(ks), 5);
      $('#tips')!.innerHTML =
        html ||
        '<p class="muted" style="margin:0">Cuando registres tus síntomas (como dolor de cabeza, dolor de panza, sensibilidad, cansancio, granitos, sueño o digestión), aquí aparecerán tarjetas explicando cómo actúan tus hormonas.</p>';
    }

    function renderPron() {
      const h = store.get<DayEntry[]>('menarca_animo', []);
      const etapa = store.get<MenarcaEstimate | null>('menarca_etapa', null);
      const r = calcularPronostico(h, iso(new Date()), etapa);
      const el = $('#pron')!;
      if (r.kind === 'en') {
        el.innerHTML =
          '<p style="margin:0 0 10px;font-size:18px;font-weight:600">🌸 Estás en tus días</p><p class="muted" style="margin:0">Cuando termine, calcularé cuándo podría llegar la próxima. Mientras tanto, anota cómo te sientes cada día.</p>';
        return;
      }
      const NV: Record<'baja' | 'media' | 'alta', [string, string]> = {
        baja: ['Baja', 'Es poco probable que te llegue en los próximos 7 días.'],
        media: ['Media', 'Podría llegar en los próximos días. Lleva una toalla a mano.'],
        alta: ['Alta', 'Es probable que llegue pronto. Lleva una toalla o protector en tu mochila.'],
      };
      const nv = NV[r.nivel];
      const ptxt = r.pct < 5 ? 'menos de 5%' : r.pct + '%';
      const base = r.hasData
        ? `Se calculó con ${r.base} y con ${r.n} ${r.n === 1 ? 'señal registrada' : 'señales registradas'} en los últimos 14 días.`
        : `Aún no tienes una estimación ni menstruaciones marcadas, así que conté ${r.n} ${r.n === 1 ? 'señal registrada' : 'señales registradas'} en los últimos 14 días.`;
      const symText = r.matchedSymptoms.length
        ? `<p class="muted" style="margin:0 0 10px;font-size:13.5px"><b>Síntomas conectados al cálculo:</b> ${r.matchedSymptoms.join(' · ')}</p>`
        : '';

      el.innerHTML = `<div class="pron-top"><b>${ptxt}</b><span class="pron-lvl ${r.nivel}">· Probabilidad ${nv[0].toLowerCase()}</span></div>
<div class="pbar" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${r.pct}" aria-label="Probabilidad de que llegue en 7 días"><i style="--w:${Math.max(r.pct, 3)}%"></i></div>
<div class="pbar-l"><span>0%</span><span>50%</span><span>100%</span></div>
<p style="margin:0 0 8px">${nv[1]}</p>
<p class="muted" style="margin:0 0 8px;font-size:14px">${base}</p>
${symText}
${r.hasData ? '' : '<button class="btn ghost" data-go="estimar" type="button" style="margin-bottom:10px">Hacer mi estimación</button>'}
<details><summary>¿Cómo se calcula?</summary><p>Combino tu ventana probable con todos los síntomas físicos y estados de ánimo de selección múltiple de los últimos 14 días: dolor de cabeza, dolor de panza, sensibilidad, cansancio, granitos, cólicos, mamas sensibles, hinchazón, digestión, sueño, temperatura, apetito y flujo. Es una orientación educativa, no un método médico.</p></details>`;
    }

    function refreshAll(msg: string) {
      renderCal();
      renderRitmo();
      renderMenarca();
      renderHoy();
      renderPetSection();
      renderHistory();
      renderPron();
      renderTips();
      renderDay();
      const ok = $('#reg-ok')!;
      ok.textContent = msg;
      ok.hidden = false;
    }

    function saveDay() {
      const h = store.get<DayEntry[]>('menarca_animo', []);
      const f = readForm();
      const nota = ($('#reg-nota') as HTMLTextAreaElement).value.trim().slice(0, 200);
      const entry: DayEntry = {
        d: selDay,
        m: f.m,
        moods: f.moods,
        dolor: f.dolor,
        flujo: f.flujo,
        nota,
        periodo: f.per,
        intensidad: f.inten,
        peso: f.peso,
      };
      const k = h.findIndex((x) => x.d === selDay);
      if (k >= 0) h[k] = { ...h[k], ...entry };
      else h.push(entry);
      store.set('menarca_animo', h.slice(-400));

      triggerCloudSync();
      refreshAll(
        (sessionAuthToken ? 'Guardado y sincronizado en la nube ☁️.' : 'Guardado en este dispositivo.') +
          (f.inten === 'fuerte'
            ? ' Si el sangrado es muy fuerte, dura mucho o te preocupa, habla con tu pediatra o con un adulto de confianza.'
            : '')
      );
    }

    function delDay() {
      store.set(
        'menarca_animo',
        store.get<DayEntry[]>('menarca_animo', []).filter((x) => x.d !== selDay)
      );
      triggerCloudSync();
      refreshAll('Día borrado.');
    }

    function renderHome() {
      renderCal();
      renderRitmo();
      renderMenarca();
      renderDay();
      renderPron();
      renderTips();
      renderHistory();
      renderHoy();
      renderPetSection();
      renderAccountStatus();
    }

    const esc = (t: string) =>
      String(t).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

    function notify(title: string, body: string, id: string) {
      let shown = false;
      if ('Notification' in window && Notification.permission === 'granted') {
        try {
          const n = new Notification(title, { body, icon: ICON || undefined, tag: 'perday-' + id });
          n.onclick = () => {
            try {
              window.focus();
            } catch {
              // ignore
            }
            n.close();
          };
          shown = true;
        } catch {
          // ignore
        }
      }
      if (!shown) showTip(title + ' ' + body);
    }

    function tick() {
      checkCelebs();
    }

    /* ---------- Celebraciones y Gran Evento: Aniversario 8 y 9 de Noviembre ---------- */
    const MESES = [
      'enero',
      'febrero',
      'marzo',
      'abril',
      'mayo',
      'junio',
      'julio',
      'agosto',
      'septiembre',
      'octubre',
      'noviembre',
      'diciembre',
    ];
    const FRX_KEYS = ['corona', 'arcoiris', 'globos', 'confeti', 'nubes', 'lazo'];
    const BGX_KEYS = ['atardecer', 'nube', 'durazno', 'helado', 'bosque', 'oceano'];
    const BMSGS = [
      'Que este año nuevo venga lleno de cosas lindas y de calma.',
      'Eres única y vas a tu propio ritmo, y eso está muy bien.',
      'Que sigas descubriendo lo que te hace feliz.',
      'Un año más de aprender, reír y crecer a tu manera.',
      'Cuida tu corazón, tu cuerpo y tus sueños. ¡Mereces todo lo bonito!',
      'Que tengas muchos abrazos, risas y momentos tranquilos.',
      'Cada año trae algo nuevo. ¡Qué emoción ver lo que viene!',
      'Gracias por cuidarte y escucharte. Eso es valentía.',
      'Que tus días estén llenos de colores suaves y buena compañía.',
      'Crecer es un viaje, y tú lo estás haciendo genial.',
      'Hoy toca celebrar lo mucho que has avanzado.',
      'Que este año te traiga confianza, amigas y mucha curiosidad.',
    ];

    const HOLMAP: Record<string, HolidayEvent> = Object.fromEntries(HOLIDAYS.map((h) => [h.id, h]));

    function bdayInfo() {
      if (!bday) return null;
      const n = new Date();
      const t = new Date(n.getFullYear(), n.getMonth(), n.getDate(), 12);
      let b = new Date(n.getFullYear(), bday.m - 1, bday.d, 12);
      let diff = Math.round((b.getTime() - t.getTime()) / 864e5);
      if (diff < -6) {
        b = new Date(n.getFullYear() + 1, bday.m - 1, bday.d, 12);
        diff = Math.round((b.getTime() - t.getTime()) / 864e5);
      }
      return { diff, year: b.getFullYear() };
    }

    function renderBday() {
      const D = $<HTMLSelectElement>('#bd-d')!;
      const M = $<HTMLSelectElement>('#bd-m')!;
      if (!D.options.length) {
        D.innerHTML =
          '<option value="">Día</option>' +
          Array.from({ length: 31 }, (_, i) => `<option value="${i + 1}">${i + 1}</option>`).join('');
        M.innerHTML =
          '<option value="">Mes</option>' +
          MESES.map((x, i) => `<option value="${i + 1}">${x}</option>`).join('');
      }
      D.value = bday ? String(bday.d) : '';
      M.value = bday ? String(bday.m) : '';
      const i = bdayInfo();
      const bdayUnlockedToday = isBirthdayUnlockedToday(bday, new Date());
      let t = 'Elige el día y el mes de tu cumpleaños.';
      if (i && bday) {
        t = bdayUnlockedToday
          ? '🎂 ¡Hoy es tu cumpleaños! Tu regalo sorpresa está desbloqueado 🎉'
          : i.diff < 0
            ? `Tu cumpleaños fue hace ${-i.diff} ${i.diff === -1 ? 'día' : 'días'}. 🔒 La sorpresa se desbloquea únicamente el día exacto.`
            : `Tu cumpleaños es el ${bday.d} de ${MESES[bday.m - 1]}. Faltan ${i.diff} ${i.diff === 1 ? 'día' : 'días'} · 🔒 Sorpresa bloqueada hasta ese día.`;
      }
      $('#bday-info')!.textContent = t;
      $('#bday-del')!.hidden = !bday;

      const bdayBtn = $<HTMLButtonElement>('#bday-test');
      if (bdayBtn) {
        bdayBtn.disabled = !bdayUnlockedToday;
        bdayBtn.textContent = bdayUnlockedToday
          ? '🎁 Abrir mi sorpresa de cumpleaños'
          : bday
            ? `🔒 Bloqueado hasta el ${bday.d} de ${MESES[bday.m - 1]}`
            : '🔒 Elige tu fecha (se desbloquea en tu día)';
      }

      $('#regalos')!.innerHTML = regalos.length
        ? regalos
            .slice()
            .reverse()
            .map((g) => {
              const h = g.k ? HOLMAP[g.k] : null;
              if (h) {
                const rewards = getHolidayRewards(h);
                const wpLabels = rewards
                  .filter((r) => r.kind === 'wallpaper')
                  .map((r) => r.label)
                  .join(', ');
                const bdgLabels = rewards
                  .filter((r) => r.kind === 'badge')
                  .map((r) => r.label)
                  .join(', ');
                const firstBadge = h.badges[0];
                return `<div class="gift">
                  ${
                    firstBadge?.image
                      ? `<span class="gift-thumb round"><img src="${firstBadge.image}" alt="${firstBadge.name}" referrerpolicy="no-referrer"/></span>`
                      : `<span aria-hidden="true">${h.emoji}</span>`
                  }
                  <div>
                    <b>${h.name} (${g.y}) · ${rewards.length} recompensas</b><br/>
                    <small>Fondos: ${wpLabels} · Insignias: ${bdgLabels}</small>
                  </div>
                </div>`;
              }
              const ins = g.ins || (g.badge != null ? BADGES[g.badge] : ['🎂', 'Cumpleaños']);
              return `<div class="gift"><span aria-hidden="true">${ins[0]}</span><div><b>Cumpleaños ${g.y}: ${ins[1]}</b><br><small>Marco ${(FR[g.marco] || FR.none).l} · Fondo ${(BG[g.fondo] || BG.lavanda).l}</small></div></div>`;
            })
            .join('')
        : '<p class="muted" style="margin:0">Todavía no tienes regalos de eventos. Las sorpresas están bloqueadas y solo se revelan el día exacto de tu cumpleaños o de cada celebración.</p>';
    }

    function saveBday() {
      const d = +$<HTMLSelectElement>('#bd-d')!.value;
      const m = +$<HTMLSelectElement>('#bd-m')!.value;
      if (!d || !m) return;
      if (d > [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][m - 1]) {
        $('#bday-info')!.textContent = 'Ese día no existe en ese mes.';
        return;
      }
      bday = { d, m };
      store.set('menarca_bday', bday);
      triggerCloudSync();
      renderBday();
      renderHoy();
      renderCal();
      checkCelebs();
    }

    function renderFest() {
      const now = new Date();
      $('#fest-list')!.innerHTML = HOLIDAYS.map((h) => {
        const act = getActiveYearForHoliday(h, now) !== null;
        const own = regalos.some((g) => g.k === h.id && g.y === now.getFullYear());
        const canOpen = act || own;
        const diff = daysUntilHoliday(h, now);
        const st = act
          ? '¡Hoy es el día exacto! Sorpresa desbloqueada 🎉'
          : `🔒 Sorpresa bloqueada · Se revela el ${h.day} de ${MESES[h.month - 1]} (faltan ${diff} ${diff === 1 ? 'día' : 'días'})`;
        return `<div class="fest${h.isGrandAnniversary ? ' grand' : ''}${!canOpen ? ' locked-fest' : ''}">
          <span aria-hidden="true">${canOpen ? h.emoji : '🔒'}</span>
          <div>
            <b>${h.name}</b>
            <small>${st}${own ? ' · ✓ Recibido' : ''}</small>
          </div>
          <button class="btn ${own ? 'ghost' : ''}" type="button" data-prev="${h.id}" ${!canOpen ? 'disabled aria-disabled="true"' : ''}>
            ${act ? (own ? 'Ver mi sorpresa 🎁' : 'Abrir sorpresa 🎁') : own ? 'Ver regalos' : '🔒 Bloqueado'}
          </button>
        </div>`;
      }).join('');
    }

    let lastGift: StoredGift | null = null;

    function showCelebModal(opts: {
      big: string;
      title: string;
      msg: string;
      g: StoredGift;
      holiday?: HolidayEvent;
      preview: boolean;
      parts: string[];
    }) {
      const { g, holiday, preview, parts } = opts;
      const nick = prof.nick.trim();
      lastGift = g;
      const cardEl = $('.bday-c')!;
      cardEl.classList.toggle('grand-aniv', Boolean(holiday?.isGrandAnniversary));

      $('#bday-e')!.textContent = opts.big;
      $('#bday-t')!.textContent = opts.title.replace('!', (nick ? ', ' + nick : '') + '!');
      $('#bday-m')!.textContent = opts.msg;

      let giftsHtml = '';
      if (holiday) {
        const rewards = getHolidayRewards(holiday);
        rewards.forEach((r) => {
          if (r.kind === 'wallpaper') {
            giftsHtml += `<div class="gift">
              ${r.image ? `<span class="gift-thumb"><img src="${r.image}" alt="${r.label}" referrerpolicy="no-referrer"/></span>` : '<span aria-hidden="true">🎨</span>'}
              <div><b>Fondo temático: ${r.label}</b><br><small>Recompensa de ${holiday.name}</small></div>
            </div>`;
          } else {
            giftsHtml += `<div class="gift">
              ${r.image ? `<span class="gift-thumb round"><img src="${r.image}" alt="${r.label}" referrerpolicy="no-referrer"/></span>` : `<span aria-hidden="true">${r.emoji || '🏅'}</span>`}
              <div><b>Insignia especial: ${r.label}</b><br><small>Recompensa coleccionable (${holiday.name})</small></div>
            </div>`;
          }
        });
      } else {
        const ins = g.ins || (g.badge != null ? BADGES[g.badge] : ['🎂', 'Pastelito']);
        giftsHtml = `<div class="gift"><span aria-hidden="true">🖼️</span><div><b>Marco ${FR[g.marco]?.l || 'Especial'}</b><br><small>Para tu foto de perfil</small></div></div>
        <div class="gift"><span aria-hidden="true">🎨</span><div><b>Fondo ${BG[g.fondo]?.l || 'Especial'}</b><br><small>Para tu página</small></div></div>
        <div class="gift"><span aria-hidden="true">${ins[0]}</span><div><b>Insignia ${ins[1]}</b><br><small>Se verá en tu foto</small></div></div>`;
      }

      $('#bday-g')!.innerHTML = giftsHtml;
      $('#confetti')!.innerHTML = Array.from(
        { length: 28 },
        (_, i) =>
          `<span class="cf" style="left:${Math.random() * 100}%;animation-delay:${(Math.random() * 3).toFixed(2)}s;animation-duration:${(3 + Math.random() * 2).toFixed(2)}s">${parts[i % parts.length]}</span>`
      ).join('');

      $('#bday-use')!.hidden = false;
      $('#bday')!.hidden = false;
      cardEl.scrollTop = 0;
      $('#bday-ok')!.focus({ preventScroll: true });
      if (!preview && document.hidden) {
        notify(opts.big + ' ' + opts.title, 'Tienes regalos nuevos esperándote en PerDay.', 'celeb');
      }
      renderPerfil();
      renderHoy();
    }

    function celebrateBday(preview: boolean, late: boolean, year?: number) {
      if (!isBirthdayUnlockedToday(bday, new Date())) {
        showTip('🔒 La sorpresa de cumpleaños está bloqueada y solo se revela en tu fecha exacta.');
        return;
      }
      const n = regalos.filter((g) => !g.k).length;
      const g: StoredGift = {
        y: year || new Date().getFullYear(),
        marco: FRX_KEYS[n % 6],
        fondo: BGX_KEYS[n % 6],
        badge: n % 12,
        msg: n % 12,
      };
      if (!preview && !regalos.some((x) => !x.k && x.y === g.y)) {
        regalos.push(g);
        store.set('menarca_regalos', regalos);
        triggerCloudSync();
      }
      showCelebModal({
        big: '🎂',
        title: late ? '¡Feliz cumpleaños!' : '¡Feliz cumpleaños!',
        msg: BMSGS[g.msg || 0],
        g,
        preview,
        parts: ['🎈', '🎉', '✨', '🍰'],
      });
    }

    function celebHol(h: HolidayEvent, yr: number, preview: boolean) {
      const now = new Date();
      const activeToday = getActiveYearForHoliday(h, now) !== null;
      const alreadyOwned = regalos.some((x) => x.k === h.id && x.y === yr);
      if (!activeToday && !alreadyOwned) {
        showTip(`🔒 La sorpresa de ${h.name} está bloqueada hasta el ${h.day} de ${MESES[h.month - 1]}.`);
        return;
      }
      const rewards = getHolidayRewards(h);
      const rewardedWallpapers = rewards.filter((r) => r.kind === 'wallpaper').map((r) => r.id);
      const rewardedBadges = rewards
        .filter((r) => r.kind === 'badge' && r.badge)
        .map((r) => r.badge!);
      const firstWp = rewardedWallpapers[0] || 'lavanda';
      const firstBadge = rewardedBadges[0];
      const g: StoredGift = {
        k: h.id,
        y: yr,
        marco: h.frameId,
        fondo: firstWp,
        wallpapers: rewardedWallpapers,
        badges: rewardedBadges,
        ins: firstBadge ? [firstBadge.emoji, firstBadge.name, firstBadge.image] : ['🎉', h.name],
        t: Date.now(),
      };
      if (!alreadyOwned) {
        regalos.push(g);
        store.set('menarca_regalos', regalos);
        triggerCloudSync();
      }
      if (!prof.activeBadge && firstBadge) {
        prof.activeBadge = firstBadge.id;
        saveProf();
      }
      showCelebModal({
        big: h.emoji,
        title: h.title,
        msg: h.message,
        g,
        holiday: h,
        preview,
        parts: h.particles,
      });
    }

    function checkBday() {
      const i = bdayInfo();
      if (!i || !isBirthdayUnlockedToday(bday, new Date())) return false;
      if (regalos.some((g) => !g.k && g.y === i.year)) return false;
      celebrateBday(false, false, i.year);
      return true;
    }

    function checkCelebs() {
      if (!$('#lock')!.hidden || !$('#bday')!.hidden || !$('#auth-modal')!.hidden) return;
      const now = new Date();
      if (isAppAnniversary(now)) {
        const anniv = HOLIDAYS.find((h) => h.isGrandAnniversary)!;
        const yr = now.getFullYear();
        if (!regalos.some((g) => g.k === anniv.id && g.y === yr)) {
          celebHol(anniv, yr, false);
          return;
        }
      }
      if (checkBday()) return;
      for (const h of HOLIDAYS) {
        const yr = getActiveYearForHoliday(h, now);
        if (yr !== null && !regalos.some((g) => g.k === h.id && g.y === yr)) {
          celebHol(h, yr, false);
          return;
        }
      }
    }

    /* ---------- Bloqueo con patrón y Hash de Contraseña/Patrón ---------- */
    const hasPat = () => !!store.get<string | null>('menarca_pat', null);
    const sesOn = () => {
      try {
        return sessionStorage.getItem('menarca_sesion') === '1';
      } catch {
        return false;
      }
    };
    const setSes = (v: boolean) => {
      try {
        if (v) sessionStorage.setItem('menarca_sesion', '1');
        else sessionStorage.removeItem('menarca_sesion');
      } catch {
        // ignore
      }
    };
    const setInert = (b: boolean) =>
      ['main', 'header.top', '#bnav', '#tip', '#drawer'].forEach((s) => {
        const e = $<HTMLElement>(s);
        if (e) (e as any).inert = b;
      });

    async function hashString(raw: string): Promise<string> {
      const s = 'menarca-sec:' + raw;
      try {
        if (window.crypto && crypto.subtle) {
          const b = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s));
          return (
            's' +
            Array.from(new Uint8Array(b))
              .map((x) => x.toString(16).padStart(2, '0'))
              .join('')
          );
        }
      } catch {
        // ignore
      }
      let h = 5381;
      for (const c of s) h = ((h << 5) + h + c.charCodeAt(0)) | 0;
      return 'd' + (h >>> 0).toString(16);
    }

    async function hashPat(seq: number[], alg?: string) {
      const s = 'menarca-pat:' + seq.join('-');
      if (alg !== 'd') {
        try {
          if (window.crypto && crypto.subtle) {
            const b = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s));
            return (
              's' +
              Array.from(new Uint8Array(b))
                .map((x) => x.toString(16).padStart(2, '0'))
                .join('')
            );
          }
        } catch {
          // ignore
        }
      }
      let h = 5381;
      for (const c of s) h = ((h << 5) + h + c.charCodeAt(0)) | 0;
      return 'd' + (h >>> 0).toString(16);
    }

    async function savePat(seq: number[]) {
      store.set('menarca_pat', await hashPat(seq));
    }

    async function checkPat(seq: number[]) {
      const saved = store.get<string>('menarca_pat', '');
      return !!saved && (await hashPat(seq, saved[0])) === saved;
    }

    function mkPattern(
      host: HTMLElement,
      onDone: (seq: number[]) => void,
      onStart?: () => void
    ) {
      host.innerHTML =
        '<svg viewBox="0 0 260 260" aria-hidden="true"><polyline points="" fill="none"/></svg>' +
        Array.from(
          { length: 9 },
          (_, i) => `<button type="button" class="pdot" data-i="${i}" aria-label="Punto ${i + 1}"><i></i></button>`
        ).join('');
      const pl = host.querySelector('polyline')!;
      const dots = $$<HTMLButtonElement>('.pdot', host);
      let seq: number[] = [];
      let down = false;
      let prev: [number, number] | null = null;
      let lock = false;
      const C = (i: number): [number, number] => [(i % 3) * 86.67 + 43.33, Math.floor(i / 3) * 86.67 + 43.33];
      const draw = (p?: [number, number]) => {
        const pts = seq.map((i) => C(i).join(','));
        if (p) pts.push(p.join(','));
        pl.setAttribute('points', pts.join(' '));
      };
      const add = (i: number) => {
        if (seq.includes(i)) return;
        if (seq.length) {
          const a = seq[seq.length - 1];
          const ax = a % 3;
          const ay = Math.floor(a / 3);
          const bx = i % 3;
          const by = Math.floor(i / 3);
          const dx = bx - ax;
          const dy = by - ay;
          if (dx % 2 === 0 && dy % 2 === 0 && (Math.abs(dx) === 2 || Math.abs(dy) === 2)) {
            const mid = ((ay + by) / 2) * 3 + (ax + bx) / 2;
            if (!seq.includes(mid)) {
              seq.push(mid);
              dots[mid].classList.add('on');
            }
          }
        }
        seq.push(i);
        dots[i].classList.add('on');
      };
      const pos = (e: PointerEvent): [number, number] => {
        const r = host.getBoundingClientRect();
        return [((e.clientX - r.left) * 260) / r.width, ((e.clientY - r.top) * 260) / r.height];
      };
      const hit = (x: number, y: number) => {
        for (let i = 0; i < 9; i++) {
          const [cx, cy] = C(i);
          if (Math.hypot(x - cx, y - cy) < 30) return i;
        }
        return -1;
      };
      const reset = () => {
        seq = [];
        down = false;
        prev = null;
        host.dataset.state = '';
        dots.forEach((d) => d.classList.remove('on'));
        draw();
      };
      const finish = () => {
        if (seq.length) {
          const s = [...seq];
          onDone(s);
        }
      };
      host.addEventListener('pointerdown', (e) => {
        if (lock) return;
        e.preventDefault();
        reset();
        if (onStart) onStart();
        down = true;
        host.setPointerCapture(e.pointerId);
        const p = pos(e);
        prev = p;
        const i = hit(...p);
        if (i >= 0) add(i);
        draw(p);
      });
      host.addEventListener('pointermove', (e) => {
        if (!down || !prev) return;
        const p = pos(e);
        for (let k = 1; k <= 8; k++) {
          const x = prev[0] + ((p[0] - prev[0]) * k) / 8;
          const y = prev[1] + ((p[1] - prev[1]) * k) / 8;
          const i = hit(x, y);
          if (i >= 0) add(i);
        }
        prev = p;
        draw(p);
      });
      const up = () => {
        if (!down) return;
        down = false;
        draw();
        finish();
      };
      host.addEventListener('pointerup', up);
      host.addEventListener('pointercancel', up);
      dots.forEach((b) =>
        b.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            if (!seq.length && onStart) onStart();
            add(+b.dataset.i!);
            draw();
          }
        })
      );
      return {
        reset,
        finish,
        getSeq: () => [...seq],
        flash() {
          lock = true;
          host.dataset.state = 'err';
          setTimeout(() => {
            lock = false;
            reset();
          }, 650);
        },
      };
    }

    let pat: ReturnType<typeof mkPattern>;
    let acctPat: ReturnType<typeof mkPattern>;
    let acctPatSeq: number[] = [];
    let acctMode: 'login' | 'register' = 'login';
    let acctSecType: 'password' | 'pattern' = 'password';

    let lockMode: 'setup' | 'confirm' | 'unlock' | 'verify' = 'unlock';
    let lockTmp: string | null = null;
    let changing = false;
    let fails = 0;
    let lockUntil = 0;

    function paintLock() {
      const T: Record<string, [string, string]> = {
        setup: ['Crea tu patrón', 'Une al menos 4 puntos con el dedo. También puedes iniciar sesión con tu cuenta en la nube.'],
        confirm: ['Dibújalo otra vez', 'Repite el mismo patrón para confirmarlo.'],
        unlock: ['Dibuja tu patrón', 'Desbloquea tu diario o inicia sesión con tu correo.'],
        verify: ['Tu patrón actual', 'Dibújalo para poder cambiarlo.'],
      };
      const t = T[lockMode];
      $('#lock-t')!.textContent = t[0];
      $('#lock-p')!.textContent = t[1];
      $('#lock-cancel')!.hidden = !(lockMode === 'verify' || changing || lockMode === 'setup');
      $('#lock-cancel')!.textContent =
        lockMode === 'setup' && !changing ? 'Entrar sin patrón por ahora' : 'Cancelar';
      $('#lock-reset')!.hidden = !(lockMode === 'unlock' || lockMode === 'verify');
    }

    function openLock(mode: 'setup' | 'confirm' | 'unlock' | 'verify') {
      lockMode = mode;
      lockTmp = null;
      if (mode === 'verify' || mode === 'unlock') changing = false;
      $('#lock')!.hidden = false;
      setInert(true);
      closeDrawer();
      $('#lock-err')!.hidden = true;
      paintLock();
      pat.reset();
    }

    function closeLock() {
      $('#lock')!.hidden = true;
      setInert(false);
      changing = false;
      lockTmp = null;
      setTimeout(() => {
        checkCelebs();
      }, 250);
    }

    function lockErr(t: string) {
      const e = $('#lock-err')!;
      e.textContent = t;
      e.hidden = false;
      pat.flash();
    }

    async function onPattern(seq: number[]) {
      if (lockMode === 'setup' || lockMode === 'confirm') {
        if (seq.length < 4) {
          lockErr('Une al menos 4 puntos.');
          return;
        }
        if (lockMode === 'setup') {
          lockTmp = seq.join('-');
          lockMode = 'confirm';
          paintLock();
          pat.reset();
          return;
        }
        if (seq.join('-') === lockTmp) {
          await savePat(seq);
          store.del('menarca_pin');
          setSes(true);
          closeLock();
          showTip('Listo, tu patrón quedó guardado en este dispositivo.');
        } else {
          lockMode = 'setup';
          lockTmp = null;
          lockErr('No coincide. Empieza de nuevo.');
          paintLock();
        }
        return;
      }
      if (Date.now() < lockUntil) {
        lockErr('Espera unos segundos antes de intentar otra vez.');
        return;
      }
      if (await checkPat(seq)) {
        fails = 0;
        $('#lock-err')!.hidden = true;
        if (lockMode === 'verify') {
          changing = true;
          lockMode = 'setup';
          paintLock();
          pat.reset();
        } else {
          setSes(true);
          closeLock();
        }
      } else {
        fails++;
        if (fails >= 5) {
          fails = 0;
          lockUntil = Date.now() + 30000;
          lockErr('Demasiados intentos. Espera 30 segundos.');
        } else lockErr('Patrón incorrecto.');
      }
    }

    /* ---------- Pantalla Modal de Inicio de Sesión y Registro en la Nube ---------- */
    function paintAuthModal() {
      $$<HTMLElement>('.auth-tab').forEach((b) => {
        const on = b.dataset.authMode === acctMode;
        b.classList.toggle('on', on);
        b.setAttribute('aria-selected', String(on));
      });
      $$<HTMLElement>('.auth-sec-tab').forEach((b) => {
        const on = b.dataset.secType === acctSecType;
        b.classList.toggle('on', on);
        b.setAttribute('aria-pressed', String(on));
      });
      $('#acct-pass-box')!.hidden = acctSecType !== 'password';
      $('#acct-pat-box')!.hidden = acctSecType !== 'pattern';
      $('#acct-submit')!.textContent =
        acctMode === 'login' ? 'Iniciar sesión y descargar mis datos' : 'Crear cuenta y guardar en la nube';
      $('#acct-err')!.hidden = true;
      $('#acct-ok')!.hidden = true;
    }

    function openAuthModal(initialMode: 'login' | 'register' = 'login') {
      acctMode = initialMode;
      acctPatSeq = [];
      acctPat?.reset();
      $('#auth-modal')!.hidden = false;
      paintAuthModal();
      setTimeout(() => {
        $<HTMLInputElement>('#acct-email')?.focus({ preventScroll: true });
      }, 50);
    }

    function closeAuthModal() {
      $('#auth-modal')!.hidden = true;
      if ($('#lock')!.hidden) {
        setInert(false);
        setTimeout(checkCelebs, 250);
      }
    }

    async function handleAuthSubmit(e: Event) {
      e.preventDefault();
      const errEl = $('#acct-err')!;
      const okEl = $('#acct-ok')!;
      errEl.hidden = true;
      okEl.hidden = true;

      const email = ($<HTMLInputElement>('#acct-email')?.value || '').trim().toLowerCase();
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errEl.textContent = 'Ingresa un correo electrónico válido (ejemplo: luna@correo.com).';
        errEl.hidden = false;
        return;
      }

      let secretHash = '';
      if (acctSecType === 'password') {
        const pass = ($<HTMLInputElement>('#acct-pass')?.value || '').trim();
        if (pass.length < 4) {
          errEl.textContent = 'La contraseña debe tener al menos 4 caracteres.';
          errEl.hidden = false;
          return;
        }
        secretHash = await hashString('pwd:' + pass);
      } else {
        const seq = acctPatSeq.length ? acctPatSeq : acctPat.getSeq();
        if (seq.length < 4) {
          errEl.textContent = 'Dibuja un patrón uniendo al menos 4 puntos.';
          errEl.hidden = false;
          return;
        }
        secretHash = await hashPat(seq);
      }

      const btn = $<HTMLButtonElement>('#acct-submit')!;
      const prevTxt = btn.textContent;
      btn.disabled = true;
      btn.textContent = acctMode === 'login' ? 'Descargando tus datos…' : 'Guardando en la nube…';

      try {
        const endpoint = acctMode === 'login' ? '/api/auth/login' : '/api/auth/register';
        const bodyData =
          acctMode === 'login'
            ? { email, authType: acctSecType, secretHash }
            : { email, authType: acctSecType, secretHash, payload: buildCloudPayload() };

        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(bodyData),
        });
        const data = await res.json();
        if (!res.ok) {
          errEl.textContent = data.error || 'No se pudo completar la operación.';
          errEl.hidden = false;
          btn.disabled = false;
          btn.textContent = prevTxt;
          return;
        }

        sessionAuthToken = data.token;
        accountInfo = {
          uid: data.user.uid,
          email: data.user.email,
          authType: data.user.authType || acctSecType,
          lastSyncIso: new Date().toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' }),
        };
        store.set('menarca_account_info', accountInfo);

        if (data.payload && Object.keys(data.payload).length > 0) {
          applyCloudPayload(data.payload);
        }

        setSes(true);
        if (!$('#lock')!.hidden) {
          closeLock();
        }
        renderAccountStatus();
        okEl.textContent =
          acctMode === 'login'
            ? '¡Bienvenida de nuevo! Se descargaron tus registros, insignias, fondos y progreso ☁️✨'
            : '¡Cuenta creada! Tus datos quedaron respaldados en la nube ☁️💖';
        okEl.hidden = false;
        setTimeout(() => {
          closeAuthModal();
          showTip(
            acctMode === 'login'
              ? `☁️ Datos sincronizados desde la cuenta ${accountInfo?.email}`
              : `☁️ Cuenta ${accountInfo?.email} creada y sincronizada`
          );
        }, 700);
      } catch {
        errEl.textContent = 'Error de conexión al servidor. Intenta de nuevo.';
        errEl.hidden = false;
      } finally {
        btn.disabled = false;
        btn.textContent = prevTxt;
      }
    }

    async function handleGoogleLogin() {
      const errEl = $('#acct-err')!;
      errEl.hidden = true;
      try {
        const cred = await signInWithPopup(auth, googleAuthProvider);
        const idToken = await cred.user.getIdToken();
        sessionAuthToken = idToken;
        const res = await fetch('/api/sync', {
          headers: { Authorization: `Bearer ${idToken}` },
        });
        if (res.ok) {
          const data = await res.json();
          accountInfo = {
            uid: cred.user.uid,
            email: cred.user.email || 'usuaria@google.com',
            authType: 'google',
            lastSyncIso: new Date().toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' }),
          };
          store.set('menarca_account_info', accountInfo);
          if (data.payload && Object.keys(data.payload).length > 0) {
            applyCloudPayload(data.payload);
          } else {
            triggerCloudSync();
          }
          setSes(true);
          if (!$('#lock')!.hidden) closeLock();
          renderAccountStatus();
          closeAuthModal();
          showTip(`☁️ Conectada con Google (${accountInfo.email})`);
        }
      } catch {
        errEl.textContent =
          'No se pudo completar el inicio con Google en esta ventana. Usa tu correo y contraseña o patrón arriba.';
        errEl.hidden = false;
      }
    }

    function dlg(t: string, p: string, ok: string, onOk: () => void) {
      $('#dlg-t')!.textContent = t;
      $('#dlg-p')!.textContent = p;
      $('#dlg-ok')!.textContent = ok;
      $('#dlg')!.hidden = false;
      $('#dlg-no')!.focus();
      $('#dlg-ok')!.onclick = () => {
        $('#dlg')!.hidden = true;
        onOk();
      };
      $('#dlg-no')!.onclick = () => {
        $('#dlg')!.hidden = true;
      };
    }

    function wipe() {
      Object.keys(localStorage)
        .filter((k) => k.startsWith('menarca_'))
        .forEach((k) => localStorage.removeItem(k));
      sessionAuthToken = null;
      setSes(false);
      location.reload();
    }

    function openDrawer() {
      $('#drawer')!.classList.add('on');
      $('#scrim')!.hidden = false;
      $('#burger')!.setAttribute('aria-expanded', 'true');
    }

    function closeDrawer() {
      $('#drawer')!.classList.remove('on');
      $('#scrim')!.hidden = true;
      $('#burger')!.setAttribute('aria-expanded', 'false');
    }

    /* ---------- Inicialización ---------- */
    pat = mkPattern($('#pat')!, onPattern, () => {
      $('#lock-err')!.hidden = true;
    });
    acctPat = mkPattern(
      $('#acct-pat')!,
      (seq) => {
        acctPatSeq = seq;
        const st = $('#acct-pat-status');
        if (st) {
          st.textContent =
            seq.length >= 4
              ? `✓ Patrón de ${seq.length} puntos listo`
              : 'Une al menos 4 puntos';
        }
      },
      () => {
        $('#acct-err')!.hidden = true;
      }
    );

    $('#lock-ok')!.onclick = () => pat.finish();
    $('#lock-cancel')!.onclick = () => {
      if ($('#lock')!.hidden) return;
      setSes(true);
      closeLock();
    };
    $('#lock-cloud-btn')!.onclick = () => {
      openAuthModal('login');
    };
    $('#lock-reset')!.onclick = () =>
      dlg(
        'Borrar todo',
        'Se borrarán el patrón y todos los datos de este dispositivo. No se puede deshacer.',
        'Borrar todo',
        wipe
      );

    // Eventos del modal de Cuenta y Nube
    $$<HTMLElement>('.auth-tab').forEach((b) => {
      b.onclick = () => {
        acctMode = (b.dataset.authMode as 'login' | 'register') || 'login';
        paintAuthModal();
      };
    });
    $$<HTMLElement>('.auth-sec-tab').forEach((b) => {
      b.onclick = () => {
        acctSecType = (b.dataset.secType as 'password' | 'pattern') || 'password';
        paintAuthModal();
      };
    });
    $('#acct-form')!.addEventListener('submit', handleAuthSubmit);
    $('#acct-google-btn')!.onclick = handleGoogleLogin;
    $('#acct-close')!.onclick = closeAuthModal;
    $('#btn-cloud-top')!.onclick = () => openAuthModal(accountInfo ? 'login' : 'register');
    $('#dr-cloud')!.onclick = () => {
      closeDrawer();
      openAuthModal('login');
    };

    // Delegación para botones de estado de cuenta y exportación JSON
    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      if (target.closest('.btn-acct-open')) {
        openAuthModal('login');
      } else if (target.closest('.btn-acct-logout')) {
        sessionAuthToken = null;
        accountInfo = null;
        store.del('menarca_account_info');
        renderAccountStatus();
        showTip('Cerraste tu sesión en la nube. Tus datos locales siguen aquí.');
      } else if (target.closest('.btn-sync-now')) {
        if (sessionAuthToken) {
          triggerCloudSync();
          showTip('☁️ Sincronizando tus datos con la nube…');
        } else {
          openAuthModal('login');
        }
      } else if (target.closest('.btn-export-json')) {
        exportHistoryToJson();
      }
    });

    const params = new URLSearchParams(window.location.search);
    const autostart = params.get('autostart') === '1';
    if (autostart) {
      setSes(true);
      $('#lock')!.hidden = true;
      setInert(false);
    } else if (!hasPat()) {
      openLock('setup');
    } else if (!sesOn()) {
      openLock('unlock');
    } else {
      $('#lock')!.hidden = true;
      setInert(false);
    }

    $('#edad')!.innerHTML =
      '<option value="">Años</option>' +
      [9, 10, 11, 12, 13, 14, 15, 16, 17, 18].map((n) => `<option value="${n}">${n} años</option>`).join('');
    $('#meses')!.innerHTML = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
      .map((n) => `<option value="${n}">${n} ${n === 1 ? 'mes' : 'meses'}</option>`)
      .join('');
    $('#qs')!.innerHTML = QS.map(
      ([n, q, o]) =>
        `<fieldset><legend>${q}</legend><div class="opts">${o.map(([v, t]) => `<label><input type="radio" name="${n}" value="${v}"><span>${t}</span></label>`).join('')}</div></fieldset>`
    ).join('');

    const bn = $('#bnav')!;
    $$('.navbtn', bn).forEach((el) => el.remove());
    NAV.forEach((n) => bn.insertBefore(mkNav(n), bn.querySelector('.fab')));

    $('#cards-que')!.innerHTML = CARDS.map(
      (c) => `<article class="card"><h2>${c.t}</h2><p class="muted" style="margin:0">${c.p}</p></article>`
    ).join('');

    $('#hist-del')!.onclick = () => {
      const keep = store
        .get<DayEntry[]>('menarca_animo', [])
        .map((x) => ({ ...x, m: null, moods: [] }))
        .filter(
          (x) =>
            x.periodo === 'si' ||
            (x.dolor && x.dolor.length) ||
            (x.flujo && x.flujo !== 'ninguno') ||
            x.peso != null ||
            x.nota
        );
      if (keep.length) store.set('menarca_animo', keep);
      else store.del('menarca_animo');
      triggerCloudSync();
      renderHistory();
      renderHoy();
      renderCal();
      renderDay();
      renderPron();
      renderTips();
    };

    // Navegación global delegada
    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      const t = target.closest<HTMLElement>('[data-go]');
      if (!t) return;
      if (t.dataset.today) {
        selDay = iso(new Date());
        calMonth = new Date();
      }
      closeDrawer();
      go(t.dataset.go!);
    });

    // Formulario Estimar
    $('#f')!.addEventListener('submit', (e) => {
      e.preventDefault();
      const fd = Object.fromEntries(new FormData(e.target as HTMLFormElement)) as Record<string, string>;
      const fsets = $$('#f fieldset');
      fsets.forEach((x) => x.classList.remove('miss'));
      const missing: HTMLElement[] = [];
      if (!fd.edad) missing.push(fsets[0]);
      QS.forEach(([n], i) => {
        if (!fd[n]) missing.push(fsets[i + 1]);
      });
      if (missing.length) {
        missing.forEach((x) => x.classList.add('miss'));
        $('#err')!.textContent = 'Falta responder lo que está marcado con línea rosa.';
        $('#err')!.hidden = false;
        missing[0].scrollIntoView({ behavior: RM.matches ? 'auto' : 'smooth', block: 'center' });
        return;
      }
      $('#err')!.hidden = true;
      const r = estimar(fd);
      store.set('menarca_etapa', {
        etapa: r.etapa,
        fecha: iso(new Date()),
        wMin: r.wMin,
        wMax: r.wMax,
        symptomCountUsed: r.symptomCountUsed,
        matchedSymptoms: r.matchedSymptoms,
        sig: {
          mamas: fd.mamas === 'si',
          vello: ['axilas', 'publica', 'ambas'].includes(fd.vello),
          crece: fd.crece === 'm4a7' || fd.crece === 'mas7',
          flujo: fd.flujo === 'si',
          sintomas: (r.symptomCountUsed || 0) > 0,
        },
      });
      triggerCloudSync();
      renderHoy();
      renderPron();
      showResult(r, +fd.edad);
    });

    $('#f')!.addEventListener('change', (e) => {
      const fs = (e.target as HTMLElement).closest('fieldset');
      if (fs) fs.classList.remove('miss');
    });

    // Instalar y Tema
    $$('.btn-install-pwa').forEach((b) =>
      b.addEventListener('click', async () => {
        if (installed) return;
        if (defer) {
          defer.prompt();
          try {
            const r = await defer.userChoice;
            if (r.outcome === 'accepted') {
              installed = true;
              paintInstall();
            }
          } catch {
            // ignore
          }
          defer = null;
          return;
        }
        const ios = /iphone|ipad|ipod/i.test(navigator.userAgent);
        showTip(
          ios
            ? 'Toca Compartir y luego Agregar a pantalla de inicio.'
            : 'Abre el menú del navegador y elige Instalar app.'
        );
      })
    );
    $('#tip-x')!.onclick = () => ($('#tip')!.hidden = true);

    $$('.toggle').forEach((b) =>
      b.addEventListener('click', () =>
        setTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark')
      )
    );

    // Perfil: Foto de avatar y recorte
    $('#b-up')!.onclick = () => $('#f-up')!.click();
    $('#b-cam')!.onclick = () => $('#f-cam')!.click();
    [$<HTMLInputElement>('#f-up')!, $<HTMLInputElement>('#f-cam')!].forEach((inp) =>
      inp.addEventListener('change', () => {
        const f = inp.files?.[0];
        if (f) readFile(f, openCrop);
        inp.value = '';
      })
    );
    $('#zoom')!.addEventListener('input', (e) => {
      if (!crop) return;
      crop.z = +(e.target as HTMLInputElement).value;
      layoutCrop();
    });
    const stage = $('#crop')!;
    stage.addEventListener('pointerdown', (e) => {
      if (!crop) return;
      drag = { x: e.clientX, y: e.clientY, ox: crop.x, oy: crop.y };
      stage.setPointerCapture(e.pointerId);
    });
    stage.addEventListener('pointermove', (e) => {
      if (!drag || !crop) return;
      crop.x = drag.ox + e.clientX - drag.x;
      crop.y = drag.oy + e.clientY - drag.y;
      layoutCrop();
    });
    ['pointerup', 'pointercancel'].forEach((t) => stage.addEventListener(t, () => (drag = null)));
    $('#crop-cancel')!.onclick = closeCrop;
    $('#crop-save')!.onclick = () => {
      if (!crop || !crop.s) return;
      const c = document.createElement('canvas');
      c.width = c.height = 256;
      const g = c.getContext('2d')!;
      const k = 256 / S;
      const W = crop.w * crop.s;
      const H = crop.h * crop.s;
      const x = (S - W) / 2 + crop.x;
      const y = (S - H) / 2 + crop.y;
      g.fillStyle = '#fff';
      g.fillRect(0, 0, 256, 256);
      g.beginPath();
      g.arc(128, 128, 128, 0, Math.PI * 2);
      g.clip();
      g.drawImage(crop.img, x * k, y * k, W * k, H * k);
      const data = c.toDataURL('image/jpeg', 0.85);
      foto = data;
      if (!store.set('menarca_foto', data)) {
        showTip('El dispositivo no tiene espacio para guardar la foto. Se verá solo en esta sesión.');
      }
      triggerCloudSync();
      closeCrop();
      renderAvatar();
    };
    $('#b-nofoto')!.onclick = () => {
      foto = null;
      store.del('menarca_foto');
      triggerCloudSync();
      renderAvatar();
    };

    $('#frames')!.addEventListener('click', (e) => {
      const b = (e.target as HTMLElement).closest<HTMLElement>('[data-f]');
      if (!b) return;
      prof.frame = b.dataset.f!;
      saveProf();
      renderPerfil();
    });

    $('#badges-sel')!.addEventListener('click', (e) => {
      const b = (e.target as HTMLElement).closest<HTMLElement>('[data-bdg]');
      if (!b) return;
      prof.activeBadge = b.dataset.bdg!;
      saveProf();
      renderPerfil();
    });

    $('#nick')!.addEventListener('input', (e) => {
      prof.nick = (e.target as HTMLInputElement).value.slice(0, 20);
      saveProf();
      renderAvatar();
    });

    $('#bgs')!.addEventListener('click', (e) => {
      const b = (e.target as HTMLElement).closest<HTMLElement>('[data-bg]');
      if (!b) return;
      const k = b.dataset.bg!;
      if (!BG[k]) return;
      prof.bg = k;
      saveProf();
      renderPerfil();
    });

    $('#sw-sp')!.onclick = () => {
      prof.sparkle = !prof.sparkle;
      saveProf();
      renderPerfil();
    };
    RM.addEventListener?.('change', renderSpark);

    $('#b-borrar')!.onclick = () => {
      dlg(
        'Borrar mi perfil',
        'Se quitarán la foto, el marco, el fondo, el apodo y los brillitos.',
        'Borrar perfil',
        () => {
          ['menarca_perfil', 'menarca_foto'].forEach((k) => store.del(k));
          prof = { nick: '', frame: 'none', bg: 'lavanda', sparkle: false, activeBadge: '' };
          foto = null;
          triggerCloudSync();
          renderPerfil();
        }
      );
    };

    // Registro diario: Estados de ánimo de selección múltiple (etiquetas)
    $('#reg-moods')!.addEventListener('click', (e) => {
      const b = (e.target as HTMLElement).closest<HTMLElement>('[data-rm]');
      if (!b) return;
      const v = +b.dataset.rm!;
      if (regMoods.includes(v)) {
        regMoods = regMoods.filter((x) => x !== v);
      } else {
        regMoods = [...regMoods, v].sort((a, z) => a - z);
      }
      $$<HTMLElement>('#reg-moods .mood').forEach((x) => {
        const on = regMoods.includes(+x.dataset.rm!);
        x.classList.toggle('on', on);
        x.setAttribute('aria-pressed', String(on));
      });
      liveTips();
    });

    $('#day-card')!.addEventListener('change', () => {
      syncInt();
      liveTips();
    });

    $('#cal')!.addEventListener('click', (e) => {
      const b = (e.target as HTMLElement).closest<HTMLElement>('[data-d]');
      if (!b) return;
      selDay = b.dataset.d!;
      renderCal();
      renderDay();
      if (matchMedia('(max-width:767px)').matches) {
        $('#day-card')!.scrollIntoView({ behavior: RM.matches ? 'auto' : 'smooth', block: 'start' });
      }
    });

    $('#cal-prev')!.onclick = () => {
      calMonth = new Date(calMonth.getFullYear(), calMonth.getMonth() - 1, 1);
      renderCal();
    };
    $('#cal-next')!.onclick = () => {
      calMonth = new Date(calMonth.getFullYear(), calMonth.getMonth() + 1, 1);
      renderCal();
    };
    $('#reg-save')!.onclick = saveDay;
    $('#reg-del')!.onclick = delDay;

    // Menú lateral
    $('#burger')!.onclick = openDrawer;
    $('#scrim')!.onclick = closeDrawer;
    $('#dr-x')!.onclick = closeDrawer;
    $('#dr-lock')!.onclick = () => {
      setSes(false);
      openLock(hasPat() ? 'unlock' : 'setup');
    };
    $('#dr-chg')!.onclick = () => openLock(hasPat() ? 'verify' : 'setup');
    $('#dr-del')!.onclick = () => {
      closeDrawer();
      dlg(
        'Eliminar todos mis datos',
        'Se borrarán tu patrón, tu calendario, tu perfil, tus fotos, tus regalos y tu historial de este dispositivo. No se puede deshacer.',
        'Eliminar todo',
        wipe
      );
    };

    // Tema inicial
    setTheme(
      store.get<string | null>('menarca_tema', null) ||
        (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'),
      false
    );
    matchMedia('(prefers-color-scheme: dark)').addEventListener?.('change', (e) => {
      if (!store.get('menarca_tema', null)) setTheme(e.matches ? 'dark' : 'light', false);
    });

    paintInstall();
    setupPwa();
    renderPerfil();
    renderHome();

    $('#bd-d')!.addEventListener('change', saveBday);
    $('#bd-m')!.addEventListener('change', saveBday);
    $('#bday-test')!.onclick = () => {
      if (!isBirthdayUnlockedToday(bday, new Date())) {
        showTip('🔒 La sorpresa de cumpleaños está bloqueada hasta el día exacto de tu cumpleaños.');
        return;
      }
      celebrateBday(false, false);
    };
    $('#bday-del')!.onclick = () => {
      bday = null;
      store.del('menarca_bday');
      triggerCloudSync();
      renderBday();
      renderHoy();
      renderCal();
    };

    $('#fest-list')!.addEventListener('click', (e) => {
      const b = (e.target as HTMLElement).closest<HTMLButtonElement>('[data-prev]');
      if (!b || b.disabled) return;
      const h = HOLMAP[b.dataset.prev!];
      if (!h) return;
      const now = new Date();
      const act = getActiveYearForHoliday(h, now) !== null;
      const own = regalos.some((g) => g.k === h.id && g.y === now.getFullYear());
      if (!act && !own) {
        showTip(`🔒 Esta sorpresa está bloqueada hasta el ${h.day} de ${MESES[h.month - 1]}.`);
        return;
      }
      celebHol(h, now.getFullYear(), false);
    });

    $('#bday-ok')!.onclick = () => {
      $('#bday')!.hidden = true;
      renderHoy();
      renderPerfil();
    };
    $('#bday-use')!.onclick = () => {
      if (lastGift) {
        if (lastGift.marco && FR[lastGift.marco]) prof.frame = lastGift.marco;
        if (lastGift.fondo && BG[lastGift.fondo]) prof.bg = lastGift.fondo;
        if (lastGift.badges && lastGift.badges[0]) prof.activeBadge = lastGift.badges[0].id;
        saveProf();
      }
      $('#bday')!.hidden = true;
      go('perfil');
    };

    setTimeout(checkCelebs, 450);

    setInterval(tick, 20000);
    const h = location.hash.slice(1);
    if (['inicio', 'estimar', 'registro', 'perfil', 'preguntas', 'queesperar'].includes(h)) {
      go(h);
    }
  }, []);

  return (
    <>
      <div id="bgfx"></div>
      <div id="veil"></div>
      <div id="sparkles"></div>

      <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
        <symbol id="i-book" viewBox="0 0 24 24">
          <path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v15H6.5A2.5 2.5 0 0 0 4 19.5zM4 19.5V22h16" />
        </symbol>
        <symbol id="i-help" viewBox="0 0 24 24">
          <path d="M9 9a3 3 0 1 1 4 2.8c-.7.3-1 .9-1 1.7V15M12 18.5v.01" />
        </symbol>
        <symbol id="i-user" viewBox="0 0 24 24">
          <circle cx="12" cy="8" r="4" />
          <path d="M4 21c1.2-4 4-6 8-6s6.8 2 8 6" />
        </symbol>
        <symbol id="i-plus" viewBox="0 0 24 24">
          <path d="M12 5v14M5 12h14" />
        </symbol>
        <symbol id="i-cloud" viewBox="0 0 24 24">
          <path d="M7 18a4 4 0 0 1-.5-8 6 6 0 0 1 11.6 1.5A3.5 3.5 0 0 1 17.5 18z" />
          <path d="M12 11v6M9.5 14.5 12 17l2.5-2.5" />
        </symbol>
        <symbol id="i-sun" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
        </symbol>
        <symbol id="i-moon" viewBox="0 0 24 24">
          <path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z" />
        </symbol>
        <symbol id="i-cam" viewBox="0 0 24 24">
          <path d="M4 8h3l2-3h6l2 3h3v11H4z" />
          <circle cx="12" cy="13" r="3.5" />
        </symbol>
        <symbol id="i-img" viewBox="0 0 24 24">
          <rect x="3" y="4" width="18" height="16" rx="3" />
          <circle cx="9" cy="10" r="2" />
          <path d="m21 16-5-5-8 8" />
        </symbol>
        <symbol id="i-menu" viewBox="0 0 24 24">
          <path d="M4 7h16M4 12h16M4 17h16" />
        </symbol>
        <symbol id="i-trash" viewBox="0 0 24 24">
          <path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3" />
        </symbol>
        <symbol id="i-cal" viewBox="0 0 24 24">
          <rect x="3" y="5" width="18" height="16" rx="3" />
          <path d="M8 3v4M16 3v4M3 10h18" />
        </symbol>
        <symbol id="i-spark" viewBox="0 0 24 24">
          <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8zM19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8z" />
        </symbol>
      </svg>

      <header className="top">
        <div className="brand">
          <span aria-hidden="true">🌙</span> PerDay
        </div>
        <div className="ctrls">
          <button className="btn-install" id="btn-cloud-top" type="button" aria-label="Cuenta y sincronización en la nube">
            <span className="bi-circ">
              <svg className="i">
                <use href="#i-cloud" />
              </svg>
            </span>
            <span className="bi-txt">Mi Cuenta</span>
          </button>
          <button
            className="toggle"
            type="button"
            role="switch"
            aria-checked="false"
            data-mode="light"
            aria-label="Cambiar entre modo claro y oscuro"
          >
            <span className="tl">Claro</span>
            <span className="knob">
              <svg className="i sun">
                <use href="#i-sun" />
              </svg>
              <svg className="i moon">
                <use href="#i-moon" />
              </svg>
            </span>
          </button>
          <button className="burger" id="burger" type="button" aria-label="Abrir menú" aria-expanded="false">
            <svg className="i">
              <use href="#i-menu" />
            </svg>
          </button>
        </div>
      </header>

      <main>
        {/* Inicio */}
        <section className="view on" id="v-inicio">
          <h1 className="sr">Mi calendario</h1>
          <div id="aniv-banner-host"></div>

          {/* 1. Tarjeta de Sincronización en la Nube en Inicio */}
          <div className="card acct-status-box" style={{ marginBottom: '16px' }}></div>

          {/* 3. Mascotas Decorativas en el Inicio */}
          <div className="card" id="pet-card" style={{ marginBottom: '16px' }}>
            <h2>Mascota Decorativa 🐾</h2>
            <div id="pet-section-host"></div>
          </div>

          <div className="grid">
            <div className="card hoy">
              <h2>Hoy en PerDay</h2>
              <p className="val" id="hoy-animo">
                Aún sin registrar
              </p>
              <p className="muted" id="hoy-etapa" style={{ margin: 0 }}>
                Haz una estimación
              </p>
              <p className="muted" id="hoy-salud" style={{ margin: '6px 0 0', fontWeight: 600, fontSize: '14px' }}>
                🩺 Sin síntomas hoy
              </p>
              <p className="muted" id="hoy-bday" style={{ margin: '6px 0 0' }} hidden></p>
              <button className="btn ghost" data-go="estimar" type="button" style={{ marginTop: '14px' }}>
                Estimar mi etapa
              </button>
            </div>

            <div className="card span2" id="pron-card">
              <h2>Pronóstico de los próximos 7 días</h2>
              <div id="pron"></div>
            </div>

            <div className="card span2" id="cal-card">
              <h2 className="sr">Calendario</h2>
              <p className="muted" style={{ margin: '0 0 12px' }}>
                Toca un día para anotar cómo estuvo.
              </p>
              <div className="cal-head">
                <button className="cbtn" id="cal-prev" type="button" aria-label="Mes anterior">
                  ‹
                </button>
                <h2 id="cal-title"></h2>
                <button className="cbtn" id="cal-next" type="button" aria-label="Mes siguiente">
                  ›
                </button>
              </div>
              <div className="cal-dow">
                <span>L</span>
                <span>M</span>
                <span>X</span>
                <span>J</span>
                <span>V</span>
                <span>S</span>
                <span>D</span>
              </div>
              <div className="cal" id="cal"></div>
              <div className="legend">
                <span>
                  <i style={{ background: '#EC6A9B' }}></i>Menstruación
                </span>
                <span>
                  <i style={{ background: '#C2185B' }}></i>Fuerte
                </span>
                <span>
                  <i style={{ background: '#7FB8E8' }}></i>Flujo o manchas
                </span>
                <span>
                  <i style={{ background: '#A99BE0' }}></i>Síntomas
                </span>
                <span>
                  <i style={{ border: '1.5px dashed #E89BBB' }}></i>Posible próxima
                </span>
              </div>
            </div>

            <div className="stack">
              <div className="card" id="tips-card">
                <h2>Tu cuerpo te dice</h2>
                <div id="tips"></div>
                <p className="foot">
                  Información general basada en KidsHealth y ACOG. No reemplaza a tu pediatra.
                </p>
              </div>
              <div className="card" id="menarca-card">
                <h2>Mi menarca</h2>
                <div id="menarca"></div>
              </div>
            </div>

            <div className="card span2" id="day-card">
              <h2 id="day-title"></h2>
              <fieldset>
                <legend>¿Te vino la menstruación?</legend>
                <div className="opts" id="reg-per"></div>
              </fieldset>
              <fieldset id="int-box" hidden>
                <legend>¿Qué tan fuerte fue?</legend>
                <div className="opts" id="reg-int"></div>
              </fieldset>
              <fieldset>
                <legend>¿Cómo te sentiste? (Puedes marcar varias etiquetas a la vez)</legend>
                <div className="moods multi-tags" id="reg-moods"></div>
              </fieldset>
              <fieldset>
                <legend>¿Notaste algún síntoma físico? (Selección múltiple conectada a tu predicción)</legend>
                <div className="tiles multi-tags" id="reg-mol"></div>
              </fieldset>
              <fieldset>
                <legend>¿Cómo fue tu flujo?</legend>
                <div className="tiles" id="reg-flu"></div>
              </fieldset>

              <fieldset>
                <legend>⚖️ Peso del día (kg, opcional)</legend>
                <input
                  type="number"
                  id="reg-peso"
                  step="0.1"
                  min="20"
                  max="150"
                  placeholder="Ejemplo: 45.5"
                  aria-label="Peso en kilogramos"
                />
              </fieldset>

              <textarea id="reg-nota" maxLength={200} placeholder="Nota (opcional)" aria-label="Nota"></textarea>
              <div id="day-tips"></div>
              <p
                className="muted"
                id="reg-ok"
                hidden
                style={{ margin: '10px 0 0', fontWeight: 600 }}
                role="status"
              ></p>
              <div className="btns" style={{ margin: '14px 0 0', justifyContent: 'flex-start' }}>
                <button className="btn" id="reg-save" type="button">
                  Guardar este día
                </button>
                <button className="btn ghost" id="reg-del" type="button">
                  Borrar este día
                </button>
                <button className="btn ghost btn-export-json" id="btn-export-json" type="button">
                  📥 Exportar historial (JSON)
                </button>
              </div>
            </div>

            <div className="stack">
              <div className="card" id="ritmo-card">
                <h2>Mi ritmo</h2>
                <div id="ritmo"></div>
                <p className="muted" style={{ margin: 0, fontSize: '14px' }}>
                  Esto es solo una orientación, no un diagnóstico.
                </p>
              </div>
            </div>

            <div className="card">
              <h2>Mi ánimo de la semana</h2>
              <div className="chart" id="chart"></div>
              <p className="muted" id="hist-vacio">
                Aún no hay ánimos registrados. Elige cómo te sentiste en el calendario.
              </p>
              <div className="btns" style={{ marginTop: '10px' }}>
                <button className="btn ghost block" id="hist-del" type="button">
                  Borrar mis ánimos
                </button>
                <button className="btn ghost block btn-export-json" type="button">
                  📥 Descargar copia JSON
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Estimar */}
        <section className="view" id="v-estimar">
          <div className="card" id="card-form" style={{ maxWidth: '640px' }}>
            <h2>Estimar</h2>
            <p className="muted">Responde con calma. No hay respuestas buenas ni malas.</p>
            <form id="f" noValidate>
              <fieldset>
                <legend>¿Cuántos años tienes?</legend>
                <div className="row">
                  <select name="edad" id="edad" aria-label="Años"></select>
                  <select name="meses" id="meses" aria-label="Meses"></select>
                </div>
              </fieldset>
              <div id="qs"></div>
              <p className="err" id="err" hidden>
                Responde todas las preguntas para ver tu estimación.
              </p>
              <button className="btn block" type="submit">
                Ver mi estimación
              </button>
            </form>
          </div>
          <div id="resultado" hidden style={{ maxWidth: '640px' }}></div>
        </section>

        {/* Qué esperar */}
        <section className="view" id="v-queesperar">
          <h1>Qué esperar</h1>
          <p className="muted">Cambios normales de la pubertad, explicados con calma.</p>
          <div className="grid" id="cards-que"></div>
        </section>

        {/* Preguntas */}
        <section className="view" id="v-preguntas">
          <h1>Preguntas frecuentes</h1>
          <p className="muted">Lo que muchas niñas se preguntan.</p>
          <div className="card">
            <details>
              <summary>¿Es normal que me llegue antes o después que a mis amigas?</summary>
              <p>Sí. Cada cuerpo tiene su propio ritmo. Lo normal va de los 9 a los 16 años.</p>
            </details>
            <details>
              <summary>¿Duele la menstruación?</summary>
              <p>
                Puede haber molestias leves en la parte baja del abdomen o la espalda. Si el dolor es muy fuerte o no te deja hacer tus cosas, avisa a un adulto de confianza.
              </p>
            </details>
            <details>
              <summary>¿Cada cuánto llega?</summary>
              <p>
                Al principio puede ser irregular. En las adolescentes, lo normal es que pasen entre 21 y 45 días entre una y otra. Con el tiempo se va haciendo más regular.
              </p>
            </details>
            <details>
              <summary>¿Qué hago si me llega en la escuela?</summary>
              <p>
                Usa una toalla sanitaria si la tienes, avisa a una persona de confianza, como una maestra o una amiga, y pide ayuda. Es algo normal que le pasa a muchas niñas.
              </p>
            </details>
            <details>
              <summary>¿Por qué cambian el sueño, la digestión o el apetito antes de que me venga?</summary>
              <p>
                Porque hormonas como el estrógeno, la progesterona y las prostaglandinas se activan para preparar el útero, y de paso influyen en el intestino, en la temperatura corporal y en el descanso. Es completamente normal y pasajero.
              </p>
            </details>
            <details>
              <summary>¿Cómo se ve la menstruación?</summary>
              <p>
                Suele ser sangre de color rojo o café. Al principio puede ser poca y solo manchar, y después aumentar unos días. A veces tiene pequeños coágulos, lo cual es normal. Cada niña tiene su propio patrón.
              </p>
            </details>
            <details>
              <summary>¿Cómo sé que me va a venir pronto?</summary>
              <p>
                Algunas señales son que te crezcan las mamas, que te salga vello, que tengas un estirón y que notes flujo blanco o transparente. La primera menstruación suele llegar unos 2 años después de que empiezan a crecer las mamas.
              </p>
            </details>
            <details>
              <summary>¿Qué es el flujo blanco?</summary>
              <p>
                Es un líquido blanco o transparente que indica que el cuerpo se está preparando. Suele aparecer unos 6 meses antes de la primera menstruación. Si cambia de color, huele fuerte o pica, consulta a tu pediatra.
              </p>
            </details>
            <details>
              <summary>¿Cuándo debo consultar al pediatra?</summary>
              <p>
                Si a los 15 años aún no te llegó, si el periodo dura más de 7 días, si empapas una toalla en menos de 2 horas, si pasan más de 45 días o menos de 21 entre un periodo y otro, o si el dolor es muy fuerte.
              </p>
            </details>
          </div>
        </section>

        {/* Mi perfil */}
        <section className="view" id="v-perfil">
          <h1>Mi perfil</h1>
          <p className="muted">Personaliza tu avatar, revisa tus recompensas y sincroniza tu cuenta en la nube.</p>

          {/* Sincronización y Copia de Seguridad en Mi Perfil */}
          <div className="card acct-status-box" style={{ marginBottom: '16px' }}></div>

          <div className="grid">
            <div className="card">
              <h2>Foto de avatar</h2>
              <div className="avatar">
                <div className="av" id="av"></div>
                <div className="av-frame" id="av-frame"></div>
                <span className="av-badge" id="av-badge" hidden></span>
              </div>
              <div className="btns">
                <button className="btn" id="b-up" type="button">
                  <svg className="i">
                    <use href="#i-img" />
                  </svg>
                  Subir foto
                </button>
                <button className="btn ghost" id="b-cam" type="button">
                  <svg className="i">
                    <use href="#i-cam" />
                  </svg>
                  Tomar foto
                </button>
                <button className="btn ghost" id="b-nofoto" type="button">
                  Quitar
                </button>
              </div>
              <input type="file" id="f-up" accept="image/*" hidden />
              <input type="file" id="f-cam" accept="image/*" capture="user" hidden />
              <div id="crop-box" hidden>
                <p className="muted" style={{ textAlign: 'center' }}>
                  Arrastra la foto y ajusta el zoom.
                </p>
                <div className="crop" id="crop">
                  <img id="crop-img" alt="" />
                </div>
                <label className="zoom">
                  Zoom <input type="range" id="zoom" min="1" max="3" step="0.02" defaultValue="1" />
                </label>
                <div className="btns">
                  <button className="btn" id="crop-save" type="button">
                    Usar esta foto
                  </button>
                  <button className="btn ghost" id="crop-cancel" type="button">
                    Cancelar
                  </button>
                </div>
              </div>
            </div>

            <div className="card">
              <h2>Marco</h2>
              <div className="frames" id="frames"></div>
            </div>

            <div className="card">
              <h2>Apodo o avatar</h2>
              <p className="muted">Opcional. No escribas tu nombre real.</p>
              <input type="text" id="nick" maxLength={20} placeholder="Por ejemplo: Luna" aria-label="Apodo" />
              <h3 style={{ margin: '18px 0 8px', fontSize: '16px' }}>Mis insignias 🏅</h3>
              <p className="muted" style={{ fontSize: '13.5px' }}>
                Elige qué insignia mostrar junto a tu foto de perfil.
              </p>
              <div className="badges-grid" id="badges-sel"></div>
            </div>

            <div className="card span2" id="card-bday">
              <h2>Mi cumpleaños 🎂 y Regalos</h2>
              <p className="muted">
                Tu regalo sorpresa permanece bloqueado y solo se revela el día exacto de tu cumpleaños.
              </p>
              <div className="row" style={{ marginBottom: '10px' }}>
                <select id="bd-d" aria-label="Día"></select>
                <select id="bd-m" aria-label="Mes"></select>
              </div>
              <p className="muted" id="bday-info" role="status" style={{ margin: '0 0 12px' }}></p>
              <div className="btns" style={{ justifyContent: 'flex-start' }}>
                <button className="btn ghost" id="bday-test" type="button" disabled>
                  🔒 Bloqueado hasta tu cumpleaños
                </button>
                <button className="btn ghost" id="bday-del" type="button" hidden>
                  Quitar fecha
                </button>
              </div>
              <h3 style={{ margin: '14px 0 8px', fontSize: '16px' }}>Mis regalos desbloqueados</h3>
              <div className="gifts" id="regalos"></div>
            </div>

            <div className="card">
              <h2>Celebraciones y Aniversario 🎉</h2>
              <p className="muted">
                Las sorpresas están bloqueadas antes de tiempo y solo se revelan el día exacto de cada fecha (Aniversario 8 de noviembre, Navidad, Halloween, San Valentín y Primavera).
              </p>
              <div id="fest-list"></div>
            </div>

            {/* 2. Fondo de pantalla: 10 Fondos Diarios */}
            <div className="card span2">
              <h2>Fondo de pantalla (10 Regalos Diarios) 🎁</h2>
              <p className="muted">
                Recibes 1 de los 10 fondos nuevos cada día que entras seguido a PerDay, además de los fondos de celebraciones en su fecha exacta.
              </p>
              <div className="bgs" id="bgs"></div>
              <p className="muted" id="bg-msg" role="status" style={{ margin: '6px 0 0', fontSize: '13px' }}>
                ✨ Entra cada día seguido a PerDay para desbloquear los 10 fondos diarios exclusivos.
              </p>
            </div>

            <div className="stack">
              <div className="card">
                <h2>Brillitos y Respaldo</h2>
                <div className="switch-row">
                  <p className="muted">Destellos suaves sobre el fondo</p>
                  <button
                    className="sw"
                    id="sw-sp"
                    type="button"
                    role="switch"
                    aria-checked="false"
                    aria-label="Brillitos"
                  ></button>
                </div>
                <button className="btn ghost block btn-export-json" id="btn-export-json-perfil" type="button">
                  📥 Exportar historial a JSON
                </button>
              </div>
              <div className="card">
                <h2>Borrar</h2>
                <p className="muted">Se quitan la foto, el marco, el fondo, el apodo y los brillitos.</p>
                <button className="btn ghost block" id="b-borrar" type="button">
                  <svg className="i">
                    <use href="#i-trash" />
                  </svg>
                  Borrar mi perfil
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <nav className="bnav" id="bnav" aria-label="Principal">
        <button className="fab" data-go="registro" data-today="1" aria-label="Registrar hoy" type="button">
          <svg className="i">
            <use href="#i-plus" />
          </svg>
        </button>
      </nav>

      <div className="card tip" id="tip" role="status" hidden>
        <p id="tip-txt"></p>
        <button className="btn ghost" id="tip-x" type="button" aria-label="Cerrar">
          ✕
        </button>
      </div>

      <aside className="drawer" id="drawer" aria-label="Menú">
        <div className="dr-head">
          <div className="brand">
            <span aria-hidden="true">🌙</span> PerDay
          </div>
          <button
            className="btn ghost"
            id="dr-x"
            type="button"
            aria-label="Cerrar menú"
            style={{ minHeight: '44px', padding: '0 14px' }}
          >
            ✕
          </button>
        </div>
        <button className="dr-item" data-go="inicio" type="button">
          Mi calendario y mascota
        </button>
        <button className="dr-item" data-go="registro" data-today="1" type="button">
          Registrar el día
        </button>
        <button className="dr-item" data-go="estimar" type="button">
          Estimar
        </button>
        <button className="dr-item" data-go="perfil" type="button">
          Mi perfil
        </button>
        <button className="dr-item" id="dr-cloud" type="button">
          ☁️ Sincronización en la nube
        </button>
        <button className="dr-item btn-export-json" type="button">
          📥 Exportar historial (JSON)
        </button>
        <button className="dr-item btn-install-pwa" type="button">
          📲 <span className="bi-txt">Instalar PerDay</span>
        </button>
        <button className="dr-item" id="dr-lock" type="button">
          Bloquear ahora
        </button>
        <button className="dr-item" id="dr-chg" type="button">
          Cambiar mi patrón
        </button>
        <button className="dr-item danger" id="dr-del" type="button">
          Eliminar todos mis datos
        </button>
      </aside>
      <div className="scrim" id="scrim" hidden></div>

      {/* Pantalla de bloqueo con patrón */}
      <div id="lock">
        <div className="card lockc">
          <div className="brand" style={{ justifyContent: 'center', marginBottom: '6px' }}>
            <span aria-hidden="true">🌙</span> PerDay
          </div>
          <h2 id="lock-t" style={{ textAlign: 'center', marginTop: '14px' }}></h2>
          <p className="muted" id="lock-p" style={{ textAlign: 'center', marginBottom: 0 }}></p>
          <div className="pat" id="pat"></div>
          <p className="err" id="lock-err" role="alert" hidden style={{ textAlign: 'center' }}></p>
          <button
            className="btn ghost block"
            id="lock-ok"
            type="button"
            style={{ minHeight: '40px', fontSize: '14px' }}
          >
            Confirmar patrón (con teclado)
          </button>
          <button className="btn block" id="lock-cloud-btn" type="button" style={{ marginTop: '10px' }}>
            ☁️ Iniciar sesión / Sincronizar cuenta
          </button>
          <button className="btn ghost block" id="lock-cancel" type="button" hidden style={{ marginTop: '10px' }}>
            Cancelar
          </button>
          <button className="btn ghost block" id="lock-reset" type="button" hidden style={{ marginTop: '10px' }}>
            Olvidé mi patrón: borrar todo
          </button>
        </div>
      </div>

      {/* 1. Modal de Inicio de Sesión y Registro en la Nube */}
      <div id="auth-modal" hidden>
        <div className="card auth-card" role="dialog" aria-modal="true" aria-labelledby="auth-modal-title">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <h2 id="auth-modal-title" style={{ margin: 0 }}>
              ☁️ Mi Cuenta en la Nube
            </h2>
            <button className="btn ghost" id="acct-close" type="button" style={{ minHeight: '38px', padding: '0 12px' }}>
              ✕
            </button>
          </div>
          <p className="muted" style={{ marginBottom: '12px', fontSize: '14px' }}>
            Ingresa tu correo electrónico y elige contraseña o patrón. Si entras desde otro dispositivo, descargaremos automáticamente tus registros, insignias, fondos y progreso.
          </p>

          <div className="auth-tabs" role="tablist">
            <button
              type="button"
              className="auth-tab on"
              data-auth-mode="login"
              role="tab"
              aria-selected="true"
            >
              Iniciar sesión
            </button>
            <button
              type="button"
              className="auth-tab"
              data-auth-mode="register"
              role="tab"
              aria-selected="false"
            >
              Crear cuenta
            </button>
          </div>

          <form id="acct-form" noValidate>
            <label className="auth-field">
              <span>Correo electrónico (email)</span>
              <input
                type="email"
                id="acct-email"
                placeholder="tucorreo@ejemplo.com"
                autoComplete="email"
                required
              />
            </label>

            <div className="auth-sec-switch">
              <span>Método de acceso:</span>
              <div className="auth-sec-btns">
                <button type="button" className="auth-sec-tab on" data-sec-type="password" aria-pressed="true">
                  🔑 Contraseña
                </button>
                <button type="button" className="auth-sec-tab" data-sec-type="pattern" aria-pressed="false">
                  ✨ Patrón
                </button>
              </div>
            </div>

            <div id="acct-pass-box">
              <label className="auth-field">
                <span>Contraseña</span>
                <input
                  type="password"
                  id="acct-pass"
                  placeholder="Mínimo 4 caracteres"
                  autoComplete="current-password"
                />
              </label>
            </div>

            <div id="acct-pat-box" hidden>
              <p className="muted" id="acct-pat-status" style={{ textAlign: 'center', margin: '4px 0', fontSize: '13px' }}>
                Dibuja tu patrón de al menos 4 puntos
              </p>
              <div className="pat" id="acct-pat" style={{ width: '210px', margin: '6px auto' }}></div>
            </div>

            <p className="err" id="acct-err" role="alert" hidden style={{ marginTop: '8px' }}></p>
            <p
              id="acct-ok"
              role="status"
              hidden
              style={{ marginTop: '8px', fontWeight: 600, color: '#245A44' }}
            ></p>

            <button className="btn block" id="acct-submit" type="submit" style={{ marginTop: '12px' }}>
              Iniciar sesión y descargar mis datos
            </button>
          </form>

          <div className="auth-divider">
            <span>o también</span>
          </div>

          <button className="btn ghost block" id="acct-google-btn" type="button">
            🌐 Continuar con Google
          </button>
        </div>
      </div>

      {/* Modal de Celebración y Gran Aniversario */}
      <div id="bday" hidden>
        <div className="card bday-c" role="dialog" aria-modal="true" aria-labelledby="bday-t">
          <div className="confetti" id="confetti" aria-hidden="true"></div>
          <div className="big" id="bday-e" aria-hidden="true">
            🎂
          </div>
          <h2 id="bday-t"></h2>
          <p id="bday-m" style={{ margin: 0 }}></p>
          <div className="gifts" id="bday-g"></div>
          <button className="btn block" id="bday-ok" type="button">
            ¡Gracias! 💖
          </button>
          <button className="btn ghost block" id="bday-use" type="button" style={{ marginTop: '10px' }}>
            Estrenar mis regalos
          </button>
        </div>
      </div>

      <div id="dlg" hidden>
        <div className="card dlg" role="dialog" aria-modal="true" aria-labelledby="dlg-t">
          <h2 id="dlg-t"></h2>
          <p className="muted" id="dlg-p"></p>
          <div className="btns">
            <button className="btn" id="dlg-ok" type="button"></button>
            <button className="btn ghost" id="dlg-no" type="button">
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
