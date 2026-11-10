export interface SymptomOption {
  id: string;
  label: string;
  category: 'Digestión' | 'Sueño' | 'Cuerpo' | 'Temperatura' | 'Apetito' | 'Piel';
  icon: string;
  weight: number;
}

export interface EducationalTip {
  key: string;
  title: string;
  category: string;
  body: string;
}

export interface BadgeAsset {
  id: string;
  name: string;
  emoji: string;
  image?: string;
  eventName: string;
}

export interface WallpaperAsset {
  id: string;
  label: string;
  value: string;
  image?: string;
  eventName?: string;
  dayNumber?: number;
}

export interface VirtualPetAsset {
  id: string;
  codeName: string;
  defaultName: string;
  species: 'Gato' | 'Perro' | 'Zorro' | 'Amigos';
  emoji: string;
  image: string;
  caption: string;
}

export interface HolidayRewardItem {
  kind: 'wallpaper' | 'badge';
  id: string;
  label: string;
  image?: string;
  emoji?: string;
  wallpaper?: WallpaperAsset;
  badge?: BadgeAsset;
}

export interface HolidayEvent {
  id: string;
  name: string;
  emoji: string;
  month: number;
  day: number;
  altMonth?: number;
  altDay?: number;
  daysBefore: number;
  daysAfter: number;
  isGrandAnniversary?: boolean;
  maxRewards: number;
  title: string;
  message: string;
  frameId: string;
  wallpapers: WallpaperAsset[];
  badges: BadgeAsset[];
  particles: string[];
}

export interface DayEntry {
  d: string;
  m?: number | null;
  moods?: number[];
  dolor?: string[];
  flujo?: string;
  nota?: string;
  periodo?: 'si' | 'no';
  intensidad?: 'ligera' | 'normal' | 'fuerte' | null;
  peso?: number | null;
}

export interface MenarcaEstimate {
  etapa: number;
  fecha: string;
  wMin: number;
  wMax: number;
  flujo?: boolean;
  rango?: string;
  symptomCountUsed?: number;
  matchedSymptoms?: string[];
  sig?: {
    mamas: boolean;
    vello: boolean;
    crece: boolean;
    flujo: boolean;
    sintomas?: boolean;
  };
}

/**
 * 3. Mascotas Decorativas (Inicio):
 * Reemplaza todas las mascotas con las 21 nuevas imágenes transparentes (-Photoroom.png).
 * Son puramente decorativas para adornar el Inicio sin necesidad de alimentarlas ni cuidarlas.
 */
export const VIRTUAL_PETS: VirtualPetAsset[] = [
  {
    id: 'mascota_michi_chef',
    codeName: '@_artizzy chef tom-Photoroom.png',
    defaultName: 'Mochi Chef',
    species: 'Gato',
    emoji: '🐱',
    image: '/assets/aistudio/__artizzy_chef_tom-Photoroom_e27bedae.png',
    caption: 'Gatita pastelera preparando algo rico para tu día ✨',
  },
  {
    id: 'mascota_gato_estambre',
    codeName: '864972672175678121-Photoroom.png',
    defaultName: 'Mandarina',
    species: 'Gato',
    emoji: '🧶',
    image: '/assets/aistudio/864972672175678121-Photoroom_d507ab4b.png',
    caption: 'Descansando sobre su bolita de estambre azul 💤',
  },
  {
    id: 'mascota_zorro_hojita',
    codeName: 'Naranjita yt furry-Photoroom.png',
    defaultName: 'Naranjita',
    species: 'Zorro',
    emoji: '🦊',
    image: '/assets/aistudio/Naranjita_yt_furry-Photoroom_5cd8b2f6.png',
    caption: 'Zorrito con su hojita verde de la buena suerte 🌱',
  },
  {
    id: 'mascota_perro_flor',
    codeName: 'Chihuahua holding flower-Photoroom.png',
    defaultName: 'Canela',
    species: 'Perro',
    emoji: '🌼',
    image: '/assets/aistudio/Chihuahua_holding_flower-Photoroom_e54960b3.png',
    caption: 'Perrita sosteniendo una margarita para decorar tu inicio 🌸',
  },
  {
    id: 'mascota_perro_orejon',
    codeName: '932245191610450385-Photoroom.png',
    defaultName: 'Trufa',
    species: 'Perro',
    emoji: '🐶',
    image: '/assets/aistudio/932245191610450385-Photoroom_c76034ba.png',
    caption: 'Cachorrito orejón acompañando tu calendario 🐾',
  },
  {
    id: 'mascota_tiburon',
    codeName: 'Cute Shark-Photoroom.png',
    defaultName: 'Coral',
    species: 'Amigos',
    emoji: '🦈',
    image: '/assets/aistudio/____Cute_Shark____-Photoroom_25c55d31.png',
    caption: 'Tiburoncito azul entre burbujas marinas 🫧',
  },
  {
    id: 'mascota_nutria',
    codeName: '354869645653817293-Photoroom.png',
    defaultName: 'Moka',
    species: 'Amigos',
    emoji: '🦦',
    image: '/assets/aistudio/354869645653817293-Photoroom_c37443fa.png',
    caption: 'Nutria tranquila sonriendo en tu pantalla 💕',
  },
  {
    id: 'mascota_pajarito',
    codeName: '757238124895603478-Photoroom.png',
    defaultName: 'Pío',
    species: 'Amigos',
    emoji: '🐦',
    image: '/assets/aistudio/757238124895603478-Photoroom_c31c083f.png',
    caption: 'Gorrioncito alegre revoloteando entre hojitas 🍂',
  },
  {
    id: 'mascota_huron',
    codeName: '1095993259441925859-Photoroom.png',
    defaultName: 'Bambú',
    species: 'Amigos',
    emoji: '🐾',
    image: '/assets/aistudio/1095993259441925859-Photoroom_67fb862d.png',
    caption: 'Hurón sonriente lleno de buena vibra 🌟',
  },
  {
    id: 'mascota_jirafa',
    codeName: '935763628825987852-Photoroom.png',
    defaultName: 'Melodía',
    species: 'Amigos',
    emoji: '🦒',
    image: '/assets/aistudio/935763628825987852-Photoroom_b7a59cad.png',
    caption: 'Jirafita con moño rosa y estrellitas ✨',
  },
  {
    id: 'mascota_cachorro_peludo',
    codeName: '1151303092292475125-Photoroom.png',
    defaultName: 'Roco',
    species: 'Perro',
    emoji: '🐕',
    image: '/assets/aistudio/1151303092292475125-Photoroom_f7864570.png',
    caption: 'Perrito peludo y simpático de guardia en tu diario 🐶',
  },
  {
    id: 'mascota_duo_abrazo',
    codeName: 'cute matching pfp-Photoroom.png',
    defaultName: 'Copito y Miel',
    species: 'Amigos',
    emoji: '💖',
    image: '/assets/aistudio/cute_matching_pfp-Photoroom_edf319c9.png',
    caption: 'Gatito y perrito dándose un abrazo gigante 🤍',
  },
  {
    id: 'mascota_chihuahua',
    codeName: '1083889835346398903-Photoroom.png',
    defaultName: 'Chispita',
    species: 'Perro',
    emoji: '🐶',
    image: '/assets/aistudio/1083889835346398903-Photoroom_ae402579.png',
    caption: 'Mirada curiosa y tierna para alegrar tu inicio 🌟',
  },
  {
    id: 'mascota_gato_mono',
    codeName: '1104859721110146721-Photoroom.png',
    defaultName: 'Perlita',
    species: 'Gato',
    emoji: '🎀',
    image: '/assets/aistudio/1104859721110146721-Photoroom_daed49a9.png',
    caption: 'Gatita gris con moñito mostrando sus patitas 🐾',
  },
  {
    id: 'mascota_perro_estrella',
    codeName: 'Spicymochi-Photoroom.png',
    defaultName: 'Lucero',
    species: 'Perro',
    emoji: '⭐',
    image: '/assets/aistudio/Spicymochi___spicymochii__on_X-Photoroom_e6883b5a.png',
    caption: 'Cachorrito con disfraz de estrella brillante 🌟',
  },
  {
    id: 'mascota_mama_perrita',
    codeName: '840765824214721840-Photoroom.png',
    defaultName: 'Vainilla',
    species: 'Perro',
    emoji: '🐩',
    image: '/assets/aistudio/840765824214721840-Photoroom_a971fa79.png',
    caption: 'Descansando en su tapete rosa con sus cachorritos 💕',
  },
  {
    id: 'mascota_hamster',
    codeName: 'hamsterrrrrrrrrrrrr-Photoroom.png',
    defaultName: 'Avellana',
    species: 'Amigos',
    emoji: '🐹',
    image: '/assets/aistudio/hamsterrrrrrrrrrrrr-Photoroom_45f10135.png',
    caption: 'Hamstercito redondito y suave como un malvavisco ☁️',
  },
  {
    id: 'mascota_lobito',
    codeName: '1148840186235469647-Photoroom.png',
    defaultName: 'Lobo Gris',
    species: 'Perro',
    emoji: '🐺',
    image: '/assets/aistudio/1148840186235469647-Photoroom_c7b61602.png',
    caption: 'Lobito sonriente con mejillas sonrojadas ✨',
  },
  {
    id: 'mascota_pastor',
    codeName: 'TearsOfThemis-Photoroom.png',
    defaultName: 'Max',
    species: 'Perro',
    emoji: '🐕‍🦺',
    image: '/assets/aistudio/_TearsOfThemis_______-Photoroom_fe04cff6.png',
    caption: 'Cachorro lleno de destellos y flores de alegría 🌸',
  },
  {
    id: 'mascota_gato_hoodie',
    codeName: 'hoodie cat-Photoroom.png',
    defaultName: 'Sombra',
    species: 'Gato',
    emoji: '🐈‍⬛',
    image: '/assets/aistudio/hoodie_cat-Photoroom_18ee0d77.png',
    caption: 'Michi con su sudadera cómoda favorita 🖤',
  },
  {
    id: 'mascota_castanita',
    codeName: '862650503665474597-Photoroom.png',
    defaultName: 'Castañita',
    species: 'Amigos',
    emoji: '🎀',
    image: '/assets/aistudio/862650503665474597-Photoroom_8e1d0e47.png',
    caption: 'Amiguito elegante con corbata saludándote alegremente 🎉',
  },
];

