/**
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
 * @pattern 正则 如: ^[A-Za-z0-9]+$
 *
 * @default 默认值
 *
 */
declare module API {
    interface ErrorRes {
        message: string
    }

    /**
    * 分页基类
    */
    interface ResPageListBase {
        /**
         * 总数量
         */
        total: number

        /**
         * 当前页数
         */
        page: number

        /**
         * 每页大少
         */
        pageSize: number

    }

    /**
     * 分页请求
     */
    interface ReqPageListBase {
        /**
         * @minimum 1
         */
        page?: number

        /**
         * @maximum 1000
         */
        pageSize?: number
    }

    /**
     * model 的基础属性
     */
    interface ModelBase {
        /** 创建时间 */
        createAt: Date,
        /** 更新时间 */
        updateAt: Date
    }
}
