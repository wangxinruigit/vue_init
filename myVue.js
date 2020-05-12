
const compileUtil={
    getVal(expr,vm){
        return expr.split('.').reduce((data,currentVal)=>{
            return data[currentVal]
        },vm.$data)
    },
    text(node,expr,vm){ //person.name
        let value;
        if (expr.indexOf('{{')!== -1){
            value=expr.replace(/\{\{(.+?)\}\}/g,(...arg)=>{
                // console.log(args)
                return this.getVal(arg[1],vm);
            })
        }else {
            value=this.getVal(expr,vm);
        }
        this.updater.textUpdater(node,value)
    },
    html(node,expr,vm){
        const value=this.getVal(expr,vm);
        this.updater.htmlUpdater(node,value)
    },
    model(node,expr,vm){
        const value=this.getVal(expr,vm);
        this.updater.modelUpdater(node,value)
    },
    on(node,expr,vm,eventName){
        let fn=vm.$options.method&&vm.$options.method[expr];
        node.addEventListener(eventName,fn,false)
    },

    updater:{
        textUpdater(node,value){
            node.textContent=value
        },
        htmlUpdater(node,value){
            node.textContent=value
        },
        modelUpdater(node,value){
            node.value=value
        }
    }

}

class compile {
    constructor(el, vm) {
        this.el = this.isElementNode(el) ? el : document.querySelector('#root')
        this.vm = vm
        //1.获取文档碎片对象 放入内存减少页面回流重绘
        const fragment = this.node2Fragment(this.el)
        //2.编译模板
        this.compile(fragment)
        //3.添加到根元素
        this.el.appendChild(fragment)
    }

    compile(fragment) {
        //1.获取子节点
        const childNodes = fragment.childNodes;
        [...childNodes].forEach((child) => {
            // console.log(child,1111)
            if (this.isElementNode(child)) {
                //是元素节点
                //编译元素节点
                // console.log('元素节点', child)
                this.compileElement(child)
            } else {
                // console.log('文本节点', child)
                this.compileText(child)
            }
            if (child.childNodes && child.childNodes.length) {

                this.compile(child)
            }
        })

    }

    compileElement(node) {
        //获取元素节点属性
        // console.log(node,111)
        const attributes = node.attributes;
        // console.log(attributes);
        [...attributes].forEach(attr => {
            // console.log(attr,22222)
            const {name, value} = attr
            if (this.isDirective(name)) { //是一个指令 v-text v-html v-model v-on:click
                const [, directive] =name.split('-') //text html model on:click
                // console.log(directive,'directive')
                const [dirName,eventName]=directive.split(':')
                //更新数据，数据驱动视图
                compileUtil[dirName](node,value,this.vm,eventName)

                node.removeAttribute('v-' + directive)
            }
        })
    }
    compileText(node){
        //{{}}
        // console.log(node.textContent)
        const content=node.textContent
        if (/\{\{(.+?)\}\}/.test(content)) {
            // console.log(content)

            compileUtil['text'](node,content,this.vm)
        }




    }

    isDirective(attrName) {
        return attrName.startsWith('v-')
    }

    isElementNode(node) {
        // console.log(node)
        // console.log(node.nodeType===1)
        return node.nodeType === 1;
    }

    node2Fragment(el) {
        //创建文档碎片
        const f = document.createDocumentFragment()
        let firstChild;
        while (firstChild = el.firstChild) {
            f.appendChild(firstChild)
        }
        return f
    }
}

class myVue {
    constructor(options) {
        this.$el = options.el;
        this.$data = options.data;
        this.$options = options
        if (this.$el) {
            new compile(this.$el, this)
        }
    }
}