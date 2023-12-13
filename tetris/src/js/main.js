const canvas = document.getElementById('desk');
const view = canvas.getContext('2d');

view.canvas.width = columns * block_size;
view.canvas.height = height * block_size;

view.scale(block_size, block_size);