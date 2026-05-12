const b = require('bcryptjs');
const hash = '$2a$10$S0nqIZHp4LAlz.5HXhPs7OTL6ivgaMNsrQAe5USbQ7hl0YAHvwzXu';
console.log(b.compareSync('admin123', hash));
