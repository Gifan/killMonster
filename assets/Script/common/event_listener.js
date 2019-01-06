const EventListenr = function (obj) {
    let that = {};
    obj.on = function (name, method, target) {
        if (!that.hasOwnProperty(name)) {
            that[name] = [];
        }
        var handler = {};
        handler.func = method;
        handler.target = target;
        
        that[name].push(handler);
        // console.log("global on-",name, that);
    };
    obj.fire = function (name) {
        if (that.hasOwnProperty(name)) {
            let handlerList = that[name];
            for (let i = 0; i < handlerList.length; i++) {
                let handler = handlerList[i];
                let args = [];
                for (let j = 1; j < arguments.length; j++) {
                    args.push(arguments[j]);
                }
                if (handler.func)
                    handler.func.apply(handler.target, args);
                else
                    trace("[Warn] 没有对应的回调事件类型 - " + name)

            }
        }
    };
    obj.off = function (name,target) {
        // console.log("try to off "+ name, that)
        if (that.hasOwnProperty(name)) {
            let handlerList = that[name];
            // console.log("try to off "+ name + "have num"+handlerList.length);
            for (let i = 0; i < handlerList.length; i++) {
                let handler = handlerList[i]
                if(handler.target === target){
                    // console.log("delete -" + target + name);
                    handlerList.splice(i,1);
                }
            }
        }
    };
    return obj;
};
export default EventListenr;