const db={
    '0':{
        id:0,
        name:'根目录'
    },
    '1':{
        id:1,
        pId:0,
        name:'电影'
    },
    '2':{
        id:2,
        pId:0,
        name:'音乐'
    },
    '3':{
        id:3,
        pId:1,
        name:'枪战片'
    },
    '4':{
        id:4,
        pId:2,
        name:'流行音乐'
    },
    '5':{
        id:5,
        pId:2,
        name:'古典音乐'
    },
    '6':{
        id:6,
        pId:4,
        name:'周杰伦'
    },
    '7':{
        id:7,
        pId:3,
        name:'战狼2'
    },
    '8':{
        id:8,
        pId:6,
        name:'七里香'
    },
    '9':{
        id:9,
        pId:0,
        name:'私密文件'
    },
    '10':{
        id:10,
        pId:0,
        name:'work'
    },

}

//通过id找到数据
function getById(db,id){
    return db[id];
};

// 根据id设置指定的数据
function setItemById(db, id, data) {   // setItemById(db, 0, {name: '123'})
    const item = db[id];
    // for(let key in data){
    //   item[key] = data[key];
    // }
    return item&&Object.assign(item, data);  // 合拼对象里面的属性
};

//通过id找到该id下的所有数据
//getChildren(db,3)
function getChildren(db,id){
    const data=[];
    for(let key in db){
        if(db[key].pId===id){
            data.push(db[key]);
        }
    }
    return data;
};

//根据指定的id找到当前这个文件以及它的所有父级
function getAllParents(db,id){
    let data=[];
    const current=db[id];
    if(current){
        data.push(current);
        data=getAllParents(db,current.pId).concat(data);
    }
    
    return data;
};

//根据指定的id删除对应的数据以及它自己
function deletItemById(db,id){
    if(!id)return false;
    delete(db[id]);
    let children=getChildren(db,id);
    var len=children.length;
    if(len){
        for(var i=0; i<len; i++){
            deletItemById(db,children[i].id)
        }
    }
    return true;
};
//判断文件名是否冲突
function nameCanUse(db, id, text) {
    const currentData = getChildren(db, id);
    return currentData.every(item => item.name !== text);
};

//新增一条数据
function addOneData(db, data) {
    return db[data.id] = data;
}


// 判断可否移动数据
function canMoveData(db, currentId, targetId) {
    const currentData = db[currentId];

    const targetParents = getAllParents(db, targetId);

    if (currentData.pId === targetId) {
        return 2; // 移动到自己所在的目录
    }

    if (targetParents.indexOf(currentData) !== -1) {
        return 3;   // 移动到自己的子集
    }
    if (!nameCanUse(db, targetId, currentData.name)) {
        return 4; // 名字冲突
    }

    return 1;
}

function moveDataToTarget(db, currentId, targetId) {
    db[currentId].pId = targetId;
}
