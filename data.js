(function(global){
	
	// Constractor
	var dataClass_gl = function (_id, _name, _latlng, _dispflg){
		return new dataClass(_id, _name, _latlng, _dispflg)
	}
	var dataClass = function (_id, _name, _latlng, _dispflg){
        	// Local variables
        	this.name;
        	this.latlng;
        	this.dispflg = true;
        	this.id;
        	this.data = {};
        	this.id = _id;
	        this.name = _name;
	        this.latlng = _latlng;
        	this.dispflg = _dispflg ? true : false;
        }



	// Public functions
	dataClass.prototype.setName = function(value){ this.name = value};
	dataClass.prototype.setLatLng = function(value){ this.latlng = value};
	dataClass.prototype.setDispflg = function(value){ 
						if(value){ 
							this.dispflg = true 
						} else { 
							this.dispflg = false 
						}
					};

  //valueにはDATACLASSのオブジェクトが入る
  //dispflgがfalseの場合、dataからvalueのデータを削除
  //既に存在する場合は位置情報とdispflgだけ更新
  dataClass.prototype.setData = function(value){
          if(value.dispflg){
						if(this.data[value.id]){
							this.data[value.id].latlng = value.latlng;
              this.data[value.id].dispflg = value.dispflg;
						} else {
              this.data[value.id] = {};
							this.data[value.id].id = value.id;
              this.data[value.id].name = value.name;
              this.data[value.id].dispflg = value.dispflg;
              this.data[value.id].latlng = value.latlng;
					  }
          } else {
            if(this.data[value.id]){
              delete this.data[value.id];
            }
          }
	
				};

	// Export
	global.DATACLASS = dataClass_gl;
})(this.self || global)
