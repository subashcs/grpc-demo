import { ProtoGrpcType } from "./protos/ts/weather";
import readline from "readline";
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
) as unknown as ProtoGrpcType;
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

  const reader = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  /**
   * Fetches the latest temperature updates from the server
   * for the requested location (region)
   */
  function serverTemperatureStreamer() {
    const serverTemperatureStream = client.getTemperatureUpdates({
      region: "Baglung",
    });
    serverTemperatureStream.on("data", (data: any) => {
      console.log("Received weather update:", data);
    });
    serverTemperatureStream.on("end", () => {
      console.log("Server finished sending weather updates");
    });
  }

  function clientTemperatureUpdateStreamer() {
    const clientTemperatureUpdateStream = client.updateTemperature(
      (err, result) => {
        if (err) {
          console.log("Error:", err);
        }
        console.log("Final data after updates:", result);
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

  function getWeatherDetails() {
    console.log("Requesting weather data of Baglung district...");
    client.getWeatherDetails({ region: "Baglung" }, (err, result) => {
      if (err) {
        console.log(err);
        return;
      }
      console.log("Got weather result:", result);
    });
  }

  function askQuestionWithOptions(
    reader: readline.Interface,
    question: string,
    options: any[]
  ) {
    return new Promise((resolve, reject) => {
      const formattedOptions = options
        .map((option: any, index: number) => `${index + 1}. ${option}`)
        .join("\n");
      reader.question(
        `${question}\n${formattedOptions}\nSelect an option: `,
        (answer: string) => {
          const selectedOption = parseInt(answer);
          if (selectedOption >= 1 && selectedOption <= options.length) {
            resolve(options[selectedOption - 1]);
          } else {
            reject(new Error("Invalid option selected."));
          }
        }
      );
    });
  }

  function clientChatService() {
    const metadata = new grpcLibrary.Metadata();
    try {
      reader.question("Enter your username:\n", (name) => {
        console.log(`Hello ${name}, Write your message:`);
        metadata.set("username", name);
        const call = client.weatherChat(metadata);
        call.write({ message: "register" });

        call.on("data", (data) => {
          console.log(`${data.username}:`, data.message);
        });
        
        reader.on("line", (line) => {
          if (line == "quit") {
            call.end();
          } else {
            call.write({ message: line });
          }
        });
      });
    } catch (error: any) {
      console.error(error.message);
    } 
  }

  async function onReady() {
    const question = "Choose a RPC type demo?";
    const options = [
      "Unary RPC - temperature details by region",
      "Server Streaming - regular temperature updates from server",
      "Client Streaming - update temperature regularly",
      "Bidirectional Streaming - group chat service",
    ];

    const rpcType = await askQuestionWithOptions(reader, question, options) as string;
    console.log(`------------------------`);
    console.log(`You selected: ${rpcType}`);
    console.log(`------------------------`);
    switch (rpcType) {
      case options[0]: {
        // Unary RPC
        getWeatherDetails();
        break;
      }
      case options[1]: {
        // Server Streaming RPC
        serverTemperatureStreamer();
        break;
      }
      case options[2]: {
        // Client Streaming RPC
        clientTemperatureUpdateStreamer();
        break;
      }
      case options[3]: {
        // Bidirectional Streaming Chat
        clientChatService();
        break;
      }
      default: {
        console.log("None selected");
      }
    }
  }
}

main();
