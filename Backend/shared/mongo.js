import "dotenv/config";
import mongoose from "mongoose";

const connections = new Map();

export const getMongoConnection = (environmentKey) => {
  const uri = process.env[environmentKey] || process.env.MONGODB_URI;
  if (!uri) {
    throw new Error(`${environmentKey} or MONGODB_URI must be configured`);
  }

  if (!connections.has(uri)) {
    const connection = mongoose.createConnection(uri, { maxPoolSize: 5 });
    connections.set(uri, {
      connection,
      ready: connection.asPromise(),
    });
  }

  return connections.get(uri);
};

export const connectMongo = async (environmentKey) => {
  const { connection, ready } = getMongoConnection(environmentKey);
  if (connection.readyState !== 1) {
    await ready;
  }
  return connection;
};
