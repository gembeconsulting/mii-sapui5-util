/**
 * JSON-based DataBinding for MII Services
 */

// Provides the JSON object based model implementation
sap.ui.define(["jquery.sap.global", "sap/ui/model/json/JSONModel", "mii/util/libs/validatejs/validate"],
	function(jQuery, JSONModel, validate) {
		"use strict";

		/**
		 * Constructor for a new QueryTemplateModel.
		 *
		 * @class
		 * Model implementation for JSON based MII Services
		 *
		 * @extends sap.ui.model.JSONModel
		 *
		 * @author Philipp Gembe
		 * @version 0.1
		 *
		 * @param {object} oData either the URL where to load the JSON from or a JS object
		 * @param {object} oURLParameters
		 * @public
		 */
		var QueryTemplateModel = JSONModel.extend("mii.util.model.illum.QueryTemplateModel", /** @lends mii.util.model.illum.QueryTemplateModel.prototype */ {
			constructor: function(oData, oParameters) {

				if (oParameters) {
					this.bPreventInitialLoad = oParameters.preventInitialLoad || false; //true, false, null (if it was true)
				}

				if (typeof oData == "string") {
					this._sServiceUrl = oData;
				}

				JSONModel.apply(this, arguments);

			}
		});

		/**
		 * Override JSON Models loadData method, to only load data, if oParameters is given. 
		 * This is to ensure having proper input data for MII QueryTemplate
		 * @public
		 */
		QueryTemplateModel.prototype.loadData = function(sUrl, oParameters, bAsync, sType, bMerge, bCache, mHeaders) {

			if (!this._sServiceUrl) {
				this._sServiceUrl = sUrl;
			}

			if (this.bPreventInitialLoad) {
				this.bPreventInitialLoad = null;
				return;
			};

			if (!sUrl || !oParameters) {
				jQuery.sap.log.warning("Method loadData() is missing either sUrl or oParameters. Data not loaded.", null, this.toString());

				return;
			}
			return this.loadMiiData(sUrl, oParameters, bAsync, sType, bMerge, bCache);
			//JSONModel.prototype.loadData.apply(this, [sUrl, oParameters, bAsync, sType, bMerge, bCache, mHeaders]);

		};

		QueryTemplateModel.prototype.loadMiiData = function(sUrl, oParameters, bAsync, sType, bMerge, bCache) {

			var bAsync = (bAsync !== false), // false if flase, true in all other cases (null, undefined, 1, "X", ...)
				bMerge = (bMerge === true), // true if true, false in all other cases
				sType = sType === "POST" ? sType : "GET", // only allow GET (defaut) and POST
				bCache = (bCache === true), // true if true, false in all other cases
				pImportCompleted,
				sMiiQueryServiceUrl = sUrl,
				oMiiQueryParameters;

			oMiiQueryParameters = this.buildIllumParamList(oParameters);
			
			// success function to set data to the model and fire request complete event
			var fnSuccess = function(oData) {
				if (!oData) {
					jQuery.sap.log.fatal("The following problem occurred: No data was retrieved by MII service: " + sMiiQueryServiceUrl);
				}
				this.setData(oData, bMerge);
				this.fireRequestCompleted({
					url: sMiiQueryServiceUrl,
					type: sType,
					async: bAsync,
					info: "cache=" + bCache + ";bMerge=" + bMerge,
					infoObject: {
						cache: bCache,
						merge: bMerge
					},
					success: true
				});
			}.bind(this);
			
			// error function to return error object and fire request complete event
			var fnError = function(oParams) {
				var oError = {
					message: oParams.textStatus || oParams.statusText || "",
					statusCode: oParams.request ? oParams.request.status : oParams.status,
					statusText: oParams.request ? oParams.request.statusText : oParams.statusText,
					responseText: oParams.request ? oParams.request.responseText : oParams.responseText
				};
				jQuery.sap.log.fatal("The following problem occurred: " + oError.statusText, oError.responseText + "," + oError.statusCode +
					"," + oError.message);

				this.fireRequestCompleted({
					url: sMiiQueryServiceUrl,
					type: sType,
					async: bAsync,
					info: "cache=" + bCache + ";bMerge=" + bMerge,
					infoObject: {
						cache: bCache,
						merge: bMerge
					},
					success: false,
					errorobject: oError
				});
				this.fireRequestFailed(oError);
			}.bind(this);

			var _loadData = function(fnSuccess, fnError) {
				this._ajax({
					url: sMiiQueryServiceUrl,
					async: bAsync,
					dataType: 'json',
					cache: bCache,
					data: oMiiQueryParameters,
					type: sType,
					success: fnSuccess,
					error: fnError
				});
			}.bind(this);

			if (bAsync) {
				pImportCompleted = new Promise(function(resolve, reject) {

					var fnReject = function(oXMLHttpRequest, sTextStatus, oError) {
						var oReject = {
							request: oXMLHttpRequest,
							textStatus: sTextStatus,
							error: oError
						};
						jQuery.sap.log.error("Error on ajax call: ", JSON.stringify(oReject), this.toString());
						reject(oReject);
					};
					
					var fnResolve = function(oData){
						resolve(oData);	
					};

					_loadData(fnResolve, fnReject);

				});

				return pImportCompleted.then(fnSuccess, fnError);

			} else {
				_loadData(fnSuccess, fnError);
			}

		};

		QueryTemplateModel.prototype.buildIllumParamList = function(oMiiQueryTemplateParams) {

			// hier werden wir notwendige mappings durchführen

			this._validateMiiParameters();

			return oMiiQueryTemplateParams;

		};
		QueryTemplateModel.prototype._validateMiiParameters = function(oMiiQueryTemplateParams) {
			// hier werdn wir die Params gegen ein Schema vergleichen
			return true;
		};

		QueryTemplateModel.prototype.getIllumServiceUrl = function(sIllumServiceName) {
			sIllumServiceName = sIllumServiceName || "QueryTemplate";
			return this._sBaseUrl + sIllumServiceName;
		};

		return QueryTemplateModel;

	});