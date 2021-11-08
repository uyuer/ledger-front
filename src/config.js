let NODE_ENV = process.env.NODE_ENV;
let config = {
    development: {
        serverUrl: 'http://localhost:9601', // 开发环境下登录服务的地址
    },
    test: {
        serverUrl: 'http://localhost:9601',
    },
    production: {
        serverUrl: 'http://localhost:9600',
    },
}
export default config[NODE_ENV]