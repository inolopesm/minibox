exports.up = (knex) => knex.schema.createTable("User", (table) => {
  table.increments("id");
  table.string("username", 24).notNullable().unique();
  table.string("password", 255).notNullable();
  table.string("accessToken", 255);
});

exports.down = (knex) => knex.schema.dropTable("User");
