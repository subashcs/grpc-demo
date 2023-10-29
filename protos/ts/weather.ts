import type * as grpc from '@grpc/grpc-js';
import type { MessageTypeDefinition } from '@grpc/proto-loader';

import type { WeatherClient as _weather_WeatherClient, WeatherDefinition as _weather_WeatherDefinition } from './weather/Weather';

type SubtypeConstructor<Constructor extends new (...args: any) => any, Subtype> = {
  new(...args: ConstructorParameters<Constructor>): Subtype;
};

export interface ProtoGrpcType {
  weather: {
    ChatMessage: MessageTypeDefinition
    ChatResponse: MessageTypeDefinition
    TemperatureUpdateRequest: MessageTypeDefinition
    Weather: SubtypeConstructor<typeof grpc.Client, _weather_WeatherClient> & { service: _weather_WeatherDefinition }
    WeatherDetails: MessageTypeDefinition
    WeatherRequest: MessageTypeDefinition
    WeatherResponse: MessageTypeDefinition
  }
}

