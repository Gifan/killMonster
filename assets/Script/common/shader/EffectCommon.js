var _default_vert = require("ccShader_Default_Vert");
var _default_vert_no_mvp = require("ccShader_Default_Vert_noMVP");
var _wave = require("ccShader_wave");


var Utils = require("Utils");
cc.Class({
    extends: cc.Component,

    properties: {
    },

    onLoad: function () {
        var self = this;
        this.parameters = {
            time: 0.0,
            mouse: {
                x: 0.5,
                y: 0.5,
            },
            resolution: {
                x: 0.0,
                y: 0.0,
            },
            wavewidth: 6 / 108,
        };
        this.node.on(cc.Node.EventType.TOUCH_END, function (event) {
            let delta = event.touch.getLocation();
            delta = this.node.convertToNodeSpace(delta);
            this.parameters.mouse.x = delta.x / this.node.getContentSize().width;
            this.parameters.mouse.y = delta.y / this.node.getContentSize().height;
            // console.log(this.parameters.mouse);
            this.parameters.time = 0.0;
            this.parameters.wavewidth = 40 / this.node.getContentSize().width;
            this.showWave();
        }, this);
        this._show_wave = false;
        self._use();

    },

    showWave() {
        this._show_wave = true;
    },

    update: function (dt) {
        if (this._program && this._show_wave) {
            this._program.use();
            this.updateGLParameters(dt);
            if (cc.sys.isNative) {
                var glProgram_state = cc.GLProgramState.getOrCreateWithGLProgram(this._program);
                glProgram_state.setUniformFloat("time", this.parameters.time);
                glProgram_state.setUniformVec2("mouse", this.parameters.mouse);
            } else {
                // this._program.setUniformLocationWith2f(this._resolution, this.parameters.resolution.x, this.parameters.resolution.y);
                this._program.setUniformLocationWith1f(this._time, this.parameters.time);
                this._program.setUniformLocationWith2f(this._mouse, this.parameters.mouse.x, 1.0-this.parameters.mouse.y);
            }
        }
    },
    
    updateGLParameters(dt) {
        this.parameters.time += dt;
        // console.log(this.parameters.time)
        // if (this.parameters.time >= 0.1) this._show_wave = false;
    },

    _use: function () {
        this._program = new cc.GLProgram();
        if (cc.sys.isNative) {
            cc.log("use native GLProgram");
            this._program.initWithString(_default_vert_no_mvp, _wave);
            this._program.addAttribute(cc.macro.ATTRIBUTE_NAME_POSITION, cc.macro.VERTEX_ATTRIB_POSITION);
            this._program.addAttribute(cc.macro.ATTRIBUTE_NAME_COLOR, cc.macro.VERTEX_ATTRIB_COLOR);
            this._program.addAttribute(cc.macro.ATTRIBUTE_NAME_TEX_COORD, cc.macro.VERTEX_ATTRIB_TEX_COORDS);

            this._program.link();
            this._program.updateUniforms();
        } else {

            this._program.initWithVertexShaderByteArray(_default_vert, _wave);
            this._program.addAttribute(cc.macro.ATTRIBUTE_NAME_POSITION, cc.macro.VERTEX_ATTRIB_POSITION);
            this._program.addAttribute(cc.macro.ATTRIBUTE_NAME_COLOR, cc.macro.VERTEX_ATTRIB_COLOR);
            this._program.addAttribute(cc.macro.ATTRIBUTE_NAME_TEX_COORD, cc.macro.VERTEX_ATTRIB_TEX_COORDS);

            this._program.link();
            this._program.updateUniforms();
        }

        if (cc.sys.isNative) {
            var glProgram_state = cc.GLProgramState.getOrCreateWithGLProgram(this._program);
            glProgram_state.setUniformFloat("time", this.parameters.time);
            glProgram_state.setUniformVec2("mouse", this.parameters.mouse);
        } else {
            this._time = this._program.getUniformLocationForName("time");
            this._mouse = this._program.getUniformLocationForName("mouse");
            this._program.setUniformLocationWith1f(this._time, this.parameters.time);
            this._program.setUniformLocationWith2f(this._mouse, this.parameters.mouse.x, this.parameters.mouse.y);
        }

        this.setProgram(this.node._sgNode, this._program);
    },

    setProgram: function (node, program) {
        if (cc.sys.isNative) {
            var glProgram_state = cc.GLProgramState.getOrCreateWithGLProgram(program);
            node.setGLProgramState(glProgram_state);
        } else {
            node.setShaderProgram(program);
        }

        var children = node.children;
        if (!children)
            return;

        for (var i = 0; i < children.length; i++)
            this.setProgram(children[i], program)
    }

});
