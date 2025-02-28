import migrationRunner from "node-pg-migrate";
import { resolve } from "node:path";
import database from "infra/database";

const POST_METHOD = "POST";
const GET_METHOD = "GET";
const validMethods = [GET_METHOD, POST_METHOD];

export default async function migrations(req, res) {
  if (!validMethods.includes(req.method)) {
    return res.status(405).json({ error: "Invalid method" });
  }
  const dbClient = await database.getNewClient();
  const dryRun = req.method === POST_METHOD ? false : true;
  const migrations = await getMigrations(dryRun, dbClient);
  if (req.method === POST_METHOD) {
    if (migrations.length === 0) {
      return res.status(200).json(migrations);
    }
    return res.status(201).json(migrations);
  }
  res.status(200).json(migrations);
}

async function getMigrations(dryRun, dbClient) {
  const migrations = await migrationRunner({
    dbClient: dbClient,
    dir: resolve("infra", "migrations"),
    direction: "up",
    dryRun,
    verbose: true,
    migrationsTable: "pgmigrations",
  });
  await dbClient.end();
  return migrations;
}
