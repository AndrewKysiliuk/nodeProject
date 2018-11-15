const fs = require('fs');
const path = require('path');
const dbPath = path.join(__dirname,'db.json');

module.exports = class DataBase {
    constructor(){
        this._record = fs.readFileSync(dbPath, 'utf-8');
        this._data = JSON.parse(this._record);
    }


    get(id) {
        return new Promise((resolve, reject) =>{
            if(id){
                let item = this._data.gallery.find(item => item.id === Number(id));
                if(item){
                    resolve(item);
                }else {
                    reject();
                }
            }else {
                resolve(this._data.gallery);
            }
        });


    }

    post(item){
        return new Promise(resolve => {item.id = this._data.gallery.length+1;
            this._data.gallery.push(item);
            fs.writeFile(dbPath,JSON.stringify(this._data),'utf-8', () => {
                console.log('New item was write');
                resolve();
            });
        })
    }

    put(editItem) {
        return new Promise((resolve, reject) =>{
            let id;
            this._data.gallery.find((item, index) => {
                if(item.id === editItem.id){
                    id = index;
                }
            } );
            if(id >= 0) {
                this._data.gallery.splice(id,1,editItem);
                fs.writeFile(dbPath,JSON.stringify(this._data),'utf-8', () => { console.log('Item was edited')});
                resolve();
            }
            else {
                reject();
            }
        });
    }

    del(delId){
        return new Promise(((resolve, reject) => {
            let id;
            this._data.gallery.find((item, index) => {
                if(item.id === Number(delId)){
                    id = index;
                }
            } );
            if(id >= 0) {
                this._data.gallery.splice(id,1);
                fs.writeFile(dbPath,JSON.stringify(this._data),'utf-8', () => { console.log('Item was deleted')});
                resolve();
            }
            else {
                reject();
            }
        }));

    }

};