/**
 * 2. 10 Fondos Diarios:
 * El sistema regala uno de estos 10 fondos nuevos cada día que la usuaria entra a PerDay seguido.
 */
export const DAILY_WALLPAPERS: WallpaperAsset[] = [
  {
    id: 'f_daily_1',
    dayNumber: 1,
    label: 'Día 1: Atardecer Pastel',
    value: 'linear-gradient(160deg,#FFE5D6,#F9D2E6 55%,#DCD3F7)',
    eventName: 'Regalo Diario (Día 1)',
  },
  {
    id: 'f_daily_2',
    dayNumber: 2,
    label: 'Día 2: Nube Serena',
    value: 'linear-gradient(160deg,#E8F4FF,#D6E6FA 55%,#E9E2FC)',
    eventName: 'Regalo Diario (Día 2)',
  },
  {
    id: 'f_daily_3',
    dayNumber: 3,
    label: 'Día 3: Brisa Durazno',
    value: 'linear-gradient(160deg,#FFF1E3,#FFD9D2 55%,#FCE1EE)',
    eventName: 'Regalo Diario (Día 3)',
  },
  {
    id: 'f_daily_4',
    dayNumber: 4,
    label: 'Día 4: Helado de Menta',
    value: 'linear-gradient(160deg,#FFE3F1,#E1F5EA 55%,#E3ECFF)',
    eventName: 'Regalo Diario (Día 4)',
  },
  {
    id: 'f_daily_5',
    dayNumber: 5,
    label: 'Día 5: Bosque Mágico',
    value: 'linear-gradient(160deg,#E7F6E8,#D4EFE7 55%,#DCE9FA)',
    eventName: 'Regalo Diario (Día 5)',
  },
  {
    id: 'f_daily_6',
    dayNumber: 6,
    label: 'Día 6: Océano Calmo',
    value: 'linear-gradient(160deg,#DFF1FB,#D8DDF8 55%,#F2DFF7)',
    eventName: 'Regalo Diario (Día 6)',
  },
  {
    id: 'f_daily_7',
    dayNumber: 7,
    label: 'Día 7: Dúo Tierno',
    value: 'url("/assets/aistudio/cute_matching_pfp_8c77ca0d.jpg") center/cover fixed no-repeat',
    image: '/assets/aistudio/cute_matching_pfp_8c77ca0d.jpg',
    eventName: 'Regalo Diario (Día 7)',
  },
  {
    id: 'f_daily_8',
    dayNumber: 8,
    label: 'Día 8: Siesta de Cachorros',
    value: 'url("/assets/aistudio/840765824214721840_793d3719.jpg") center/cover fixed no-repeat',
    image: '/assets/aistudio/840765824214721840_793d3719.jpg',
    eventName: 'Regalo Diario (Día 8)',
  },
  {
    id: 'f_daily_9',
    dayNumber: 9,
    label: 'Día 9: Bosque de Otoño',
    value: 'url("/assets/aistudio/I_think_I_did_a_good_job_ef67d4be.jpg") center/cover fixed no-repeat',
    image: '/assets/aistudio/I_think_I_did_a_good_job_ef67d4be.jpg',
    eventName: 'Regalo Diario (Día 9)',
  },
  {
    id: 'f_daily_10',
    dayNumber: 10,
    label: 'Día 10: Jirafita Rosa',
    value: 'url("/assets/aistudio/935763628825987852_d7bbc829.jpg") center/cover fixed no-repeat',
    image: '/assets/aistudio/935763628825987852_d7bbc829.jpg',
    eventName: 'Regalo Diario (Día 10)',
  },
];

