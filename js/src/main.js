var prism = require("prismjs");
var aTemplate = require("a-template");
var saveAs = require("filesaver.js");
var JSZip = require("jszip");
var $ = require('zepto-browserify').$
var generator = new aTemplate({
	templates:["form","source","package"],
	data:{
		mode:"css",
		lang:"en",
		fileMode:"gulpfile",
		usePreprocessor:"",
		useAutoPrefixer:"true",
		useMinifyCss:"true",
		cssPreprocessor:"sass",
		cssSrc:"css/src",
		cssDest:"css/dist",
		cssStyleGuideDest:"docs/css",
		useCssComb:"true",
		useCmq:"true",
		useCssStyleGuide:"",
		useCssLint:"",
		useConcatCss:"",
		concatCss:"main.css",
		jsSrc:"js/src",
		jsDest:"js/dist",
		// jsDocDest:"docs/js",
		useUglifyJs:"true",
		useAltJs:"",
		useConcatJs:"",
		useJsHint:"",
		useBrowserify:"",
		// useJsDoc:"",
		altJs:"coffee",
		concatJs:"main.js",
		htmlSrc:"html",
		htmlDest:"./",
		useTemplateEngine:"",
		templateEngine:"ejs",
		useMinifyHtml:"",
		useImageMin:"",
		imageSrc:"images/src",
		imageDest:"images/dist",
		useIconFont:"",
		iconFontName:"myicon",
		iconFontSrc:"fonts/src",
		iconFontDest:"fonts/dist",
		iconFontCssPrefix:"icon",
		useBrowserSync:"",
		browserSyncDir:"./",
		browserSyncLocal:"true",
		useNotification:"",
		useConcatJsOrCss:function(){
			if(this.data.useConcatJs || this.data.useConcatCss){
				return true;
			}else{
				return false;
			}
		},
		useSourceMap:function(){
			if((this.data.useSourceMapCss && this.data.usePreprocessor) || (this.data.useAltJs && this.data.useSourceMapJs)){
				return true;
			}else{
				return false;
			}
		},
		useCssStream:function(){
			if(this.data.useSourceMapCss && this.data.usePreprocessor){
				return true;
			}else{
				return false;
			}
		},
		cssExtName:function(){
			var preprocessor = this.data.cssPreprocessor;
			if(!this.data.usePreprocessor){
				return "css";
			}else{
				if(preprocessor == "sass"){
					return "sass"
				}else if (preprocessor == "less"){
					return "less";
				}else if (preprocessor == "stylus"){
					return "styl";
				}
			}
		},
		cssTask:function(){
			var data = this.data;
			if(!data.usePreprocessor){
				return "css";
			}else{
				return data.cssPreprocessor;
			}
		},
		useJsStream:function(){
			if(this.data.useAltJs && this.data.useSourceMapJs){
				return true;
			}else{
				return false;
			}
		},
		jsExtName:function(){
			var data = this.data;
			if(!data.useAltJs){
				return "js";
			}else if(data.altJs == "babel"){
				return "js";
			}else if(data.altJs == "coffee"){
				return "coffee";
			}else if(data.altJs == "typescript"){
				return "ts";
			}
		},
		jsTask:function(){
			var data = this.data;
			if(!data.useAltJs){
				return "js";
			}else{
				return data.altJs;
			}
		},
		useMinifyHtmlOnly:function(){
			if(!this.data.useMinifyHtml && this.data.useNotification){
				return true;
			}else{
				return false;
			}
		},
		htmlExtName:function(){
			var data = this.data;
			if(!data.useTemplateEngine){
				return "html";
			}else{
				return data.templateEngine;
			}
		},
		htmlTask:function(){
			var data = this.data;
			if(!data.useTemplateEngine){
				return "html";
			}else{
				return data.templateEngine;
			}
		},
		useRename:function(){
			var data = this.data;
			if(data.useMinifyCss || data.useUglifyJs || data.useMinifyHtml){
				return true;
			}else{
				return false;
			}
		},
		useImageTask:function(){
			var data = this.data;
			if(data.useBrowserSync || data.useImageMin){
				return true;
			}else{
				return false;
			}
		},
		imageTasks:function(){
			var data = this.data;
			if(data.useImageMin){
				if(data.useBrowserSync){
					return "'image','reload'";
				}else{
					return "'image'";
				}
			}else{
				return "'reload'";
			}
		}
	},
	changeMode:function(mode){
		this.data.mode = mode;
		this.update();
		this.update("text","package");
		this.update("text","source")
		Prism.highlightElement($('#jsoncode')[0]);
	},
	changeFileMode:function(mode){
		this.data.fileMode = mode;
		this.update();
		this.update("text","package");
		this.update("text","source")
		Prism.highlightElement($('#jsoncode')[0]);
	},
	refresh:function(){
		this.update("html","form");
		this.update("text","package");
		this.update("text","source")
		Prism.highlightElement($('#jsoncode')[0]);
		this.saveData("gulpSettings");
	},
	refreshSource:function(){
		this.update("text","package");
		this.update("text","source")
		Prism.highlightElement($('#jsoncode')[0]);
		this.saveData("gulpSettings");
	},
	showAlert:function(){
		if(lang == "ja"){
			var $alert = $("<div class='sourceCopied'>クリップボードにソースをコピーしました</div>");
		}else{
			var $alert = $("<div class='sourceCopied'>Copied the source into the clipboard</div>");					
		}
        $("body").append($alert);
        $alert.delay(1).queue(function(next){
            $(this).addClass("active");
            next();
        }).delay(700).queue(function(next){
            $(this).removeClass('active');
            next();
        }).delay(200).queue(function(next){
            $(this).remove();
            next();
        });
	},
	sourceCopy:function(){
		this.method.showAlert();
		// source.copyToClipBoard();
	},
	packageCopy:function(){
		this.method.showAlert();
		// package.copyToClipBoard();
	},
	downloadPackage:function(){
		var data = this.data;
		var zip = new JSZip();
		// zip.file("gulpfile.js", source.getHtml());
		// zip.file("package.json", package.getHtml());
		if(data.useIconFont){
			var iconPath = data.iconFontSrc+"/template/"+data.iconFontName;
			zip.file(iconPath+".html", fontHtml.getHtml());
			zip.file(iconPath+".css", fontCss.getHtml());
		}
		var content = zip.generate({type:"blob"});
		saveAs(content, "gulp-generator.zip");
	},
	getZippedUrl:function(){
		var zip = new JSZip();
		var data = this.data;
		var strings = JSON.stringify(data);
		zip.file('data', strings);
		var hash = zip.generate({ type: "base64" });
		var key = "AIzaSyCWP_hFdFq5rvUIgaZA6woBYipqm_idMCY";
		location.hash = hash;
		var url = location.href;
		location.hash = "";
		$.ajax({
			url: "https://www.googleapis.com/urlshortener/v1/url?key=" + key,
	        type: "POST",
	        contentType: "application/json; charset=utf-8",
	        data: JSON.stringify({
	          longUrl: url,
	        }),
	        dataType: "json",
	        success: function(res) {
	        	this.data.shortenedUrl = res.id;
	        	this.data.generatorModalMode = "active";
	        	this.method.refresh.apply(form);
	        	$(".generatorModal")
	        	.delayAddClass("active",100)
	        	.delayAddClass("show",100);
	        },
		})
	},
	hideModal:function(e,a){
		if($(this.e.target).hasClass("generatorModal")){
			$(".generatorModal")
		    .delayRemoveClass("show",100)
		    .delayRemoveClass("active",100);
		}
	}
});
console.log("test");
generator.update();