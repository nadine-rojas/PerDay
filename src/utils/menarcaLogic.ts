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
}

export interface VirtualPetAsset {
  id: string;
  codeName: string;
  defaultName: string;
  species: 'Gato' | 'Perro' | 'Zorro' | 'Amigos';
  emoji: string;
  image: string;
  greeting: string;
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
  dolor?: string[];
  flujo?: string;
  nota?: string;
  periodo?: 'si' | 'no';
  intensidad?: 'ligera' | 'normal' | 'fuerte' | null;
  peso?: number | null;
  agua?: number;
}

export interface MenarcaEstimate {
  etapa: number;
  fecha: string;
  wMin: number;
  wMax: number;
  flujo?: boolean;
  rango?: string;
  sig?: {
    mamas: boolean;
    vello: boolean;
    crece: boolean;
    flujo: boolean;
  };
}

export const VIRTUAL_PETS: VirtualPetAsset[] = [
  {
    id: 'mascota_gato_chef',
    codeName: 'mascota_gato.jpg',
    defaultName: 'Mochi Chef',
    species: 'Gato',
    emoji: '🐱',
    image: '/assets/aistudio/__artizzy_chef_tom_7bf7e845.jpg',
    greeting: '¡Miau! Preparé una sopita calentita para acompañarte hoy 🍲💖',
  },
  {
    id: 'mascota_perro_flor',
    codeName: 'mascota_perro.jpg',
    defaultName: 'Canela',
    species: 'Perro',
    emoji: '🐶',
    image: '/assets/aistudio/Chihuahua_holding_flower_b7ff8380.jpg',
    greeting: '¡Guau! Te traje una margarita para alegrar tu día 🌼🐾',
  },
  {
    id: 'mascota_gato_estambre',
    codeName: 'mascota_gato_estambre.jpg',
    defaultName: 'Mandarina',
    species: 'Gato',
    emoji: '🧶',
    image: '/assets/aistudio/864972672175678121_5879ec22.jpg',
    greeting: 'Abrazando mi bolita de estambre azul mientras descansas 🧶💤',
  },
  {
    id: 'mascota_zorro_hojita',
    codeName: 'mascota_zorro.jpg',
    defaultName: 'Naranjita',
    species: 'Zorro',
    emoji: '🦊',
    image: '/assets/aistudio/Naranjita_yt_furry_d8adfe9b.jpg',
    greeting: '¡Hola! Mi hojita de la suerte te acompaña hoy 🌱✨',
  },
  {
    id: 'mascota_perro_orejon',
    codeName: 'mascota_perro_orejon.jpg',
    defaultName: 'Trufa',
    species: 'Perro',
    emoji: '🐕',
    image: '/assets/aistudio/932245191610450385_11ffe6a4.jpg',
    greeting: '¡Estoy aquí para escucharte y darte ánimos siempre! 🐾💛',
  },
  {
    id: 'mascota_gato_sudadera',
    codeName: 'mascota_gato_hoodie.jpg',
    defaultName: 'Sombra',
    species: 'Gato',
    emoji: '🐈‍⬛',
    image: '/assets/aistudio/hoodie_cat_f7693b4d.jpg',
    greeting: 'Con mi sudadera favorita lista para un día cómodo y tranquilo 🖤✨',
  },
  {
    id: 'mascota_gato_mono',
    codeName: 'mascota_gato_mono.jpg',
    defaultName: 'Perlita',
    species: 'Gato',
    emoji: '🎀',
    image: '/assets/aistudio/1104859721110146721_3599b3d7.jpg',
    greeting: '¡Me puse mi moñito rosa para verte sonreír hoy! 🎀🐱',
  },
  {
    id: 'mascota_perro_estrella',
    codeName: 'mascota_perro_estrella.jpg',
    defaultName: 'Lucero',
    species: 'Perro',
    emoji: '⭐',
    image: '/assets/aistudio/Spicymochi___spicymochii__on_X_3566b9d9.jpg',
    greeting: '¡Brillas muchísimo hoy! Recuerda tomar agüita 🌟🐶',
  },
  {
    id: 'mascota_tortuga',
    codeName: 'mascota_tortuga.jpg',
    defaultName: 'Burbuja',
    species: 'Amigos',
    emoji: '🐢',
    image: '/assets/aistudio/915145586792760691_b527fbca.jpg',
    greeting: 'Paso a pasito y a tu propio ritmo, como en el mar azul 🫧🐢',
  },
  {
    id: 'mascota_hamster',
    codeName: 'mascota_hamster.jpg',
    defaultName: 'Avellana',
    species: 'Amigos',
    emoji: '🐹',
    image: '/assets/aistudio/hamsterrrrrrrrrrrrr_9fbc34d5.jpg',
    greeting: '¡Guardé semillitas y buena energía para ti! 🐹🌻',
  },
  {
    id: 'mascota_tiburon',
    codeName: 'mascota_tiburon.jpg',
    defaultName: 'Coral',
    species: 'Amigos',
    emoji: '🦈',
    image: '/assets/aistudio/____Cute_Shark_____ef1511cd.jpg',
    greeting: '¡Un chapuzón de alegría! No olvides tus vasos de agua 💧🦈',
  },
  {
    id: 'mascota_buho',
    codeName: 'mascota_buho.jpg',
    defaultName: 'Nieve',
    species: 'Amigos',
    emoji: '🦉',
    image: '/assets/aistudio/1084874997754779594_79a3c054.jpg',
    greeting: 'Cuido tus sueños para que descanses súper bien esta noche 🌙🦉',
  },
];

