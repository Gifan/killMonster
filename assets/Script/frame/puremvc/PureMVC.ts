/**
 * PureMVC Standard Framework for TypeScript - Copyright © 2012 Frederic Saunier
 * PureMVC Framework - Copyright © 2006-2012 Futurescale, Inc.
 * All rights reserved.
 * modify by jianfen wu
 */
module PureMVC {
    "use strict";
    export interface INotifier {
        sendNotification(name: string, args?: any): void;
    }

    export interface IObserver {
        name: string;
        caller: Object;
        method: Function;
        priority: number;
        receiveOnce: boolean;
    }

    export interface ICommand extends INotifier {
        execute(...args: Array<any>): void;
    }

    export interface IProxy extends INotifier {
        getProxyName(): string;
        onRegister(): void;
        onRemove(): void;
        setData(data: any): void;
        getData(): any;
    }
    export interface IMediator extends INotifier {
        getMediatorName(): string;
        getViewComponent(): any;
        listNotificationInterests(): void;
        removeNotificationInterests(): void;
        handleNotification(name: string, method: Function): void;
        onRegister(): void;
        onRemove(): void;
    }

    export interface IController {
        executeCommand(name: string, args: any): void;
        registerCommand(name: string, cls: new () => ICommand): void;
        removeCommand(name: string): void;
        retrieveCommand(name: string): new () => ICommand;
        hasCommand(name: string): boolean;
    }

    export interface IModel {
        registerProxy(proxy: IProxy): void;
        removeProxy(name: string): void;
        retrieveProxy(name: string): IProxy;
        hasProxy(name: string): boolean;
    }

    export interface IView {
        registerObserver(name: string, method: Function, caller: Object, priority?: number): IObserver;
        removeObserver(name: string, method: Function, caller: Object): void;
        notifyCancel(): void;
        notifyObservers(name: string, args?: any): void;
        registerMediator(mediator: IMediator): void;
        removeMediator(name: string): void;
        retrieveMediator(name: string): IMediator;
        hasMediator(name: string): boolean;
    }

    export interface IFacade {
        registerObserver(name: string, method: Function, caller: Object, priority?: number): void;
        removeObserver(name: string, method: Function, caller: Object): void;
        registerCommand(name: string, cls: new () => ICommand): void;
        removeCommand(name: string): void;
        hasCommand(name: string): boolean;
        registerProxy(proxy: IProxy): void;
        removeProxy(name: string): void;
        retrieveProxy(name: string): IProxy;
        hasProxy(name: string): boolean;
        registerMediator(mediator: IMediator): void;
        removeMediator(name: string): void;
        retrieveMediator(name: string): IMediator;
        hasMediator(name: string): boolean;
        sendNotification(name: string, args?: any): void;
        notifyCancel(): void;
    }

    export class Observer implements IObserver {
        name: string;
        caller: Object;
        method: Function;
        priority: number;
        receiveOnce: boolean;
    }

    export class Notifier {
        protected facade: IFacade;

        constructor() {
            this.facade = Facade.getInstance();
        }

        sendNotification(name: string, args?: any): void {
            this.facade.sendNotification(name, args);
        }
    }

    export class Proxy extends Notifier implements IProxy {
        private proxyName: string;

        protected data: any;

        constructor(name: string, data?: any) {
            super();
            if (name === void 0) {
                throw Error("Invalid Proxy Name");
            }
            this.proxyName = name;
            if (data !== void 0) {
                this.data = data;
            }
        }

        getProxyName(): string {
            return this.proxyName || null;
        }

        onRegister(): void {
        }

        onRemove(): void {
        }

        setData(data: any): void {
            this.data = data;
        }

        getData(): any {
            return this.data;
        }
    }

    export class Controller implements IController {
        static readonly SINGLETON_MSG: string = "Controller singleton already constructed!";
        static inst: IController = null;

        private commands: { [name: string]: new () => ICommand } = {};

        constructor() {
            if (Controller.inst !== null) {
                throw Error(Controller.SINGLETON_MSG);
            }
            Controller.inst = this;
        }

        executeCommand(name: string, args: any): void {
            const cls: new () => ICommand = this.commands[name];
            const command: ICommand = new cls();
            if (args === void 0) {
                command.execute.call(command);
            }
            else if (args instanceof Array) {
                command.execute.apply(command, args);
            }
            else {
                command.execute.call(command, args);
            }
        }

        registerCommand(name: string, cls: new () => ICommand): void {
            if (this.hasCommand(name) === true) {
                throw Error("Register Duplicate Command " + name);
            }
            this.commands[name] = cls;
            View.inst.registerObserver(name, this.executeCommand, this);
        }

        removeCommand(name: string): void {
            if (this.hasCommand(name) === false) {
                throw Error("Remove Non-Existent Command " + name);
            }
            delete this.commands[name];
            View.inst.removeObserver(name, this.executeCommand, this);
        }

        retrieveCommand(name: string): new () => ICommand {
            return this.commands[name] || null;
        }

