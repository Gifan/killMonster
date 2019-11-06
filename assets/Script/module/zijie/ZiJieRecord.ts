

const { ccclass, property } = cc._decorator;
declare let tt: any;
@ccclass
export default class ZiJieRecord extends cc.Component {

    @property(cc.Node)
    btnZiJieRecord: cc.Node = null;

    public isInitRecord: boolean = false;
    protected changeListener(enable: boolean): void {

    }

    public onOpen(args) {

    }

    public onClose() {

    }

    public onClickRecord() {
        this.recordVideo(() => {
            let ingnode = this.btnZiJieRecord.getChildByName("lping");
            ingnode && (ingnode.active = true);
        }, (param) => {
            let ingnode = this.btnZiJieRecord.getChildByName("lping");
            ingnode && (ingnode.active = false);
        })
    }

    /** 
     * 微信提示框 没有 cancelText 则只显示一个按钮
    */
    public showWxTips(title: string, content: string, okText: string = "确定", cancelText?: string, success?: any) {
        let showCancel = Boolean(cancelText);
        let tipsData = {
            title: title,
            content: content,
            showCancel: showCancel,
            confirmText: okText,
            cancelText: cancelText,
            success: success
        }
        tt.showModal(tipsData);
    }

    private stopcb: Function = null;
    recordVideo(onStartCallBack?: Function, onStopCallBack?: Function) {
        this.stopcb = onStopCallBack;
        let self = this;
        let authCamera = (suc) => {
            //console.log('[hd_sdk_zijie]----->询问授权摄像机');
            tt.authorize({
                scope: 'scope.camera',
                success: suc,
                fail: () => {
                    this.showWxTips('提示', '请授权访问相册', '确定', '取消', (res) => {
                        //console.log('[hd_sdk_zijie]----->提示框', res);
                        if (res.confirm) {
                            tt.openSetting({
                                success: (res) => {
                                    //console.log('[hd_sdk_zijie]----->打开授权设置', res);
                                }
                            });
                        }
                    });
                }
            })
        }

        let record = () => {
            if (!self.isInitRecord) {
                self.isInitRecord = true;
                const recorder = tt.getGameRecorderManager();
                //console.log('[hd_sdk_zijie]----->注册录屏事件');
                recorder.onStart((res) => {
                    //console.log('[hd_sdk_zijie]----->录制开始事件', res);
                    if (onStartCallBack)
                        onStartCallBack();
                    // recorder.recordClip({
                    //     timeRange: [3, 3]
                    // })
                });

                recorder.onStop((res) => {
                    self.isRecordVideo = false;
                    // console.log('[hd_sdk_zijie]----->录制停止事件', res, onStopCallBack);
                    if (onStopCallBack)
                        onStopCallBack(null);
                    tt.shareVideo({
                        videoPath: res.videoPath,
                        success: () => {
                            if (this.stopcb)
                                this.stopcb(1);
                        },
                        fail: (err) => {
                            // console.log('[hd_sdk_zijie]----->弹窗');
                            this.showWxTips('提示', '分享视频已取消', '确定', '取消', (res) => {

                            });
                            if (this.stopcb)
                                this.stopcb(1);
                        }
                    });

                });
                recorder.onError((res) => {
                    this.isRecordVideo = false;
                    this.showWxTips('提示', '录屏出错' + res, '确定');
                })

                recorder.onInterruptionBegin(res => {
                    console.log('[hd_sdk_zijie]----->录制视频中断开始');
                    if (self.isRecordVideo) recorder.pause();
                })

                recorder.onInterruptionEnd(res => {
                    console.log('[hd_sdk_zijie]----->录制视频中断结束');
                    if (self.isRecordVideo) recorder.resume();
                })
            }
            if (!self.isRecordVideo) {
                self.recordVideoStart();
            } else {
                self.recordVideoStop();
            }
            self.isRecordVideo = !self.isRecordVideo;
            console.log('[hd_sdk_zijie]----->正在录制', self.isRecordVideo);
        }

        authCamera(() => {
            record();
        });
    }

    /** 录屏开始 */
    public recordVideoStart() {
        const recorder = tt.getGameRecorderManager();
        //console.log('[hd_sdk_zijie]----->开始录制', recorder.onStart);
        if (recorder) {
            recorder.start({
                // microphoneEnabled: false,
                duration: 120,
            });
        } else {
            console.log('[hd_sdk_zijie]----->tt.getGameRecorderManager()返回值为空');
        }
    }

    /** 录屏停止 */
    public recordVideoStop() {
        const recorder = tt.getGameRecorderManager();
        //console.log('[hd_sdk_zijie]----->停止录制', recorder);
        if (recorder) {
            recorder.stop();
        } else {
            console.log('[hd_sdk_zijie]----->tt.getGameRecorderManager()返回值为空');
        }
    }
    /** 是否在录制 */
    public isRecordVideo: boolean = false;

    /** 是否正在录屏状态 */
    public getIsRecord() {
        return this.isRecordVideo;
    }
    public isHaveVideo: boolean = true;
    public getIsHaveVideo(): boolean {
        return this.isHaveVideo;
    }
    update(dt) { }
}