export const DAILY_WALLPAPERS: WallpaperAsset[] = [
  {
    id: 'f_daily_atardecer',
    label: 'Regalo Diario: Atardecer Pastel',
    value: 'linear-gradient(160deg,#FFE5D6,#F9D2E6 55%,#DCD3F7)',
    eventName: 'Regalo Diario',
  },
  {
    id: 'f_daily_nube',
    label: 'Regalo Diario: Nube Serena',
    value: 'linear-gradient(160deg,#F2F8FF,#E3EEFB)',
    eventName: 'Regalo Diario',
  },
  {
    id: 'f_daily_durazno',
    label: 'Regalo Diario: Brisa Durazno',
    value: 'linear-gradient(160deg,#FFF1E3,#FFD9D2)',
    eventName: 'Regalo Diario',
  },
  {
    id: 'f_daily_helado',
    label: 'Regalo Diario: Helado de Menta',
    value: 'linear-gradient(160deg,#FFE3F1,#E1F5EA 55%,#E3ECFF)',
    eventName: 'Regalo Diario',
  },
  {
    id: 'f_daily_bosque',
    label: 'Regalo Diario: Bosque Mágico',
    value: 'linear-gradient(160deg,#E7F6E8,#D8EEE9)',
    eventName: 'Regalo Diario',
  },
  {
    id: 'f_daily_oceano',
    label: 'Regalo Diario: Océano Calmo',
    value: 'linear-gradient(160deg,#DFF1FB,#D8DDF8)',
    eventName: 'Regalo Diario',
  },
  {
    id: 'f_daily_amigos',
    label: 'Regalo Diario: Dúo Tierno',
    value: 'url("/assets/aistudio/cute_matching_pfp_8c77ca0d.jpg") center/cover fixed no-repeat',
    image: '/assets/aistudio/cute_matching_pfp_8c77ca0d.jpg',
    eventName: 'Regalo Diario',
  },
  {
    id: 'f_daily_cachorros',
    label: 'Regalo Diario: Siesta de Cachorros',
    value: 'url("/assets/aistudio/840765824214721840_793d3719.jpg") center/cover fixed no-repeat',
    image: '/assets/aistudio/840765824214721840_793d3719.jpg',
    eventName: 'Regalo Diario',
  },
  {
    id: 'f_daily_zorrito',
    label: 'Regalo Diario: Bosque de Otoño',
    value: 'url("/assets/aistudio/I_think_I_did_a_good_job_ef67d4be.jpg") center/cover fixed no-repeat',
    image: '/assets/aistudio/I_think_I_did_a_good_job_ef67d4be.jpg',
    eventName: 'Regalo Diario',
  },
  {
    id: 'f_daily_jirafa',
    label: 'Regalo Diario: Jirafita Rosa',
    value: 'url("/assets/aistudio/935763628825987852_d7bbc829.jpg") center/cover fixed no-repeat',
    image: '/assets/aistudio/935763628825987852_d7bbc829.jpg',
    eventName: 'Regalo Diario',
  },
];

