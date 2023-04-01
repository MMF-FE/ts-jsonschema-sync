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
    /** 海报管理 */
    namespace posterManage {

        /**
         * 创建模板
         */
        interface ReqTemplate extends Template {}

        /**
         * 模板列表
         */
        interface ResTemplateList extends API.ResPageListBase {
            list: Template[]
        }

        interface ReqList extends API.ReqPageListBase {
            mgUserId?: number
            query?: string
        }


        interface Children {
            type: 'group' | 'text' | 'rect' | 'circle' | 'line' | 'image'
            x: number | 'center'
            y: number | 'center'
            isInput: boolean
            label?: string
            /**
             * image
             */
            width?: number
            height?: number | 'auto'
            url?: string
            isCircular?: boolean // 是否圆角
            /**
             * circle
             */
            r?: number
            lineWidth?: number
            strokeStyle?: string
            /**
             * text
             */
            text?: string
            font?: string // 30px Arial
            color?: string | (number | string)[][]
            orientation?: 'vertical' | 'horizontal'
            rotation?: number // 元素旋转
            maxWidth?: number
            lineHeight?: number
            maxLine?: number
            textAlign?: 'left' | 'center' | 'right'
            shadow?: {
                color: string
                offsetX: number
                offsetY: number
                blur: number
            }

            /**
             * line
             */
            long?: number
            lineCap?: string
            linearGradient?: number[]

            // children?: Children[]
        }

        interface BuildOptions {
            width: number
            height: number
            // children: Children[]
            children: any[]
        }

        /**
         * 模板
         */
        interface Template {
            id?: string
            name: string
            image: string
            /**
             * psd 文件 md5
             */
            key: string
            buildOptions: BuildOptions
        }

    }
}
