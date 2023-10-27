const fs = require('fs')
const path = require('path')
const SyncHook = require("../1.tapable");
const parser = require('@babel/parser'); // 源代码转成 ast 抽象语法书
const { monitorEventLoopDelay } = require('perf_hooks');
const traverse = require('@babel/traverse').default; // 遍历语法树
const generate = require('@babel/generator').default; // 把语法树重新生成代码

const baseDir = process.cwd();

class Compiler {
    constructor(options) {
        this.options = options;

        this.hooks = {
            run: new SyncHook(),
            done: new SyncHook(),
        }
    }

    run() {
        this.hooks.run.call();
        const modules = []
        const entry = path.join(this.options.context, this.options.entry);
        const entryModule = this.buildModule(entry);
        entryModule.deps.forEach((item) => {
            const module = this.buildModule(item);
            modules.push(module)
        })
        this.hooks.done.call();
    }

    buildModule(modulePath) {
        const originalCode = fs.readFileSync(modulePath, 'utf-8');
        let sourceCode = originalCode;
        // 调用 loader 对代码进行转换
        const rules = this.options.module.rules;

        const loaders = [];

        for (let i = 0; i < rules.length; i++) {
            if (rules[i].test.test(modulePath)) {
                loaders.push(...rules[i].use);
            }
        }

        for (let i = loaders.length - 1; i >= 0; i--) {
            let loader = loaders[i];
            sourceCode = require(loader)(sourceCode);
        }




        console.log("🚀 ~ Compiler ~ buildModule ~ originalCode:", originalCode);

        console.log("🚀 ~ Compiler ~ buildModule ~ sourceCode:", sourceCode);


        // 转成语法树
        const astTree = parser.parse(sourceCode, {
            sourceType: 'module'
        })

        const moduleId = './' + path.posix.relative(baseDir, modulePath)

        const module = {
            id: moduleId,
            deps: [],
        }
        // 遍历语法树
        traverse(astTree, {
            CallExpression({ node, type }) {
                if (node.callee.name === 'require') {
                    const moduleName = node.arguments[0].value
                    console.log("🚀 ~ Compiler ~ CallExpression ~ moduleName:", moduleName);
                    let depModulePath;
                    // 绝对路径
                    if (path.isAbsolute(moduleName)) {
                        depModulePath = moduleName
                    } else {
                        // 相对路径
                        // 获取当前文件所在文件夹
                        const dirname = path.posix.dirname(modulePath);
                        depModulePath = path.posix.join(dirname, moduleName)
                        console.log("🚀 ~ Compiler ~ CallExpression ~ depModulePath:", depModulePath);

                        // const extensions = this.options.

                        const depModuleId = './' + path.posix.relative(baseDir, depModulePath)
                        node.arguments = [type.stringLiteral(depModuleId)]
                        module.deps.push(depModuleId)
                    }

                }
            }
        });


        const { code } = generate(astTree)
        module._source = code;
        return module;
    }



}

module.exports = Compiler