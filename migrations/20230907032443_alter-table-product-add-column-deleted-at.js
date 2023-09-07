exports.up = (knex) => knex.schema.alterTable("Product", (table) => {
  table.bigInteger("deletedAt");
});

exports.down = (knex) => knex.schema.alterTable("Product", (table) => {
  table.dropColumn("deletedAt");
});