/**
 * 4. Nuevos Síntomas Físicos (Selección Múltiple) conectados a la predicción y estimación:
 */
export const SYMPTOM_OPTIONS: SymptomOption[] = [
  {
    id: 'Dolor de cabeza',
    label: 'Dolor de cabeza',
    category: 'Cuerpo',
    icon: '🤕',
    weight: 0.6,
  },
  {
    id: 'Dolor de panza',
    label: 'Dolor de panza',
    category: 'Digestión',
    icon: '🤢',
    weight: 0.95,
  },
  {
    id: 'Sensibilidad',
    label: 'Sensibilidad',
    category: 'Cuerpo',
    icon: '🥺',
    weight: 0.85,
  },
  {
    id: 'Cansancio',
    label: 'Cansancio',
    category: 'Sueño',
    icon: '😴',
    weight: 0.65,
  },
  {
    id: 'Granitos',
    label: 'Granitos',
    category: 'Piel',
    icon: '🔴',
    weight: 0.55,
  },
  {
    id: 'Cólicos',
    label: 'Cólicos',
    category: 'Cuerpo',
    icon: '😣',
    weight: 1.15,
  },
  {
    id: 'Mamas sensibles',
    label: 'Mamas sensibles',
    category: 'Cuerpo',
    icon: '🌸',
    weight: 1.0,
  },
  {
    id: 'Hinchazón',
    label: 'Hinchazón',
    category: 'Digestión',
    icon: '🎈',
    weight: 0.8,
  },
  {
    id: 'Dolor en la espalda baja o calambres',
    label: 'Dolor en la espalda baja o calambres',
    category: 'Cuerpo',
    icon: '⚡',
    weight: 1.0,
  },
  {
    id: 'Panza revuelta o gases',
    label: 'Panza revuelta o gases',
    category: 'Digestión',
    icon: '🫧',
    weight: 0.85,
  },
  {
    id: 'Dormí mal',
    label: 'Dormí mal',
    category: 'Sueño',
    icon: '🥱',
    weight: 0.75,
  },
  {
    id: 'Sofocos / mucho calor',
    label: 'Sofocos / mucho calor',
    category: 'Temperatura',
    icon: '🌡️',
    weight: 0.75,
  },
  {
    id: 'Antojos fuertes',
    label: 'Antojos fuertes',
    category: 'Apetito',
    icon: '🍫',
    weight: 0.8,
  },
  {
    id: 'Náuseas',
    label: 'Náuseas',
    category: 'Digestión',
    icon: '🍵',
    weight: 0.7,
  },
  {
    id: 'Mareos',
    label: 'Mareos',
    category: 'Cuerpo',
    icon: '💫',
    weight: 0.65,
  },
  {
    id: 'Sudor u olor',
    label: 'Sudor u olor',
    category: 'Temperatura',
    icon: '💦',
    weight: 0.4,
  },
];

export const SIGNAL_WEIGHTS: Record<string, number> = {
  'Dolor de cabeza': 0.6,
  'Dolor de panza': 0.95,
  Sensibilidad: 0.85,
  Cansancio: 0.65,
  Granitos: 0.55,
  Cólicos: 1.15,
  'Mamas sensibles': 1.0,
  Hinchazón: 0.8,
  'Dolor en la espalda baja o calambres': 1.0,
  'Panza revuelta o gases': 0.85,
  'Dormí mal': 0.75,
  'Sofocos / mucho calor': 0.75,
  'Antojos fuertes': 0.8,
  Náuseas: 0.7,
  Mareos: 0.65,
  'Sudor u olor': 0.4,
  'Dolor de espalda': 0.85,
  Antojos: 0.7,
  'f:blanco': 1.2,
  'f:claro': 1.2,
  'f:manchas': 3.0,
  'f:cafe': 3.0,
  m: 0.35,
};

