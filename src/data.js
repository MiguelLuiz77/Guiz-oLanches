const makeProducts = (category, entries, start = 1) => entries.map(([name, price], index) => ({
  id: `${category}-${start + index}`,
  name,
  price: Math.round(price * 100),
  number: start + index,
}));

export const categories = [
  {
    id: 'hamburguer', title: 'Lanches de Hambúrguer', short: 'Hambúrguer', icon: '🍔',
    products: makeProducts('hamburguer', [
      ['X-Salada + caçulinha', 25], ['X-Burguer + caçulinha', 25], ['X-Duplo', 26], ['X-Egg', 28],
      ['X-Calabresa', 30], ['X-Dogão', 31], ['X-Bacon', 31], ['X-Egg Calabresa', 33],
      ['X-Bacon Catupiry', 35], ['X-Bacon Cheddar', 35], ['X-Egg Bacon', 36], ['X-Calabacon', 37],
      ['X-Tudinho', 45], ['X-Tartaruga', 90],
    ]),
  },
  {
    id: 'frango', title: 'Lanches de Frango', short: 'Frango', icon: '🍗',
    products: makeProducts('frango', [
      ['X-Frango', 31], ['X-Egg Frango', 33], ['X-Frango Catupiry', 35], ['X-Frango Bacon', 37],
      ['X-Frango Egg Bacon', 39], ['X-Calfrango Bacon', 41],
    ], 15),
  },
  {
    id: 'hotdogs', title: 'Hot Dogs', short: 'Hot Dogs', icon: '🌭',
    products: makeProducts('hotdogs', [
      ['Hot Dog', 19], ['Hot Egg', 20], ['Hot Cheddar', 23], ['Hot Catupiry', 23],
      ['Hot Calabresa', 24], ['Hot Bacon', 26], ['Hot Frango', 27],
    ], 21),
  },
  {
    id: 'tradicionais', title: 'Tradicionais', short: 'Tradicionais', icon: '🥪',
    products: makeProducts('tradicionais', [
      ['Misto Quente', 20], ['Bauru', 21], ['Americano', 23], ['Misto Bacon', 26], ['Misto Calabresa', 26],
    ], 28),
  },
  {
    id: 'artesanal', title: 'Hambúrguer Artesanal', short: 'Artesanal', icon: '🍔',
    products: makeProducts('artesanal', [
      ['Burguer Queijo', 32], ['Burguer Salada', 34], ['Burguer Cheddar', 35], ['Burguer Bacon', 40], ['Burguer Ninja', 52],
    ], 33),
  },
  {
    id: 'porcoes', title: 'Porções', short: 'Porções', icon: '🍟',
    products: makeProducts('porcoes', [
      ['Batata Pequena', 16], ['Batata Média', 30], ['Batata Grande', 40],
      ['Batata Mista (Batata + Bacon + Cheddar)', 60], ['Batata Mista (Batata + Calabresa + Queijo)', 60],
    ]),
  },
  {
    id: 'adicionais', title: 'Adicionais', short: 'Adicionais', icon: '➕',
    products: [
      ...makeProducts('adicional-lanche', [
        ['Queijo', 4], ['Presunto', 3], ['Salsicha', 3], ['Ovo', 3], ['Hambúrguer', 4],
        ['Calabresa', 7], ['Cheddar', 7], ['Catupiry', 7], ['Bacon', 8], ['Frango', 8],
      ]).map((item) => ({ ...item, subgroup: 'Adicionais de lanches' })),
      ...makeProducts('adicional-porcao', [
        ['Calabresa', 8], ['Cheddar', 8], ['Catupiry', 8], ['Bacon', 8], ['Queijo', 10],
      ]).map((item) => ({ ...item, subgroup: 'Adicionais de porções' })),
    ],
  },
  {
    id: 'combos', title: 'Combos', short: 'Combos', icon: '🍔',
    products: [
      ...makeProducts('combo-solo', [
        ['1 Hot Dog + Fritas + Refri 200ml', 31], ['1 X-Burguer + Fritas + Refri 200ml', 33],
        ['1 X-Salada + Fritas + Refri 200ml', 34], ['1 X-Frango + Fritas + Refri 200ml', 38],
        ['1 X-Bacon + Fritas + Refri 200ml', 40],
      ]).map((item) => ({ ...item, subgroup: 'Combos solteiro' })),
      ...makeProducts('combo-familia', [
        ['2 Hot Dogs + Fritas Média + 1 Guaraná 1L', 65], ['2 Hot Bacon + Fritas Média + 1 Guaraná 1L', 72],
        ['2 X-Salada + Fritas Média + 1 Guaraná 1L', 75], ['2 X-Bacon + Fritas Média + 1 Guaraná 1L', 80],
      ]).map((item) => ({ ...item, subgroup: 'Combos família' })),
    ],
  },
  {
    id: 'acai', title: 'Açaí', short: 'Açaí', icon: '🍧',
    products: [],
  },
  {
    id: 'bebidas', title: 'Bebidas', short: 'Bebidas', icon: '🥤',
    products: makeProducts('bebidas', [
      ['Água sem gás', 4], ['Água com gás', 5], ['Refrigerante 310ml', 8], ['Refrigerante 600ml', 11],
      ['Coca-Cola 1L', 13], ['Guaraná 1L', 11], ['Sukita 2L', 14], ['Coca-Cola 2,5L', 19], ['Suco de Maracujá 500ml', 12],
    ]),
  },
  {
    id: 'pasteis', title: 'Pastéis', short: 'Pastel', icon: '🥟',
    products: makeProducts('pasteis', [
      ['Pastel de Carne', 14], ['Pastel de Frango', 14], ['Pastel de Queijo', 14], ['Pastel de Pizza', 14],
      ['Pastel de Carne com Queijo', 17], ['Pastel de Frango com Catupiry', 17],
      ['Pastel de Frango com Cheddar', 17], ['Pastel de Frango com Queijo', 17],
    ]),
  },
];

