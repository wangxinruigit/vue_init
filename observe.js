class Dep {
    constructor() {
        this.subs = []
    }

    //收集观察者
    addSub(watcher) {
        this.subs.push(watcher)
    }

    //通知观察者去更新
    notify() {
        this.subs.forEach(w => {
            w.update()
        })
    }
}

class Wather {
    constructor(vm, expr, cb) {
        this.vm = vm
        this.expr = expr
        this.cb = cb
        this.oldVal = this.getOldVal()
    }

    getOldVal() {
        Dep.target = this
        const oldVal = compileUtil.getVal(this.expr, this.vm)
        Dep.target = null
        return oldVal
    }

    update() {
        const newVal = compileUtil.getVal(this.expr, this.vm)
        if (newVal !== this.oldVal) {
            this.cb(newVal)
        }

    }

}


class Observe {
    constructor(data) {
        this.observe(data)
        console.log(11111111)
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
        /*  {
              person:{
                      name:'王兴锐',
                      age:'18',
                      fav:'姑娘'
              },
              msg:'学习MVVM的V-TEXT原理',
              htmlStr:'<h1>学习MVVM的V-HTML原理</h1>'
          }*/
        if (data && typeof data === 'object') {
            Object.keys(data).forEach(key => {
                this.defineReactive(data, key, data[key])
            })
        }
    }

    defineReactive(obj, key, value) {
        // console.log(Dep.target)
        // console.log(value)
        //递归遍历
        this.observe(value)
        // console.log(111)
        const dep = new Dep()
        Object.defineProperty(obj, key, {
            enumerable: true,
            configurable: false,
            get() {
                // console.log(Dep.target)
                Dep.target && dep.addSub(Dep.target)
                return value
            },
            set: (newVal) => {
                this.observe(newVal)
                if (newVal !== value) {
                    value = newVal
                    dep.notify()
                }
            }
        })
    }
}