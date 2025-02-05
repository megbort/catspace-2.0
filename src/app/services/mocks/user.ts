import { User } from '../models';

export const USER: User = {
  id: 'U0001',
  email: 'demo@example.com',
  image:
    'https://res.cloudinary.com/dm1yyjg7i/image/upload/v1730658243/catspace/catspace-image-01_svkhtp.jpg',
  handle: 'demoHandle',
  name: 'Demo Username',
  description:
    'Hello this is a demo user. Look at my description here, I post things sometimes.',
  favorites: [],
  following: [],
  posts: [
    {
      id: 'U0001P0001',
      title: 'Sunday morning vibes',
      image:
        'https://res.cloudinary.com/dm1yyjg7i/image/upload/v1738557256/catspace/catspace-image-17_pihkmj.jpg',
      favorites: 90,
      tags: [],
      comments: [],
    },
    {
      id: 'U0001P0002',
      title: "I'm feeling like some zooms today",
      image:
        'https://res.cloudinary.com/dm1yyjg7i/image/upload/v1738557265/catspace/catspace-image-18_x1ks73.jpg',
      favorites: 202,
      tags: [],
      comments: [],
    },
    {
      id: 'U0001P0003',
      title: "Waiting here for my human to come home, they're always late >:(",
      image:
        'https://res.cloudinary.com/dm1yyjg7i/image/upload/v1738557273/catspace/catspace-image-19_ifqlkg.jpg',
      favorites: 20,
      tags: [],
      comments: [],
    },
    {
      id: 'U0001P0004',
      title:
        'Vel enim labore sanctus diam gubergren invidunt sed ea dolor ut invidunt.',
      image:
        'https://res.cloudinary.com/dm1yyjg7i/image/upload/v1738715772/catspace-image-20_japkom.jpg',
      favorites: 212,
      tags: [],
      comments: [],
    },
    {
      id: 'U0001P0005',
      title: 'Te ea hendrerit veniam est labore soluta.',
      image:
        'https://res.cloudinary.com/dm1yyjg7i/image/upload/v1738715778/catspace-image-21_sx2mwr.jpg',
      favorites: 29,
      tags: [],
      comments: [],
    },
    {
      id: 'U0001P0006',
      title: 'Sea est gubergren rebum sed invidunt vero vero et nonumy ipsum.',
      image:
        'https://res.cloudinary.com/dm1yyjg7i/image/upload/v1738715783/catspace-image-22_andwud.jpg',
      favorites: 49,
      tags: [],
      comments: [],
    },
    {
      id: 'U0001P0007',
      title:
        'Sed lorem dolores erat velit sed zzril duis ad et in consequat takimata takimata nonummy.',
      image:
        'https://res.cloudinary.com/dm1yyjg7i/image/upload/v1738715788/catspace-image-23_nwcaj2.jpg',
      favorites: 309,
      tags: [],
      comments: [],
    },
    {
      id: 'U0001P0008',
      title:
        'Ut hendrerit ea sanctus et dolores justo quis sed elitr et eos duis tempor sadipscing nulla et erat takimata.',
      image:
        'https://res.cloudinary.com/dm1yyjg7i/image/upload/v1738715793/catspace-image-24_svabl9.jpg',
      favorites: 34,
      tags: [],
      comments: [],
    },
  ],
};
