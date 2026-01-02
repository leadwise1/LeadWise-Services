import serverless from "serverless-http";
import { createServer } from "../server";

const app = createServer();
const handler = serverless(app);

// Export for Vercel serverless function
export default handler;
