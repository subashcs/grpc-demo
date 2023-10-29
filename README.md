# GRPC Demo
This project contains demonstration of communication between client and server using GRPC and Protobuf. Different RPC call methods such as Unary, Client Streaming, Server Streaming and Bidirectional Streaming are demonstrated in this project.

# Running the project
To run the clients and server, first of all build the proto file using command:
```
yarn protogen
```
This will generate the typescript definitions from the proto file.Now, run the server and the client.

## Running the server 
 To run the server, Run command 
 ```
 yarn server
 ```

## Running the client

To run the client, Run command

```
yarn client
```