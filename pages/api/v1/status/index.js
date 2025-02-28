import database from "/infra/database.js";

export default async function status(req, res) {
  const updatedAt = new Date().toISOString();
  const dbVersion = await database.query("SHOW server_version;");
  const dbMaxConns = await database.query("SHOW max_connections;");
  const dbUsedConns = await database.query(
    "SELECT count(*)::int FROM pg_stat_activity WHERE datname='local_db';",
  );
  res.status(200).json({
    updated_at: updatedAt,
    dependencies: {
      database: {
        version: dbVersion[0].server_version,
        max_connections: parseInt(dbMaxConns[0].max_connections),
        opened_connections: dbUsedConns[0].count,
      },
    },
  });
}
