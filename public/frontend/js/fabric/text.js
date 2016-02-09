_txtSelectionFlag=0;
proFabric.text = {
	parent : proFabric,
    canvas: proFabric.get.canvas(),
    updateUI:function(Object){
        $("#addText").val("");
        $("#addText").val(Object.text);
        $("#fontSize").val(Object.fontSize);
        $("#col-picker").colorpicker("val", Object.fill);
        $( "#FontSize" ).val(Object.fontSize);
        $( "#textfont" ).val(Object.fontFamily);
        _txtSelectionFlag = 1;
        if(Object.fontWeight == 'bold')
        {
            $('#bold').addClass("btn-primary");
        }
        else
        {
            $('#bold').removeClass("btn-primary");
        }
        if(Object.fontStyle == 'italic')
        {
            $('#italic').addClass("btn-primary");
        }
        else
        {
            $('#italic').removeClass("btn-primary");
        }
        if(Object.textDecoration == 'underline')
        {
            $('#underline').addClass("btn-primary");
        }
        else
        {
            $('#underline').removeClass("btn-primary");
        }
        if(Object.textAlign=='left')
        {
            $('#left').addClass("btn-primary");
        }
        else
        {
            $('#right').removeClass("btn-primary");
            $('#center').removeClass("btn-primary");
            $('#justify').removeClass("btn-primary");

        }
        if(Object.textAlign=='center')
        {
            $('#center').addClass("btn-primary");
        }
        else
        {
            $('#left').removeClass("btn-primary");
            $('#right').removeClass("btn-primary");
            $('#justify').removeClass("btn-primary");
        }
        if(Object.textAlign=='right')
        {
            $('#right').addClass("btn-primary");
        }
        else
        {
            $('#left').removeClass("btn-primary");
            $('#center').removeClass("btn-primary");
            $('#justify').removeClass("btn-primary");
        }
        if(Object.textAlign=='justify')
        {
            $('#justify').addClass("btn-primary");
        }
        else
        {
            $('#left').removeClass("btn-primary");
            $('#right').removeClass("btn-primary");
            $('#center').removeClass("btn-primary");
        }
    },
    SetFontSize: function(size){
        var obj = this.parent().canvas.getActiveObject();
        if(obj) {
            obj.set({
                fontSize: size
            });
            this.parent().canvas.renderAll();
        }
        else
        {
            obj = this.parent().canvas.getActiveGroup();
            if(obj) {
                for (var i = 0; i < obj._objects.length; i++) {
                    if(obj._objects[i].class=="text") {
                        obj._objects[i].set({
                            fontSize: size
                        });
                    }
                }
                this.parent().canvas.renderAll();
            }
        }
    },
    SetTextColor: function(color){
        var obj = this.parent().canvas.getActiveObject();
        if(obj&& obj.class=="text") {
            obj.set({
                fill: color
            });
            this.parent().canvas.renderAll();
        }
        else
        {
            obj = this.parent().canvas.getActiveGroup();
            if(obj) {
                for (var i = 0; i < obj._objects.length; i++) {
                    obj._objects[i].set({
                        fill: color
                    });
                }
                this.parent().canvas.renderAll();
            }
        }
    },
    SetFontFamily: function(font)
    {
        var obj = this.parent().canvas.getActiveObject();
        if(obj && obj.class=="text") {
            obj.fontFamily = font;
            this.parent().canvas.renderAll();
        }
        else
        {
            obj = this.parent().canvas.getActiveGroup();
            if(obj) {
                for (var i = 0; i < obj._objects.length; i++) {
                    if(obj._objects[i].class=="text") {
                        obj._objects[i].fontFamily = font;
                    }
                }
                this.parent().canvas.renderAll();
            }
        }
    },
    SetText: function(txt){
        var self = this;
        var obj = self.canvas.getActiveObject();
        if(obj && obj.class=="text") {
            obj.text = txt;
            self.canvas.renderAll();
        }
        else
        {
            obj = self.canvas.getActiveGroup();
            if(obj) {
                for (var i = 0; i < obj._objects.length; i++) {
                    if(obj._objects[i].class=="text") {
                        obj._objects[i].text = txt;
                    }
                }
                self.canvas.renderAll();
            }
        }
    },
    SetBold: function(){
        var self = this;
        var obj = self.canvas.getActiveObject();
        if(obj && obj.class=="text") {
            if(obj.fontWeight=="bold"){
                obj.set({
                    fontWeight: 'normal'
                });
            }
            else{
                obj.set({
                    fontWeight: 'bold'
                });
            }

            this.parent().canvas.renderAll();
        }
        else
        {
            obj = this.parent().canvas.getActiveGroup();
            if(obj) {
                for (var i = 0; i < obj._objects.length; i++) {
                    if(obj._objects[i].class=="text") {
                        if(obj._objects[i].fontWeight=="bold") {
                            obj._objects[i].set({
                                fontWeight: 'normal'
                            });
                        }
                        else{
                            obj._objects[i].set({
                                fontWeight: 'bold'
                            });
                        }
                    }
                }
                this.parent().canvas.renderAll();
            }
        }
    },

    SetItalic: function(){
        var obj = this.parent().canvas.getActiveObject();
        if(obj && obj.class=="text") {
            if(obj.fontStyle=="italic") {
                obj.set({
                    fontStyle: 'normal'
                });
            }
            else
            {
                obj.set({
                    fontStyle: 'italic'
                });
            }
            this.parent().canvas.renderAll();
        }
        else
        {
            obj = this.parent().canvas.getActiveGroup();
            if(obj) {
                for (var i = 0; i < obj._objects.length; i++) {
                    if(obj._objects[i].class=="text") {
                        if(obj._objects[i].fontStyle=="italic") {
                            obj._objects[i].set({
                                fontStyle: 'normal'
                            });
                        }
                        else{
                            obj._objects[i].set({
                                fontStyle: 'italic'
                            });
                        }
                    }
                }
                this.parent().canvas.renderAll();
            }
        }
    },

    SetUnderline: function(){
        var obj = this.parent().canvas.getActiveObject();
        if(obj && obj.class=="text") {
            if(obj.textDecoration=="underline") {
                obj.set({
                    textDecoration: 'none'
                });
            }
            else{
                obj.set({
                    textDecoration: 'underline'
                });
            }
            this.parent().canvas.renderAll();
        }
        else
        {
            obj = this.parent().canvas.getActiveGroup();
            if(obj) {
                for (var i = 0; i < obj._objects.length; i++) {
                    if(obj._objects[i].class=="text") {
                        if(obj.textDecoration=="underline") {
                            obj._objects[i].set({
                                textDecoration: 'none'
                            });
                        }
                        else{
                            obj._objects[i].set({
                                textDecoration: 'underline'
                            });
                        }
                    }
                }
                this.parent().canvas.renderAll();
            }
        }
    },
    textAlign: function(type){
        var obj = this.parent().canvas.getActiveObject();
        if(obj && obj.class=="text") {
            obj.set({
                textAlign: type
            });
            this.parent().canvas.renderAll();
        }
        else
        {
            obj = this.parent().canvas.getActiveGroup();
            if(obj) {
                for (var i = 0; i < obj._objects.length; i++) {
                    if(obj._objects[i].class=="text") {
                        obj._objects[i].set({
                            textAlign: type
                        });
                    }
                }
                this.parent().canvas.renderAll();
            }
        }
    },
    bringTextToFront: function(){
        var obj = this.parent().canvas.getActiveObject();
        if(obj && obj.class=="text") {
            this.parent().canvas.sendBackwards(obj);
            this.parent().canvas.sendToBack(obj);
            this.parent().canvas.renderAll();
        }
        else
        {
            obj = this.parent().canvas.getActiveGroup();
            if(obj) {
                for (var i = 0; i < obj._objects.length; i++) {
                    if(obj._objects[i].class=="text") {
                        this.parent().canvas.sendBackwards(obj._objects[i]);
                        this.parent().canvas.sendToBack(obj._objects[i]);
                    }
                }
                this.parent().canvas.renderAll();
            }
        }
    },
    bringTextToBack: function(){
        var obj = this.parent().canvas.getActiveObject();
        if(obj && obj.class=="text") {
            this.parent().canvas.bringForward(obj);
            this.parent().canvas.bringToFront(obj);
            this.parent().canvas.renderAll();
        }
        else
        {
            obj = this.parent().canvas.getActiveGroup();
            if(obj) {
                for (var i = 0; i < obj._objects.length; i++) {
                    if(obj._objects[i].class=="text") {
                        this.parent().canvas.bringForward(obj._objects[i]);
                        this.parent().canvas.bringToFront(obj._objects[i]);
                    }
                }
                this.parent().canvas.renderAll();
            }
        }
    },
    setGroupTextColor: function(sets){
        var self = this;
        $.each(sets, function (index, set) {
            self.canvas.forEachObject(function(obj) {
                if(obj.id==set.id)
                {
                    obj.set({
                        fill: set.color,
                        stroke:set.color,
                        color:set.color,
                        selectable:false
                    });
                }
            });
        });
        self.canvas.renderAll();
    },
    disableTextOpts:function(){
        document.getElementById('addText').value = "";
        $("#addText").attr("disabled", "disabled");
        $("#fontSize").attr("disabled", "disabled");
        $("#textfont").attr("disabled", "disabled");
		$("#bold").removeClass("btn-primary");
        $("#bold").attr("disabled", "disabled");
		$("#italic").removeClass("btn-primary");
        $("#italic").attr("disabled", "disabled");
		$("#underline").removeClass("btn-primary");
        $("#underline").attr("disabled", "disabled");
		$("#left").removeClass("btn-primary");
        $("#left").attr("disabled", "disabled");
		$("#right").removeClass("btn-primary");
        $("#right").attr("disabled", "disabled");
		$("#center").removeClass("btn-primary");
        $("#center").attr("disabled", "disabled");
		$("#justify").removeClass("btn-primary");
        $("#justify").attr("disabled", "disabled");
        $("#picker").attr("disabled", "disabled");
    },
    enableTextOpts:function(){
        $("#addText").removeAttr("disabled");
        $("#fontSize").removeAttr("disabled");
        $("#textfont").removeAttr("disabled");
        $("#bold").removeAttr("disabled");
        $("#italic").removeAttr("disabled");
        $("#underline").removeAttr("disabled");
        $("#left").removeAttr("disabled");
        $("#right").removeAttr("disabled");
        $("#center").removeAttr("disabled");
        $("#justify").removeAttr("disabled");
        $("#picker").removeAttr("disabled");
    },
    add: function(_text,_options){
        var self = this;
        var text = new fabric.Textbox(_text || 'Enter Your Text Here', {
            left: (_options && _options.left) || self.parent.get.width() / 2,
            top: (_options && _options.top) || self.parent.get.height() / 4,
            width: (_options && _options.width) || 200,
            height: (_options && _options.height) || 200,
            textAlign : 'left',
            class: 'text',
            fill: '#2323FF',
            fontSize: 16,
            id: (_options && _options.id) || self.parent.get.guid(),
            opacity: (_options && _options.opacity) || 1,
            scaleX: (_options && _options.scaleX) || 1,
            scaleY: (_options && _options.scaleY) || 1,
            target: (_options && _options.target) || false,
            selectable: (_options && _options.selectable) || true,
            hasControls		  : (_options && _options.opacity) || true,
            hasRotatingPoint  : (_options && _options.hasRotatingPoint) || true,
            lockMovementX     : (_options && _options.lockMovementX) || false,
            lockMovementY	  : (_options && _options.lockMovementY) || false,
            lockRotation 	  : (_options && _options.lockRotation) || false,
            lockScalingX 	  : (_options && _options.lockScalingX) || false,
            lockScalingY 	  : (_options && _options.lockScalingY) || false
        });

        text.setCoords();
        self.canvas.add(text);
        self.canvas.setActiveObject(text);
        self.canvas.renderAll();

    },
    get: function(property) {
        var obj = this.canvas.getActiveObject();
        if(obj && obj.class !== 'text') return;

        return obj.get(property);
    },
    set: function(options) {
        var self = this;
        var obj = this.canvas.getActiveObject();
        var before = obj.toJSON(['id','class']);
        if(obj && obj.class !== 'text') return;
        obj.set(options);
        obj.setCoords();
        this.canvas.renderAll();
        self.parent.savestate('modified',before,obj.toJSON(['id','class']));
    }
};