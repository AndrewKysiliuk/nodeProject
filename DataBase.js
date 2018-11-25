const fs = require('fs');
const path = require('path');
const dbPath = path.join(__dirname,'db.json');

module.exports = class DataBase {
    constructor(){
        this._record = fs.readFileSync(dbPath, 'utf-8');
        this._data = JSON.parse(this._record);
        this._users = this._data.users;
        this._usersData = this._data.usersData;
        this._defaultCategory = [
            {
                "catName": "alco",
                "title" : "Алкогольні напої",
            },
            {
                "catName": "noAlco",
                "title" : "Безалкогольні напої",
            },
            {
                "catName": "salad",
                "title" : "Салати",
            },
            {
                "catName": "first",
                "title" : "Перші страви",
            },
            {
                "catName": "sup",
                "title" : "Супи",
            },
            {
                "catName": "pizza",
                "title" : "Піца",
            },
            {
                "catName": "sushi",
                "title" : "Суші",
            }
        ];
    }


    getData(key, category, index) {
        return new Promise((resolve, reject) =>{
            let keyData = this._usersData.find(item => item.key === key);
            if(keyData){
                if(category){
                    let needCategory = keyData.categories.find(item => item.catName === category);
                    if (needCategory){
                        if(index){
                            let needItem = needCategory.data.find(item => item.id === Number(index));
                            if (needItem){
                                resolve(needItem)
                            } else {
                                reject('Item not found')
                            }
                        } else {
                            resolve(needCategory.data);
                        }
                    }
                    else {
                        reject('Category not found');
                    }
                } else {
                    let categoryList = [];
                    keyData.categories.forEach(item => categoryList.push(
                        {
                            "category": item.catName,
                            "title": item.title
                        }));
                    if(categoryList.length) {
                        resolve(categoryList);
                    } else{
                        reject('no category')
                    }
                }
            } else {
                reject('Invalid key');
            }
        });
    }

    authorization(item) {
        return new Promise((resolve, reject) => {
            let user = this._users.find(user => user.email === item.email);
            if(user){
                if(user.password === item.password){
                    resolve(`${user.email}${user.password}`);
                } else {
                    reject('Invalid password');
                }
            } else {
                reject('User not found');
            }
        });
    }

    registration(item) {
        return new Promise((resolve, reject) => {
            if(this._users.find(user => user.email === item.email)) {
                reject(`User with email: ${item.email} already exists`);
            }
            else {
                let userData = {
                    'key': `${item.email}${item.password}`,
                    'categories': this._defaultCategory
                };
                this._usersData.push(userData);
                this._users.push(item);

                fs.writeFile(dbPath, JSON.stringify(this._data),'utf-8', () => {
                    console.log('New user was create');
                    resolve('New user was create');
                });
            }
        });
    }

    post(key, category, item){
        return new Promise((resolve, reject) => {
            let keyData = this._usersData.find(item => item.key === key);
            if(keyData) {
                let needCategory = keyData.categories.find(item => item.catName === category);
                if (needCategory) {
                    needCategory.data.unshift(item);
                    fs.writeFile(dbPath, JSON.stringify(this._data),'utf-8', () => {
                        console.log('New item was write');
                        resolve('New item was write');
                    });
                }
            }
        });
    }

    put(key, category, delIndex, editItem) {
        return new Promise(((resolve, reject) => {
            let keyData = this._usersData.find(item => item.key === key);
            if(keyData){
                let needCategory = keyData.categories.find(item => item.catName === category);
                if (needCategory){
                    let id = -1;
                    needCategory.data.find((item, index) => {
                        if(item.id === Number(delIndex)){
                            id = index;
                        }
                    });
                    if(id >= 0) {
                        needCategory.data.splice(id,1,editItem);
                        fs.writeFile(dbPath,JSON.stringify(this._data),'utf-8', () => {
                            resolve('Item was edited');
                        });
                    }
                    else {
                        reject('Item not found');
                    }
                }else {
                    reject('Category not found');
                }
            }else {
                reject('Invalid key');
            }
        }));
    }

    del(key, category, delIndex){
        return new Promise(((resolve, reject) => {
            let keyData = this._usersData.find(item => item.key === key);
            if(keyData){
                let needCategory = keyData.categories.find(item => item.catName === category);
                if (needCategory){
                    let id = -1;
                    needCategory.data.find((item, index) => {
                        if(item.id === Number(delIndex)){
                            id = index;
                        }
                    });
                    if(id >= 0) {
                        needCategory.data.splice(id,1);
                        fs.writeFile(dbPath,JSON.stringify(this._data),'utf-8', () => {
                            resolve('Item was deleted');
                        });
                    }
                    else {
                        reject('Item not found');
                    }
                }else {
                    reject('Category not found');
                }
            }else {
                reject('Invalid key');
            }
        }));
    }

};

