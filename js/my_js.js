window.onload=function(){

    var file_box = document.getElementById('file_box');//获取文件夹最外层的父级（它子集的个数就是有多少个文件夹）
    var way = document.getElementById('way');//获取面包屑路径的ul
    var currentListId = 0;  //默认根目录id为零；
    var obj = { length: 0 }
    var rname = document.querySelector('.rname')//获取重命名按钮
    var delet = document.querySelector('.delet');//获取删除按钮
    var alert_btn = document.querySelector('.alert_box li');//获取提示框
    var addfile_btn = document.querySelector('.addfile');//获取新建文件夹按钮
    var noFile = document.querySelector('.noFile');
    var selectAll = document.getElementById('selectAll');
    var funBtn = document.getElementById('funBtn').children;  //获取所有的按钮
    var moveList = document.getElementById('moveList');//获取移动列表父级
    var btnMoveTo = document.getElementById('moveTo');//获取移动按钮；
    var moveTargetId=0;

    var plan_bar = document.querySelector('.plan_bar');//获取loading页进度条；
    var load_bk=document.querySelector('.shade');
    var loadNum=document.querySelector('.shade p');
    var num=0;
    var login_btn = document.querySelector('.login_btn');
    var str='请直接点击登录进入阿木木的云盘，按钮随便找了张图片当作页面背景，色调不搭配哟...';
    var text = document.querySelector('.text');


    var timers=setInterval(function () {
        if (!str.length) {
            timers=null;
            clearInterval(timers);
            return;
        }
        text.innerHTML += str[0];
        str = str.substr(1);
    }, 150);

    //load();
    login_btn.addEventListener('click',function () {
        var plan = document.querySelector('.plan');
        plan.style.display='block';
        load();
    })
    function load() {
        var timer = requestAnimationFrame(load);
        num++;
        loadNum.innerHTML = 'loading...' + num + '%';
        plan_bar.style.width = num + "%";
        if (parseInt(num) === 100) {
            load_bk.style.display = "none";
            clearInterval(timer);
            return;
        }
    }


    //生成文件节点
    function creatFileNode(fileData){
        var file_box=document.getElementById('file_box');
        var fileItem=document.createElement('div');
        fileItem.className='col-xs-6 col-sm-4 col-lg-2';
        fileItem.innerHTML=`<div class="fileParent" style="text-align:center;">
                                <em class="ck"></em>
                                <div class="file"></div>
                                <p class="show">${fileData.name}</p>
                                <input type="" name="" value="">
                            </div>`
        var addFilesIdItems = fileItem.firstElementChild.children;
        fileItem.firstElementChild.fileId = fileData.id;
        for(var i=0; i<addFilesIdItems.length; i++){
            addFilesIdItems[i].fileId = fileData.id;
          }
          
          return fileItem;
        };

        //生成面包屑节点
        function creatWayNode(fileData){
            var itemWay=document.createElement('li');
            itemWay.innerHTML=`${fileData.name}`;
            var icon_span=document.createElement('span');
            itemWay.fileData=fileData.id;
            itemWay.appendChild(icon_span);
            return itemWay;
        }

        //初始化操作
        creatFileList(db, currentListId);
        creatWayList(db, currentListId);
        //生成初始化结构
        // var selectAll ;
        function creatFileList(db,id){
            let sortTime = document.getElementById('sortTime');
            let sortLetter = document.getElementById('sortLetter');
            let sortBtn = document.getElementById('sortBtn');
            let sortUl = document.querySelector('.sortUl');
            file_box.innerHTML='';
            let children= getChildren(db,id);
            if(!children.length){
                noFile.style.display='block';
            }else{
                noFile.style.display='none';
            }
            sortBtn.addEventListener('click',function () {
                sortUl.classList.toggle('active');
            })
            // 按中文首字符的拼音进行排序排序
            sortLetter.addEventListener('click',function() {
                chinaName(db,id);
            });
            // 按时间进行排序排序
            sortTime.addEventListener('click',function () {
                timeSort(db,id);
            })

            children.forEach(function(item){
                file_box.appendChild(creatFileNode(item)); 
            })
        };

        //生成面包屑结构
        function creatWayList(db,id){
            way.innerHTML =``;
            let parents=getAllParents(db,id);
            parents.forEach(function(item){
                way.appendChild(creatWayNode(item));
            })
        }


        //点击进入
        file_box.addEventListener('click',function(e){
            var target=e.target;
            if(target.classList.contains('file')){
                currentListId=target.fileId;
                creatFileList(db,currentListId);
                creatWayList(db,currentListId);
                clearSelect();
                obj.length=0;

            }
            if (target.classList.contains('ck')) {
                checkNodeData(target.parentNode);
            }
        })
        //点击面包屑，返回路径
        
        way.addEventListener('click',function(e){
            var target=e.target;
            //console.log(target.fileId);
            if(target.fileData !== undefined && currentListId !== target.fileId){
                currentListId = target.fileData
                
                creatFileList(db,currentListId);
                creatWayList(db,currentListId);
                clearSelect();
                obj.length=0;
              }
            
        })


//文件夹单选全选
    function checkNodeData(checkNode) {
        var { fileId } = checkNode;
        checkNode.firstElementChild.classList.toggle('active');
        var checked = checkNode.classList.toggle('active');
        var len = file_box.children.length;
        if (checked){
            obj[fileId] = checkNode;
            obj.length++;
        }else{
            delete(obj[fileId]);
            obj.length--;
        }
        alertBox('alert_select', '已选中：'+obj.length+'个文件');
        selectAll.classList.toggle('active',obj.length===len);
    };
    //清空选中
    function clearSelect() {
        if(obj.length>0){
            selectAll.classList.remove('active');
            toggleCheckedAll(false)
        }
    }


    //全选按钮
    selectAll.addEventListener('click',function(e) {
     
        var isChecked=this.classList.toggle('active');
        toggleCheckedAll(isChecked)
        
    })
    function toggleCheckedAll(isChecked) {
        var len = file_box.children.length;
        //console.log(file_box.children);
        if (isChecked){
            obj.length=len;
            alertBox('alert_select', '已选中：' + obj.length + '个文件');
           
        }else{
            obj = {length:0} ;
            alertBox('alert_select', '已选中：' + obj.length + '个文件');
        }
        //console.log(obj);
        for (let i = 0; i < len; i++) {
            const fileItem = file_box.children[i].querySelector('.fileParent');
            const { fileId } = fileItem;
            fileItem.classList.toggle('active', isChecked);
            fileItem.firstElementChild.classList.toggle('active', isChecked);
            if (!obj[fileId] && isChecked) {
                obj[fileId] = fileItem;
            }
        }
    }




//重命名
        rname.addEventListener('click',function(e){
            if(obj.length>1) {
                alertBox('alert_select', '只能选择一个文件');
            }
            else if (obj.length < 1){
                alertBox('alert_select', '请选择一个要重命名的文件');
            }
            else{setNewName(obj,true);}
        })
        function setNewName(obj, showMessage, succFn,failFn) {
            canUseButton(true); 
          
            var checkedEle = objToArr(obj)[0];
            var { fileId, fileNode }=checkedEle;
            console.log(checkedEle);
            var nameText = fileNode.querySelector('p');
            var nameInput = fileNode.querySelector('input');
            var oldName = nameText.innerHTML;
            showHid(nameInput, nameText,'show');
            nameInput.focus();
            nameInput.value = oldName;
            nameInput.onblur=function () {
                let newName = this.value.trim();
                if (!newName){
                    //console.log(oldName);
                    //nameText.innerHTML = oldName;
                    showHid(nameText, nameInput, 'show');
                    this.onblur = null;
                    canUseButton(false);
                    failFn && failFn();
                    return showMessage && alertBox('alert_danger', '重命名失败');
                }
                else if (newName === oldName){
                    showHid(nameText, nameInput, 'show');
                    this.onblur = null;
                    canUseButton(false);
                    failFn && failFn();
                }
                else if (!nameCanUse(db, currentListId, newName)){
                    this.select();
                    //canUseButton(false);
                    //failFn && failFn();
                    return showMessage && alertBox('alert_danger', '此文件名已经存在了');
                   
                }else{
                    nameText.innerHTML = newName;
                    showHid(nameText, nameInput, 'show');
                    setItemById(db, fileId, { name: newName});
                    showMessage && alertBox('alert_success', '命名成功');
                    this.onblur = null;
                    canUseButton(false);
                    succFn && succFn(newName); 
                };
               
                
            }
            
        }


//删除文件夹
deleteFile();
function deleteFile() {
    var myModal_delet = document.getElementById('myModal_delet');
    var dele_colse = document.querySelector('.dele_close');
    var dele_sure = document.querySelector('.dele_sure');
    var shade=document.getElementById('shade');
    //console.log(dele_sure);
    delet.onclick = function () {
        if (obj.length < 1) {
            alertBox('alert_danger', '请至少选择一个文件');
        } else {
            clearTimeout(timer)
            myModal_delet.style.cssText = 'display: block; padding-right: 17px;';
            var timer = setTimeout(function () {
                shade.style.transform ='';
                myModal_delet.classList.add('in');
            }, 200);
        }
        var icon_close = document.getElementById('close');
        console.log(icon_close);
        dele_colse.addEventListener('click', function (e) {
            myModal_delet.classList.remove('in');
            shade.style.transform = 'scale(0)';
            clearTimeout(timer2);
            var timer2 = setTimeout(function () {
                myModal_delet.style = '';
            }, 200);
        });
        icon_close.addEventListener('click', function (e) {
            myModal_delet.classList.remove('in');
            shade.style.transform = 'scale(0)';
            clearTimeout(timer2);
            var timer2 = setTimeout(function () {
                myModal_delet.style = '';
            }, 200);
        });

        dele_sure.onclick=function () {
            sure_delete(obj);
            nullFile();
        }
    };
    function sure_delete(obj) {
        var checkedEle = objToArr(obj);
        checkedEle.forEach(function (item) {
            var {fileId, fileNode}=item;
            file_box.removeChild(fileNode.parentNode);
            obj.length--;
            console.log(obj);
            delete (obj[fileId]);
           
            deletItemById(db, item.fileId);
        })
        myModal_delet.classList.remove('in');
        clearTimeout(timer2);
        var timer2 = setTimeout(function () {
            shade.style.transform = 'scale(0)';
            myModal_delet.style = '';
        }, 200);

    }
}

//新建文件夹
addfile_btn.addEventListener('click', function (e) {
    clearSelect();
    var newFileData = {
        id: Date.now(),
        name: '',
        pId: currentListId
    }
    var newFileNode = creatFileNode(newFileData);
    var fileParent = newFileNode.querySelector('.fileParent');
    file_box.insertBefore(newFileNode, file_box.firstElementChild);
    //clearSelect();
    checkNodeData(fileParent);
    setNewName(
        obj,
        false,
        (name) => {
            newFileData.name = name;
            console.log(newFileData);
            addOneData(db, newFileData);
            alertBox('alert_success', '新建文件夹成功')
        },
        (name) => {
            file_box.removeChild(newFileNode);
            clearSelect();
            alertBox('alert_select', '取消操作');

        }
    );
});
    //移动文件夹
//生成移动结构
    function creatMoveDode(db, id = 0, currentListId) {
        const data = db[id];
        const floorIndex = getAllParents(db, id).length;
        const children = getChildren(db, id);
        const len = children.length;
        var str=`<ul>`;
        str += ` <li><div><span></span><em data-file-id="${data.id}"></em><strong data-file-id="${data.id}" class="titleName">${data.name}</strong></div>`;
        if(len){
            for (let i = 0; i < len; i++) {
                str += creatMoveDode(db, children[i].id, currentListId);
            }
        }
        return str += `</li></ul>`;
    }

    /* 点击移动到按钮执行的事件 */
    btnMoveTo.addEventListener('click',function (e) {
        moveList.innerHTML = creatMoveDode(db, id = 0, currentListId);
        var btnMoveClose = document.getElementById('btnMoveClose');
        if (obj.length < 1) {
            alertBox('alert_danger', '请至少选择一个文件');
        } else {
            myModal_move.style.cssText = 'display: block; padding-right: 17px;';
            var timer = setTimeout(function () {
                shade.style.transform = '';
                myModal_move.classList.add('in');
                clearTimeout(timer)
            }, 200);
        }
        var icon_closeMove = document.getElementById('closeMove');
        btnMoveClose.addEventListener('click', function (e) {
            cancelFn();
        });
        icon_closeMove.addEventListener('click', function (e) {
            cancelFn();
        });
//点击目录标题时的下拉折起效果
        downUp(sureFn);
      
    })
    function sureFn() {
        const checkedEle = objToArr(obj);
        let canMove=true;
        for (var i = 0, len = checkedEle.length;i<len;i++){
            const { fileId, fileNode } = checkedEle[i];
            var ret = canMoveData(db, fileId, moveTargetId);
            if(ret===2){
                alertBox('alert_select', '已经在当前目录了');
                canMove=false;
            } else if (ret === 3){
                alertBox('alert_select', '不能移动到自己的子集');
                canMove = false;
            } else if (ret === 4) {
                alertBox('alert_select', '文件夹名字有冲突');
                canMove = false;
            }
        }
        if (canMove){
            checkedEle.forEach(function (item) {
                const { fileId, fileNode } = item;
                moveDataToTarget(db, fileId, moveTargetId);
                file_box.removeChild(fileNode.parentNode);
                clearSelect();

            })
        }
    };
    function cancelFn() {
        myModal_move.classList.remove('in');
        shade.style.transform = 'scale(0)';
        clearTimeout(timer2);
        var timer2 = setTimeout(function () {
            myModal_move.style = '';
        }, 200);
    }
    function downUp(sureFn) {
        var myModal_move = document.getElementById('myModal_move');
        //点击目录标题时的下拉折起效果
        var moveIcon = moveList.getElementsByTagName('em');
        [...moveIcon].forEach(function (item) {
            item.onclick=function() {
                
                //this.parentNode.parentNode.lastElementChild.classList.toggle('listactive');
                [...this.parentNode.parentNode.children].forEach(function(key) {
                    if(key!==key.parentNode.firstElementChild){
                        key.classList.toggle('listactive');
                    }
                   
                })
               this.classList.toggle('active');
               //console.log(this.previousElementSibling);
               this.previousElementSibling.classList.toggle('active');
                
            }
        })

        //点击标题加背景色
        moveTitle = moveList.getElementsByTagName('strong');
        [...moveTitle].forEach(function (item) {
            item.onclick=function () {
                [...moveTitle].forEach(function (item) {
                    item.classList.remove('active');
                })
                this.classList.add('active');
                moveTargetId = this.dataset.fileId * 1;
            }
        });
        //移动数据
        let btnMoveSure = document.getElementById('btnMoveSure');
        btnMoveSure.onclick=function () {
            sureFn && sureFn();
            
            cancelFn();
            nullFile();
            
        }

    }


 // 按时间进行排序排序
    function timeSort(db, id) {
        let sortUl = document.querySelector('.sortUl');
        let children = getChildren(db, id);
        children.sort(function (a, b) {
            return b.id - a.id;
        });
        file_box.innerHTML = '';
        console.log(children);
        children.forEach(function (item) {
            file_box.appendChild(creatFileNode(item));
        });
        sortUl.classList.toggle('active');
    };
    // 按中文首字符的拼音进行排序排序
    function chinaName(db, id) {
        let sortUl = document.querySelector('.sortUl');
        let children = getChildren(db, id);
        children.sort(function (a, b) {
            return a.name[0].localeCompare(b.name[0], 'zh');
        });
        file_box.innerHTML = '';
        children.forEach(function (item) {
            file_box.appendChild(creatFileNode(item));
        });
        sortUl.classList.toggle('active');
    }



//将选中的元素缓存转换成数组（将obj转换成数组）
function objToArr(obj) {
    var data = [];
    for (let key in obj) {
        if (key !== 'length') {
            data.push({
                fileId: key*1,
                fileNode: obj[key]
            })
        }
    }
    return data;
}
//控制显示还是隐藏的函数
function showHid(show, hidden, className) {
    show.classList.add('show');
    hidden.classList.remove('show');

};

//弹出什么样的框
function alertBox(cls,str) {
    alert_btn.classList.add(cls);
    alert_btn.style.opacity = '1';
    alert_btn.innerHTML = str
    var timer1 = setTimeout(function () {
        alert_btn.classList.remove(cls);
        alert_btn.style.opacity = '0';
        timer1=null;
        clearTimeout(timer1);
    }, 2000);
    return;
};

//按钮能否使用

function canUseButton(boolean) {
    [...funBtn].forEach(function(item) {
        return item.disabled = boolean;
    })
}

//空文件夹 显示‘空文件夹’
function nullFile() {
    let children = file_box.children;
    if (!children.length) {
        noFile.style.display = 'block';
    } else {
        noFile.style.display = 'none';
    }
}







}














































    



