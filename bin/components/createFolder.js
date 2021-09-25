module.exports = { getFolderPathHandler }

const inquirer = require('inquirer');
const fs = require('fs');
const process = require("process");
const path = require("path");

async function getFolderPathHandler(){
    try{
        await inquirer.prompt({
            type:'input',
            name:'folderPath',
            message: 'Input the path of the folder >',
            validate: checkIf_folderExist
        }).then((answer) => {
            createTemplateName(answer.folderPath);
        })
    }catch(error){
        console.log(error);
    }
}

async function createTemplateName(folderPath){
    try{

        let folderpath_arr = folderPath.split("\\");
        let folder_from_path = folderpath_arr.length;
        let foldername = folderpath_arr[folder_from_path-1];
        foldername = foldername.split('.');
        
        await inquirer.prompt({
            type: 'input',
            name:'template_name',
            message: `Do you want the template to be named '${foldername}', if not please input another name >`,
            default: foldername,
            validate: checkInput
        }).then((answer) => {
            createTemplate(answer.template_name);
            getFilesFromFolder(folderPath, answer.template_name.trim());
        })


    }catch(error){
        console.log(error.message);
    }
}

async function checkIf_folderExist(folderpath){
    try{

        let folder = new Promise((resolve, reject) => {
            fs.lstat(folderpath, (err, stats) => {
                if(err) resolve(false);

                if(!stats){
                    resolve(false);
                    return;
                }

                if(stats.isDirectory()){
                    resolve(true);
                }

                resolve(false);
            })
        });

        if(!await folder){ // If path is not a folder. This will happen.
            return 'Invalid path!'
        }

        return true;

    }catch(error){
        console.log(error);
    }
}

async function getFilesFromFolder(folderpath, templateName){
    try{

        let allFiles = new Promise((resolve, reject) => {
            fs.readdir(folderpath, (err, files) => {
                if(err) reject(err);

                resolve(files);
            });
        });
        showFilesInsideFolder(await allFiles, templateName, folderpath);
    }catch(error){
        console.log(error.message);
    }
}

async function showFilesInsideFolder(files, templateName, folderpath){
    try{

        await inquirer.prompt({
            type: 'checkbox',
            name: 'selected_files',
            message: `Select which files you want to import into the new template '${templateName}'`,
            choices: files
        }).then((answer) => {
            return generateFilesInsideTemplate(answer.selected_files, templateName, folderpath);
        })

    }catch(error){
        console.log(error.message);
    }
}

async function checkInput(input){

    let allTemplates = new Promise((resolve, reject) => {
        fs.readdir(path.resolve(__dirname,'../templates'), (err, files)=>{
            if(err) reject(err);

            resolve(files);
        })
    });

    for(let file of await allTemplates){
        if(input.toLowerCase() == file.toLowerCase()){
            return 'Template name already exist!'
        }
    }

    input = input.replace(/^\s+/, '').replace(/\s+$/, '');
    if(input === "" || !input){
        return 'Invalid name';
    }

    return true;
}

async function generateFilesInsideTemplate(selected_files, templateName, folderpath){
    try{
        for(let file of selected_files){
            let content = new Promise((resolve, reject) => {
                fs.readFile(`${folderpath}\\${file}`,{encoding: "utf8", flags: "r"}, (err, data)=>{
                    if(err) reject(err);
                    console.log(data);
                    resolve(data);
                });
            });
             fs.writeFile(path.resolve(__dirname,`../templates/${templateName}/${file}`), await content, (err)=>{
                 if(err) return console.log("Failed adding file to template...");
             });
        }

        return console.log("Template created!");


    }catch(error){
        console.log(error.message);
    }
}

async function createTemplate(templateName){
    try{
        let tempPath = path.resolve(__dirname,`../templates/${templateName}`);
        fs.mkdir(tempPath,{ recursive: true }, (err) =>{
            if(err) return console.log(err);
        });

    }catch(error){
        console.log(error.message);
    }
}