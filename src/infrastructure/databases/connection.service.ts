import { Initializer, Destructor, Service } from 'fastify-decorators';
import { DataSource } from 'typeorm';

@Service()
export default class ConnectionService {
    private _dataSource = new DataSource({
        type: "mysql",
        host: "localhost",
        port: 3306,
        username: "server",
        password: "staging",
        database: "app",
        entities: ['dist/**/*.entity.js'],
        // logging: true,
        synchronize: true
    })

    get DataSource(): DataSource {
        return this._dataSource;
    }

    @Initializer()
    async init(): Promise<void> {
            await this._dataSource.initialize();
    }
  
    @Destructor()
    async destroy(): Promise<void> {
        await this._dataSource.destroy();
    }
}