export const EDUCATIONAL_TIPS: Record<string, EducationalTip> = {
  fuerte: {
    key: 'fuerte',
    title: '🩸 Sangrado abundante',
    category: 'Cuidado importante',
    body: 'Si empapas una toalla en menos de 2 horas, el periodo dura más de 7 días o te sientes mareada, avisa hoy a un adulto de confianza y consulta a tu pediatra.',
  },
  'f:manchas': {
    key: 'f:manchas',
    title: '🩷 Manchas rosadas',
    category: 'Señal cercana',
    body: 'Cuando las hormonas empiezan a activar el ciclo, el útero puede soltar unas gotitas pequeñas antes de la menstruación. Lleva una toalla o protector en tu mochila con tranquilidad.',
  },
  'f:cafe': {
    key: 'f:cafe',
    title: '🤎 Manchas café',
    category: 'Señal normal',
    body: 'Es sangre que tardó un poquito más en salir y por eso tomó color café al contacto con el aire. Es súper común en los primeros ciclos mientras tus hormonas encuentran su ritmo.',
  },
  periodo: {
    key: 'periodo',
    title: '🌸 Estás en tus días',
    category: 'Tu ciclo',
    body: 'Cambia tu toalla cada 4 a 6 horas y descansa si tu cuerpo te lo pide. Un periodo normal dura entre 2 y 7 días.',
  },
  'Dolor de panza': {
    key: 'Dolor de panza',
    title: '🤢 Cuerpo y digestión: ¿Por qué duele la panza?',
    category: 'Hormonas y abdomen',
    body: 'Las prostaglandinas que preparan al útero también pueden causar sensibilidad o retortijones suaves en el abdomen. Aplicarte calor tibio y descansar ayuda a relajar la zona.',
  },
  Sensibilidad: {
    key: 'Sensibilidad',
    title: '🥺 ¿Por qué noto más sensibilidad física o emocional?',
    category: 'Hormonas y sensibilidad',
    body: 'Antes del periodo, los cambios de estrógeno y progesterona hacen que tanto tus receptores físicos como tus emociones estén más perceptivos. Trátate con mucha paciencia y suavidad.',
  },
  Náuseas: {
    key: 'Náuseas',
    title: '🍵 ¿Por qué puedo sentir náuseas leves?',
    category: 'Hormonas y digestión',
    body: 'Las prostaglandinas pueden llegar por el torrente sanguíneo y hacer que el estómago se sienta más sensible unos días antes o al empezar el periodo. Comer porciones pequeñas y suaves ayuda mucho.',
  },
  Mareos: {
    key: 'Mareos',
    title: '💫 ¿Por qué siento ligeros mareos?',
    category: 'Bienestar y energía',
    body: 'Los cambios hormonales pueden relajar levemente los vasos sanguíneos o pedir más hidratación y energía. Levántate despacio de la cama y come a tus horas; si son frecuentes, avisa a un adulto.',
  },
  'Panza revuelta o gases': {
    key: 'Panza revuelta o gases',
    title: '🫧 Digestión: ¿Por qué siento la panza revuelta o gases?',
    category: 'Hormonas y digestión',
    body: 'Antes o durante el periodo, tu cuerpo produce prostaglandinas y cambia el nivel de progesterona. Estas hormonas ayudan a que el útero trabaje, pero como el intestino está justo al lado, también hacen que la digestión vaya más lenta o más rápida.',
  },
  'Dormí mal': {
    key: 'Dormí mal',
    title: '🥱 Sueño: ¿Por qué me costó dormir bien?',
    category: 'Hormonas y descanso',
    body: 'Las hormonas como el estrógeno y la progesterona suben y bajan para preparar tu ciclo, y eso influye en la melatonina (la hormona del sueño) y en la temperatura de tu cuerpo por la noche.',
  },
  'Dolor en la espalda baja o calambres': {
    key: 'Dolor en la espalda baja o calambres',
    title: '⚡ Cuerpo: ¿Por qué duele la espalda baja o dan calambres?',
    category: 'Hormonas y músculos',
    body: 'Las prostaglandinas hacen que el útero practique pequeñas contracciones suaves. Como los nervios y músculos de la pelvis están conectados con la espalda baja, esa sensación se refleja ahí como calambres o pesadez.',
  },
  'Sofocos / mucho calor': {
    key: 'Sofocos / mucho calor',
    title: '🌡️ Temperatura: ¿Por qué siento sofocos o mucho calor?',
    category: 'Hormonas y temperatura',
    body: 'Cuando la progesterona y el estrógeno cambian de nivel, el "termostato" natural de tu cerebro (el hipotálamo) se vuelve más sensible y sube un poquito tu temperatura corporal.',
  },
  'Antojos fuertes': {
    key: 'Antojos fuertes',
    title: '🍫 Apetito: ¿Por qué tengo antojos fuertes?',
    category: 'Hormonas y energía',
    body: 'En los días previos al periodo tu cuerpo gasta un poco más de energía y puede bajar levemente la serotonina. Por eso tu cerebro pide carbohidratos o algo dulce para recargar energía rápido.',
  },
  Cólicos: {
    key: 'Cólicos',
    title: '😣 Cólicos en el abdomen bajo',
    category: 'Hormonas y útero',
    body: 'Pasan porque las hormonas avisan al útero que se contraiga suavemente. Una bolsita tibia en la panza, descansar y caminar despacio ayudan mucho. Si el dolor es muy fuerte, avisa a un adulto.',
  },
  'f:blanco': {
    key: 'f:blanco',
    title: '🥛 Flujo blanco o cremoso',
    category: 'Preparación hormonal',
    body: 'Los estrógenos activan la limpieza natural de tu cuerpo. Suele aparecer unos 6 meses antes de la primera menstruación y es señal de salud. Si pica o huele fuerte, consulta a tu pediatra.',
  },
  'f:claro': {
    key: 'f:claro',
    title: '💧 Flujo transparente',
    category: 'Preparación hormonal',
    body: 'Es completamente normal y cambia según el nivel de tus hormonas durante el mes. Mantiene la zona sana y protegida.',
  },
  'Mamas sensibles': {
    key: 'Mamas sensibles',
    title: '🌸 Mamas sensibles',
    category: 'Hormonas y crecimiento',
    body: 'El estrógeno y la progesterona hacen que el tejido de las mamas crezca y retenga un poquito de líquido antes del periodo. Usar un top suave y cómodo te dará alivio.',
  },
  Hinchazón: {
    key: 'Hinchazón',
    title: '🎈 Hinchazón abdominal',
    category: 'Hormonas y líquidos',
    body: 'Los cambios de progesterona hacen que el cuerpo guarde un poquito más de líquido unos días. Caminar y comer con menos sal ayuda a que baje sola.',
  },
  Granitos: {
    key: 'Granitos',
    title: '🔴 Granitos en la piel',
    category: 'Hormonas y piel',
    body: 'Las hormonas de la pubertad despiertan las glándulas de la piel y producen más grasita natural. Lava tu rostro con agua y jabón suave sin apretarlos.',
  },
  Cansancio: {
    key: 'Cansancio',
    title: '😴 Cansancio y sueño',
    category: 'Energía y desarrollo',
    body: 'Crecer y adaptarte a nuevas hormonas consume mucha energía. Escucha a tu cuerpo y duerme entre 8 y 10 horas.',
  },
  'Dolor de cabeza': {
    key: 'Dolor de cabeza',
    title: '🤕 Dolor de cabeza',
    category: 'Bienestar',
    body: 'Las variaciones de estrógeno o dormir poco pueden dar dolor de cabeza. Descansa la vista de las pantallas y relájate en un lugar tranquilo.',
  },
  'Dolor de espalda': {
    key: 'Dolor de espalda',
    title: '🧍 Dolor de espalda',
    category: 'Hormonas y músculos',
    body: 'Las contracciones suaves del útero se sienten a veces en la espalda baja. El calor local y estirarte despacio ayudan.',
  },
  Antojos: {
    key: 'Antojos',
    title: '🍫 Antojos',
    category: 'Hormonas y energía',
    body: 'Son normales por los cambios hormonales que suben el gasto de energía de tu cuerpo.',
  },
  'Sudor u olor': {
    key: 'Sudor u olor',
    title: '💦 Sudor y olor corporal',
    category: 'Pubertad',
    body: 'Las hormonas activan nuevas glándulas del sudor. Bañarte a diario y usar un desodorante suave te hará sentir fresca.',
  },
  emo: {
    key: 'emo',
    title: '💜 Tus emociones y las hormonas',
    category: 'Bienestar emocional',
    body: 'Las hormonas se comunican con las zonas del cerebro que regulan el ánimo, por eso puedes sentir varias emociones a la vez. Respira lento y recuerda que es pasajero.',
  },
};

export const TIP_PRIORITY: string[] = [
  'fuerte',
  'f:manchas',
  'f:cafe',
  'periodo',
  'Cólicos',
  'Dolor de panza',
  'Sensibilidad',
  'Panza revuelta o gases',
  'Dormí mal',
  'Dolor en la espalda baja o calambres',
  'Sofocos / mucho calor',
  'Antojos fuertes',
  'Náuseas',
  'Mareos',
  'f:blanco',
  'f:claro',
  'Mamas sensibles',
  'Hinchazón',
  'Granitos',
  'Cansancio',
  'Dolor de cabeza',
  'Dolor de espalda',
  'Antojos',
  'Sudor u olor',
  'emo',
];

