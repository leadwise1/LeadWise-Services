import { RequestHandler } from "express";

// Define the interface locally to fix the "Cannot use namespace" error
interface DemoResponse {
  message: string;
}

export const handleDemo: RequestHandler = (req, res) => {
  const response: DemoResponse = {
    message: "Hello from Express server",
  };
  res.status(200).json(response);
};