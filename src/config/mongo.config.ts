import { ConfigService } from '@nestjs/config';
import { TypegooseModuleOptions } from 'nestjs-typegoose';

export const getMongoConfig = (
  configService: ConfigService,
): Promise<TypegooseModuleOptions> | TypegooseModuleOptions => ({
  uri: getMongoConnectionString(configService),
  ...getMongoConnectionOptions(),
});

const getMongoConnectionString = (configService: ConfigService) => {
  const port = configService.get('ENVIRONMENT') === 'staging' ? '' : ':' + configService.get('MONGO_PORT');

  const connectionURL = 'mongodb://' + configService.get('MONGO_LOGIN') + ':' + configService.get('MONGO_PASSWORD') + '@' + configService.get('MONGO_HOST') + port + '/' + configService.get('MONGO_DB_NAME');

  console.log(connectionURL);

  return connectionURL;
};

const getMongoConnectionOptions = () => ({
  useNewUrlParser: true,
  useUnifiedTopology: true,
  autoIndex: true,
});
