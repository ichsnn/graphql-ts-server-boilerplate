import { startServer } from "../services/server";

export const setup = async () => {
  let listener : any = await startServer();
  const port = listener.address().port;
  process.env.TEST_HOST = `http://127.0.0.1:${port}`;
};