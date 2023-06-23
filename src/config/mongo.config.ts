import { ConfigService } from '@nestjs/config';
import { TypegooseModuleOptions } from 'nestjs-typegoose';

export const getMongoConfig = (
  configService: ConfigService,
): Promise<TypegooseModuleOptions> | TypegooseModuleOptions => ({
  uri: getMongoConnectionString(configService),
  ...getMongoConnectionOptions(),
});

// mongodb://[username:password@]host1[:port1][,...hostN[:portN]][/[defaultauthdb][?options]]

const getMongoConnectionString = (configService: ConfigService) => {
  return (
    'mongodb://' +
    configService.get('MONGO_LOGIN') +
    ':' +
    configService.get('MONGO_PASSWORD') +
    '@' +
    configService.get('MONGO_HOST') +
    ':' +
    configService.get('MONGO_PORT') +
    '/' +
    configService.get('MONGO_AUTHDATABASE')
  );
};

const getMongoConnectionOptions = () => ({
  useNewUrlParser: true,
  useUnifiedTopology: true,
  autoIndex: true,
});
