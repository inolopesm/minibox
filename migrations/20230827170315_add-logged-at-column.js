exports.up = (knex) => knex.schema.alterTable("User", (table) => {
  table.bigInteger("loggedAt");
});

exports.down = (knex) => knex.schema.alterTable("User", (table) => {
  table.dropColumn("loggedAt");
});