        hasCommand(name: string): boolean {
            return this.retrieveCommand(name) != null;
        }
    }

    export class Model implements IModel {
        static readonly SINGLETON_MSG: string = "Model singleton already constructed!";
        static inst: IModel = null;

        private proxies: { [name: string]: IProxy } = {};

        constructor() {
            if (Model.inst !== null) {
                throw Error(Model.SINGLETON_MSG);
            }
            Model.inst = this;
        }

        registerProxy(proxy: IProxy): void {
            const name: string = proxy.getProxyName();
            if (name === null) {
                throw Error("Register Invalid Proxy");
            }
            if (this.hasProxy(name) === true) {
                throw Error("Register Duplicate Proxy " + name);
            }
            this.proxies[name] = proxy;
            proxy.onRegister();
        }

        removeProxy(name: string): void {
            if (name === void 0) {
                throw Error("Remove Invalid Proxy");
            }
            const proxy: IProxy = this.retrieveProxy(name);
            if (proxy === null) {
                throw Error("Remove Non-Existent Proxy " + name);
            }
            delete this.proxies[name];
            proxy.onRemove();
        }

        retrieveProxy(name: string): IProxy {
            return this.proxies[name] || null;
        }

        hasProxy(name: string): boolean {
            return this.retrieveProxy(name) != null;
        }
    }

    export class View implements IView {
        static readonly SINGLETON_MSG: string = "View singleton already constructed!";
        static inst: IView = null;

        private mediators: { [name: string]: IMediator } = {};
        private observers: { [name: string]: Array<boolean | IObserver> } = {};

        private isCanceled: boolean = false;
        private onceObservers: Array<IObserver> = [];

        constructor() {
            if (View.inst !== null) {
                throw Error(View.SINGLETON_MSG);
            }
            View.inst = this;
        }

        /**
         * @receiveOnce: 是否只响应一次，默认为false
         * @priority: 优先级，优先响应级别高的消息，值越大，级别越高，默认为1
         */
        registerObserver(name: string, method: Function, caller: Object, priority: number = 1): IObserver {
            if (name === void 0) {
                throw Error("Register Invalid Observer");
            }
            if (method === void 0) {
                throw Error("Register Invalid Observer Method");
            }
            let observers: Array<boolean | IObserver> = this.observers[name];
            // 若列表不存在，则新建
            if (observers === void 0) {
                observers = this.observers[name] = [false];
            }
            // 若当前禁止直接更新，则复制列表
            else if (observers[0] === true) {
                observers = this.observers[name] = observers.concat();
                // 新生成的列表允许被更新
                observers[0] = false;
            }

            let index: number = -1;
            for (let i: number = 1; i < observers.length; i++) {
                const observer: IObserver = observers[i] as IObserver;
                if (observer.method === method && observer.caller === caller) {
                    return null;
                }
                // 优先级高的命令先执行
                if (index === -1 && observer.priority < priority) {
                    index = i;
                }
            }

            const observer: IObserver = new Observer();
            observer.name = name;
            observer.caller = caller;
            observer.method = method;
            observer.priority = priority;
            if (index < 0) {
                observers.push(observer);
            }
            else {
                observers.splice(index, 0, observer);
            }
            return observer;
        }

        removeObserver(name: string, method: Function, caller: Object): void {
            if (name === void 0) {
                throw Error("Remove Invalid Observer");
            }
            if (method === void 0) {
                throw Error("Remove Invalid Observer Method");
            }
            let observers: Array<boolean | IObserver> = this.observers[name];
            // 无此类事件
            if (observers === void 0) {
                return;
            }
            // 若当前禁止直接更新，则复制列表
            if (observers[0] === true) {
                observers = this.observers[name] = observers.concat();
                // 新生成的列表允许被更新
                observers[0] = false;
            }
            for (let i: number = 1; i < observers.length; i++) {
                const observer: IObserver = observers[i] as IObserver;
                if (observer.method === method && observer.caller === caller) {
                    observers.splice(i, 1);
                    break;
                }
            }
            // 移除空列表
            if (observers.length === 1) {
                delete this.observers[name];
            }
        }

        notifyCancel(): void {
            this.isCanceled = true;
        }

        notifyObservers(name: string, args?: any): void {
            if (name === void 0) {
                throw Error("Notify Invalid Command");
            }
            const observers: Array<boolean | IObserver> = this.observers[name];
            // 无此类事件
            if (observers === void 0) {
                return;
            }
            // 标记禁止更新
            observers[0] = true;

            for (let i: number = 1; i < observers.length; i++) {
                const observer: IObserver = observers[i] as IObserver;
                if (observer.caller === Controller.inst) {
                    observer.method.call(observer.caller, name, args);
                }
                else if (args === void 0) {
                    observer.method.call(observer.caller);
                }
                else if (args instanceof Array) {
                    observer.method.apply(observer.caller, args);
                }
                else {
                    observer.method.call(observer.caller, args);
                }
            }
            // 标记允许直接更新
            observers[0] = false;
        }

