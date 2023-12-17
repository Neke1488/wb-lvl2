'use strict';

const columns = 10;
const height = 20;
const block_size = 30;
//установыим константы для клавиш управления
const keys = {
    down: 40,
    left: 37,
    right: 39,
    space: 32,
    up: 38
}

const colors = [
    '#a0d2eb',
    '#FFD700',
    '#FF69B4',
    '#DC143C',
    '#66CDAA',
    '#4169E1',
    '#FFDEAD'
]

const figures = [
    [[0, 0, 0, 0],
     [1, 1, 1, 1],
     [0, 0, 0, 0],
     [0, 0, 0, 0]],

    [[2, 0, 0],
     [2, 2, 2],
     [0, 0, 0]],

    [[0, 0, 3],
     [3, 3, 3],
     [0, 0, 0]],
    
    [[4, 4],
     [4, 4]],
    
    [[0, 5, 5],
     [5, 5, 0],
     [0, 0, 0]],

    [[0, 6, 0],
     [6, 6, 6],
     [0, 0, 0]],

    [[7, 7, 0],
     [0, 7, 7],
     [0, 0, 0]]
];
//метод Object.freeze позволяет 'заморозить' объект
//чтобы имеющиеся свойства были недоступны для записи и настройки
Object.freeze(keys);

const points = {
    one: 100,
    double: 300,
    triple: 500,
    tetris: 800,
    simpleFall: 1,
    fastFall: 2
}
Object.freeze(points);