export const acaiSizes = [
  { label: '300ml', price: 1400, extra: 300 },
  { label: '500ml', price: 1600, extra: 350 },
  { label: '700ml', price: 1900, extra: 400 },
  { label: '1L', price: 2600, extra: 500 },
];

export const acaiToppings = ['Leite em pó', 'Leite condensado', 'Paçoca', 'Confete', 'Morango', 'Banana', 'Chocoboll', 'Granola'];

export const reviews = [
  {
    name: 'Laura Felix', initials: 'LF',
    quote: 'Recomendo demais. Lanche saboroso, macio, quentinho. Atendimento rápido, pró-ativos. Parabenizo ao proprietário Sr. Guilherme e ao entregador que foi rápido e extremamente educado.',
  },
  { name: 'Rafael Lopes', initials: 'RL', quote: 'Recomendo a todos. Muito bom os lanches. Caprichados.' },
  {
    name: 'Lucy Diniz Yuno', initials: 'LY',
    quote: 'Um dos melhores da região, sempre pedimos, às vezes vamos até lá, são muito caprichosos e atenciosos!',
  },
  {
    name: 'Luiz Guilherme Semensati', initials: 'LS',
    quote: 'O melhor lanche da região disparado, sem tirar nem por! Feito com muito capricho e com ingredientes de qualidade máxima.',
  },
];

export const whatsappUrl = 'https://wa.me/5512988081969';
export const instagramUrl = 'https://www.instagram.com/guizao.lanches?rpxt=MThhcjJ6eXhqMHJiag==';
export const address = 'Av. Pres. Juscelino Kubitschek, 4949 - Monte Castelo, São José dos Campos - SP, 12216-340';
export const mapsUrl = 'https://www.google.com/maps/search/?api=1&query=Av.+Pres.+Juscelino+Kubitschek,+4949+-+Monte+Castelo,+S%C3%A3o+Jos%C3%A9+dos+Campos+-+SP,+12216-340';
