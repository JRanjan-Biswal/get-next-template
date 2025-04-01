#!/usr/bin/env node
import { promisify } from "util";
import cp from "child_process";
import path from "path";
import fs, { existsSync, mkdirSync } from "fs";
import select, { Separator } from '@inquirer/select';
var buf = new Buffer.alloc(1024);
// cli spinners
import ora from "ora";
// import { firstBitHandler, readWriteFile, lastBitHanlder } from "./file-execution.mjs";
import sassCreattion from "./utils/sass-creation.mjs";
// import fontPromise from "./utils/font.mjs";

// convert libs to promises
const exec = promisify(cp.exec);
const rm = promisify(fs.rm);

if (process.argv.length < 3) {
    console.log("You have to provide a name to your app.");
    console.log("For example :");
    console.log("    npx create-nextjs-template <--my app name-->");
    process.exit(1);
}

const projectName = process.argv[2];
const currentPath = process.cwd();
const projectPath = path.join(currentPath, projectName);

// on stop interrupt signal from terminal
// process.on('SIGINT', () => {
//     console.log("\nTerminating...");
//     setTimeout(() => {

//     }, 10000)
//     fs.rmSync(projectPath, { recursive: true, force: true }, function (data, err) {
//         if (err) console.error(err)
//         console.log(data)
//     });

//     if (!fs.existsSync(projectPath)) {
//         console.log('second')
//         process.exit(1)
//     }
// });

// TODO: change to your boilerplate repo
const git_repo_js = "https://github.com/JRanjan-Biswal/create-nextjs-app-template-code.git";
const git_repo_ts = "https://github.com/JRanjan-Biswal/create-nextts-app-template-code.git";
var nextConfigFile = 'next.config.mjs';

// create project directory
if (fs.existsSync(projectPath)) {
    console.log(`The file ${projectName} already exist in the current directory, please give it another name.`);
    process.exit(1);
}
else {
    fs.mkdirSync(projectPath);
}

