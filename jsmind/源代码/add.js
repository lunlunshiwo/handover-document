var jsmind = new Vue({
  el: '#main123',
  data: {
    clientX: '',
    clientY: '',
    popShow: false,
    lists: [],//弹窗显示的数组
    does: 0,
    btnShow:{
      a: false,
      b: false,
      c: false,
      d: false
    },
    maskShow: false,
    maskLists: [],//弹窗获取到的内容数组
    searchTxt: '',//搜索框的内容
    titleObj:{},//jm子项的标签
    order: '',//jm子项的序号
    symble:'',//jm子项的符号
    condition:'',//jm子项的符号
    assignmentPopShow:false,//赋值框是否弹出
    assignmentTxt:''//赋值结果
  },
  mounted:function() {
    this.build();
  },
  methods: {
    build: function () {
      var mind = {
        "meta": {
          "name": "demo",
          "author": "hizzgdev@163.com",
          "version": "0.2"
        },
        "format": "node_array",
        "data": [{
          "id": "root",
          "isroot": true,
          "topic": "开始",
          "isreadonly": "true"
        }]
      };
      var options = {
        container: 'jsmind_container',
        editable: false,
        theme: 'clouds',
        mode: 'full'
      };
      _jm = jsMind.show(options, mind);
    },
    //右单机打开pop
    pop: function (e) {
      e.preventDefault();
      var e = e || window.event;
      var target = e.target || e.srcElement;
      var node = _jm.get_selected_node();
      this.btnStore(node);
      console.log(target.nodeName, node);
      if (node && target.nodeName.toLowerCase() === 'jmnode') {
        this.clientX = e.clientX + 'px';
        this.clientY = e.clientY-20+ 'px';
        this.popShow = true;
      } else {
        // 还原
        this.reduction();
      }
    },
    // 根据node判断哪个按钮显示
    btnStore: function(node) {
      if(!!node && node.id === 'root'){
        this.btnShow.a = true;
        this.btnShow.b = false;
        this.btnShow.c = false;
        this.btnShow.d = false;
      } else if(!!node && !node.children.length && !node.data.isAssignment){
        this.btnShow.a = true;
        this.btnShow.b = true;
        this.btnShow.c = true;
        this.btnShow.d = true;
      } else if(!!node && node.children.length && !node.data.isAssignment){
        this.btnShow.a = true;
        this.btnShow.b = true;
        this.btnShow.c = true;
        this.btnShow.d = false;
      } else if(!!node && !node.children.length && node.data.isAssignment){
        this.btnShow.a = false;
        this.btnShow.b = false;
        this.btnShow.c = true;
        this.btnShow.d = false;
      }
    },
    // 点击增加jsmind
    add: function () {
       Wb.request({
          url: 'm?xwl=Cohort/CohortMaker/create_cohort_server/select_variable',
          params: {
            PID: Pid
          },
          success: function (r) {
            var rs = Wb.decode(r.responseText).rows,
            datajson = {},
            dataarr = [];
            for (var a in rs) {
            datajson = {};
            datajson.name = rs[a].ELE_LOCAL_VARNAME;
            datajson.id = rs[a].ID;
            dataarr.push(datajson);
          }
          //给jsmind中的数据赋值（此处的jsmind等同于jq的$）
          //此处的lists的结构为"{name，id}",name做展示，id做数据处理
          //获得数据，功能弹窗弹出
          jsmind.maskLists = dataarr;
          if (jsmind.maskLists.length) {
            jsmind.maskShow = true;
          }
          console.log(jsmind.maskLists);
          jsmind.lists = jsmind.maskLists;
          jsmind.does = 1;
        }
      });
    },
    //点击编辑jsmind
    edit: function() {
      var selected_node = _jm.get_selected_node();
      this.titleObj = {
        name: selected_node.data.mname,
        id: selected_node.data.mid
      };
      this.symble = selected_node.data.symble;
      this.order = selected_node.data.order;
      this.condition = selected_node.data.condition;
      this.maskShow = true;
      //表示编辑功能
      this.does = 2;
    },
    //关闭弹窗
    closeMask:function(){
      this.maskShow = false;
    },
    // 点击选择标签
    chooseTitle:function(e){
      this.titleObj={
        name:e.target.innerText,
        id:e.target.attributes["data-id"].value
      };
      console.log(this.titleObj);
    },
    // 判断选择标签的颜色
    isActive:function(id){
      return id == this.titleObj.id ? true : false;
    },
    // 添加jsmind子标签
    addJsmind:function(){
      console.log(this.titleObj,this.order,this.symble,this.condition);
      if (this.titleObj.id && this.symble && this.condition) {
        data = {
          isAssignment:false,
          mname:this.titleObj.name,
          mid: this.titleObj.id,
          order: this.order,
          symble: this.symble,
          condition: this.condition
        };
        console.log(data,this.does);
        var postfix = this.order?"【"+this.order+"】":'';
        var r = postfix + this.titleObj.name + this.symble + this.condition;
        if (this.does == 1) {
          if (r) {
            var nodeid = jsMind.util.uuid.newid();
            var topic = r;
            //jsmind自带的开始设置的参数
            _jm.enable_edit();
            //扩展方法， right 将子节点增加到右侧， left 将子节点增加到左侧，默认右侧
            var node = _jm.add_node(_jm.get_selected_node(), nodeid, topic, data, "right");
            //jsmind自带的禁止设置的参数
            _jm.disable_edit();
          }
        } else {
          if (r) {
            var node = _jm.get_selected_node();
            var topic = r;
            var nodeid = _jm.get_selected_node().id;
            //jsmind自带的开始设置的参数
            _jm.enable_edit();
            var node = _jm.update_node(nodeid, topic);
            var node = _jm.get_selected_node();
            node.data.mname = this.titleObj.name;
            node.data.mid = this.titleObj.id;
            node.data.order = this.order;
            node.data.symbble = this.sumble;
            node.data.condition = this.condition;
            //jsmind自带的开始设置的参数
            _jm.disable_edit();
          }
        }
        // 还原
        this.reduction();
      }
    },
    //操作之后还原
    reduction:function(){
      this.titleObj = {};
      this.order = '';
      this.symble = '';
      this.condition = '';
      this.does = 0;
      this.maskShow = false;
      this.popShow = false;
      this.assignmentPopShow = false;
      this.assignmentTxt = '';
      this.btnShow.a = false;
      this.btnShow.b = false;
      this.btnShow.c = false;
      this.btnShow.d = false;
    },
    //删除jsmind节点
    catout: function() {
      _jm.enable_edit();
      var node = _jm.get_selected_node();
      _jm.remove_node(node);
      _jm.disable_edit();
      this.popShow = false;
    },
    //赋值
    assignment: function() {
      this.assignmentPopShow = true;
    },
    // 确认赋值
    confirmAssignment: function(){
      var data = {
        isAssignment: true,
        assignment: this.assignmentTxt
      };
      var r = '【赋值】' + this.assignmentTxt;
      if (r&&!!this.assignmentTxt) {
        var nodeid = jsMind.util.uuid.newid();
        var topic = r;
        //jsmind自带的开始设置的参数
        _jm.enable_edit();
        //扩展方法， right 将子节点增加到右侧， left 将子节点增加到左侧，默认右侧
        var node = _jm.add_node(_jm.get_selected_node(), nodeid, topic, data, "right" ,{"background-color":"red"});
        _jm.set_node_color(nodeid, 'rgb(66, 139, 202)', '#fff');
        //jsmind自带的禁止设置的参数
        _jm.disable_edit();
      }
      // 还原
      this.reduction();
    },
    //取消赋值
    cancelAssignment: function() {
      this.assignmentPopShow = false;
      this.assignmentTxt = '';
    },
    //确定键输出数据
    shuchu: function() {
      //提取数据
      var data = _jm.get_data("node_array");
      console.log(data);
      Wb.request({
        url:'m?xwl=Cohort/CohortMaker/create_cohort_server/update_cohort_element',
        params:{
//           ID:record.data.ID ,
          data : Wb.encode(data),
          cid:Cid
        },
        success:function(){
          app.win_add.close();
          app.grid2.store.reload();
        }
      });
    },
    // 取消
    quxiao: function() {
      this.reduction();
      app.win_add.close();
      app.grid2.store.reload();
    }
  },
  watch: {
    searchTxt: function (val) {
      var data = [];
      for (var a=0,len=this.maskLists.length;a<len;a++) {
        if (this.maskLists[a].name.indexOf(val) > -1) {
          data.push(this.maskLists[a]);
        }
      }
      this.lists = data;
    }
  }
})
