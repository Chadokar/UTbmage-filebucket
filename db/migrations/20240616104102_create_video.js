/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.schema.createTable("videos", (table) => {
    table.increments("id").primary();
    table.string("title").notNullable();
    table.string("description", 20000);
    table.string("yt_channel").notNullable();
    table.string("url").unique();
    table.boolean("working").defaultTo(true);
    table.string("content", 40000);
    table.string("backend_name");
    // give only three options for designer: view,edit and onlyedit
    table.string("desiger").defaultTo("edit");
    table.string("writer").defaultTo("edit");
    table.integer("last_update_by").unsigned();
    table.foreign("last_update_by").references("users.id");
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
  await knex.schema.dropTable("videos");
};
