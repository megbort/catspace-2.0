import { User } from '../models';

export const USERS: User[] = [
  {
    id: 'U0001',
    email: 'demo2@example.com',
    image:
      'https://res.cloudinary.com/dm1yyjg7i/image/upload/v1730658243/catspace/catspace-image-01_svkhtp.jpg',
    name: 'Kiku Krenbrink',
    handle: 'kikuKrenn',
    description:
      "Hello! I'm Kiku, the fluffiest boss around. I spend my days napping in sunbeams and pretending not to care about your attention... but don't be fooled—I control everything. Pet me if you must, but only for 3 seconds, then I'll claw your hand. My real passion? Pushing your things off ledges just to see what happens. Feed me at exactly 6 p.m., or else...",
    favorites: [],
    following: [],
    followers: [],
    tags: ['catnip', 'tabby', 'curious', 'soft'],
    posts: [
      {
        id: 'U0001P0001',
        title: 'Sunday morning vibes',
        image:
          'https://res.cloudinary.com/dm1yyjg7i/image/upload/v1738557256/catspace/catspace-image-17_pihkmj.jpg',
        favorites: 90,
        description: 'Just enjoying the sun and dreaming of tuna treats.',
        comments: [],
      },
      {
        id: 'U0001P0002',
        title: "I'm feeling like some zooms today",
        image:
          'https://res.cloudinary.com/dm1yyjg7i/image/upload/v1738557265/catspace/catspace-image-18_x1ks73.jpg',
        favorites: 202,
        description: 'Just enjoying the sun and dreaming of tuna treats.',
        comments: [],
      },
      {
        id: 'U0001P0003',
        title:
          "Waiting here for my human to come home, they're always late >:(",
        image:
          'https://res.cloudinary.com/dm1yyjg7i/image/upload/v1738557273/catspace/catspace-image-19_ifqlkg.jpg',
        favorites: 20,
        description: 'Just enjoying the sun and dreaming of tuna treats.',
        comments: [],
      },
      {
        id: 'U0001P0004',
        title:
          'Vel enim labore sanctus diam gubergren invidunt sed ea dolor ut invidunt.',
        image:
          'https://res.cloudinary.com/dm1yyjg7i/image/upload/v1738715772/catspace/catspace-image-20_japkom.jpg',
        favorites: 212,
        description: 'Just enjoying the sun and dreaming of tuna treats.',
        comments: [],
      },
      {
        id: 'U0001P0005',
        title: 'Te ea hendrerit veniam est labore soluta.',
        image:
          'https://res.cloudinary.com/dm1yyjg7i/image/upload/v1738715778/catspace/catspace-image-21_sx2mwr.jpg',
        favorites: 29,
        description: 'Just enjoying the sun and dreaming of tuna treats.',
        comments: [],
      },
      {
        id: 'U0001P0006',
        title:
          'Sea est gubergren rebum sed invidunt vero vero et nonumy ipsum.',
        image:
          'https://res.cloudinary.com/dm1yyjg7i/image/upload/v1738715783/catspace/catspace-image-22_andwud.jpg',
        favorites: 49,
        description: 'Just enjoying the sun and dreaming of tuna treats.',
        comments: [],
      },
      {
        id: 'U0001P0007',
        title:
          'Sed lorem dolores erat velit sed zzril duis ad et in consequat takimata takimata nonummy.',
        image:
          'https://res.cloudinary.com/dm1yyjg7i/image/upload/v1738715788/catspace/catspace-image-23_nwcaj2.jpg',
        favorites: 309,
        description: 'Just enjoying the sun and dreaming of tuna treats.',
        comments: [],
      },
      {
        id: 'U0001P0008',
        title:
          'Ut hendrerit ea sanctus et dolores justo quis sed elitr et eos duis tempor sadipscing nulla et erat takimata.',
        image:
          'https://res.cloudinary.com/dm1yyjg7i/image/upload/v1738715793/catspace/catspace-image-24_svabl9.jpg',
        favorites: 34,
        description: 'Just enjoying the sun and dreaming of tuna treats.',
        comments: [],
      },
    ],
  },
  {
    id: '02',
    email: '',
    image:
      'https://res.cloudinary.com/dm1yyjg7i/image/upload/v1730658243/catspace/catspace-image-02_uz3etn.jpg',
    name: 'Baxter Whiskerpaws',
    handle: 'baxterwhiskers',
    description:
      "Playful troublemaker with a love for chasing invisible things. If there's a box, I'm in it.",
    favorites: ['x', 'y', 'z'],
    following: [],
    followers: [],
    tags: ['playful', 'stripped', 'whiskers', 'fluffy'],
    posts: [],
  },
  {
    id: '03',
    email: '',
    image:
      'https://res.cloudinary.com/dm1yyjg7i/image/upload/v1730658243/catspace/catspace-image-03_fhxfnz.jpg',
    name: 'Luna Moonpurr',
    handle: 'lunathepurr',
    description:
      'A mysterious night owl who loves gazing at the moon and curling up in dark corners.',
    favorites: ['x', 'y', 'z'],
    following: [],
    followers: [],
    tags: ['mysterious', 'paws', 'moonlight', 'elegant'],
    posts: [],
  },
  {
    id: '04',
    email: '',
    image:
      'https://res.cloudinary.com/dm1yyjg7i/image/upload/v1730658244/catspace/catspace-image-04_osmx3b.jpg',
    name: 'Oscar Furrytail',
    handle: 'oscarfurry',
    description:
      'A gentle giant with a heart as warm as his fur. Loves belly rubs—sometimes.',
    favorites: [],
    following: [],
    followers: [],
    tags: ['cuddly', 'orange', 'gentle', 'bigeyes'],
    posts: [],
  },
  {
    id: '05',
    email: '',
    image:
      'https://res.cloudinary.com/dm1yyjg7i/image/upload/v1730658245/catspace/catspace-image-05_cwyhxv.jpg',
    name: 'Milo Pouncester',
    handle: 'milotheleaper',
    description:
      'Born to jump! The higher, the better. Catches treats midair like a pro.',
    favorites: [],
    following: [],
    followers: [],
    tags: ['energetic', 'grey', 'jumping', 'adventurous'],
    posts: [],
  },
  {
    id: '06',
    email: '',
    image:
      'https://res.cloudinary.com/dm1yyjg7i/image/upload/v1730658246/catspace/catspace-image-06_tstuf4.jpg',
    name: 'Whiskers McFluff',
    handle: 'whiskersfluff',
    description:
      'Soft as a cloud, sneaky as a ninja. Will steal your spot the moment you move.',
    favorites: [],
    following: [],
    followers: [],
    tags: ['fluffy', 'quiet', 'snuggly', 'playful'],
    posts: [],
  },
  {
    id: '07',
    email: '',
    image:
      'https://res.cloudinary.com/dm1yyjg7i/image/upload/v1730658247/catspace/catspace-image-07_fvvlqp.jpg',
    name: 'Cleo Purrington',
    handle: 'cleothecat',
    description:
      'Regal and refined, with a purr that soothes souls. Bow before my fluffy majesty!',
    favorites: [],
    following: [],
    followers: [],
    tags: ['regal', 'white', 'sophisticated', 'graceful'],
    posts: [],
  },
  {
    id: '08',
    email: '',
    image:
      'https://res.cloudinary.com/dm1yyjg7i/image/upload/v1730658247/catspace/catspace-image-08_xvdpu7.jpg',
    name: 'Charlie Snugglepaws',
    handle: 'charliesnuggles',
    description:
      "Always ready for a nap or a cuddle. If you need a lap warmer, I'm your cat!",
    favorites: [],
    following: [],
    followers: [],
    tags: ['snuggly', 'striped', 'friendly', 'sleepy'],
    posts: [],
  },
  {
    id: '09',
    email: '',
    image:
      'https://res.cloudinary.com/dm1yyjg7i/image/upload/v1730658248/catspace/catspace-image-09_tn6nt9.jpg',
    name: 'Oliver Cuddlekins',
    handle: 'olivercuddles',
    description:
      'Cuddles are my superpower. I will turn even the toughest humans into softies!',
    favorites: [],
    following: [],
    followers: [],
    tags: ['cute', 'calico', 'curledup', 'content'],
    posts: [],
  },
  {
    id: '10',
    email: '',
    image:
      'https://res.cloudinary.com/dm1yyjg7i/image/upload/v1730658249/catspace/catspace-image-10_cpzqjm.jpg',
    name: 'Mittens Whiskerface',
    handle: 'mittenswhiskers',
    description:
      'Cuddles are my superpower. I will turn even the toughest humans into softies!',
    favorites: [],
    following: [],
    followers: [],
    tags: ['adorable', 'mittens', 'sweet', 'kitten'],
    posts: [],
  },
  {
    id: '11',
    email: '',
    image:
      'https://res.cloudinary.com/dm1yyjg7i/image/upload/v1730658250/catspace/catspace-image-12_mbz9yf.jpg',
    name: 'Simba Roarheart',
    handle: 'simbaking',
    description:
      'Cuddles are my superpower. I will turn even the toughest humans into softies!',
    favorites: [],
    following: [],
    followers: [],
    tags: ['brave', 'lion', 'golden', 'majestic'],
    posts: [],
  },
  {
    id: '12',
    email: '',
    image:
      'https://res.cloudinary.com/dm1yyjg7i/image/upload/v1730658251/catspace/catspace-image-13_aohajw.jpg',
    name: 'Whiskey Fuzzington',
    handle: 'whiskeyfuzz',
    description:
      'Cuddles are my superpower. I will turn even the toughest humans into softies!',
    favorites: [],
    following: [],
    followers: [],
    tags: ['mischievous', 'gray', 'fuzzy', 'playful'],
    posts: [],
  },
  {
    id: '13',
    email: '',
    image:
      'https://res.cloudinary.com/dm1yyjg7i/image/upload/v1730658252/catspace/catspace-image-14_tygyih.jpg',
    name: 'Zara Starwhiskers',
    handle: 'zarastar',
    description:
      "A tiny troublemaker with the softest paws. If it's moving, I'll chase it!",
    favorites: [],
    following: [],
    followers: [],
    tags: ['star', 'white', 'shiny', 'playful'],
    posts: [],
  },
  {
    id: '14',
    email: '',
    image:
      'https://res.cloudinary.com/dm1yyjg7i/image/upload/v1730658252/catspace/catspace-image-15_e7oivm.jpg',
    name: 'Whisper Softpaws',
    handle: 'whisperthesoft',
    description:
      "A tiny troublemaker with the softest paws. If it's moving, I'll chase it!",
    favorites: [],
    following: [],
    followers: [],
    tags: ['gentle', 'gray', 'quiet', 'graceful'],
    posts: [],
  },
  {
    id: '15',
    email: '',
    image:
      'https://res.cloudinary.com/dm1yyjg7i/image/upload/v1730658253/catspace/catspace-image-16_hsbzbk.jpg',
    name: 'Cupcake Sweetnose',
    handle: 'cupcakesweetie',
    description:
      "A tiny troublemaker with the softest paws. If it's moving, I'll chase it!",
    favorites: [],
    following: [],
    followers: [],
    tags: ['meowmix', 'sweet', 'blessed', 'clawz'],
    posts: [],
  },
  {
    id: '16',
    email: '',
    image:
      'https://res.cloudinary.com/dm1yyjg7i/image/upload/v1730658249/catspace/catspace-image-11_xm3ssp.jpg',
    name: 'Meowmer Meemo',
    handle: 'memomeow',
    description:
      "A tiny troublemaker with the softest paws. If it's moving, I'll chase it!",
    favorites: [],
    following: [],
    followers: [],
    tags: ['meemo', 'fuzzhead', 'scratch', 'nice'],
    posts: [],
  },
];