export const SYMPTOM_OPTIONS: SymptomOption[] = [
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
    id: 'Dolor en la espalda baja o calambres',
    label: 'Dolor en la espalda baja o calambres',
    category: 'Cuerpo',
    icon: '⚡',
    weight: 1.0,
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
    id: 'Cólicos',
    label: 'Cólicos',
    category: 'Cuerpo',
    icon: '😣',
    weight: 1.1,
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
    id: 'Cansancio',
    label: 'Cansancio',
    category: 'Sueño',
    icon: '😴',
    weight: 0.55,
  },
  {
    id: 'Dolor de cabeza',
    label: 'Dolor de cabeza',
    category: 'Cuerpo',
    icon: '🤕',
    weight: 0.45,
  },
  {
    id: 'Granitos',
    label: 'Granitos',
    category: 'Piel',
    icon: '🔴',
    weight: 0.5,
  },
  {
    id: 'Sudor u olor',
    label: 'Sudor u olor',
    category: 'Temperatura',
    icon: '💦',
    weight: 0.35,
  },
];

export const SIGNAL_WEIGHTS: Record<string, number> = {
  'Panza revuelta o gases': 0.85,
  'Dormí mal': 0.75,
  'Dolor en la espalda baja o calambres': 1.0,
  'Sofocos / mucho calor': 0.75,
  'Antojos fuertes': 0.8,
  'Cólicos': 1.1,
  'Dolor de cabeza': 0.45,
  'Cansancio': 0.55,
  'Hinchazón': 0.8,
  'Mamas sensibles': 1.0,
  'Granitos': 0.5,
  'Dolor de espalda': 0.85,
  'Antojos': 0.7,
  'Sudor u olor': 0.35,
  'f:blanco': 1.2,
  'f:claro': 1.2,
  'f:manchas': 3.0,
  'f:cafe': 3.0,
  'm': 0.35,
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
    body: 'Cambia tu toalla cada 4 a 6 horas, toma agua y descansa si tu cuerpo te lo pide. Un periodo normal dura entre 2 y 7 días.',
  },
  'Panza revuelta o gases': {
    key: 'Panza revuelta o gases',
    title: '🫧 Digestión: ¿Por qué siento la panza revuelta o gases?',
    category: 'Hormonas y digestión',
    body: 'Antes o durante el periodo, tu cuerpo produce prostaglandinas y cambia el nivel de progesterona. Estas hormonas ayudan a que el útero trabaje, pero como el intestino está justo al lado, también hacen que la digestión vaya más lenta o más rápida. Es totalmente normal: tomar agüita tibia y comer sin prisa ayuda mucho.',
  },
  'Dormí mal': {
    key: 'Dormí mal',
    title: '🥱 Sueño: ¿Por qué me costó dormir bien?',
    category: 'Hormonas y descanso',
    body: 'Las hormonas como el estrógeno y la progesterona suben y bajan para preparar tu ciclo, y eso influye en la melatonina (la hormona del sueño) y en la temperatura de tu cuerpo por la noche. Por eso puedes dar más vueltas en la cama. Bajar el brillo de las pantallas y hacer 3 respiraciones lentas te ayudará a descansar.',
  },
  'Dolor en la espalda baja o calambres': {
    key: 'Dolor en la espalda baja o calambres',
    title: '⚡ Cuerpo: ¿Por qué duele la espalda baja o dan calambres?',
    category: 'Hormonas y músculos',
    body: 'Las prostaglandinas hacen que el útero practique pequeñas contracciones suaves. Como los nervios y músculos de la pelvis están conectados con la espalda baja, esa sensación se refleja ahí como calambres o pesadez. Poner una bolsita tibia o estirar despacio la espalda relaja la zona.',
  },
  'Sofocos / mucho calor': {
    key: 'Sofocos / mucho calor',
    title: '🌡️ Temperatura: ¿Por qué siento sofocos o mucho calor?',
    category: 'Hormonas y temperatura',
    body: 'Cuando la progesterona y el estrógeno cambian de nivel, el "termostato" natural de tu cerebro (el hipotálamo) se vuelve más sensible y sube un poquito tu temperatura corporal. Sentir olas de calor es una respuesta normal de tu cuerpo: usa ropa fresca en capas y bebe agua fresca.',
  },
  'Antojos fuertes': {
    key: 'Antojos fuertes',
    title: '🍫 Apetito: ¿Por qué tengo antojos fuertes?',
    category: 'Hormonas y energía',
    body: 'En los días previos al periodo tu cuerpo gasta un poco más de energía y puede bajar levemente la serotonina (la sustancia que da calma y buen humor). Por eso tu cerebro pide carbohidratos o algo dulce para recargar energía rápido. Disfruta un gustito con calma y combínalo con fruta y agua.',
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
    body: 'Los cambios de progesterona hacen que el cuerpo guarde un poquito más de agua unos días. Caminar, tomar agua y comer menos sal ayuda a que baje sola.',
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
    body: 'Las variaciones de estrógeno, junto con dormir poco o tomar poca agua, pueden dar dolor de cabeza. Hidrátate y descansa la vista de las pantallas.',
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
    body: 'Las hormonas se comunican con las zonas del cerebro que regulan el ánimo, por eso puedes sentirte sensible, enojada o triste de repente. Respira lento (inhala 4 segundos, suelta 6) y recuerda que es pasajero.',
  },
};

