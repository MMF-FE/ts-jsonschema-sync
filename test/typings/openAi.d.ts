declare module API {
    /** open ai */
    namespace openAi {
        /**
         * 代理设置
         */
        interface IProxy {
            host: string
            ip: string
            useIp: boolean
            active: boolean
            createdat: Date
            updatedat: Date
        }
    }
}