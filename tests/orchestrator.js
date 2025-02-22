import retry from "async-retry";

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

export default { waitForAllServices };
