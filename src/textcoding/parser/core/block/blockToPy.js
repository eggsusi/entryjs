/*
 *
 */
"use strict";

goog.provide("Entry.BlockToPyParser");

goog.require("Entry.KeyboardCodeMap");
goog.require("Entry.TextCodingUtil");

Entry.BlockToPyParser = function() {

};

(function(p){
    p.Code = function(code) {
        if (code instanceof Entry.Thread)
            return this.Thread(code);
        if (code instanceof Entry.Block)
            return this.Block(code);

        var textCode = "",
            threads = code.getThreads();

        for (var i = 0; i < threads.length; i++) {
            var thread = threads[i];

            textCode += this.Thread(thread) + '\n';
        }

        return textCode;
    };

    p.Thread = function(thread) {
        if (thread instanceof Entry.Block)
            return this.Block(thread);
        var result = "",
            blocks = thread.getBlocks();

        for (var i = 0; i < blocks.length; i++) {
            var block = blocks[i];
            result += (this.Block(block) + '\n');
        }
        return result;
    };

    p.Block = function(block) {
        if(!block._schema || !block._schema.syntax)
            return "";
        var syntax = block._schema.syntax.py[0];
        if(!syntax || syntax == null)
            return "";
        var blockReg = /(%.)/mi;
        var statementReg = /(\$.)/mi;
        var blockTokens = syntax.split(blockReg);
        var schemaParams = block._schema.params;
        var dataParams = block.data.params;

        var result = "";    
        
        for (var i=0; i<blockTokens.length; i++) { 
            var blockToken = blockTokens[i];
            if (blockToken.length === 0) continue;
            if (blockReg.test(blockToken)) {
                var blockParam = blockToken.split('%')[1];
                var index = Number(blockParam) - 1;
                
                if(schemaParams[index]) {
                    if(schemaParams[index].type == "Indicator") {
                        index++;    
                    } else if(schemaParams[index].type == "Block") {
                        result += this.Block(dataParams[index]).trim();
                    } else {
                        var param = this['Field' + schemaParams[index].type](dataParams[index], schemaParams[index]);
                        
                        if(param == null) {
                            if(schemaParams[index].text) {
                                param = schemaParams[index].text;
                            }
                            else
                                param = null;  
                        } 
                        
                        param = Entry.TextCodingUtil.prototype.binaryOperatorValueConvertor(param);   
                        param = String(param);

                        if(!Entry.TextCodingUtil.prototype.isNumeric(param) &&
                           !Entry.TextCodingUtil.prototype.isBinaryOperator(param))
                           param = String("\"" + param + "\"");  
                       
                        result += param;
                    }
                }
            } else if (statementReg.test(blockToken)) {
                var statements = blockToken.split(statementReg);
                for (var j=0; j<statements.length; j++) {
                    var statementToken = statements[j];
                    if (statementToken.length === 0) continue;
                    if (statementReg.test(statementToken)) {
                        var index = Number(statementToken.split('$')[1]) - 1;
                        result += Entry.TextCodingUtil.prototype.indent(this.Thread(block.statements[index]));
                    } else result += statementToken;
                }
            } else {
                var tagIndex = 0;
                var bb = blockToken.search('#');
                if(blockToken.search('#') != -1) {
                    var tagIndex = blockToken.indexOf('#');
                    blockToken = blockToken.substring(tagIndex+1);
                }

                result += blockToken;
            }
        }
        return result;
    };

    p.FieldAngle = function(dataParam) {
        console.log("FieldAngle", dataParam);

        return dataParam;
    };

    p.FieldColor = function(dataParam) {
        console.log("FieldColor", dataParam);

        return dataParam;
    };

    p.FieldDropdown = function(dataParam) {
        console.log("FieldDropdown", dataParam);
        
        return dataParam;
    };

    p.FieldDropdownDynamic = function(dataParam, schemaParam) {
        console.log("FieldDropdownDynamic", dataParam);

        if(dataParam == "null") {
            dataParam = "none";
        } else {
            dataParam = Entry.TextCodingUtil.prototype.dropdownDynamicValueConvertor(dataParam, schemaParam);
        }                    
       
        return dataParam;
    };

    p.FieldImage = function(dataParam) {
        console.log("FieldImage", dataParam);

        return dataParam;
    };

    p.FieldIndicator = function(dataParam) {
        console.log("FieldIndicator", dataParam);

        return dataParam;
    };

    p.FieldKeyboard = function(dataParam) {
        console.log("FieldKeyboardInput", dataParam);

        return dataParam;
    };

    p.FieldOutput = function(dataParam) {
        console.log("FieldOutput", dataParam);

        return dataParam;
    };

    p.FieldText = function(dataParam) {
        console.log("FieldText", dataParam);

        return dataParam;
    };

    p.FieldTextInput = function(dataParam) {
        console.log("FieldTextInput", dataParam);

        return dataParam;
    };

    p.FieldNumber = function(dataParam) {
        console.log("FieldNumber", dataParam);

        return dataParam;
    };

    p.FieldKeyboard = function(dataParam) {
        console.log("FieldKeyboard Before", dataParam);

        dataParam = Entry.KeyboardCodeMap.prototype.keyCodeToChar[dataParam];

        if(!dataParam || dataParam == null)
            dataParam = "Q";

        console.log("FieldKeyboard After", dataParam);

        return dataParam;
    };

    

})(Entry.BlockToPyParser.prototype);
