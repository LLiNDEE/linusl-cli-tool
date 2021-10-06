#!/usr/bin/env node

const inquirer = require('inquirer');
const fs = require('fs');
const process = require("process");
const path = require("path");
const { getFolderPathHandler } = require('./components/createFolder');

async function starting_question(){
    try{

        const start = await inquirer.prompt([
        {
            type:'list',
            name:'action',
            message: 'What do you want to do?',
            choices: ['Add new template file by file', 'Add new template by importing folder', 'Edit existing template', 'Delete a template']
        },
        {
            type: 'confirm',
            name: 'answer',
            message: 'Are you sure?',
            default: false
        }
    ]).then((answer) => {
            if(!answer.answer) return console.log("Okay bye!!!!!!");

            if(answer.action == "Add new template file by file"){
                return createTemplateName();
            }

            if(answer.action == "Edit existing template"){
                return editTemplateHandler();
            }

            if(answer.action == "Delete a template"){
                return deleteTemplateHandler();
            }

            if(answer.action == "Add new template by importing folder"){
                return getFolderPathHandler();
            }

        })

    }catch(error){
        console.log(error.message);
    }
}

starting_question();

async function createTemplateName(){
    try{
        
        let template_name;

        const template_name_question = await inquirer.prompt({
            type:'input',
            name: 'template_name',
            message: 'Enter the name for the template: ',
            default: `Template${Math.floor(Math.random() * 1000)}`,
            validate: checkTemplateName
        }).then((answer)=>{
            template_name = answer.template_name;
            createTemplate_addFiles(template_name);
        });

         createTemplateFolder(template_name); 
        

    }catch(error){
        console.log(error.message);
    }
}

async function createTemplate_addFiles(templateName, _filename = ""){
    try{

        if(_filename == ""){
           return await addFile_question(templateName);
        }

        let fixed_filename;

        if(_filename !== path.basename(_filename)){
            let filepath_arr = _filename.split("\\");
            let filename_from_path = filepath_arr.length;
            fixed_filename = filepath_arr[filename_from_path-1];
        }else{
            fixed_filename = _filename;
        }

         if(await checkFileExistInTemplate(templateName, await fixed_filename)){
             fileExist_options(templateName, await fixed_filename);
             return;
         };


        if(_filename !== path.basename(_filename)){
              let content = new Promise((resolve, reject) =>{
                fs.readFile(`${_filename}`, {encoding: "utf8", flags: "r"}, (err, data) => {
                    if(err) return reject(err);
                    resolve(data);
                });
              })
             
                let pathDir = path.resolve(__dirname,`./templates/${templateName}/${fixed_filename}`);
                 fs.writeFileSync(pathDir, await content,  {encoding: "utf8", flags: "r"});
                 controlQuestion(templateName);
            return;
        }
        
          let content = fs.readFileSync(`${process.cwd()}/${await _filename}`, {encoding: "utf8", flags: "r"});
          let pathDir = path.resolve(__dirname,`./templates/${templateName}/${_filename}`);
          fs.writeFileSync(pathDir, content,  {encoding: "utf8", flags: "r"});

        controlQuestion(templateName);

    }catch(error){
        console.log(error.message);
    }
}

async function controlQuestion(templateName){
    try{
       await inquirer.prompt({
            type:"confirm",
            name: "confirmQ",
            message: "Do you want to add more files?",
            default: false
        }).then((answer) => {
            if(answer.confirmQ){
                return addFile_question(templateName);
            }
            return console.log("Template is now complete!");
        });
    }catch(error){
        console.log(error.message);
    }
}

async function addFile_question(templateName){
    try{

        let addFileq = new Promise(async(resolve, reject) =>{
            const file = await inquirer.prompt({
                type:'input',
                name:'filename',
                message: 'Enter the filename or path of the file you want to add\nYou MUST include the file extension! >',
                validate: checkIfFileExist
            }).then((answer)=>{
                resolve(answer.filename);
            });
        });

        return createTemplate_addFiles(templateName, await addFileq);

    }catch(error){
        console.log(error.message);
    }
}

async function checkTemplateName(input){
    try{

        let allDirectories = new Promise((resolve, reject)=>{
            fs.readdir(path.resolve(__dirname,`./templates`), (err, folders)=>{
                if(err) return reject(err);

                return resolve(folders);

            });
        });

        for(let folder of await allDirectories){
            if(input.toLowerCase() == folder.toLowerCase()){
                return 'Template name already exist!';
            }
        }

        input = input.replace(/^\s+/, '').replace(/\s+$/, '');
        if(input == "" || !input){
            return 'Invalid name!';
        }

        return true;

    }catch(error){
        console.log(error.message);
    }
}

