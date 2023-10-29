rm -r protos/ts
yarn proto-loader-gen-types --grpcLib=@grpc/grpc-js --outDir=protos/ts/ protos/*.proto