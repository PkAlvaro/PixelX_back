module.exports = {
  up: (queryInterface) => queryInterface.bulkInsert('EventoBonusAvances', [
    {
      id_casilla_evento: 1,
      cantidad_aumentada: 5,
      createdAt: new Date(),
      updatedAt: new Date(),
      imagen: 'https://i.postimg.cc/L8LX57sY/evento-bonus-avance.png',
    },
    {
      id_casilla_evento: 2,
      cantidad_aumentada: 5,
      createdAt: new Date(),
      updatedAt: new Date(),
      imagen: 'https://i.postimg.cc/L8LX57sY/evento-bonus-avance.png',
    },
    {
      id_casilla_evento: 3,
      cantidad_aumentada: 5,
      createdAt: new Date(),
      updatedAt: new Date(),
      imagen: 'https://i.postimg.cc/L8LX57sY/evento-bonus-avance.png',
    },
    {
      id_casilla_evento: 4,
      cantidad_aumentada: 5,
      createdAt: new Date(),
      updatedAt: new Date(),
      imagen: 'https://i.postimg.cc/L8LX57sY/evento-bonus-avance.png',
    },
  ]),
  down: (queryInterface) => queryInterface.bulkDelete('EventoBonusAvances', null, {}),
};
