import { Profile } from '../models';

export const PROFILES: Profile[] = [
  {
    id: '01',
    image:
      'https://images.pexels.com/photos/2959715/pexels-photo-2959715.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    name: 'Kiku Krenbrink',
    handle: 'kikucatu',
    followers: 122,
    tags: ['#catnip', '#tabby', '#curious', '#soft'],
    following: true,
    posts: [
      {
        id: 'kikuPost001',
        title: 'Sunday morning vibes',
        image:
          'https://images.pexels.com/photos/2959715/pexels-photo-2959715.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        favorites: 202,
        isFavorite: false,
      },
      {
        id: 'kikuPost002',
        title: "I'm feeling like some zooms today",
        image:
          'https://images.pexels.com/photos/2959715/pexels-photo-2959715.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        favorites: 202,
        isFavorite: false,
      },
      {
        id: 'kikuPost003',
        title:
          "Waiting here for my human to come home, they're always late >:(",
        image:
          'https://images.pexels.com/photos/2959715/pexels-photo-2959715.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        favorites: 202,
        isFavorite: false,
      },
    ],
  },
  {
    id: '02',
    image:
      'https://images.pexels.com/photos/2558605/pexels-photo-2558605.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    name: 'Baxter Whiskerpaws',
    handle: 'baxterwhiskers',
    followers: 98,
    tags: ['#playful', '#stripped', '#whiskers', '#fluffy'],
    following: false,
    posts: [],
  },
  {
    id: '03',
    image:
      'https://images.pexels.com/photos/1276553/pexels-photo-1276553.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    name: 'Luna Moonpurr',
    handle: 'lunathepurr',
    followers: 205,
    tags: ['#mysterious', '#paws', '#moonlight', '#elegant'],
    following: true,
    posts: [],
  },
  {
    id: '04',
    image:
      'https://images.pexels.com/photos/57416/cat-sweet-kitty-animals-57416.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    name: 'Oscar Furrytail',
    handle: 'oscarfurry',
    followers: 150,
    tags: ['#cuddly', '#orange', '#gentle', '#bigeyes'],
    following: false,
    posts: [],
  },
  {
    id: '05',
    image:
      'https://images.pexels.com/photos/1543793/pexels-photo-1543793.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    name: 'Milo Pouncester',
    handle: 'milotheleaper',
    followers: 180,
    tags: ['#energetic', '#grey', '#jumping', '#adventurous'],
    following: true,
    posts: [],
  },
  {
    id: '06',
    image:
      'https://images.pexels.com/photos/96938/pexels-photo-96938.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    name: 'Whiskers McFluff',
    handle: 'whiskersfluff',
    followers: 130,
    tags: ['#fluffy', '#quiet', '#snuggly', '#playful'],
    following: false,
    posts: [],
  },
  {
    id: '07',
    image:
      'https://images.pexels.com/photos/1084425/pexels-photo-1084425.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    name: 'Cleo Purrington',
    handle: 'cleothecat',
    followers: 112,
    tags: ['#regal', '#white', '#sophisticated', '#graceful'],
    following: true,
    posts: [],
  },
  {
    id: '08',
    image:
      'https://images.pexels.com/photos/730896/pexels-photo-730896.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    name: 'Charlie Snugglepaws',
    handle: 'charliesnuggles',
    followers: 90,
    tags: ['#snuggly', '#striped', '#friendly', '#sleepy'],
    following: true,
    posts: [],
  },
  {
    id: '09',
    image:
      'https://images.pexels.com/photos/4056390/pexels-photo-4056390.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    name: 'Oliver Cuddlekins',
    handle: 'olivercuddles',
    followers: 175,
    tags: ['#cute', '#calico', '#curledup', '#content'],
    following: false,
    posts: [],
  },
  {
    id: '10',
    image:
      'https://images.pexels.com/photos/4557382/pexels-photo-4557382.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    name: 'Mittens Whiskerface',
    handle: 'mittenswhiskers',
    followers: 120,
    tags: ['#adorable', '#mittens', '#sweet', '#kitten'],
    following: true,
    posts: [],
  },
  {
    id: '11',
    image:
      'https://images.pexels.com/photos/4083295/pexels-photo-4083295.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    name: 'Simba Roarheart',
    handle: 'simbaking',
    followers: 200,
    tags: ['#brave', '#lion', '#golden', '#majestic'],
    following: false,
    posts: [],
  },
  {
    id: '12',
    image:
      'https://images.pexels.com/photos/1311285/pexels-photo-1311285.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    name: 'Whiskey Fuzzington',
    handle: 'whiskeyfuzz',
    followers: 88,
    tags: ['#mischievous', '#gray', '#fuzzy', '#playful'],
    following: true,
    posts: [],
  },
  {
    id: '13',
    image:
      'https://images.pexels.com/photos/2617753/pexels-photo-2617753.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    name: 'Zara Starwhiskers',
    handle: 'zarastar',
    followers: 135,
    tags: ['#star', '#white', '#shiny', '#playful'],
    following: false,
    posts: [],
  },
  {
    id: '14',
    image:
      'https://images.pexels.com/photos/1416834/pexels-photo-1416834.png?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',

    name: 'Whisper Softpaws',
    handle: 'whisperthesoft',
    followers: 155,
    tags: ['#gentle', '#gray', '#quiet', '#graceful'],
    following: true,
    posts: [],
  },
  {
    id: '15',
    image:
      'https://images.pexels.com/photos/416160/pexels-photo-416160.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    name: 'Cupcake Sweetnose',
    handle: 'cupcakesweetie',
    followers: 20,
    tags: ['#meowmix', '#sweet', '#blessed', '#clawz'],
    following: false,
    posts: [],
  },
  {
    id: '16',
    image:
      'https://images.pexels.com/photos/7689487/pexels-photo-7689487.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    name: 'Meowmer Meemo',
    handle: 'memomeow',
    followers: 20,
    tags: ['#meemo', '#fuzzhead', '#scratch', '#nice'],
    following: false,
    posts: [],
  },
];
