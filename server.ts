import { ProtoGrpcType } from "./protos/ts/weather";

const protoLoader = require("@grpc/proto-loader");

const grpcLibrary = require("@grpc/grpc-js");

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
) as ProtoGrpcType;

const weatherPackage = packageObject.weather;

/**
 * Server streaming example: server sending multiple updates response
 * @param call
 */
function getTemperatureUpdates(call: any) {
  const request = call.request;

  // Assume some processing logic based on the received request
  // For example, streaming responses for demonstration
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
  console.log("Request:", call.request);
  const responses: any[] = [];
  let id = 0;
  call.on("data", (request: any) => {
    // Process each incoming request
    id++;
    console.log(`Received data: ${request.region}, ${request.temperature}`);
    responses.push({
      id,
      region: request.region,
      temperature: request.temperature,
    });
  });

  call.on("end", () => {
    // Client has finished sending requests
    // send the latest data
    const response = {
      message: responses[responses.length - 1],
    };
    callback(null, response);
  });
}

/**
 * Unary RPC example: single procedure call
 * @param call
 * @param res
 */
function getDetails(call: any, res: any) {
  console.log("Unary Request:", call.request);
  res(null, { message: { region: "Baglung", temperature: 43, humidity: 2 } });
}

const users = new Map<string, any>();

function weatherChat(call: any) {

  call.on("data", (req: any) => {
    const username = call.metadata.get("username")[0] as string;
    const message = req.message;
    console.log("Chat message:", message);

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
    getDetails,
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