        registerMediator(mediator: IMediator): void {
            const name: string = mediator.getMediatorName();
            if (name === null) {
                throw Error("Register Invalid Mediator");
            }
            if (this.hasMediator(name) === true) {
                throw Error("Register Duplicate Mediator " + name);
            }
            this.mediators[name] = mediator;
            mediator.listNotificationInterests();
            mediator.onRegister();
        }

        removeMediator(name: string): void {
            if (name === void 0) {
                throw Error("Remove Invalid Mediator");
            }
            const mediator: IMediator = this.retrieveMediator(name);
            if (mediator === null) {
                throw Error("Remove Non-Existent Mediator " + name);
            }
            delete this.mediators[name];
            mediator.removeNotificationInterests();
            mediator.onRemove();
        }

        retrieveMediator(name: string): IMediator {
            return this.mediators[name] || null;
        }

        hasMediator(name: string): boolean {
            return this.retrieveMediator(name) != null;
        }
    }

    export class Mediator extends Notifier implements IMediator {
        private mediatorName: string;
        private notificationInterests: Array<IObserver> = [];

        protected viewComponent: any;

        constructor(name: string, viewComponent?: any) {
            super();
            if (name === void 0) {
                throw Error("Invalid Mediator Name");
            }
            if (viewComponent === void 0) {
                throw Error("Invalid View Component");
            }
            this.mediatorName = name;
            if (viewComponent !== void 0) {
                this.viewComponent = viewComponent;
            }
        }

        getMediatorName(): string {
            return this.mediatorName || null;
        }

        getViewComponent(): any {
            return this.viewComponent;
        }

        listNotificationInterests(): void {
        }

        removeNotificationInterests(): void {
            for (let i: number = 0; i < this.notificationInterests.length; i++) {
                const observer: IObserver = this.notificationInterests[i];
                View.inst.removeObserver(observer.name, observer.method, observer.caller);
            }
        }

        handleNotification(name: string, method: Function): void {
            const observer: IObserver = View.inst.registerObserver(name, method, this);
            observer && this.notificationInterests.push(observer);
        }

        onRegister(): void {
        }

        onRemove(): void {
        }
    }

    export class Facade implements IFacade {
        static readonly SINGLETON_MSG: string = "Facade singleton already constructed!";
        static inst: IFacade = null;

        static getInstance(): IFacade {
            if (Facade.inst === null) {
                Facade.inst = new Facade();
            }
            return Facade.inst;
        }

        private view: IView = new View();
        private model: IModel = new Model();
        private controller: IController = new Controller();

        constructor() {
            if (Facade.inst !== null) {
                throw Error(Facade.SINGLETON_MSG);
            }
            Facade.inst = this;
            this.initializeFacade();
        }

        private initializeFacade(): void {
            this.initializeModel();
            this.initializeView();
            this.initializeController();
        }

        protected initializeModel(): void {

        }

        protected initializeView(): void {

        }

        protected initializeController(): void {

        }

        registerObserver(name: string, method: Function, caller: Object, priority?: number): void {
            this.view.registerObserver(name, method, caller, priority);
        }

        removeObserver(name: string, method: Function, caller: Object): void {
            this.view.removeObserver(name, method, caller);
        }

        registerCommand(name: string, cls: new () => ICommand): void {
            this.controller.registerCommand(name, cls);
        }

        removeCommand(name: string): void {
            this.controller.removeCommand(name);
        }

        hasCommand(name: string): boolean {
            return this.controller.hasCommand(name);
        }

        registerProxy(proxy: IProxy): void {
            this.model.registerProxy(proxy);
        }

        removeProxy(name: string): void {
            this.model.removeProxy(name);
        }

        retrieveProxy(name: string): IProxy {
            return this.model.retrieveProxy(name);
        }

        hasProxy(name: string): boolean {
            return this.model.hasProxy(name);
        }

        registerMediator(mediator: IMediator): void {
            this.view.registerMediator(mediator);
        }

        removeMediator(name: string): void {
            this.view.removeMediator(name);
        }

        retrieveMediator(name: string): IMediator {
            return this.view.retrieveMediator(name);
        }

        hasMediator(name: string): boolean {
            return this.view.hasMediator(name);
        }

        sendNotification(name: string, args?: any): void {
            this.view.notifyObservers(name, args);
        }

        notifyCancel(): void {
            this.view.notifyCancel();
        }
    }

    export abstract class MacroCommand extends Notifier implements ICommand {
        private commands: Array<new () => ICommand> = [];

        constructor() {
            super();
            this.initializeMacroCommand();
        }

        abstract initializeMacroCommand(): void;

        addSubCommand(cls: new () => ICommand): void {
            this.commands.push(cls);
        }

        execute(): void {
            for (let i: number = 0; i < this.commands.length; i++) {
                const cls: new () => ICommand = this.commands[i];
                const command: ICommand = new cls();
                command.execute.apply(command, arguments);
            }
        }
    }

    export abstract class SimpleCommand extends Notifier implements ICommand {

        abstract execute(...args: Array<any>): void;
    }
}
