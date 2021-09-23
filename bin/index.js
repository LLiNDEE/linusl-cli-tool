#!/usr/bin/env node


const inquirer = require('inquirer');
const fs = require('fs');
const process = require("process");
const path = require("path");

async function starting_question(){

    const templates = checkTemplatesHandler();

    const answer = await inquirer.prompt([
        {
            type:"list",
            name: "template",
            message: "Select a template..",
            choices: templates
        },
        {
            type: "confirm",
            name: "answer",
            message: "Are you sure?: ",
            default: false
        }
    ]).then(answer=>{
        if(answer.answer){
            generateTemplates(answer.template);
            return;
        }
    });


}

starting_question();


async function generateTemplates(template){

    let allFiles = new Promise((resolve, reject) => {
        fs.readdir(`${process.cwd()}/bin/templates/${template}`, (err, files)=>{
            if(err) return reject(err);

            resolve(files);
        });
    });

    let checkFiles = checkFilesExist(await allFiles);

    if((await checkFiles).length == 0){ // Om det inte finns någon fil med samma namn.
        return generateFiles(template, await allFiles);
    }

    if((await checkFiles).length !== 0){ // Om det finns en/flera filer med samma namn.
        return fixDuplicatedFileNames(await checkFiles, template);
        
    }

}

function checkTemplatesHandler(){
    try{

        return (fs.readdirSync(`${process.cwd()}/bin/templates`,(err, files)=>{
            if(err) return console.log(err);

            return files;

        }));

    }catch(error){
        console.log(error.message);
    }
}

async function checkFilesExist(allFiles){
    try{

        let found_files = [];

        allFiles.forEach(file=>{
            if(fs.existsSync(`${process.cwd()}/${file}`)){
                let newFile = {
                    "org_name": file,
                    "new_name": "",
                    "skip": false,
                    "overwrite": false
                };
                found_files.push(newFile);
            }
        });

        return found_files;

    }catch(error){
        console.log(error);
    }
}

function generateFiles(template, allFiles){
    try{
        allFiles.forEach(file=>{
            let content = fs.readFileSync(path.resolve(__dirname,`./templates/${template}/${file}`),{encoding: "utf8", flags: "r"});
            fs.writeFileSync(`${process.cwd()}/${file}`,content,{encoding: "utf8", flags: "r"});
        });


    }catch(error){
        console.log(error.message);
    }
}

async function fixDuplicatedFileNames(files, template){

    let newArr = [];

    for(const file of files){
      let newFile = await namesLoop(file, template);
      newArr.push(newFile);
    }

    generateChangedFiles(await newArr, template);

}

async function namesLoop(file, template){

    let newFile;

    await inquirer.prompt({
        type: "list",
        name: "file_options",
        message: `A file named ${file.org_name} does already exist.`,
        choices: ['Change name', 'Overwrite', 'Skip']
    }).then(async(answer)=>{
        if(answer.file_options == 'Change name'){
            await inquirer.prompt({
                type: 'input',
                name: 'new_name',
                message: `Input a new name for ${file.org_name}:`,
                validate: checkNameInput
            }).then((answer)=>{
                let getFileType = file.org_name.split('.');

                let newName = `${answer.new_name}.${getFileType[1]}`;

                file.new_name = newName.trim();
                // newArr.push(file);
                newFile = file;
            });
        }else if(answer.file_options == 'Overwrite'){
            file.overwrite = true;
            // newArr.push(file);
            newFile = file
        }else if(answer.file_options == 'Skip'){
            file.skip = true;
            newFile = file;
        }
    });

    return newFile;

    // generateChangedFiles(await newArr, template);

}

async function generateChangedFiles(files, template){

    let allFiles = await getAllFiles(template);


     allFiles.forEach(file=>{

        let status = true;

        files.forEach(_file=>{
            if(file == _file.org_name){
                status = false;
                if(_file.skip){
                    return;
                }

                if(_file.overwrite){
                    let content = fs.readFileSync(path.resolve(__dirname,`./templates/${template}/${file}`),{encoding: "utf8", flags: "r"});
                    fs.writeFileSync(`${process.cwd()}/${file}`,content,{encoding: "utf8", flags: "r"});
                    return;
                }
                    let content = fs.readFileSync(path.resolve(__dirname,`./templates/${template}/${file}`),{encoding: "utf8", flags: "r"});
                    fs.writeFileSync(`${process.cwd()}/${_file.new_name}`,content,{encoding: "utf8", flags: "r"});
                    return;

            }
        });
        if(status){
            let content = fs.readFileSync(path.resolve(__dirname,`./templates/${template}/${file}`),{encoding: "utf8", flags: "r"});
            fs.writeFileSync(`${process.cwd()}/${file}`,content,{encoding: "utf8", flags: "r"});
        }

    })

}

async function getAllFiles(template){
    let allFiles = new Promise((resolve, reject) => {
        fs.readdir(`${process.cwd()}/bin/templates/${template}`, (err, files)=>{
            if(err) return reject(err);

            resolve(files);
        });
    });

    return await allFiles;
}

async function checkNameInput(input) {

    let files_in_current_dir = new Promise((resolve, reject) => {
        fs.readdir(`${process.cwd()}/`, (err, files)=>{
            if(err) return reject(err);

            resolve(files);
        });
    });

    for(let file of await files_in_current_dir){
        let newFile = file.split(".");
        if(input == newFile[0]){
            return 'Invalid name'
        }
    }

    input = input.replace(/^\s+/, '').replace(/\s+$/, '');
    if(input === "" || !input){
        return 'Invalid name';
    }

    return true;

}
