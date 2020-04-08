

const { ccclass, property } = cc._decorator;
declare let tt: any;
@ccclass
export default class ZiJieRecord extends cc.Component {

    @property(cc.Node)
    btnZiJieRecord: cc.Node = null;
    @property(cc.Label)
    recordTime: cc.Label = null;

    private videoPath: any = null;
    public isInitRecord: boolean = false;
    protected changeListener(enable: boolean): void {

    }

    public onOpen(args) {

    }

    public onClose() {

    }
    private recorTime: number = 0;
    private startRecord: boolean = false;
    public onClickRecord() {
        if (this.videoPath) {
            tt.shareAppMessage({
                channel: "video",
                extra: { videoPath: this.videoPath, videoTopics: ["一起来玩消除怪兽", "新奇有刺激的消除怪兽来啦！"], },
                title: "消除怪兽",
                desc: "超级好玩的消除怪兽小视频",
                // videoPath: res.videoPath,
                success: () => {
                    this.videoPath = null;
                    tt.showToast({
                        title: "分享成功",
                        duration: 2000,
                        success(res) {
                            console.log(`${res}`);
                        },
                        fail(res) {
                            console.log(`showToast调用失败`);
                        }
                    });
                    this.recordTime.string = "";
                },
                fail: (err) => {
                    console.log('[hd_sdk_zijie]----->弹窗', err);
                    this.videoPath = null;
                    this.recordTime.string = "";
                    tt.showToast({
                        title: "分享失败",
                        duration: 2000,
                        success(res) {
                            console.log(`${res}`);
                        },
                        fail(res) {
                            console.log(`showToast调用失败`);
                        }
                    });
                }
            });
            return;
        }
        if (this.startRecord) {
            if (this.recorTime < 5) {
                this.showWxTips('提示', "录制时间需要超过5秒，请稍后", '确定', '取消');
                return;
            }
        }


        this.recordVideo(() => {
            let ingnode = this.btnZiJieRecord.getChildByName("lping");
            ingnode && (ingnode.active = true);
            this.recorTime = 0;
            this.startRecord = true;
            this.recordTime.string = '0s';
            this.schedule(() => {
                this.recorTime++;
                this.recordTime.string = `${this.recorTime}s`;
            }, 1);

        }, (param) => {
            this.unscheduleAllCallbacks();
            this.startRecord = false;
            this.recordTime.string = '录屏完成\n点击分享';
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
                    console.log('[hd_sdk_zijie]----->录制停止事件', res, onStopCallBack, res.videoPath);
                    this.videoPath = res.videoPath;
                    if (onStopCallBack)
                        onStopCallBack(null);
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
                duration: 30,
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
