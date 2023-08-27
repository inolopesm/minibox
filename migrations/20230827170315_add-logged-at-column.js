exports.up = (knex) => knex.schema.alterTable("User", (table) => {
  table.integer("loggedAt");
});

exports.down = (knex) => knex.schema.alterTable("User", (table) => {
  table.dropColumn("loggedAt");
});
