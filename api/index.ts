import serverless from "serverless-http";
import { createServer } from "../server";

const app = createServer();
const handler = serverless(app);

// If TypeScript complains about handler type you can cast to any:
// export default (handler as any);

export default async function (req: any, res: any) {
  return handler(req, res);
}