/**
 * 2. Bloqueo estricto de sorpresas:
 * daysBefore = 0 y daysAfter = 0 para que ningún evento pueda verse ni reclamarse antes de la fecha exacta.
 */
export const HOLIDAYS: HolidayEvent[] = [
  {
    id: 'aniversario',
    name: 'Gran Aniversario de PerDay (8 Nov)',
    emoji: '👑',
    month: 11,
    day: 8,
    daysBefore: 0,
    daysAfter: 0,
    isGrandAnniversary: true,
    maxRewards: 4,
    title: '¡Feliz Gran Aniversario de PerDay! 👑🎉',
    message:
      '¡Celebramos el Gran Aniversario de PerDay el 8 de noviembre! Recibes 4 recompensas exclusivas de colección: 2 fondos especiales y 2 insignias de aniversario.',
    frameId: 'f_aniversario',
    wallpapers: [
      {
        id: 'f_aniv_prado',
        label: 'Prado de Amistad (8 Nov)',
        value: 'url("/assets/aistudio/1132444268833955463_9b395a00.jpg") center/cover fixed no-repeat',
        image: '/assets/aistudio/1132444268833955463_9b395a00.jpg',
        eventName: 'Aniversario 8 Nov',
      },
      {
        id: 'f_aniv_sonrisa',
        label: 'Sonrisa al Sol (8 Nov)',
        value: 'url("/assets/aistudio/611715561929287884_1649ee35.jpg") center/cover fixed no-repeat',
        image: '/assets/aistudio/611715561929287884_1649ee35.jpg',
        eventName: 'Aniversario 8 Nov',
      },
    ],
    badges: [
      {
        id: 'b_aniv_duck',
        name: 'Patito Buena Onda',
        emoji: '🐥',
        image: '/assets/aistudio/_1__Instagram_fcfef809.jpg',
        eventName: 'Aniversario 8 Nov',
      },
      {
        id: 'b_aniv_fluff',
        name: 'Estampilla Perrito',
        emoji: '🐶',
        image: '/assets/aistudio/403072235410243975_4f2c4cea.jpg',
        eventName: 'Aniversario 8 Nov',
      },
    ],
    particles: ['👑', '🎉', '💖', '✨', '🎁', '🌟'],
  },
  {
    id: 'navidad',
    name: 'Navidad',
    emoji: '🎄',
    month: 12,
    day: 25,
    daysBefore: 0,
    daysAfter: 0,
    maxRewards: 3,
    title: '¡Feliz Navidad! 🎄🎅',
    message:
      'Que este día esté lleno de paz, abrazos calentitos y momentos lindos. Te regalamos 3 recompensas navideñas (2 fondos invernales y 1 insignia especial).',
    frameId: 'f_navidad',
    wallpapers: [
      {
        id: 'f_nav_farol',
        label: 'Farolito en la Nieve',
        value: 'url("/assets/aistudio/969822101014335330_862f14fa.jpg") center/cover fixed no-repeat',
        image: '/assets/aistudio/969822101014335330_862f14fa.jpg',
        eventName: 'Navidad',
      },
      {
        id: 'f_nav_santa',
        label: 'Santa Tierno',
        value: 'url("/assets/aistudio/316166836357715214_0f2b90eb.jpg") center/cover fixed no-repeat',
        image: '/assets/aistudio/316166836357715214_0f2b90eb.jpg',
        eventName: 'Navidad',
      },
    ],
    badges: [
      {
        id: 'b_navidad_gorro',
        name: 'Gorrito Navideño',
        emoji: '🎅',
        image: '/assets/aistudio/351843789649784111_9cefd7dc.jpg',
        eventName: 'Navidad',
      },
    ],
    particles: ['❄️', '⭐', '🎄', '🎁'],
  },
  {
    id: 'halloween',
    name: 'Halloween',
    emoji: '🎃',
    month: 10,
    day: 31,
    daysBefore: 0,
    daysAfter: 0,
    maxRewards: 3,
    title: '¡Feliz Halloween! 🎃👻',
    message:
      'Que tengas una noche divertida llena de dulces, risas y sustos muy tiernos. Aquí tienes tus 3 recompensas de Halloween (2 fondos y 1 insignia).',
    frameId: 'f_halloween',
    wallpapers: [
      {
        id: 'f_hal_fantasmas',
        label: 'Fantasmitas y Moños',
        value: 'url("/assets/aistudio/372461831706405272_4479cd02.jpg") center/cover fixed no-repeat',
        image: '/assets/aistudio/372461831706405272_4479cd02.jpg',
        eventName: 'Halloween',
      },
      {
        id: 'f_hal_gatito',
        label: 'Gatito y Calabazas',
        value: 'url("/assets/aistudio/45__Cute_Halloween_Wallpaper_Options_to_Spookify_Your_Screen___Kbeauty_Addiction_f07e8fa0.jpg") center/cover fixed no-repeat',
        image: '/assets/aistudio/45__Cute_Halloween_Wallpaper_Options_to_Spookify_Your_Screen___Kbeauty_Addiction_f07e8fa0.jpg',
        eventName: 'Halloween',
      },
    ],
    badges: [
      {
        id: 'b_halloween_osito',
        name: 'Osito Calabaza',
        emoji: '🎃',
        image: '/assets/aistudio/descarga_2ca91ee6.jpg',
        eventName: 'Halloween',
      },
    ],
    particles: ['🎃', '🦇', '👻', '🍬'],
  },
  {
    id: 'sanvalentin',
    name: 'San Valentín',
    emoji: '💝',
    month: 2,
    day: 14,
    daysBefore: 0,
    daysAfter: 0,
    maxRewards: 3,
    title: '¡Feliz San Valentín! 💝🌸',
    message:
      'Un día especial para celebrar el cariño hacia ti misma y hacia tus mejores amigas. ¡Disfruta tus 3 recompensas de corazones (2 fondos y 1 insignia)!',
    frameId: 'f_sanvalentin',
    wallpapers: [
      {
        id: 'f_val_gatitos',
        label: 'Gatitos Pixel Love',
        value: 'url("/assets/aistudio/1091137816013710922_9c83c046.jpg") center/cover fixed no-repeat',
        image: '/assets/aistudio/1091137816013710922_9c83c046.jpg',
        eventName: 'San Valentín',
      },
      {
        id: 'f_val_cuadros',
        label: 'Cuadros de Corazones',
        value: 'url("/assets/aistudio/Valentine_s_Day_wallpaper_pt_1_a177bd9b.jpg") center/cover fixed no-repeat',
        image: '/assets/aistudio/Valentine_s_Day_wallpaper_pt_1_a177bd9b.jpg',
        eventName: 'San Valentín',
      },
    ],
    badges: [
      {
        id: 'b_valentin_corazones',
        name: 'Corazones Unidos',
        emoji: '💝',
        image: '/assets/aistudio/Cute_stickers__Playful_paper_gems_with_aesthetic_Pink_cfe80fc7.jpg',
        eventName: 'San Valentín',
      },
    ],
    particles: ['💗', '💖', '💝', '🌸'],
  },
  {
    id: 'primavera',
    name: 'Primavera',
    emoji: '🌼',
    month: 3,
    day: 21,
    altMonth: 9,
    altDay: 21,
    daysBefore: 0,
    daysAfter: 0,
    maxRewards: 3,
    title: '¡Bienvenida la Primavera! 🌼🦋',
    message:
      'Las flores se abren a su propio ritmo, igual que tú. Celebra la estación más colorida con tus 3 recompensas (2 fondos florales y 1 insignia).',
    frameId: 'f_primavera',
    wallpapers: [
      {
        id: 'f_pri_ramo',
        label: 'Flores de Primavera',
        value: 'url("/assets/aistudio/735071970441996628_ac5c5a5b.jpg") center/cover fixed no-repeat',
        image: '/assets/aistudio/735071970441996628_ac5c5a5b.jpg',
        eventName: 'Primavera',
      },
      {
        id: 'f_pri_girasoles',
        label: 'Ramo de Girasoles',
        value: 'url("/assets/aistudio/619596861256679119_1278c72e.jpg") center/cover fixed no-repeat',
        image: '/assets/aistudio/619596861256679119_1278c72e.jpg',
        eventName: 'Primavera',
      },
    ],
    badges: [
      {
        id: 'b_primavera_estrella',
        name: 'Estrella de Primavera',
        emoji: '🌼',
        image: '/assets/aistudio/__70f5696e.jpg',
        eventName: 'Primavera',
      },
    ],
    particles: ['🌼', '🌸', '🦋', '✨'],
  },
];

