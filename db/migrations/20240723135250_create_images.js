/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.schema.createTable("images", (table) => {
    table.increments("id").primary();
    table.string("title").notNullable();
    table.string("yt_id");
    table.string("backend_name");
    table.boolean("is_thumbnail").defaultTo(false);
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
    table.uuid("uuid").defaultTo(knex.fn.uuid());
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  await knex.schema.dropTable("images");
};
