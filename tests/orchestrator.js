import retry from "async-retry";
import database from "infra/database";

async function waitForAllServices() {
  await waitForWEbServer();

  async function waitForWEbServer() {
    return retry(fetchStatusPage, {
      retries: 50,
      maxTimeout: 1000,
    });

    async function fetchStatusPage() {
      const response = await fetch("http://localhost:3000/api/v1/status");

      if (!response.ok) {
        throw new Error("Web server is not ready yet");
      }
    }
  }
}

async function cleanDatabase() {
  await database.query("drop schema public cascade; create schema public;");
}

const orchestrator = {
  waitForAllServices,
  cleanDatabase,
};

export default orchestrator;
