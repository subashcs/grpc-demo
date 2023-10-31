import { ProtoGrpcType } from "./protos/ts/weather";
import * as protoLoader from "@grpc/proto-loader";
import * as grpcLibrary from "@grpc/grpc-js";
const protoFileName = "./protos/weather.proto";

const options = {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
};

const packageDefinition = protoLoader.loadSync(protoFileName, options);
const packageObject = grpcLibrary.loadPackageDefinition(
  packageDefinition
)as unknown as ProtoGrpcType;

const weatherPackage = packageObject.weather;

/**
 * Server streaming example: server sending multiple updates response
 * @param call
 */
function getTemperatureUpdates(call: any) {
  const request = call.request;
  // Streaming new temperature data mock updates
  for (let i = 1; i <= 5; i++) {
    const response = {
      message: {
        region: request.region,
        temperature: Number(Math.random() * 100 + i),
        humidity: i,
      },
    };
    call.write(response);
  }

  call.end(); // Signal the end of the streaming
}

/**
 * Client streaming example: client sending multiple updates
 * @param call
 * @param res
 */
function updateTemperature(call: any, callback: any) {
  const weatherData: any[] = [];
  let id = 0;
  call.on("data", (request: any) => {
    // Process each incoming request
    id++;
    console.log(`Updating for ${request.region} with new temperature ${request.temperature}`);
    weatherData.push({
      id,
      region: request.region,
      temperature: request.temperature,
    });
  });

  call.on("end", () => {
    // Save all the received data, and send acknowledgement to client
    const response = {
      message: weatherData,
    };
    callback(null, response);
  });
}

/**
 * Unary RPC example: single procedure call
 * Fetch weather data for a particular region
 * @param call
 * @param res
 */
function getWeatherDetails(call: any, res:any) {
  console.log("Processing weather data for region - ", call.request.region);
  const { temperature, id } = { temperature: Math.random() * 100, id: Math.random() * 10 };
  res(null, {
    message: { region: call.request.region, temperature, id },
  });
}

const users = new Map<string, any>();
/**
 * Chat room service for weather data subscribers
 */
function weatherChat(call: any) {
  // listen for messages from clients
  call.on("data", (req: any) => {
    const username = call.metadata.get("username")[0] as string;
    const message = req.message;
    console.log(`Received message from ${username}: ${message}`);
    // brodcast message to all users
    for (let [user, userCall] of users) {
      if (username !== user) {
        userCall.write({
          username,
          message,
        });
      }
    }

    if (users.get("username") === undefined) {
      users.set(username, call);
    }
  });
  // when any client ends the connection send a good bye response
  call.on("end", () => {
    const username = call.metadata.get("username")[0] as string;
    users.delete(username);
    call.write({
      username: "Server",
      message: `See you later ${username}`,
    });
  });
}

function createServer() {
  const server = new grpcLibrary.Server();
  server.addService(weatherPackage.Weather.service, {
    getWeatherDetails,
    updateTemperature,
    getTemperatureUpdates,
    weatherChat,
  });
  return server;
}

function main() {
  const PORT = 8082;
  const server = createServer();
  server.bindAsync(
    `localhost:${PORT}`,
    grpcLibrary.ServerCredentials.createInsecure(),
    (err: unknown, port: number) => {
      if (err) {
        console.log(err);
        return;
      }

      console.log(`Your server has started on port ${port}`);
      console.log(`Open http://localhost:${port}`);
      server.start();
    }
  );
}

main();
