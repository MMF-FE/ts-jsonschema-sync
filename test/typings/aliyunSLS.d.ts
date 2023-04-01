/**
 * @author huangrongfa
 * @date 2022-04-20 17:06
 * @since 1.0.0
 * 注释说明
 * @minimum 最小值
 * @maximum 最大值
 *
 * @minItems 数组最小数量
 * @maxItems 数组最大数量
 *
 * @minLength 最小长度
 * @maxLength 最大长度
 *
 * @pattern 正则, 如: ^[A-Za-z0-9]+$
 *
 * @default 默认值
 *
 */
declare module API {
    namespace aliyunSLS {

        interface ReqWriteLog {
            projectName: string
            logStoreName: string
            logs: any[]
        }

        interface ReqLogList {
            projectName?: string
            logStoreName?: string
            /**
             * 时间缀 秒
             */
            from: number
            /**
             * 时间缀 秒
             */
            to: number
            /**
             * 指定日志主题
             */
            topic?: string
            /**
             * 查询的关键词,不输入关键词,则查询全部日志数据
             */
            query?: string
            /**
             * 读取的行数,默认值为 100,取值范围为 0-100
             * @default 100
             * @minimum 0
             * @maximum 100
             */
            line?: number
            /**
             * 读取起始位置,默认值为 0,取值范围>0
             * @default 0
             * @minimum 0
             */
            offset?: number
        }

        /**
         * 小程序日志
         */
        interface ResMinAppLog {
            _id: string
            client_ip: string
            receive_time: string
            // date: string
            province: string
            city: string
            isp: string
            uid?: string
            env: string
            version: string
            taro_env: string
            os: string
            os_type: string
            t: string
            custom: {
                user_phone: string
                user_id: string
                user_name: string
                salon_id: string
                zone: string
            }
            page: {
                host?: string
                target?: string
                options?: string
            }
            log?: {
                order_params?: string
                checkout_from?: string
                api?: string
            }
        }

        interface ReqMinAppLogList {
            /**
             * 查询的关键词,不输入关键词,则查询全部日志数据
             */
            query?: string
            /**
             * 时间缀 秒
             */
            from?: number
            /**
             * 时间缀 秒
             */
            to?: number

            env?: 'dev' | 'sit' | 'prd'

            /**
             * 所有分区 z0 | z1 | z2 | z6 | z99
             */
            zone: string

            /**
             * 门店 id
             */
            salonId?: string | number

            /**
             * 手机号
             */
            mobile?: string

            /**
             * 所在平台
             */
            taroEnv: 'weapp' | 'alipay' | 'h5' | 'tt'

            /**
             * 读取的行数,默认值为 100,取值范围为 0-100
             * @default 100
             * @minimum 0
             * @maximum 100
             */
            line?: number
            /**
             * 读取起始位置,默认值为 0,取值范围>0
             * @default 0
             * @minimum 0
             */
            offset?: number
        }
    }
}
