class Observe {
    constructor(data) {
        this.observe(data)
    }

    observe(data) {
        /* {
                person:{
                    name:'张三',
                    fav:{
                       a:'爱好'
                    }
                }
            }*/
        if (data && typeof data === 'object') {
            Object.keys(data).forEach(key => {
                this.defineReactive(data, key, data[key])
            })

        }
    }

    defineReactive(obj, key, value) {
        //递归遍历
        this.observe(value)
        Object.defineProperty(obj, key, {
            enumerable: true,
            configurable: false,
            get() {
                this.observe(value)
                return value
            },
            set:(newVal)=> {
                this.observe(newVal)
                if (newVal !== value) {
                    value = newVal
                }
            }
        })
    }
}