jQuery.sap.registerPreloadedModules({
	"version": "2.0",
	"name": "mii.util.library-preload",
	"modules": {
		"mii/util/library.js": "sap.ui.define([\"sap/ui/core/library\"],function(){\"use strict\";sap.ui.getCore().initLibrary({name:\"mii.util\",version:\"0.1.7\",dependencies:[\"sap.ui.core\"],types:[],interfaces:[],controls:[],elements:[\"mii.util.model.illum.QueryTemplateModel\",\"mii.util.model.illum.MIIMessageParser\"],noLibraryCSS:!0});var e=mii.util;return e.QueryTemplateType={AggregateQuery:\"AggregateQuery\",AlarmQuery:\"AlarmQuery\",OLAPQuery:\"OLAPQuery\",MDOQuery:\"MDOQuery\",KPIFrameworkQuery:\"KPIFrameworkQuery\",SQLQuery:\"MDOQuery\",TagQuery:\"SQLQuery\",XacuteQuery:\"XacuteQuery\",XMLQuery:\"XMLQuery\",PCoQuery:\"PCoQuery\",CatalogQuery:\"CatalogQuery\"},e.operationMode={Create:\"INSERT\",Read:\"SELECT\",Update:\"UPDATE\",Delete:\"DELETE\"},e});",
		"mii/util/model/illum/MIIMessageParser.js": "sap.ui.define([\"sap/ui/core/message/MessageParser\",\"sap/ui/core/message/Message\"],function(s,e){return s.extend(\"mii.util.model.illum.MIIMessageParser\",{parse:function(s){var r,a;sap.ui.core.MessageType.Information,sap.ui.core.MessageType.Warning,sap.ui.core.MessageType.Error,r=[],a=this.getProcessor(),$.each(s.messages,function(s,o){r.push(new e({message:o,type:sap.ui.core.MessageType.Information,processor:a}))}),this.getProcessor().fireMessageChange({oldMessages:this.aLastMessages,newMessages:r}),this.aLastMessages=r},setProcessor:function(s){this._oProcessor=s},getProcessor:function(){return this._oProcessor}})});",
		"mii/util/model/illum/QueryTemplateModel.js": "sap.ui.define([\"jquery.sap.global\",\"sap/ui/model/json/JSONModel\",\"./MIIMessageParser\"],function(e,t,s){\"use strict\";var r=t.extend(\"mii.util.model.illum.QueryTemplateModel\",{constructor:function(e,r){this._oMessageParser=new s,this._oMessageParser.setProcessor(this),r&&(this.bPreventInitialLoad=r.preventInitialLoad||!1,this.bPreventParameterlessLoad=r.preventParameterlessLoad||!1,this.bIgnoreFatalError=r.ignoreFatalError||!1,this.bCheckReturnRequired=r.checkReturnRequired||!1,this.aRequiredRowsets=r.requiredRowsets||[0]),\"string\"==typeof e&&(this._sServiceUrl=e),t.prototype.constructor.apply(this,arguments)}});return r.prototype.loadData=function(e,t,s,r,a,o,i){return this._sServiceUrl||(this._sServiceUrl=e),this.bPreventInitialLoad?(this.bPreventInitialLoad=null,Promise.resolve()):!e||!t&&this.bPreventParameterlessLoad?Promise.reject(new Error(\"Method loadData() is missing either sUrl or oParameters (while preventing parameterless load).\")):this.loadMiiData(e,t,s,r,a,o,i)},r.prototype.loadMiiData=function(t,s,r,a,o,i,n){var u,l,r=!1!==r,o=!0===o,a=\"POST\"===a?a:\"GET\",i=!0===i,c=t;l=this.buildIllumParamList(s);var d=function(t){var s,n;if(t){try{t.success=!this.hasError(t),t.lastErrorMessage=this.getError(t),t.messages=this._compressMessages(t)}catch(e){s=new Error(e)}this._oMessageParser.parse(t),t.success||this.bIgnoreFatalError||(s=new Error(t.lastErrorMessage||\"Fatal Error within MII transaction!\")),this.bCheckReturnRequired&&(this.aRequiredRowsets.every(function(e){return n=e,t.rowsets[e]&&t.rowsets[e].length>0})||(s=new Error(\"Rowset [\"+n+\"] is marked as mandatory, but no Rows has been returned!\")))}else e.sap.log.fatal(\"The following problem occurred: No data was retrieved by MII service '\"+c+\"'\"),s=new Error(\"No data was retrieved by MII service '\"+c+\"'\");return this.fireRequestCompleted({url:c,type:a,async:r,info:\"cache=\"+i+\";bMerge=\"+o,infoObject:{cache:i,merge:o},success:!0}),s?Promise.reject(s):(this.setData(t,o),Promise.resolve(t))}.bind(this),h=function(t){var s={message:t.textStatus||t.statusText||\"\",statusCode:t.request?t.request.status:t.status,statusText:t.request?t.request.statusText:t.statusText,responseText:t.request?t.request.responseText:t.responseText};return e.sap.log.fatal(\"The following problem occurred: \"+s.statusText,s.responseText+\",\"+s.statusCode+\",\"+s.message),this.fireRequestCompleted({url:c,type:a,async:r,info:\"cache=\"+i+\";bMerge=\"+o,infoObject:{cache:i,merge:o},success:!1,errorobject:s}),this.fireRequestFailed(s),Promise.reject(s)}.bind(this),p=function(e,t){this._ajax({url:c,async:r,dataType:\"json\",cache:i,data:l,type:a,success:e,error:t})}.bind(this);if(r)return u=new Promise(function(e,t){var s=function(e,s,r){t({request:e,textStatus:s,error:r})};p(function(t){e(t)},s)}),u.then(d,h);p(d,h)},r.prototype.buildIllumParamList=function(e){return this._validateMiiParameters(),e},r.prototype.hasError=function(e){return(e=e||this.getData())&&!!e.d.results[0].FatalError},r.prototype.getError=function(e){return(e=e||this.getData())&&e.d.results[0].FatalError},r.prototype.hasRowsAtRowsetIndex=function(e,t){var s=!0;return e=e||this.getData(),t=t||0,s=s&&e&&e.d.results[0].Rowset.results[t],s=s&&e&&e.d.results[0].Rowset.results[t].Row,s=s&&e&&e.d.results[0].Rowset.results[t].Row.results,s=s&&e&&e.d.results[0].Rowset.results[t].Row.results.length>0},r.prototype.getRowsAtRowsetIndex=function(e,t){if(e=e||this.getData(),t=t||0,this.hasRowsAtRowsetIndex(e,t))return e.d.results[0].Rowset.results[t].Row.results},r.prototype._compressRows=function(e){return e=e||this.getData(),e.d.results[0].Rowset&&e.d.results[0].Rowset.results?e.d.results[0].Rowset.results.map(function(e){return e.Row&&e.Row.results?this._removeMetadata(e.Row.results):[]}.bind(this)):[]},r.prototype._removeMetadata=function(e){var t=function(e){return delete e.__metadata,e};return Array.isArray(e)?e.map(function(e){return t(e)}):t(e)},r.prototype._compressMessages=function(e){return e=e||this.getData(),e.d.results[0].Messages&&e.d.results[0].Messages.results?e.d.results[0].Messages.results.map(function(e){return e.Message}):[]},r.prototype._validateMiiParameters=function(e){return!0},r});",
		"mii/util/type/illum/Column.js": "sap.ui.define([\"jquery.sap.global\",\"mii/util/library\",\"sap/ui/base/ManagedObject\"],function(t,e,i){\"use strict\";return i.extend(\"mii.util.model.type.Column\",{metadata:{library:\"mii.util\",properties:{name:{type:\"string\"},description:{type:\"string\"},sourceColumn:{type:\"string\"},minRange:{type:\"int\",defaultValue:0},maxRange:{type:\"int\",defaultValue:1},SQLDataType:{type:\"int\"}}},constructor:function(t){i.apply(this,arguments)}})},!0);",
		"mii/util/type/illum/DataItem.js": "sap.ui.define([\"jquery.sap.global\",\"mii/util/library\",\"sap/ui/base/ManagedObject\"],function(t,i,e){\"use strict\";return e.extend(\"mii.util.type.illuminator.DataItem\",{metadata:{library:\"mii.util\",properties:{rowId:{type:\"int\",defaultValue:0,bindable:!1}},defaultProperty:\"rowId\",aggregations:{attributes:{type:\"any\",multiple:!0,singularName:\"attribute\"}},defaultAggregation:\"properties\",association:{columnRef:{type:\"mii.util.type.illuminator.Colmn\",multiple:!1}}},constructor:function(t){e.apply(this,arguments)}})},!0);",
		"mii/util/type/illum/FatalError.js": "sap.ui.define([\"jquery.sap.global\",\"mii/util/library\",\"sap/ui/base/ManagedObject\"],function(i,t,r){\"use strict\";return r.extend(\"mii.util.type.illuminator.FatalError\",{metadata:{library:\"mii.util\",properties:{fatalError:{type:\"string\"}}},constructor:function(i){r.apply(this,arguments)}})},!0);",
		"mii/util/type/illum/Message.js": "sap.ui.define([\"jquery.sap.global\",\"mii/util/library\",\"sap/ui/base/ManagedObject\"],function(i,t,e){\"use strict\";return e.extend(\"mii.util.type.illuminator.Message\",{metadata:{library:\"mii.util\",properties:{message:{type:\"string\"}}},constructor:function(i){e.apply(this,arguments)}})},!0);",
		"mii/util/type/illum/Row.js": "sap.ui.define([\"jquery.sap.global\",\"mii/util/library\",\"sap/ui/base/ManagedObject\"],function(t,i,e){\"use strict\";return e.extend(\"mii.util.type.illuminator.Row\",{metadata:{library:\"mii.util\",properties:{rowId:{type:\"int\",defaultValue:0}},defaultProperty:\"rowId\",aggregations:{dataItems:{type:\"mii.util.type.illuminator.DataItem\",multiple:!0,singularName:\"dataItem\"}},defaultAggregation:\"properties\",association:{columnRef:{type:\"mii.util.type.illuminator.Column\",multiple:!1}}},constructor:function(t){e.apply(this,arguments)}})},!0);",
		"mii/util/type/illum/Rowset.js": "sap.ui.define([\"jquery.sap.global\",\"mii/util/library\",\"sap/ui/base/ManagedObject\"],function(t,i,e){\"use strict\";var l=e.extend(\"mii.util.type.illuminator.Rowset\",{metadata:{library:\"mii.util\",properties:{rowsetId:{type:\"int\",defaultValue:0},queryTemplate:{type:\"string\"}},defaultProperty:\"rowsetId\",aggregations:{rows:{type:\"mii.util.type.illuminator.Row\",multiple:!0,singularName:\"row\"},columns:{type:\"mii.util.type.illuminator.Column\",multiple:!0,singularName:\"column\"}},defaultAggregation:\"rows\"},constructor:function(t){e.apply(this,arguments),this.setRowsetId(t.RowsetId),this.setQueryTemplate(t.QueryTemplate),this.setMiiData(t)}});return l.prototype.setMiiData=function(i){var e=i.Column.results,l=i.Row.results;t.each(e,function(t,i){this.addColumn(new mii.util.type.illuminator.Column(i))}).bind(this),t.each(l,function(t,i){this.addRow(new mii.util.type.illuminator.Row(i))}).bind(this)},l},!0);",
		"mii/util/type/illum/Rowsets.js": "sap.ui.define([\"jquery.sap.global\",\"./library\",\"sap/ui/base/Object\"],function(e,t,a){\"use strict\";var i=a.extend(\"mii.util.MIIQueryTemplate\",{metadata:{abstract:!0,library:\"mii.util\",properties:{name:{type:\"string\"},serviceUrl:{type:\"string\",defaultValue:\"/XMII/IlluminatorOData\"},jsonModel:{type:\"sap.ui.model.json.JSONModel\"},queryTemplateType:{type:\"mii.util.QueryTemplateType\"},queryTemplatePath:{type:\"string\"}},publicMethods:[\"setMiiData\",\"getMiiData\"]},constructor:function(e){a.apply(this,arguments),this.setQueryTemplateType(e)}});return i.prototype.alert=function(){alert()},i},!0);",
		"mii/util/type/illum/RowsetsObject.js": "sap.ui.define([\"jquery.sap.global\",\"./library\",\"sap/ui/base/ManagedObject\"],function(t,e,i){\"use strict\";var a=i.extend(\"mii.util.RowsetsObject\",{metadata:{library:\"mii.util\",properties:{fatalError:{type:\"mii.util.type.illuminator.FatalError\"},queryTemplate:{type:\"string\"},startDate:{type:\"string\"},endDate:{type:\"string\"},dateCreated:{type:\"string\"},version:{type:\"string\"}},aggregations:{rowsets:{type:\"mii.util.type.illuminator.Rowset\",multiple:!0,singularName:\"rowset\"},messages:{type:\"mii.util.type.illuminator.Message\",multiple:!0,singularName:\"message\"}},publicMethods:[\"setMiiData\"]},constructor:function(t){i.apply(this,arguments),this.iDefaultLength=1,this.iDefaultIndex=0,this._checkRowsetsPropertiesValid=function(){var t=this._oData.d.results;return!(!t||t.length!==this.iDefaultLength)&&!!(t[this.iDefaultIndex].QueryTemplate&&t[this.iDefaultIndex].StartDate&&t[this.iDefaultIndex].EndDate&&t[this.iDefaultIndex].DateCreated&&t[this.iDefaultIndex].Version)},t&&this.setMiiData(t)}});return a.prototype.setMiiData=function(e){var i,a;if(!e||!e.data)throw\"MII data object is not provided!\";if(!e.data.d)throw\"Non-Odata Illuminator response is currently not supported!\";this._oData=e.data,this._checkRowsetsPropertiesValid()&&(i=this._oData.d.results[0],this.setQueryTemplate(i.QueryTemplate),this.setStartDate(i.StartDate),this.setEndDate(i.EndDate),this.setDateCreated(i.DateCreated),this.setVersion(i.Version)),a=i.Rowset.results,t.each(a,function(t,e){this.addRowset(new mii.util.type.illuminator.Rowset(e))}).bind(this)},a},!0);",
		"mii/util/messagebundle.properties": "libraryTitle=MII Utilities\nlibraryDescription=Library for MII Utilities in UI5"
	}
});