async function createTemplateFolder(templateName){
    try{

        fs.mkdirSync(path.resolve(__dirname,`./templates/${templateName}`));

    }catch(error){
        console.log(error.message);
    }
}

async function checkIfFileExist(input){

     if(input !== path.basename(input)){
         let filepath_arr = input.split("\\");
         let filename_from_path = filepath_arr.length;
         let complete_file = filepath_arr[filename_from_path-1];
         if(!complete_file.includes(".")){
             return 'File does not exist!'
         }
        return true;
     }

    if(fs.existsSync(`${input}`)){
        return true;
    }

    if(!fs.existsSync(`${process.cwd()}/${input}`)){ 
        return 'File does not exist!';
    }

    return true;

}

async function checkFileExistInTemplate(template, file){
    try{

        let status = false;
        if(fs.existsSync(path.resolve(__dirname,`./templates/${template}/${await file}`))){
            status = true;
        }
        return status;

    }catch(error){
        console.log(error.message);
    }
}

async function fileExist_options(templateName, filename){
    try{

        await inquirer.prompt({
            type:'list',
            name: 'file_options',
            message: `A file named '${filename}' already exists in '${templateName}'.\n What do you want to do?`,
            choices: ['Change name', 'Overwrite', 'Skip'],
            default: 'Skip'
        }).then(async(answer) => {
            if(answer.file_options == "Skip"){
                return;
            }

            if(answer.file_options == "Overwrite"){
                let content = fs.readFileSync(`${process.cwd()}/${await filename}`, {encoding: "utf8", flags: "r"});
                let pathDir = path.resolve(__dirname,`./templates/${templateName}/${filename}`);
                fs.writeFileSync(pathDir, content,  {encoding: "utf8", flags: "r"});
                return;
            }

            if(answer.file_options == "Change name"){
                await inquirer.prompt({
                    type: 'input',
                    name: 'new_name',
                    message: `Input a new name for '${filename}'\n You MUST include the file extension!`,
                    validate: checkInput
                }).then(async(answer) => {
                    answer.new_name = answer.new_name.trim();
                    let content = fs.readFileSync(`${process.cwd()}/${await filename}`, {encoding: "utf8", flags: "r"});
                    let pathDir = path.resolve(__dirname,`./templates/${templateName}/${answer.new_name}`);
                    fs.writeFileSync(pathDir, content,  {encoding: "utf8", flags: "r"});
                    controlQuestion(templateName);
                    return;
                })
            }

        })

    }catch(error){
        console.log(error.message);
    }
}

function checkInput(input){

    input = input.replace(/^\s+/, '').replace(/\s+$/, '');
    if(input === "" || !input){
        return 'Invalid name';
    }

    return true;
}


async function editTemplateHandler(){
    try{

        let allTemps = await getAllTemplates();

        let template_to_edit;

        await inquirer.prompt({
            type: 'list',
            name: 'edit_template',
            message: 'What template do you want to edit?',
            choices: allTemps
        }).then((answer)=>{
            template_to_edit = answer.edit_template;
        });

        await inquirer.prompt({
            type: 'list',
            name: 'edit_options',
            message: `What do you want to do with ${template_to_edit}?`,
            choices: ['Add file', 'Delete file', 'Change template name']
        }).then((answer)=>{
            if(answer.edit_options == 'Add file'){
                return editTemplate_addFile(template_to_edit);
            }

            if(answer.edit_options == 'Delete file'){
                return editTemplate_deleteFile(template_to_edit);
            }

            if(answer.edit_options == 'Change template name'){
                return editTemplate_changeTempName(template_to_edit);
            }

        })

    }catch(error){
        console.log(error.message);
    }
}

async function getAllTemplates(){
    try{

        let allTemplates = new Promise((resolve, reject) =>{
            fs.readdir(path.resolve(__dirname, './templates'), (err, files) =>{
                if(err) reject(err);

                resolve(files)
            });
        });

        return await allTemplates;

    }catch(error){
        console.log(error.message);
    }
}

async function editTemplate_addFile(template){
    try{

        await inquirer.prompt({
            type: 'input',
            name: 'filename',
            message: 'Enter the filename or path of the file you want to add\nYou MUST include the file extension! >',
            validate: checkIfFileExist
        }).then((answer) => {
            createTemplate_addFiles(template, answer.filename);
            return;
        });

    }catch(error){
        console.log(error.message);
    }
}