/**
 * Verifica si hoy es el día exacto del Aniversario de PerDay (8 de Noviembre).
 */
export function isAppAnniversary(now: Date = new Date()): boolean {
  const m = now.getMonth() + 1;
  const d = now.getDate();
  return m === 11 && d === 8;
}

/**
 * Verifica si un cumpleaños u otro evento está en su fecha exacta para desbloquear su sorpresa.
 */
export function isBirthdayUnlockedToday(
  bday: { d: number; m: number } | null,
  now: Date = new Date()
): boolean {
  if (!bday) return false;
  return now.getMonth() + 1 === bday.m && now.getDate() === bday.d;
}

export function getHolidayRewards(h: HolidayEvent): HolidayRewardItem[] {
  const limit = h.isGrandAnniversary ? 4 : Math.min(3, h.maxRewards || 3);
  const items: HolidayRewardItem[] = [];
  for (const w of h.wallpapers) {
    if (items.length < limit) {
      items.push({
        kind: 'wallpaper',
        id: w.id,
        label: w.label,
        image: w.image,
        wallpaper: w,
      });
    }
  }
  for (const b of h.badges) {
    if (items.length < limit) {
      items.push({
        kind: 'badge',
        id: b.id,
        label: b.name,
        image: b.image,
        emoji: b.emoji,
        badge: b,
      });
    }
  }
  return items.slice(0, limit);
}

/**
 * 2. 10 Fondos Diarios por entrada diaria consecutiva:
 * Regala uno de los 10 fondos nuevos cada día que la usuaria entra a la aplicación seguido.
 */
export function claimDailyWallpaperGift(
  todayIso: string,
  claimedByDate: Record<string, string>
): {
  wallpaper: WallpaperAsset;
  isNewToday: boolean;
  streakCount: number;
  totalUnlocked: number;
  updatedClaims: Record<string, string>;
} {
  const computeStreak = (claims: Record<string, string>, refIso: string): number => {
    let streak = 0;
    const cursor = new Date(refIso + 'T12:00');
    while (streak < 365) {
      const key = new Date(cursor.getTime() - cursor.getTimezoneOffset() * 6e4)
        .toISOString()
        .slice(0, 10);
      if (claims[key]) {
        streak++;
        cursor.setDate(cursor.getDate() - 1);
      } else {
        break;
      }
    }
    return Math.max(1, streak);
  };

  if (claimedByDate[todayIso]) {
    const existing =
      DAILY_WALLPAPERS.find((w) => w.id === claimedByDate[todayIso]) || DAILY_WALLPAPERS[0];
    const streakCount = computeStreak(claimedByDate, todayIso);
    const uniqueUnlocked = new Set(Object.values(claimedByDate)).size;
    return {
      wallpaper: existing,
      isNewToday: false,
      streakCount,
      totalUnlocked: Math.min(DAILY_WALLPAPERS.length, uniqueUnlocked),
      updatedClaims: claimedByDate,
    };
  }

  // Check if yesterday was claimed to determine consecutive streak index (1..10)
  const prevDate = new Date(todayIso + 'T12:00');
  prevDate.setDate(prevDate.getDate() - 1);
  const yesterdayIso = new Date(prevDate.getTime() - prevDate.getTimezoneOffset() * 6e4)
    .toISOString()
    .slice(0, 10);

  const prevStreak = claimedByDate[yesterdayIso] ? computeStreak(claimedByDate, yesterdayIso) : 0;
  const newStreak = prevStreak + 1;
  const alreadyClaimedIds = new Set(Object.values(claimedByDate));

  // Prefer the wallpaper matching the streak day (1..10), or the next uncollected wallpaper among the 10
  const streakIdx = (newStreak - 1) % DAILY_WALLPAPERS.length;
  const candidateByStreak = DAILY_WALLPAPERS[streakIdx];
  const nextWallpaper =
    !alreadyClaimedIds.has(candidateByStreak.id)
      ? candidateByStreak
      : DAILY_WALLPAPERS.find((w) => !alreadyClaimedIds.has(w.id)) || candidateByStreak;

  const updatedClaims = {
    ...claimedByDate,
    [todayIso]: nextWallpaper.id,
  };

  const uniqueUnlocked = new Set(Object.values(updatedClaims)).size;

  return {
    wallpaper: nextWallpaper,
    isNewToday: true,
    streakCount: newStreak,
    totalUnlocked: Math.min(DAILY_WALLPAPERS.length, uniqueUnlocked),
    updatedClaims,
  };
}

/**
 * Genera el contenido JSON descargable con el historial de registros diarios de PerDay.
 */
