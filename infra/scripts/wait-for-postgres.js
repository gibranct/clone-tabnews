const { exec } = require("node:child_process");
function checkPostgreSQLReady() {
  exec("docker exec postgres-dev pg_isready --host localhost", handleReturn);

  function handleReturn(error, stdout) {
    if (stdout.search("accepting connections") === -1) {
      process.stdout.write(".");
      checkPostgreSQLReady();
      return;
    }
    process.stdout.write("\n🟢 PostgreSQL is ready!\n");
  }
}
process.stdout.write("\n\n🔴 Waiting for PostgreSQL to be ready");

checkPostgreSQLReady();