try {
    const codingLangSelector = await select({
        message: 'Select a language',
        choices: [
            {
                name: 'javascript',
                value: 'js',
                description: 'javaScript is a loosely typed (or weakly typed) language',
            },
            {
                name: 'typescript',
                value: 'ts',
                description: 'typeScript is a strongly typed programming language that builds on javaScript',
            }
        ],
    });

    const gitSpinner = ora("Downloading files...").start();
    // clone the repo into the project folder -> creates the new boilerplate
    if (codingLangSelector == 'ts') {
        await exec(`git clone --depth 1 ${git_repo_ts} ${projectPath} --quiet`);
        nextConfigFile = 'next.config.ts';
    }
    else {
        await exec(`git clone --depth 1 ${git_repo_js} ${projectPath} --quiet`);
        nextConfigFile = 'next.config.mjs';
    }

    gitSpinner.succeed();

    const cleanSpinner = ora("Removing useless files").start();
    // remove my git history
    const rmGit = rm(path.join(projectPath, ".git"), { recursive: true, force: true });
    // remove the installation file
    const rmBin = rm(path.join(projectPath, "bin"), { recursive: true, force: true });
    await Promise.all([rmGit, rmBin]);

    process.chdir(projectPath);
    // remove the packages needed for cli
    await exec("npm uninstall ora cli-spinners");
    cleanSpinner.succeed();

    // await fontPromise()
    // firstBitHandler(projectPath, nextConfigFile);

    const packageManager = await select({
        message: 'Select a package manager',
        choices: [
            {
                name: 'npm',
                value: 'npm',
                description: 'npm is the most popular package manager',
            },
            {
                name: 'yarn',
                value: 'yarn',
                description: 'yarn is an awesome package manager',
            },
            new Separator(),
            {
                name: 'jspm',
                value: 'jspm',
                disabled: true,
            },
            {
                name: 'pnpm',
                value: 'pnpm',
                disabled: '(pnpm is not available)',
            },
        ],
    });

    // package manager dependency 
    if (packageManager == 'yarn') {
        await exec('yarn -v')
            .catch(async err => {
                console.log("\u001b[31m", err.message);
                const cleanSpinner = ora("installing yarn globally...").start();
                if (err.message.includes('recognized as an internal or external command'));
                await exec('npm i --global yarn')
                    .then(() => cleanSpinner.succeed("yarn installed successfully.."))
                    .catch(err => {
                        console.log("\u001b[31m", err.message);
                        err.exit();
                    })
            });
    }

    const styling = await select({
        message: 'Select a css processor',
        choices: [
            {
                name: 'vanilla css',
                value: 'css',
                description: 'default css processor'
            },
            {
                name: 'sass',
                value: 'sass',
                description: 'best for coding faster using preprocessor'
            },
            new Separator(),
            {
                name: 'tailwind',
                value: 'tailwind',
                disabled: 'already provided'
            }
        ]
    })

    const sliderPackage = await select({
        message: 'Select a slider package',
        choices: [
            {
                name: 'none',
                value: 'none',
                description: 'no dependencies for slider will be installed'
            },
            {
                name: 'Swiper Js',
                value: 'swiper',
                description: 'best slider package'
            },
            {
                name: 'React Slick',
                value: 'react-slick',
                description: 'react slick is a carousel component'
            },
            new Separator(),
            // {
            //     name: 'Owl Carousel',
            //     value: 'owl-carousel',
            //     description: 'this package of owl carousel is based on elements not on react components '
            // },
        ]
    })

    const datePackage = await select({
        message: 'Select a date package',
        choices: [
            {
                name: 'none',
                value: 'none',
                description: 'no dependencies for slider will be installed'
            },
            {
                name: 'Date Pack',
                value: 'date-pack',
                description: 'is a simple library, help in getting different formats e.g. (dd-mm-yyyy)'
            },
            {
                name: 'Moment',
                value: 'moment',
                description: 'a js date library for parsing, validating, manipulating, and formatting dates.'
            },
            {
                name: 'Date Fns',
                value: 'date-fns',
                description: 'date-fns provides toolset for manipulating js dates in a browser & node.js'
            }
        ]
    })



    // styling dependencies
    if (styling === 'sass') {
        const sassSpinner = ora("setting up sass...").start();

        // let returnVal = readWriteFile(projectPath, nextConfigFile, 'sassOptions')
        // if (returnVal instanceof Error) {
        //     sassSpinner.fail(`some error occurred while installing sass ${returnVal}`)
        // }
        // else {
        //     sassCreattion(projectPath, 'app')
            packageManager === 'npm' ? await exec(`npm install --save-dev sass`) : await exec('yarn add sass --dev')
            sassSpinner.succeed('successfully added sass as dependency')
        // }
    }

    // carousel / slider dependencies
    let sliderSpinner = null;
    if (sliderPackage !== 'none') {
        sliderSpinner = ora("setting up slider...").start();
    }

    if (sliderPackage === 'swiper') {
        packageManager === 'npm' ? await exec('npm install swiper --save') : await exec('yarn add swiper --dev');
        sliderSpinner.succeed('successfully added swiper as dev dependency');
    }
    else if (sliderPackage === 'react-slick' && packageManager === 'npm') {
        await exec('npm install react-slick --save');
        await exec('npm install slick-carousel --save');
        sliderSpinner.succeed('successfully added react slick as dev dependency');
    }
    else if (sliderPackage === 'react-slick' && packageManager === 'yarn') {
        await exec('yarn add react-slick');
        await exex('yarn add slick-carousel');
        sliderSpinner.succeed('successfully added react slick as dev dependency');
    }
    // else if (sliderPackage === 'owl-carousel') {

    // }

    // date dependencies
    let dateSpinner = null;
    if (datePackage !== 'none') dateSpinner = ora("setting up date package...").start();

    if (datePackage == 'date-pack') {
        packageManager === 'npm' ? await exec('npm install date-pack --save') : await exec('yarn add date-pack --dev');
        dateSpinner.succeed('successfully added date-pack as dev dependency');
    }
    else if (datePackage == "moment") {
        packageManager === 'npm' ? await exec('npm install moment --save') : await exec('yarn add moment --dev');
        dateSpinner.succeed('successfully added moment as dev dependency');
    }
    else if (datePackage == "date-fns") {
        packageManager === 'npm' ? await exec('npm install date-fns --save') : await exec('yarn add date-fns --dev');
        dateSpinner.succeed('successfully added date-fns as dev dependency');
    }


    // lastBitHanlder(projectPath, nextConfigFile, 'lastBit');

    const npmSpinner = ora("Installing dependencies...").start();
    if (packageManager === 'npm') {
        await exec("npm install");
    }
    else if (packageManager === 'yarn') {
        await exec("yarn")
    }
    npmSpinner.succeed();

    console.log("The installation is done!");
    console.log("You can now run your app with:");
    console.log(`    cd ${projectName}`);
    packageManager === 'npm' ? console.log(`    npm run dev`) : console.log(`    yarn dev`);

} catch (error) {
    // clean up in case of error, so the user does not have to do it manually
    fs.rmSync(projectPath, { recursive: true, force: true }, function (err) {
        if (err) console.error(err)
    });
    console.log('testing here', projectPath)
    // console.log('testing error console-->',error);
}