async function editTemplate_deleteFile(template){
    try{

        let allFiles = await getAllFilesInTemplate(template);
        if(allFiles.length == 0){
            await inquirer.prompt({
                type: 'confirm',
                name: 'confirmQ',
                message:`No files inside '${template}', do you want to go back?`,
                default: true
            }).then((answer) => {
                if(answer.confirmQ){
                    editTemplateHandler();
                    return;
                }
                console.log("Goodbye!");
            })
        }

        await inquirer.prompt({
            type: 'list',
            name: 'file_list',
            message: 'What file do you want to delete?',
            choices: allFiles
        }).then(async(answer1)=>{
            await inquirer.prompt({
                type: 'confirm',
                name: 'confirmQ',
                message: `Are you sure you want to delete ${answer1.file_list} from ${template}?`,
                default: false
            }).then((answer)=>{
                if(answer.confirmQ){
                    deleteFileHandler(template, answer1.file_list);
                    return;
                }
                return;
            });

        });


    }catch(error){
        console.log(error.message);
    }
}

async function deleteFileHandler(template, filename){
    try{

        let file_path = path.resolve(__dirname,`./templates/${template}/${filename}`);

         fs.unlink(file_path, (err)=>{
             if(err) return console.log("Could not delete file!")
         });

         deleteFileQuestion(template);

    }catch(error){
        console.log(error.message);
    }
}

async function deleteFileQuestion(template){
    try{

        await inquirer.prompt({
            type:'confirm',
            name: 'confirmQ',
            message: 'Do you want to delete any more files?',
            default: false
        }).then((answer)=>{
            if(answer.confirmQ){
                editTemplate_deleteFile(template);
                return;
            }
            return;
        })
        
    }catch(error){
        console.log(error.message);
    }
}

async function getAllFilesInTemplate(template){
    try{

        let allFiles = new Promise((resolve, reject) =>{
            fs.readdir(path.resolve(__dirname, `./templates/${template}`),(err, files) =>{
                if(err) reject(err);

                resolve(files);
            });
        });

        return await allFiles;

    }catch(error){
        console.log(error.message);
    }
}

async function editTemplate_changeTempName(template){
    try{

        let currPath = path.resolve(__dirname,`./templates/${template}`);

        await inquirer.prompt({
            type: 'input',
            name: 'new_temp_name',
            message: `Enter a new name for '${template}'`,
            validate: newTempNameChecker 
        }).then(async(answer1)=>{
            await inquirer.prompt({
                type: 'confirm',
                name: 'confirm_new_name',
                message: `Are you sure you want to change the name of '${template}' to '${answer1.new_temp_name.trim()}'?`,
                default: false
            }).then(async(answer2)=>{
                if(answer2.confirm_new_name){
                    let newPath = path.resolve(__dirname,`./templates/${answer1.new_temp_name.trim()}`);

                    fs.rename(currPath, newPath, (err)=>{
                        if(err) return console.log("Could not rename template!");

                        return console.log(`Successfully renamed '${template}' to '${answer1.new_temp_name.trim()}'`);
                    })

                }else{
                    return editTemplate_changeTempName(template);
                }

            })
        })

    }catch(error){
        console.log(error.message);
    }
}

async function newTempNameChecker(input){
    try{

        let allDirectories = new Promise((resolve, reject)=>{
            fs.readdir(path.resolve(__dirname,`./templates`), (err, folders)=>{
                if(err) return reject(err);

                return resolve(folders);

            });
        });

        for(let folder of await allDirectories){
            if(input.toLowerCase() == folder.toLowerCase()){
                return 'Template name already exist!';
            }
        }

        input = input.replace(/^\s+/, '').replace(/\s+$/, '');
        if(input === "" || !input){
            return 'Invalid name';
        }

        return true;

    }catch(error){
        console.log(error.message);
    }
}

async function deleteTemplateHandler(){
    try{

        let allTemplates = new Promise((resolve, reject)=>{
            fs.readdir(path.resolve(__dirname, './templates'), (err, files) =>{
                if(err) return reject(err);

                resolve(files);
            })
        })

        await inquirer.prompt({
            type:'list',
            name: 'temp_to_delete',
            message: 'What template do you want to delete?',
            choices: await allTemplates
        }).then(async(answer1)=>{
            await inquirer.prompt({
                type:'confirm',
                name:'confirm_delete',
                message: `Are you sure you want to delete '${answer1.temp_to_delete}' and all files inside?`,
                default: false
            }).then((answer)=>{
                if(answer.confirm_delete){
                    let Temp_path = path.resolve(__dirname,`./templates/${answer1.temp_to_delete}`);
                    fs.rmdir(Temp_path, {recursive: true}, (err)=>{
                        if(err) return console.log("Could not delete template!");

                        console.log("Successfully deleted template!");
                    });
                }else{
                    console.log("No templates deleted!");
                }
            })
        })


    }catch(error){
        console.log(error.message);
    }
}
