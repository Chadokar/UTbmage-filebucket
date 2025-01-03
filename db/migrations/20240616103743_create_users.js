/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.schema.createTable("users", (table) => {
    table.increments("id").primary();
    table.string("first_name").notNullable();
    table.string("last_name");
    table.string("email").notNullable();
    table.string("password").notNullable();
    table.string("username");
    table.string("thumbnail", 20000);
    table.string("publishedAt");
    table.string("profile_id");
    table.string("yt_channel");
    table.string("role").defaultTo("editor");
    table.string("access_token", 20000);
    table.string("refresh_token", 20000);
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
    table.unique("email");
    table.unique("username");
    table.uuid("uuid").defaultTo(knex.fn.uuid());
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  await knex.schema.dropTable("users");
};
