import { ProtoGrpcType } from "./protos/ts/weather";
import readline from "readline";
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

function main() {
  const PORT = 8082;
  const client = new weatherPackage.Weather(
    `localhost:${PORT}`,
    grpcLibrary.credentials.createInsecure()
  );
  const deadline = new Date();
  deadline.setSeconds(deadline.getSeconds() + 5);

  client.waitForReady(deadline, (err) => {
    if (err) {
      console.error(err);
      return;
    }
    onReady();
  });

  function serverTemperatureStreamer() {
    const serverTemperatureStream = client.getTemperatureUpdates({
      region: "Baglung",
    });
    serverTemperatureStream.on("data", (data: any) => {
      console.log("Server Streaming:", data);
    });
    serverTemperatureStream.on("end", () => {
      console.log("temperature getter communication ended");
    });
  }

  function clientTemperatureUpdateStreamer() {
    const clientTemperatureUpdateStream = client.updateTemperature(
      (err, result) => {
        if (err) {
          console.log("Error:", err);
        }
        console.log("Client Temperature Streaming RPC Result:", result);
      }
    );

    clientTemperatureUpdateStream.write({
      region: "Kathmandu",
      temperature: 30,
    });

    clientTemperatureUpdateStream.write({
      region: "NewYork",
      temperature: 35,
    });

    clientTemperatureUpdateStream.write({
      region: "Kathmandu",
      temperature: 28,
    });
    clientTemperatureUpdateStream.end();
  }

  function detailsGetter() {
    client.getDetails({ region: "Baglung" }, (err, result) => {
      if (err) {
        console.log(err);
        return;
      }
      console.log("got response", result);
    });
  }

  function clientChatService() {
    const reader = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    const metadata = new grpcLibrary.Metadata();

      reader.question("Enter your username:\n", (name) => {
        console.log(`Hello ${name}`);
        metadata.set("username", name);
        const call = client.weatherChat(metadata);
        call.write({ message: "register" });

        call.on("data", (data) => {
          console.log("Chat message:", data.message);
        });

        reader.on("line", (line) => {
          if (line == "quit") {
            call.end();
          } else {
            call.write({ message: line });
          }
        });
      })
  }

  function onReady() {
    // Unary RPC
    // detailsGetter();

    // Server Streaming RPC
    // serverTemperatureStreamer();

    // Client Streaming RPC
    // clientTemperatureUpdateStreamer();

    // Bidirectional Streaming Chat
    clientChatService();
  }
}

main();
