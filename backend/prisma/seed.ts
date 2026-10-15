import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const SEED_PRODUCTS = [
  {
    name: 'Espresso',
    description: 'Rich, concentrated double shot of our signature house blend with a thick hazelnut crema.',
    price: 95,
    category: 'Espresso',
    imageUrl: '/src/assets/images/hero_coffee_latte_art_1791815764504.jpg',
    available: true,
    featured: false,
  },
  {
    name: 'Americano',
    description: 'Double espresso pulled over hot water, highlighting chocolate and citrus notes.',
    price: 110,
    category: 'Espresso',
    imageUrl: '/src/assets/images/coffee_iced_spanish_latte_1791815797774.jpg',
    available: true,
    featured: false,
  },
  {
    name: 'Café Latte',
    description: 'Smooth espresso paired with velvety steamed milk and a thin layer of microfoam.',
    price: 145,
    category: 'Latte',
    imageUrl: '/src/assets/images/hero_coffee_latte_art_1791815764504.jpg',
    available: true,
    featured: true,
  },
  {
    name: 'Cappuccino',
    description: 'Equal harmony of rich espresso, steamed milk, and airy foam dusted with cocoa.',
    price: 145,
    category: 'Espresso',
    imageUrl: '/src/assets/images/hero_coffee_latte_art_1791815764504.jpg',
    available: true,
    featured: false,
  },
  {
    name: 'Spanish Latte',
    description: 'Our signature blend espresso combined with sweet condensed milk and silky fresh milk.',
    price: 165,
    category: 'Latte',
    imageUrl: '/src/assets/images/coffee_iced_spanish_latte_1791815797774.jpg',
    available: true,
    featured: true,
  },
  {
    name: 'Caramel Macchiato',
    description: 'Freshly steamed milk marked with espresso and drizzled with artisanal caramel.',
    price: 175,
    category: 'Latte',
    imageUrl: '/src/assets/images/coffee_iced_spanish_latte_1791815797774.jpg',
    available: true,
    featured: false,
  },
  {
    name: 'Iced Vanilla Latte',
    description: 'Chilled espresso and milk infused with natural Madagascar vanilla bean syrup over ice.',
    price: 165,
    category: 'Iced Coffee',
    imageUrl: '/src/assets/images/coffee_iced_spanish_latte_1791815797774.jpg',
    available: true,
    featured: false,
  },
  {
    name: 'Iced Mocha',
    description: 'Decadent dark cocoa melted into double espresso and cold milk served over ice.',
    price: 175,
    category: 'Iced Coffee',
    imageUrl: '/src/assets/images/coffee_iced_spanish_latte_1791815797774.jpg',
    available: true,
    featured: true,
  },
  {
    name: 'Matcha Latte',
    description: 'Ceremonial Japanese Uji matcha whisked with fresh steamed milk for a calm, earthy cup.',
    price: 180,
    category: 'Non-Coffee',
    imageUrl: '/src/assets/images/coffee_matcha_latte_1791815816390.jpg',
    available: true,
    featured: true,
  },
  {
    name: 'Chocolate Frappe',
    description: 'Blended rich Dutch chocolate, cream, and ice topped with chocolate curls.',
    price: 185,
    category: 'Non-Coffee',
    imageUrl: '/src/assets/images/coffee_iced_spanish_latte_1791815797774.jpg',
    available: true,
    featured: false,
  },
  {
    name: 'Butter Croissant',
    description: 'Flaky golden French pastry laminated with pure European cultured butter.',
    price: 105,
    category: 'Pastries',
    imageUrl: '/src/assets/images/bakery_fresh_croissant_1791815828881.jpg',
    available: true,
    featured: true,
  },
  {
    name: 'Chocolate Muffin',
    description: 'Decadent moist chocolate sponge studded with molten bittersweet dark chocolate chunks.',
    price: 95,
    category: 'Pastries',
    imageUrl: '/src/assets/images/bakery_fresh_croissant_1791815828881.jpg',
    available: true,
    featured: false,
  },
];

async function main() {
  console.log('Seeding Coffee Mellenia products...');
  for (const prod of SEED_PRODUCTS) {
    await prisma.product.create({
      data: prod,
    });
  }
  console.log('Seeding completed successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
