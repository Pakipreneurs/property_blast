proFabric;
var _pickerFlag = 0;
var _selectionflag=0;
var undo_redo_tmp_obj=[],canvas_state = new Array(), current_state=0;
var proFabric = new function(){
	var that = this; // refrence for proFabric
	this.canvasWidth = 576;
	this.canvasHeight = 864;
    var Top = this.canvasHeight;
    var Left = this.canvasWidth;
	this.zoom = 100, this.defaultZoom = 100;
    this.canvas = new fabric.Canvas('myCanvas',{backgroundColor:'#fff'});
    this.canvas.setWidth(this.canvasWidth);
    this.canvas.setHeight(this.canvasHeight);
    this.canvas.selection = false;
    var BaseURL = $('#base_url').val();
    //console.log(BaseURL);
        fabric.Image.fromURL(BaseURL+'abc.jpg', function(img) {
            img.class = 'image';
            img.src = BaseURL+'abc.jpg';
            img.orignalSource = BaseURL+'abc.jpg';
            img.id = "test";
            img.originX = "center";
            img.originY = "center";
            img.top = Top-102;
            img.left = Left-510;
            img.height = 200;
            img.width = 200;
            img.color = "#0000ff";
            img.lockMovementX = true;
            img.lockMovementY = true;
            img.lockRotation = true;
        console.log(img.width);
        that.canvas.add(img);
    });
    this.canvas.renderAll();

    fabric.Object.prototype.toObject = (function (toObject) {
        return function () {
            return fabric.util.object.extend(toObject.call(this), {
                id: this.id,
                class: this.class,
                original_scaleX: this.original_scaleX,
                original_scaleY: this.original_scaleY,
                original_left: this.original_left,
                original_top: this.original_top
            });
        };
    })(fabric.Object.prototype.toObject);

	this.canvas.on('mouse:down', function(o){
        if(_pickerFlag==1) {
            // get the current mouse position
            var ctx = that.canvas.getContext("2d");
            var mouse = that.canvas.getPointer(o.e);
            var x = parseInt(mouse.x);
            var y = parseInt(mouse.y);

            // get the color array for the pixel under the mouse
            var px = ctx.getImageData(x, y, 1, 1).data;
            var rgb_val = px[0] + ':' + px[1] + ':' + px[2] + ':' + px[3];
            // report that pixel data
            _pickerFlag = 0;
            var rgba = 'rgba(' + px[0] + ',' + px[1] + ',' + px[2] + ',' + px[3] + ')';
            var hex = proFabric.rgb2hex( rgba );
            $('#picker').colpickSetColor(hex);
        }
    });
	this.canvas.on('mouse:move', function(o){});
	this.canvas.on('mouse:up', function(o){
        var object = that.canvas.getActiveObject();
        if(!object) {
            that.unselectSelected();
            $("#colorStyleOpt").show();
            $("#settingOpt").fadeOut();
            $("#imageOpt").fadeOut();
            $("#settingOpt").fadeOut();
            $("#textOpt").fadeOut();
            that.getcolorObjects();
            that.selectfalseColor();
        }
    });
	this.canvas.on('selection:cleared', function(o){});
	this.canvas.on('selection:created', function(o){});
	this.canvas.on('object:added', function(o){});
	this.canvas.on('object:remove', function(o){});
	this.canvas.on('object:modified', function(o){});
	this.canvas.on('object:rotating', function(o){});
	this.canvas.on('object:scaling', function(o){});
	this.canvas.on('object:moving', function(o){});
	this.canvas.on('object:selected', function(o){
		var object = o.target;
        if(object.class=="text") {
            that.text.updateUI(object);
            $("#textOpt").show();
            $("#settingOpt").show();
            $("#imageOpt").fadeOut();
            $("#colorStyleOpt").fadeOut();
        }
		else if(object.class){
			proFabric.image.imageSelected(object);
		}
        else if(object.class=='shape'){
            proFabric.shapes.shapeSelected(object);
        }
		//console.log(object);
		var dataId=object.class;
		$("#tabs li" ).each(function() {
			if($(this).data('id')==object.class){
				$(this).trigger('click');
				//console.log($(this).data('id'));
				/*$(this).siblings('li').removeClass('.ui-tabs-active ui-state-active');
				$(this).addClass('.ui-tabs-active ui-state-active');*/
			}
		});
		if(object.class=="text"){

		}
		else if(object.class=='image'){
            $("#settingOpt").show();
            $("#imageOpt").show();
            $("#textOpt").fadeOut();
            $("#colorStyleOpt").fadeOut();
		}
		else if(object.class=='shape'){
			proFabric.shapes.shapeSelected(object);
		}
	});
    this.canvas.on('mouse:move', function(e) {

    });

	this.get = {
		canvas : function(){
			return that.canvas;
		},
		width : function(){
			return that.canvasWidth;
		},
		height : function(){
			return that.canvasHeight;
		},
		currentObject : function(){
			return that.canvas.getActiveObject();
		},
		currentGroup : function(){
			return that.canvas.getActiveGroup();
		},
		zoom : function(){
			return that.zoom;
		},
		guid : function() {
			return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
				var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
				return v.toString(16);
			});
		},
		defaultZoom : function(){
			return that.defaultZoom;
		},
		inchesToPixel : function(inc){
			return inc * 96;
        }
	};
	this.set = {
		width : function(w){
			that.canvasWidth = w;
		},
		height : function(h){
			that.canvasHeight = h;
		},
		zoom : function(z){
			that.zoom = z;
		},
		defaultZoom : function(z){
			that.defaultZoom = z;
		},
		bringFront : function(){
			var obj = that.get.currentObject();
			if(!obj)return;
			that.canvas.bringForward(obj);
			that.canvas.renderAll();
		},
		sendBack : function(){
			var obj = that.get.currentObject();
			if(!obj)return;
			that.canvas.sendBackwards(obj);
			that.canvas.renderAll();
		},
		lock : function(){
			var obj = that.get.currentObject();
			if(!obj)return;
            if(obj.class=='text')
            {
                if(obj.lockMovementX==false) {
                    obj.set({
                        lockMovementX: true,
                        lockMovementY: true,
                        lockRotation: true,
                        lockScalingX: true,
                        lockScalingY: true
                    });
                    $("#text_lock").removeClass('fa fa-lock');
                    $("#text_lock").addClass('fa fa-unlock');
                    console.log("Here Locked !! ------- "+obj.lockMovementX);
                }
                else
                {
                    obj.set({
                        lockMovementX     : false,
                        lockMovementY	  : false,
                        lockRotation 	  : false,
                        lockScalingX 	  : false,
                        lockScalingY 	  : false
                    });
                    $("#text_lock").removeClass('fa fa-unlock');
                    $("#text_lock").addClass('fa fa-lock');
                    console.log("Here Un-Locked !! ------ "+obj.lockMovementX);
                }
                that.canvas.renderAll();
            }
            else {
                if (obj.lockMovementX == false) {
                    obj.set({
                        lockMovementX: true,
                        lockMovementY: true,
                        lockRotation: true,
                        lockScalingX: true,
                        lockScalingY: true
                    });
                }
                else {
                    obj.set({
                        lockMovementX: false,
                        lockMovementY: false,
                        lockRotation: false,
                        lockScalingX: false,
                        lockScalingY: false
                    });
                }
                that.canvas.renderAll();
            }
		},
		unlock : function(){
			var obj = that.get.currentObject();
			if(!obj)return;
			obj.set({
				lockMovementX     : false,
				lockMovementY	  : false,
				lockRotation 	  : false,
				lockScalingX 	  : false,
				lockScalingY 	  : false
			});
			that.canvas.renderAll();
		},
        ID : function(id){
            if(id) {
                //console.log('ID Assigning : ' + id);
                //console.log("Here");
                var obj = that.canvas.getActiveObject();
                if (obj&&obj.class=='text') {
                    if(!obj.btnID)
                    {
                        obj.btnID = id;
                        $(id).addClass('ui-state-active');
                        $(id).addClass('ui-widget-content');
                        alert("Assigning ID");
                    }
                    else if(id == obj.btnID)
                    {
                        alert('FLAG : '+_txtSelectionFlag);
                        if(_selectionflag==1&&_txtSelectionFlag==1) {
                            obj.btnID = "";
                            that.canvas.setActiveObject(obj);
                            $(id).removeClass('ui-state-active');
                            $(id).removeClass('ui-widget-content');
                            alert("id already assigned to button . . . . Un-selecting and removing ID");
                            _txtSelectionFlag=0;
                        }
                        _txtSelectionFlag = 1;
                    }
                    else
                    {
                        console.log("id already assigned to button");
                    }
                    selectionflag = 0;
                    //console.log("Here2");
                    //console.log(obj);
                }
            }
        },
		canvas_size: function(w, h) {
			that.canvas.setHeight(h || that.canvas.getHeight());
			that.canvas.setWidth(w || that.canvas.getWidth());

			that.canvas.renderAll();
		},
		setActiveobj:function(id){
			that.canvas.forEachObject(function(obj) {
				console.log(obj);
				if (obj.linkid == id) {	
					that.canvas.setActiveObject(obj, '');
				}
			});
			that.canvas.renderAll();
		}
    },
	this.export = {
		svg : function(){
		},
		json : function(){
            return that.canvas.toJSON();
		}
	};
    this.randBtnSelection = function(id) {
        //var objectList = that.canvas.getObjects();
        /*for (var i = 0; i < objectList._objects.length; i++) {
            if (objectList._objects[i].class == "text") {
                if (objectList._objects[i].btnID) {
                    if (id == objectList._objects[i].btnID) {
                        that.canvas.setActiveObject(objectList._objects[i]);
                        return;
                    }
                }
            }
        }*/
        that.canvas.forEachObject(function(obj){
            console.log(obj+"  ::  "+id);
            if (obj.btnID) {
                console.log(obj.btnID);
                if (id == obj.btnID) {
                    console.log('Selected');
                    that.canvas.setActiveObject(obj);
                    _selectionflag = 1;
                    if(_txtSelectionFlag==1)
                    _txtSelectionFlag = 0;
                    else
                        _txtSelectionFlag=1;
                    return;
                }
            }
            //console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> HERE WE ARE");
        });
    };
	this.import = {
		svg : function(svg){
		},
		json :function(_json){
                var _JSON_NEW = JSON.stringify(_json);
                console.log("++++++++++++++-----------------+++++++++++++++");
                that.canvas.loadFromJSON(_JSON_NEW, that.canvas.renderAll.bind(that.canvas), function(o, object) {
                    object.set({
                        lockMovementX: true,
                        lockMovementY: true,
                        lockRotation: true,
                        lockScalingX: true,
                        lockScalingY: true,
                        hasControls: false
                    });
                    //object.index = i++;
                    if(object.type=="path-group")
                    {
                        object.set({selectable :false});
                        object.selectable = false;
                    }
                    console.log(object.index);

                    //fabric.log(o, object);
                });
                console.log("++++++++++++++-----------------+++++++++++++++");
                that.canvas.renderAll();
            /*var lenght = that.canvas._objects.length;
            console.log("here");
            for(var i = 0 ; i < lenght ; i++) {
                //that.canvas._objects[i].selectable = true;
                if(that.canvas._objects[i].class=="color")
                {
                    that.canvas._objects[i].index = i;
                    console.log(that.canvas._objects[i].index);
                }
            }
            console.log("here");
            that.canvas.renderAll();*/
        }
	};
    this.rgb2hex=function (rgb){
        rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
        return (rgb && rgb.length === 4) ? "#" +
        ("0" + parseInt(rgb[1],10).toString(16)).slice(-2) +
        ("0" + parseInt(rgb[2],10).toString(16)).slice(-2) +
        ("0" + parseInt(rgb[3],10).toString(16)).slice(-2) : '';
    };

	this.deselectCanvas =function(){
		that.canvas.discardActiveObject();
		that.canvas.discardActiveGroup()
	};
	this.zoomcanvas = function(zoom){
		//this.deselectcanvas();
		this.zoom = zoom;
		this.canvas.forEachObject(function(obj){
			if(obj.type === 'group'){
				obj.saveState();
				var groupobj = obj['_objects'];
				for(i=0; i<groupobj.length; i++){
					var objct = groupobj[i],
					scale_X= typeof objct.original_scaleX === "undefined" ? objct.scaleX : objct.original_scaleX,
					scale_Y= typeof objct.original_scaleY === "undefined" ? objct.scaleY : objct.original_scaleY,
					left   = typeof objct.original_left === "undefined"   ? objct.left   : objct.original_left,
					top    = typeof objct.original_top === "undefined"    ? objct.top    : objct.original_top;
					objct.scaleX = scale_X * (zoom/100);
					objct.scaleY = scale_Y * (zoom/100);
					objct.left   = left   * (zoom/100);
					objct.top    = top    * (zoom/100);
					objct.setCoords();
				}
				obj.saveCoords().setObjectsCoords();
			}
			else{
				var scale_X= typeof obj.original_scaleX === "undefined" ? obj.scaleX : obj.original_scaleX,
				scale_Y    = typeof obj.original_scaleY === "undefined" ? obj.scaleY : obj.original_scaleY,
				left       = typeof obj.original_left === "undefined"   ? obj.left   : obj.original_left,
				top        = typeof obj.original_top === "undefined"    ? obj.top    : obj.original_top;

				obj.original_scaleX = typeof obj.original_scaleX === "undefined" ? obj.scaleX : obj.original_scaleX;
				obj.original_scaleY = typeof obj.original_scaleY === "undefined" ? obj.scaleY : obj.original_scaleY;
				obj.original_left   = typeof obj.original_left === "undefined"   ? obj.left   : obj.original_left;
				obj.original_top    = typeof obj.original_top === "undefined"    ? obj.top    : obj.original_top;

				obj.scaleX = scale_X * (zoom/100);
				obj.scaleY = scale_Y * (zoom/100);
				obj.left   = left   * (zoom/100);
				obj.top    = top    * (zoom/100);
			}
			obj.setCoords();
		});
		this.canvas.setWidth(this.canvasWidth * (zoom/100)).setHeight(this.canvasHeight * (zoom/100));
		this.canvas.renderAll();
	};
	this.getCanvasPixelData = function(x, y) {
		var ctx = that.canvas.getContext('2d');
		var pixel = ctx.getImageData(x, y, that.canvasWidth, that.canvasHeight);
		var data = pixel.data;
		return 'rgba(' + data[0] + ',' + data[1] + ',' + data[2] + ',' + data[3] + ')';
	};
    this.delete = function(opt_obj) {//Edited by Ahmad
        if(opt_obj=='text')
        {
            if(that.canvas.getActiveGroup()){
                //that.canvas.getActiveGroup().forEachObject(function(o){ canvas.remove(o) });
                //that.canvas.discardActiveGroup().renderAll();
                var obj = that.canvas.getActiveGroup();
                for(var i = 0 ; i < obj._objects.length ; i++) {
                    console.log(obj._objects[i]);
                    if(obj._objects[i].class=="text") {
                        console.log("TEXT");
                        that.canvas.fxRemove(obj._objects[i]);
                    }
                }
                that.canvas.discardActiveGroup();
                that.canvas.renderAll();
                that.canvas.discardActiveGroup().renderAll();
            } else {
                that.canvas.remove(that.canvas.getActiveObject());
            }
        }
        else if(opt_obj=='image')
        {
            console.log("IMAGE");
            if(that.canvas.getActiveGroup()){
                //that.canvas.getActiveGroup().forEachObject(function(o){ canvas.remove(o) });
                //that.canvas.discardActiveGroup().renderAll();
                var obj = that.canvas.getActiveGroup();
                for(var i = 0 ; i < obj._objects.length ; i++) {
                    console.log(obj._objects[i]);
                    if(obj._objects[i].class=='image') {
                        that.canvas.fxRemove(obj._objects[i]);
                    }
                }
                that.canvas.discardActiveGroup();
                that.canvas.renderAll();
                that.canvas.discardActiveGroup().renderAll();
            } else {
                that.canvas.remove(that.canvas.getActiveObject());
            }
        }
        else
        {
            console.log("OTHER");
            if(that.canvas.getActiveGroup()){
                //that.canvas.getActiveGroup().forEachObject(function(o){ canvas.remove(o) });
                //that.canvas.discardActiveGroup().renderAll();
                var obj = that.canvas.getActiveGroup();
                for(var i = 0 ; i < obj._objects.length ; i++) {
                    console.log(obj._objects[i]);
                    that.canvas.fxRemove(obj._objects[i]);
                }
                that.canvas.discardActiveGroup();
                that.canvas.renderAll();
                that.canvas.discardActiveGroup().renderAll();
            } else {
                that.canvas.remove(that.canvas.getActiveObject());
            }
        }
    };
    this.droper = function (){
            _pickerFlag = 1;
    };
    this.disableSelection=function(){
        that.canvas.deactivateAll();
        that.canvas.selection = false;
        var lenght = that.canvas._objects.length;
        for(var i = 0 ; i < lenght ; i++) {
            that.canvas._objects[i].selectable = false;
        }
        that.canvas.renderAll();
        console.log(that.canvas);
    };
    this.enableSelection=function(){
        that.canvas.deactivateAll();
        that.canvas.selection = false;
        var lenght = that.canvas._objects.length;
        for(var i = 0 ; i < lenght ; i++) {
            that.canvas._objects[i].selectable = true;
        }
        that.canvas.renderAll();
        //alert('I am disable');
    };
    this.unselectSelected=function(){
        that.canvas.deactivateAll();
        that.canvas.renderAll();
    };
    this.replaceImg=function(source){
        console.log("here")
        that.canvas.forEachObject(function(obj) {
            if(obj.class=="image")
            {
                var top = obj.top;
                var left = obj.left;
                var _width = obj.width;
                var _height = obj.height;
                that.canvas.fxRemove(obj);
                that.canvas.renderAll();
                fabric.Image.fromURL(source, function(img) {
                    img.class = 'image';
                    img.src = source;
                    img.orignalSource = source;
                    img.id = "test";
                    img.top = top;
                    img.left = left;
                    img.width = _width;
                    img.height = _height
                    img.color = "#0000ff";
                    img.set({
                        lockMovementX: true,
                        lockMovementY: true,
                        lockRotation: true,
                        lockScalingX: true,
                        lockScalingY: true,
                        hasControls: false
                    });
                    console.log(img.width);
                    that.canvas.add(img);
                    that.canvas.renderAll();
                });
            }
        });
    };
    this.getEditImg=function(source){
        var obj = that.canvas.getActiveObject();
        console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>> Inside Edit Image");
        console.log(obj.orignalSource);
        console.log(obj.src);
        console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>> Inside Edit Image");
        if(obj.orignalSource)
            return obj.orignalSource;
        else {
            obj.orignalSource = obj.src;
            return obj.src;
        }
    };
    this.newImg = function(newObj){
        var dataURL;
        var obj = that.canvas.getActiveObject();
        var before = obj.toJSON(['id','class']);
        console.log("Old Top : "+obj.top);
        console.log("Old left : "+obj.left);
        console.log("Old Width : "+obj.width);
        console.log("Old height : "+obj.height);
        var _width = obj.width;
        var _height = obj.height;
        TempCanvas = new fabric.Canvas(fabric.util.createCanvasElement());
        TempCanvas.setWidth(newObj.imgWidth);
        TempCanvas.setHeight(newObj.imgHeight);
        fabric.Image.fromURL(newObj.src, function(img) {
            TempCanvas.add(img);
            TempCanvas.renderAll();
            dataURL = TempCanvas.toDataURL({
                format: 'png',
                left: newObj.x,
                top: newObj.y,
                width: newObj.width,
                height: newObj.height
            });
            var ImageObj = new Image();
            ImageObj.onload = function() {
                image = new fabric.Image(ImageObj);
                image.top = obj.top;
                image.left = obj.left;
                image.width = _width;
                image.height = _height;
                image.src = dataURL;
                image.orignalSource = obj.orignalSource;
                //image.original_src = obj.original_src;
                image.angle = obj.angle;
                image.id = obj.id;
                image.class = "image";
                image.set({
                    original_scaleX: newObj.scaleX,
                    original_scaleY: newObj.scaleX,
                    lockMovementX: true,
                    lockMovementY: true,
                    lockRotation: true,
                    lockScalingX: true,
                    lockScalingY: true,
                    hasControls: false
                });
                console.log("New Top : "+image.top);
                console.log("New left : "+image.left);
                console.log("New Width : "+image.width);
                console.log("New height : "+image.height);
                that.canvas.add(image);
                that.canvas.moveTo(image, that.canvas.getObjects().indexOf(obj));
                that.canvas.setActiveObject(image);
                that.canvas.fxRemove(obj);
                this.savestate('modified',before,image.toJSON(['id','class']));
                that.canvas.renderAll();
            }
            ImageObj.src = dataURL;
        });
    };
    this.getcolorObjects = function(){
        console.log("I am here...............................................................");
        var lenght = that.canvas._objects.length;
        console.log(lenght);
        for(var i = 0 ; i < lenght ; i++) {
            that.canvas._objects[i].selectable = true;
            if(that.canvas._objects[i].class=="color")
            {
                console.log(that.canvas._objects[i]);
            }
        }
        console.log("I am here...............................................................");
    }
    this.selectfalseColor = function (){
        var lenght = that.canvas._objects.length;
        for(var i = 0 ; i < lenght ; i++) {
            if(that.canvas._objects[i].type =="path-group") {
                that.canvas._objects[i].selectable = false;
            }
        }
        that.canvas.renderAll();
    }
    this.undo = function(){
        if(current_state<0)
            return;
        that.canvas.discardActiveObject();
        that.canvas.discardActiveGroup();
        console.log("Undo start --------------------->");
        console.log(current_state);
        console.log(canvas_state);
        if(current_state > 0){
            current_state--;
            var state=canvas_state;
            obj = state[current_state];
            var action = obj.action;
            if(action == 'background'){
                var color = obj.before;
                $('li#showgrid').removeClass('active');
                that.canvas.backgroundColor = color;
                that.canvas.renderAll();
            }
            if(action == 'modified'){
                var object = obj.before;
                console.log(object);
                if(object.type != "group"){
                    that.canvas.forEachObject(function(temp){
                        console.log(object.id + "-:-" + temp.id);
                        if(temp.id == object.id){
                            that.canvas.remove(temp);
                            setTimeout(function(){
                                that.addObject(object,0,0,1,1);
                            },10);
                        }
                    });
                }
                else{
                    $.each(object.objects,function(index,obj){
                        that.canvas.forEachObject(function(temp){
                            if(temp.id == obj.id){
                                that.canvas.remove(temp);
                                setTimeout(function(){
                                    that.addObject(obj,object.left+object.width/2,object.top+object.height/2,object.scaleX,object.scaleY);
                                },10);
                            }
                        });
                    });
                }
            }
            else if(action == 'add'){
                var object = obj.object;
                that.canvas.forEachObject(function(temp){
                    if(temp.id == object.id){
                        that.canvas.fxRemove(temp);
                    }
                });
            }
            else if(action== 'delete'){
                var object = obj.object;
                //that.addObject(object,0,0,1,1);
                if(object.type != "group"){
                    console.log(object);
                    that.addObject(object,0,0,1,1);
                }
                else{
                    $.each(object.objects,function(index,obj){
                        that.addObject(obj,object.left+object.width/2,object.top+object.height/2,object.scaleX,object.scaleY);
                    });
                }
            }
            that.canvas.renderAll();
        }
        else{
            current_state = 0;
        }
    };
    this.redo = function(){
        if(current_state<0)
            return;
        console.log("Redo start --------------------->");
        console.log(canvas_state[current_state]);
        console.log(current_state);
        console.log(canvas_state);
        that.canvas.discardActiveObject();
        that.canvas.discardActiveGroup();
        if((current_state < canvas_state.length)){
            var state=canvas_state;
            var obj = state[current_state];
            var action = obj.action;
            if(action == 'background'){
                //$('li#showgrid').removeClass('active');
                var color = obj.after;
                that.canvas.backgroundColor = color;
                that.canvas.renderAll();
            }
            if(action == 'modified'){
                var object = obj.after;
                if(object.type != "group"){
                    that.canvas.forEachObject(function(temp){
                        if(temp.id == object.id){
                            console.log("Called->",object);
                            that.canvas.remove(temp);
                            setTimeout(function(){
                                that.addObject(object,0,0,1,1);
                            },10);
                        }
                    });
                }
                else{
                    $.each(object.objects,function(index,obj){
                        that.canvas.forEachObject(function(temp){
                            if(temp.id == obj.id){
                                that.canvas.remove(temp);
                                setTimeout(function(){
                                    that.addObject(obj,object.left+object.width/2,object.top+object.height/2,object.scaleX,object.scaleY);
                                },10);
                            }
                        });
                    });
                }
            }
            else if(action == 'add'){
                var object = obj.object;
                if(object.type != "group"){
                    that.addObject(object,0,0,1,1);
                }
                else{
                    $.each(object.objects,function(index,obj){
                        that.addObject(obj,object.left+object.width/2,object.top+object.height/2,object.scaleX,object.scaleY);
                    });
                }
            }
            else if(action=="delete"){
                var object = obj.object;
                if(object.type != "group"){
                    that.canvas.forEachObject(function(temp){
                        if(temp.id == object.id){
                            that.canvas.fxRemove(temp);
                        }
                    });
                }
                else{
                    $.each(object.objects,function(index,obj){
                        that.canvas.forEachObject(function(temp){
                            if(temp.id == obj.id){
                                that.canvas.fxRemove(temp);
                            }
                        });
                    });
                }
            }
            that.canvas.renderAll();
            current_state++;
        }
    };
    this.savestate = function(type,object,object1){
        var obj = {
            action:type,
            object:object,
            before:object,
            after:object1
        };
        canvas_state.splice(current_state,0,obj);
        current_state++;
        //alert(current_state);
        console.log(current_state);
        console.log(canvas_state);
    };
    this.addObject = function(obj,offsetLeft,offsetTop,scaleX,scaleY) {
        console.log(obj);
        if (!obj) return;
        if (obj.class == "text"){
            text = new fabric.Text(obj.text, {
                fontSize: obj.fontSize,
                fontFamily: obj.fontFamily,
                fill: obj.fill,
                class:obj.class,
                textDecoration:obj.textDecoration,
                fontStyle:obj.fontStyle,
                fontWeight:obj.fontWeight,
                originX: obj.originX,
                originY: obj.originY,
                id:obj.id,
                alignment:obj.alignment,
                angle:obj.angle,
                textAlign:obj.textAlign,
                index:obj.index
            });
            text.set({
                left:obj.left+offsetLeft,
                top:obj.top+offsetTop,
                scaleY:obj.scaleY*scaleY,
                scaleX:obj.scaleX*scaleX,
                lockMovementX     : true,
                lockMovementY	  : true,
                lockRotation 	  : true,
                lockScalingX 	  : true,
                lockScalingY 	  : true,
                hasControls       : false
            });
            if(obj.shadow)
            {
                text.setShadow({
                    blur: obj.shadow.blur,
                    color: obj.shadow.color,
                    offsetX: obj.shadow.offsetX,
                    offsetY: obj.shadow.offsetY
                });
            }
            if(obj.stroke)
            {
                text.set({
                    stroke:obj.stroke,
                    strokeWidth : obj.strokeWidth
                });
            }
            text.on('editing:entered', function(obj) {
                $("textarea#text_area").val(text.text);
            });
            text.on('editing:exited', function(obj) {
                $("textarea#text_area").val(text.text);
            });
            alert();
            that.canvas.add(text);
            console.log(obj.index);
            console.log(text.index);
            that.canvas.moveTo(text,obj.index);
            that.canvas.renderAll();
        }
        else if (obj.class == "svg"){
            var group = [];
            fabric.loadSVGFromURL(obj.src, function(objects, options) {
                var loadedObjects = new fabric.util.groupSVGElements(objects, options);
                loadedObjects.src = obj.src;
                loadedObjects.class = obj.class;
                loadedObjects.set({
                    originX: 'center',
                    originY: 'center',
                    id:obj.id,
                    fill:obj.fill,
                    class: 'svg',
                    top: obj.top+offsetTop,
                    left: obj.left+offsetLeft,
                    scaleX: obj.scaleX*scaleX,
                    scaleY: obj.scaleY*scaleY,
                    opacity:obj.opacity,
                    angle:obj.angle,
                    alignment : obj.alignment,
                    index:obj.index,
                    hasControls : false
                });
                if(obj.paths)
                {
                    if(obj.paths[0].stroke)
                    {
                        $.each(loadedObjects.paths,function(index,value){
                            value.set({
                                stroke: obj.paths[0].stroke
                            });
                        });
                    }
                    if(obj.paths[0].strokeWidth)
                    {
                        $.each(loadedObjects.paths,function(index,value){
                            value.set({
                                strokeWidth:obj.paths[0].strokeWidth
                            });
                        });
                    }
                    if(obj.paths[0].shadow)
                    {
                        $.each(loadedObjects.paths,function(index,value){
                            value.setShadow({
                                blur: obj.paths[0].shadow.blur,
                                color: obj.paths[0].shadow.color,
                                offsetX: obj.paths[0].shadow.offsetX,
                                offsetY: obj.paths[0].shadow.offsetY
                            });
                        });
                    }
                }
                else
                {
                    if(obj.stroke)
                    {
                        $.each(loadedObjects.paths,function(index,value){
                            value.set({
                                stroke: obj.stroke
                            });
                        });
                    }
                    if(obj.strokeWidth)
                    {
                        $.each(loadedObjects.paths,function(index,value){
                            value.set({
                                strokeWidth:obj.strokeWidth
                            });
                        });
                    }
                    if(obj.shadow)
                    {
                        $.each(loadedObjects.paths,function(index,value){
                            value.setShadow({
                                blur: obj.shadow.blur,
                                color: obj.shadow.color,
                                offsetX: obj.shadow.offsetX,
                                offsetY: obj.shadow.offsetY
                            });
                        });
                    }
                }
                that.canvas.add(loadedObjects);
                that.canvas.moveTo(loadedObjects,obj.index);
                that.canvas.renderAll();
            }, function(item, object)
            {
                object.set('id', item.getAttribute('id'));
                group.push(object);
            }, {
                crossOrigin: 'anonymous'
            });
        }
        else if(obj.type == "image"){
            var ImageObj = new Image();
            ImageObj.onload = function() {
                image = new fabric.Image(ImageObj);
                image.top  = obj.top+offsetTop;
                image.left = obj.left+offsetLeft;
                image.width = obj.width;
                image.height = obj.height;
                image.scaleX = obj.scaleX*scaleX;
                image.scaleY = obj.scaleY*scaleY;
                image.src = obj.src;
                image.original_src = obj.original_src;
                image.class="image";
                image.angle = obj.angle;
                image.originX = obj.originX;
                image.originY = obj.originY;
                image.id = obj.id;
                image.alignment = obj.alignment;
                image.index = obj.index;
                image.lockMovementX  = true;
                image.lockMovementY  = true;
                image.lockRotation  = true;
                image.lockScalingX  = true;
                image.lockScalingY  = true;
                image.hasControls = false;
                that.canvas.add(image);
                that.canvas.moveTo(image,obj.index);
                that.canvas.bringForward(image);
                that.canvas.renderAll();
            }
            ImageObj.src = obj.src;
        }
    }
};