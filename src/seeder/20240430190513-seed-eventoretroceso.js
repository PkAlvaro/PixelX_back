module.exports = {
  up: (queryInterface) => queryInterface.bulkInsert('EventoRetrocesos', [
    {
      id_casilla_evento: 1,
      num_casillas: 5,
      createdAt: new Date(),
      updatedAt: new Date(),
      imagen: 'https://i.postimg.cc/yNKNZPJf/evento-retroceso.png',
    },
    {
      id_casilla_evento: 2,
      num_casillas: 5,
      createdAt: new Date(),
      updatedAt: new Date(),
      imagen: 'https://i.postimg.cc/yNKNZPJf/evento-retroceso.png',
    },
    {
      id_casilla_evento: 3,
      num_casillas: 5,
      createdAt: new Date(),
      updatedAt: new Date(),
      imagen: 'https://i.postimg.cc/yNKNZPJf/evento-retroceso.png',
    },
    {
      id_casilla_evento: 4,
      num_casillas: 5,
      createdAt: new Date(),
      updatedAt: new Date(),
      imagen: 'https://i.postimg.cc/yNKNZPJf/evento-retroceso.png',
    },
  ]),
  down: (queryInterface) => queryInterface.bulkDelete('EventoRetrocesos', null, {}),
};