export const TIP_PRIORITY: string[] = [
  'fuerte',
  'f:manchas',
  'f:cafe',
  'periodo',
  'Panza revuelta o gases',
  'Dormí mal',
  'Dolor en la espalda baja o calambres',
  'Sofocos / mucho calor',
  'Antojos fuertes',
  'Cólicos',
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

export const HOLIDAYS: HolidayEvent[] = [
  {
    id: 'aniversario',
    name: 'Gran Aniversario de la App (8 y 9 Nov)',
    emoji: '👑',
    month: 11,
    day: 8,
    daysBefore: 0,
    daysAfter: 1, // Incluye regla de tolerancia: 8 de noviembre y 9 de noviembre
    isGrandAnniversary: true,
    maxRewards: 4, // Límite exacto de 4 recompensas para el Aniversario
    title: '¡Feliz Gran Aniversario de la App! 👑🎉',
    message:
      '¡Celebramos el Gran Aniversario de Estimar Menarca (8 de noviembre, con tolerancia especial el 9 de noviembre)! Recibes exactamente 4 recompensas exclusivas de colección: 2 fondos especiales y 2 insignias de aniversario.',
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
    daysBefore: 2,
    daysAfter: 1,
    maxRewards: 3, // Límite estricto de máximo 3 recompensas en eventos normales
    title: '¡Feliz Navidad! 🎄🎅',
    message:
      'Que estos días estén llenos de paz, abrazos calentitos y momentos lindos. Te regalamos 3 recompensas navideñas (2 fondos invernales y 1 insignia especial).',
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
    daysBefore: 2,
    daysAfter: 1,
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
    daysBefore: 1,
    daysAfter: 1,
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
    daysBefore: 2,
    daysAfter: 2,
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
 * Regla de Aniversario (8 de Noviembre) + Regla de Tolerancia (9 de Noviembre):
 * Si la usuaria entra o se registra el 8 de noviembre o un día después (9 de noviembre),
 * recibe las 4 recompensas especiales del Aniversario.
 */
export function isAppAnniversary(now: Date = new Date()): boolean {
  const m = now.getMonth() + 1;
  const d = now.getDate();
  return m === 11 && (d === 8 || d === 9);
}

/**
 * Devuelve la lista de recompensas de un evento aplicando el límite estricto:
 * - Eventos normales: máximo 3 recompensas.
 * - Aniversario de la App (8-9 Nov): exactamente 4 recompensas.
 */
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
 * Regalo Diario: Regala un fondo de pantalla nuevo cada día que la usuaria abre la aplicación.
 */
export function claimDailyWallpaperGift(
  todayIso: string,
  claimedByDate: Record<string, string>
): {
  wallpaper: WallpaperAsset;
  isNewToday: boolean;
  updatedClaims: Record<string, string>;
} {
  if (claimedByDate[todayIso]) {
    const existing =
      DAILY_WALLPAPERS.find((w) => w.id === claimedByDate[todayIso]) || DAILY_WALLPAPERS[0];
    return {
      wallpaper: existing,
      isNewToday: false,
      updatedClaims: claimedByDate,
    };
  }

  const alreadyClaimedIds = new Set(Object.values(claimedByDate));
  const nextWallpaper =
    DAILY_WALLPAPERS.find((w) => !alreadyClaimedIds.has(w.id)) ||
    DAILY_WALLPAPERS[Object.keys(claimedByDate).length % DAILY_WALLPAPERS.length];

  const updatedClaims = {
    ...claimedByDate,
    [todayIso]: nextWallpaper.id,
  };

  return {
    wallpaper: nextWallpaper,
    isNewToday: true,
    updatedClaims,
  };
}

/**
 * Genera el contenido JSON descargable con el historial de registros diarios (síntomas, ánimo, peso, agua, flujo).
 */
export function buildHistoryExportJson(params: {
  entries: DayEntry[];
  profileNick?: string;
  petId?: string;
  exportedAtIso: string;
}): string {
  const payload = {
    app: 'Estimar menarca',
    version: 2,
    exportedAt: params.exportedAtIso,
    usuario: params.profileNick || 'Usuaria',
    mascotaActiva: params.petId || VIRTUAL_PETS[0].id,
    totalRegistros: params.entries.length,
    historialDiario: params.entries.map((e) => ({
      fecha: e.d,
      animoIndice: e.m ?? null,
      periodo: e.periodo || 'no',
      intensidad: e.intensidad || null,
      flujo: e.flujo || 'ninguno',
      sintomas: e.dolor || [],
      pesoKg: e.peso ?? null,
      vasosAgua: e.agua ?? 0,
      nota: e.nota || '',
    })),
  };
  return JSON.stringify(payload, null, 2);
}

export function getActiveYearForHoliday(h: HolidayEvent, now: Date = new Date()): number | null {
  if (h.isGrandAnniversary) {
    return isAppAnniversary(now) ? now.getFullYear() : null;
  }
  const t = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 12);
  const datesToCheck: Array<[number, number]> = [[h.month, h.day]];
  if (h.altMonth && h.altDay) {
    datesToCheck.push([h.altMonth, h.altDay]);
  }
  for (const yr of [now.getFullYear() - 1, now.getFullYear(), now.getFullYear() + 1]) {
    for (const [m, d] of datesToCheck) {
      const target = new Date(yr, m - 1, d, 12);
      const diff = Math.round((target.getTime() - t.getTime()) / 864e5);
      if (diff >= -h.daysAfter && diff <= h.daysBefore) {
        return yr;
      }
    }
  }
  return null;
}

export function detectActiveHoliday(now: Date = new Date()): { holiday: HolidayEvent; year: number } | null {
  // Prioritize the Grand Anniversary on November 8 and tolerance day November 9
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
}): string[] {
  const keys: string[] = [...(formState.dolor || [])];
  if (formState.flujo && formState.flujo !== 'ninguno') {
    keys.push('f:' + formState.flujo);
  }
  if (formState.per === 'si') {
    keys.push('periodo');
    if (formState.inten === 'fuerte') keys.push('fuerte');
  }
  if (formState.moodName) {
    if (formState.moodName === 'Cansada') keys.push('Cansancio');
    else if (['Triste', 'Enojada', 'Nerviosa', 'Confundida', 'Sensible'].includes(formState.moodName)) {
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
    if (e.m != null && moodValues[e.m] != null && moodValues[e.m] <= 3) ks.push('m');

    ks.forEach((k) => {
      seen[k] = seen[k] || 0;
      if (seen[k] < 3) {
        seen[k]++;
        const weight = SIGNAL_WEIGHTS[k] ?? 0.45;
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

  // Find period start dates
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
      b.setDate(b.getDate() + 45);
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