export function buildHistoryExportJson(params: {
  entries: DayEntry[];
  profileNick?: string;
  petId?: string;
  exportedAtIso: string;
}): string {
  const payload = {
    app: 'PerDay',
    version: 3,
    exportedAt: params.exportedAtIso,
    usuario: params.profileNick || 'Usuaria',
    mascotaDecorativa: params.petId || VIRTUAL_PETS[0].id,
    totalRegistros: params.entries.length,
    historialDiario: params.entries.map((e) => ({
      fecha: e.d,
      animosIndices: Array.isArray(e.moods) ? e.moods : e.m != null ? [e.m] : [],
      animoIndice: e.m ?? (Array.isArray(e.moods) && e.moods.length ? e.moods[0] : null),
      periodo: e.periodo || 'no',
      intensidad: e.intensidad || null,
      flujo: e.flujo || 'ninguno',
      sintomas: e.dolor || [],
      pesoKg: e.peso ?? null,
      nota: e.nota || '',
    })),
  };
  return JSON.stringify(payload, null, 2);
}

/**
 * 2. Bloqueo de sorpresas:
 * Solo devuelve el año activo cuando la fecha actual coincide EXACTAMENTE con el día y mes del evento.
 */
export function getActiveYearForHoliday(h: HolidayEvent, now: Date = new Date()): number | null {
  const m = now.getMonth() + 1;
  const d = now.getDate();
  if (m === h.month && d === h.day) {
    return now.getFullYear();
  }
  if (h.altMonth && h.altDay && m === h.altMonth && d === h.altDay) {
    return now.getFullYear();
  }
  return null;
}

export function detectActiveHoliday(now: Date = new Date()): { holiday: HolidayEvent; year: number } | null {
  const anniv = HOLIDAYS.find((h) => h.isGrandAnniversary);
  if (anniv && isAppAnniversary(now)) {
    return { holiday: anniv, year: now.getFullYear() };
  }
  for (const h of HOLIDAYS) {
    const yr = getActiveYearForHoliday(h, now);
    if (yr !== null) {
      return { holiday: h, year: yr };
    }
  }
  return null;
}

export function daysUntilHoliday(h: HolidayEvent, now: Date = new Date()): number {
  const t = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 12);
  const candidates: number[] = [];
  const datesToCheck: Array<[number, number]> = [[h.month, h.day]];
  if (h.altMonth && h.altDay) {
    datesToCheck.push([h.altMonth, h.altDay]);
  }
  for (const yr of [now.getFullYear(), now.getFullYear() + 1]) {
    for (const [m, d] of datesToCheck) {
      const diff = Math.round((new Date(yr, m - 1, d, 12).getTime() - t.getTime()) / 864e5);
      if (diff >= 0) candidates.push(diff);
    }
  }
  return candidates.length ? Math.min(...candidates) : 0;
}

export function extractTipKeys(formState: {
  per?: string;
  inten?: string | null;
  flujo?: string;
  dolor?: string[];
  moodName?: string | null;
  moodNames?: string[];
}): string[] {
  const keys: string[] = [...(formState.dolor || [])];
  if (formState.flujo && formState.flujo !== 'ninguno') {
    keys.push('f:' + formState.flujo);
  }
  if (formState.per === 'si') {
    keys.push('periodo');
    if (formState.inten === 'fuerte') keys.push('fuerte');
  }
  const allMoods = [
    ...(formState.moodNames || []),
    ...(formState.moodName ? [formState.moodName] : []),
  ];
  for (const mn of allMoods) {
    if (mn === 'Cansada') keys.push('Cansancio');
    else if (['Triste', 'Enojada', 'Nerviosa', 'Confundida', 'Sensible'].includes(mn)) {
      keys.push('emo');
    }
  }
  return keys.filter((k, i) => keys.indexOf(k) === i);
}

export function obtenerTipsEducativos(keys: string[], max = 6): EducationalTip[] {
  const unique = keys.filter((k, i) => keys.indexOf(k) === i && Boolean(EDUCATIONAL_TIPS[k]));
  unique.sort((a, b) => {
    const ia = TIP_PRIORITY.indexOf(a);
    const ib = TIP_PRIORITY.indexOf(b);
    return (ia === -1 ? 999 : ia) - (ib === -1 ? 999 : ib);
  });
  return unique.slice(0, max).map((k) => EDUCATIONAL_TIPS[k]);
}

export function getEntryMoodIndices(e: DayEntry): number[] {
  if (Array.isArray(e.moods) && e.moods.length > 0) {
    return e.moods;
  }
  if (e.m != null) {
    return [e.m];
  }
  return [];
}

export function calcularPuntajeSintomas(
  history: DayEntry[],
  todayIso: string,
  days = 14,
  moodValues: number[] = [6, 5, 2, 3, 1, 2, 3, 2]
): { score: number; count: number; matchedSymptoms: string[] } {
  const now = new Date(todayIso + 'T12:00');
  let score = 0;
  let count = 0;
  const seen: Record<string, number> = {};
  const matchedSet = new Set<string>();

  history.forEach((e) => {
    if (e.periodo === 'si') return;
    const entryDate = new Date(e.d + 'T12:00');
    const ago = Math.round((now.getTime() - entryDate.getTime()) / 864e5);
    if (ago < 0 || ago >= days) return;

    const ks: string[] = [...(e.dolor || [])];
    if (e.flujo && e.flujo !== 'ninguno') ks.push('f:' + e.flujo);
    const moodIdxs = getEntryMoodIndices(e);
    if (moodIdxs.some((idx) => moodValues[idx] != null && moodValues[idx] <= 3)) {
      ks.push('m');
    }

    ks.forEach((k) => {
      seen[k] = seen[k] || 0;
      if (seen[k] < 3) {
        seen[k]++;
        const weight = SIGNAL_WEIGHTS[k] ?? 0.5;
        score += weight * (ago <= 7 ? 1 : 0.65);
        count++;
        if (!k.startsWith('f:') && k !== 'm') {
          matchedSet.add(k);
        }
      }
    });
  });

  return { score, count, matchedSymptoms: [...matchedSet] };
}

/**
 * 4. Fórmula de predicción (Estimar) mejorada:
 * Combina las respuestas del cuestionario de desarrollo con la nueva variedad de síntomas físicos
 * y estados de ánimo registrados en el calendario para calcular con mayor precisión cuándo llegará el periodo.
 */
