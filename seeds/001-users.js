const bcryptjs = require('bcryptjs');

exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('users').truncate()
    .then(function () {
      // Inserts seed entries
      return knex('users').insert([
        {id: 1, username: 'user1', password: bcryptjs.hashSync('pass', 10) },
        {id: 2, username: 'user2', password: bcryptjs.hashSync('pass', 10) }, 
        {id: 3, username: 'user3', password: bcryptjs.hashSync('pass', 10) }
      ]);
    });
};
