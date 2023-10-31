// Original file: protos/weather.proto

import type * as grpc from '@grpc/grpc-js'
import type { MethodDefinition } from '@grpc/proto-loader'
import type { ChatMessage as _weather_ChatMessage, ChatMessage__Output as _weather_ChatMessage__Output } from '../weather/ChatMessage';
import type { ChatResponse as _weather_ChatResponse, ChatResponse__Output as _weather_ChatResponse__Output } from '../weather/ChatResponse';
import type { TemperatureUpdateRequest as _weather_TemperatureUpdateRequest, TemperatureUpdateRequest__Output as _weather_TemperatureUpdateRequest__Output } from '../weather/TemperatureUpdateRequest';
import type { WeatherRequest as _weather_WeatherRequest, WeatherRequest__Output as _weather_WeatherRequest__Output } from '../weather/WeatherRequest';
import type { WeatherResponse as _weather_WeatherResponse, WeatherResponse__Output as _weather_WeatherResponse__Output } from '../weather/WeatherResponse';

export interface WeatherClient extends grpc.Client {
  getTemperatureUpdates(argument: _weather_WeatherRequest, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_weather_WeatherResponse__Output>;
  getTemperatureUpdates(argument: _weather_WeatherRequest, options?: grpc.CallOptions): grpc.ClientReadableStream<_weather_WeatherResponse__Output>;
  getTemperatureUpdates(argument: _weather_WeatherRequest, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_weather_WeatherResponse__Output>;
  getTemperatureUpdates(argument: _weather_WeatherRequest, options?: grpc.CallOptions): grpc.ClientReadableStream<_weather_WeatherResponse__Output>;
  
  getWeatherDetails(argument: _weather_WeatherRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_weather_WeatherResponse__Output>): grpc.ClientUnaryCall;
  getWeatherDetails(argument: _weather_WeatherRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_weather_WeatherResponse__Output>): grpc.ClientUnaryCall;
  getWeatherDetails(argument: _weather_WeatherRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_weather_WeatherResponse__Output>): grpc.ClientUnaryCall;
  getWeatherDetails(argument: _weather_WeatherRequest, callback: grpc.requestCallback<_weather_WeatherResponse__Output>): grpc.ClientUnaryCall;
  getWeatherDetails(argument: _weather_WeatherRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_weather_WeatherResponse__Output>): grpc.ClientUnaryCall;
  getWeatherDetails(argument: _weather_WeatherRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_weather_WeatherResponse__Output>): grpc.ClientUnaryCall;
  getWeatherDetails(argument: _weather_WeatherRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_weather_WeatherResponse__Output>): grpc.ClientUnaryCall;
  getWeatherDetails(argument: _weather_WeatherRequest, callback: grpc.requestCallback<_weather_WeatherResponse__Output>): grpc.ClientUnaryCall;
  
  updateTemperature(metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_weather_WeatherResponse__Output>): grpc.ClientWritableStream<_weather_TemperatureUpdateRequest>;
  updateTemperature(metadata: grpc.Metadata, callback: grpc.requestCallback<_weather_WeatherResponse__Output>): grpc.ClientWritableStream<_weather_TemperatureUpdateRequest>;
  updateTemperature(options: grpc.CallOptions, callback: grpc.requestCallback<_weather_WeatherResponse__Output>): grpc.ClientWritableStream<_weather_TemperatureUpdateRequest>;
  updateTemperature(callback: grpc.requestCallback<_weather_WeatherResponse__Output>): grpc.ClientWritableStream<_weather_TemperatureUpdateRequest>;
  updateTemperature(metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_weather_WeatherResponse__Output>): grpc.ClientWritableStream<_weather_TemperatureUpdateRequest>;
  updateTemperature(metadata: grpc.Metadata, callback: grpc.requestCallback<_weather_WeatherResponse__Output>): grpc.ClientWritableStream<_weather_TemperatureUpdateRequest>;
  updateTemperature(options: grpc.CallOptions, callback: grpc.requestCallback<_weather_WeatherResponse__Output>): grpc.ClientWritableStream<_weather_TemperatureUpdateRequest>;
  updateTemperature(callback: grpc.requestCallback<_weather_WeatherResponse__Output>): grpc.ClientWritableStream<_weather_TemperatureUpdateRequest>;
  
  weatherChat(metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientDuplexStream<_weather_ChatMessage, _weather_ChatResponse__Output>;
  weatherChat(options?: grpc.CallOptions): grpc.ClientDuplexStream<_weather_ChatMessage, _weather_ChatResponse__Output>;
  weatherChat(metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientDuplexStream<_weather_ChatMessage, _weather_ChatResponse__Output>;
  weatherChat(options?: grpc.CallOptions): grpc.ClientDuplexStream<_weather_ChatMessage, _weather_ChatResponse__Output>;
  
}

export interface WeatherHandlers extends grpc.UntypedServiceImplementation {
  getTemperatureUpdates: grpc.handleServerStreamingCall<_weather_WeatherRequest__Output, _weather_WeatherResponse>;
  
  getWeatherDetails: grpc.handleUnaryCall<_weather_WeatherRequest__Output, _weather_WeatherResponse>;
  
  updateTemperature: grpc.handleClientStreamingCall<_weather_TemperatureUpdateRequest__Output, _weather_WeatherResponse>;
  
  weatherChat: grpc.handleBidiStreamingCall<_weather_ChatMessage__Output, _weather_ChatResponse>;
  
}

export interface WeatherDefinition extends grpc.ServiceDefinition {
  getTemperatureUpdates: MethodDefinition<_weather_WeatherRequest, _weather_WeatherResponse, _weather_WeatherRequest__Output, _weather_WeatherResponse__Output>
  getWeatherDetails: MethodDefinition<_weather_WeatherRequest, _weather_WeatherResponse, _weather_WeatherRequest__Output, _weather_WeatherResponse__Output>
  updateTemperature: MethodDefinition<_weather_TemperatureUpdateRequest, _weather_WeatherResponse, _weather_TemperatureUpdateRequest__Output, _weather_WeatherResponse__Output>
  weatherChat: MethodDefinition<_weather_ChatMessage, _weather_ChatResponse, _weather_ChatMessage__Output, _weather_ChatResponse__Output>
}