export function calcularEstimacionMenarca(
  d: Record<string, string>,
  history: DayEntry[] = [],
  todayIso: string = new Date().toISOString().slice(0, 10)
): {
  etapa: number;
  wMin: number;
  wMax: number;
  flujo: boolean;
  rango: string;
  symptomScore: number;
  symptomCountUsed: number;
  matchedSymptoms: string[];
} {
  const pts: Record<string, number> = { si: 2, nose: 1, no: 0 };
  const sn: Record<string, number> = { si: 1, nose: 0.5, no: 0 };
  const vello =
    ({ ninguno: 0, axilas: 1, publica: 2, ambas: 2, nose: 0.5 } as Record<string, number>)[d.vello] ?? 0;
  const crece =
    ({ mas7: 2, m4a7: 1.5, menos4: 0, nose: 0.5 } as Record<string, number>)[d.crece] ?? 0;
  const fam =
    ({ menor11: 1, '11a12': 0, mas13: -1, nose: 0 } as Record<string, number>)[d.familia] ?? 0;

  // Integrar síntomas físicos registrados en los últimos 30 días
  const sg = calcularPuntajeSintomas(history, todayIso, 30);
  const symptomBoost = Math.min(2.2, sg.score * 0.35);

  const s = (pts[d.mamas] ?? 0) + vello + crece + (sn[d.piel] ?? 0) + (sn[d.forma] ?? 0) + symptomBoost;
  const ageM = (+d.edad || 12) * 12 + (+d.meses || 0);
  let c = Math.max(3, 36 - s * 4.8 - fam * 4);
  c = Math.round(0.75 * c + 0.25 * Math.max(3, 150 - ageM));

  let wMin = Math.max(0, c - 6);
  let wMax = c + 6;
  let etapa = s >= 5 ? 2 : s >= 2.5 ? 1 : 0;

  if (d.flujo === 'si' || sg.score >= 3.5) {
    etapa = 2;
    wMin = 0;
    const cap = d.flujo === 'si' && sg.score >= 2.5 ? 6 : sg.score >= 3.5 ? Math.max(6, c + 2) : 12;
    wMax = Math.min(wMax, cap);
  }

  wMax = Math.min(wMax, Math.max(6, 192 - ageM));
  wMin = Math.min(wMin, Math.max(0, wMax - 6));

  const rangoTxt = (a: number, b: number) => {
    if (b <= 24) return `entre ${Math.round(a)} y ${Math.round(b)} meses`;
    const f = (x: number) => (Math.round(x / 6) / 2).toString().replace('.', ',');
    return `entre ${f(a)} y ${f(b)} años`;
  };

  return {
    etapa,
    wMin,
    wMax,
    flujo: d.flujo === 'si',
    rango: rangoTxt(wMin, wMax),
    symptomScore: sg.score,
    symptomCountUsed: sg.count,
    matchedSymptoms: sg.matchedSymptoms,
  };
}

export function calcularPronostico(
  history: DayEntry[],
  todayIso: string,
  etapaGuardada: MenarcaEstimate | null
): {
  kind: 'en' | 'ciclo' | 'est' | 'sin';
  pct: number;
  nivel: 'baja' | 'media' | 'alta';
  base: string;
  n: number;
  hasData: boolean;
  matchedSymptoms: string[];
} {
  const today = new Date(todayIso + 'T12:00');
  if (history.some((x) => x.d === todayIso && x.periodo === 'si')) {
    return {
      kind: 'en',
      pct: 100,
      nivel: 'alta',
      base: '',
      n: 0,
      hasData: true,
      matchedSymptoms: [],
    };
  }

  const periodDays = new Set(
    history
      .filter((x) => x.periodo === 'si')
      .map((x) => x.d)
      .sort()
  );
  const starts = [...periodDays].filter((d) => {
    const prev = new Date(d + 'T12:00');
    prev.setDate(prev.getDate() - 1);
    const prevIso = new Date(prev.getTime() - prev.getTimezoneOffset() * 6e4).toISOString().slice(0, 10);
    return !periodDays.has(prevIso);
  });

  const sg = calcularPuntajeSintomas(history, todayIso, 14);
  const H = 7;
  let lo: number | null = null;
  let hi: number | null = null;
  let base = '';
  let kind: 'ciclo' | 'est' | 'sin' = 'sin';
  const dd = (d: Date) => Math.round((d.getTime() - today.getTime()) / 864e5);

  if (starts.length > 0) {
    const last = new Date(starts[starts.length - 1] + 'T12:00');
    if (starts.length >= 2) {
      const gaps: number[] = [];
      for (let i = 1; i < starts.length; i++) {
        const d1 = new Date(starts[i] + 'T12:00');
        const d0 = new Date(starts[i - 1] + 'T12:00');
        gaps.push(Math.round((d1.getTime() - d0.getTime()) / 864e5));
      }
      let gLo = Math.min(...gaps);
      let gHi = Math.max(...gaps);
      if (gLo === gHi) {
        gLo = Math.max(1, gLo - 2);
        gHi += 2;
      }
      const a = new Date(last);
      a.setDate(a.getDate() + gLo);
      const b = new Date(last);
      b.setDate(b.getDate() + gHi);
      lo = dd(a);
      hi = dd(b);
      base = 'tu ritmo (tus ciclos anteriores)';
    } else {
      const a = new Date(last);
      a.setDate(a.getDate() + 21);
      const b = new Date(last);
      b.setDate(last.getDate() + 45);
      lo = dd(a);
      hi = dd(b);
      base = 'el tiempo desde tu última menstruación (entre 21 y 45 días)';
    }
    kind = 'ciclo';
  } else if (etapaGuardada && etapaGuardada.wMax != null) {
    const estDate = new Date(etapaGuardada.fecha + 'T12:00');
    const el0 = Math.max(0, (today.getTime() - estDate.getTime()) / (30.44 * 864e5));
    lo = Math.round(Math.max(0, etapaGuardada.wMin - el0) * 30.44);
    hi = Math.round(Math.max(0, etapaGuardada.wMax - el0) * 30.44);
    base = 'tu estimación y el tiempo que pasó desde que la hiciste';
    kind = 'est';
  }

  let p0 = 0.02;
  if (lo !== null && hi !== null) {
    if (hi < 0) p0 = 0.3;
    else if (hi === 0 && kind === 'est') p0 = 0.15;
    else {
      const len = Math.max(hi - lo + 1, kind === 'est' ? 30 : 7);
      const ov = Math.max(0, Math.min(hi, H) - Math.max(lo, 0) + 1);
      p0 = Math.min(0.9, ov / len);
    }
  }

  let p = 1 - (1 - p0) * Math.exp(-sg.score / 8.5);
  p = Math.min(0.95, Math.max(p, p0));
  const pct = Math.round((p * 100) / 5) * 5;
  return {
    kind,
    pct,
    nivel: pct < 20 ? 'baja' : pct < 50 ? 'media' : 'alta',
    base,
    n: sg.count,
    hasData: lo !== null,
    matchedSymptoms: sg.matchedSymptoms,
  };
}
