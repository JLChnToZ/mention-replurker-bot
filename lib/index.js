"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
require("source-map-support/register");
var fs_1 = require("fs");
var util_1 = require("util");
var readline_1 = require("readline");
var plurk2_1 = require("plurk2");
var utils_1 = require("./utils");
var readFileAsync = util_1.promisify(fs_1.readFile);
var writeFileAsync = util_1.promisify(fs_1.writeFile);
var existsAsync = util_1.promisify(fs_1.exists);
var CONFIG_FILE_PATH = 'config.json';
var keyword = /徵友/;
var replurkNotify = { qualifier: 'has', content: '已轉噗' };
var replurkRestrictedNotify = { qualifier: ':', content: '這功能只能由噗主使用' };
function nickName2Reply(nickName) {
    return "@" + nickName + ":";
}
var replurkIds = new Set();
var rejectedIds = new Map();
function main() {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var e_1, _a, e_2, _b, e_3, _c, e_4, _d, config, _e, _f, _g, requireSave, tokenReady, rl, _h, _j, client, e_5, rl, verifier, alerts, alerts_1, alerts_1_1, alert, mentioned, plurk, rejectNotify, e_6, e_1_1, result, replurkIds_1, replurkIds_1_1, id, results, id, i, e_7, replurkIds_2, replurkIds_2_1, plurk_id, e_8, e_3_1, rejectedIds_1, rejectedIds_1_1, kvp, reply, e_9, e_4_1;
        return tslib_1.__generator(this, function (_k) {
            switch (_k.label) {
                case 0: return [4, existsAsync(CONFIG_FILE_PATH)];
                case 1:
                    if (!(_k.sent())) return [3, 3];
                    _g = (_f = JSON).parse;
                    return [4, readFileAsync(CONFIG_FILE_PATH, 'utf-8')];
                case 2:
                    _e = _g.apply(_f, [_k.sent()]);
                    return [3, 4];
                case 3:
                    _e = {};
                    _k.label = 4;
                case 4:
                    config = _e;
                    requireSave = false, tokenReady = false;
                    if (!(!config.consumerKey || !config.consumerSecret)) return [3, 7];
                    rl = readline_1.createInterface({ input: process.stdin, output: process.stdout });
                    _h = config;
                    return [4, utils_1.readlineQuestionPromise(rl, 'Consumer Key: ')];
                case 5:
                    _h.consumerKey = _k.sent();
                    _j = config;
                    return [4, utils_1.readlineQuestionPromise(rl, 'Consumer Secret: ')];
                case 6:
                    _j.consumerSecret = _k.sent();
                    rl.close();
                    requireSave = true;
                    _k.label = 7;
                case 7:
                    client = new plurk2_1.PlurkClient(config.consumerKey, config.consumerSecret);
                    if (!(config.accessToken && config.accessTokenSecret)) return [3, 11];
                    client.token = config.accessToken;
                    client.tokenSecret = config.accessTokenSecret;
                    _k.label = 8;
                case 8:
                    _k.trys.push([8, 10, , 11]);
                    return [4, client.request('checkToken')];
                case 9:
                    _k.sent();
                    console.log('Exists token detected!');
                    tokenReady = true;
                    return [3, 11];
                case 10:
                    e_5 = _k.sent();
                    console.error(e_5.stack || e_5);
                    return [3, 11];
                case 11:
                    if (!!tokenReady) return [3, 15];
                    return [4, client.getRequestToken()];
                case 12:
                    _k.sent();
                    console.log('Please go to this page to get your verifier code:', client.authPage);
                    rl = readline_1.createInterface({ input: process.stdin, output: process.stdout });
                    return [4, utils_1.readlineQuestionPromise(rl, 'Verifier code: ')];
                case 13:
                    verifier = _k.sent();
                    rl.close();
                    return [4, client.getAccessToken(verifier)];
                case 14:
                    _k.sent();
                    config.accessToken = client.token;
                    config.accessTokenSecret = client.tokenSecret;
                    requireSave = true;
                    _k.label = 15;
                case 15:
                    console.log('Login successfully!');
                    if (!requireSave) return [3, 17];
                    return [4, writeFileAsync(CONFIG_FILE_PATH, JSON.stringify(config, undefined, 2))];
                case 16:
                    _k.sent();
                    _k.label = 17;
                case 17:
                    if (!true) return [3, 56];
                    return [4, client.request('Alerts/getActive')];
                case 18:
                    alerts = _k.sent();
                    _k.label = 19;
                case 19:
                    _k.trys.push([19, 26, 27, 28]);
                    alerts_1 = tslib_1.__values(alerts), alerts_1_1 = alerts_1.next();
                    _k.label = 20;
                case 20:
                    if (!!alerts_1_1.done) return [3, 25];
                    alert = alerts_1_1.value;
                    if (alert.type !== "mentioned")
                        return [3, 24];
                    _k.label = 21;
                case 21:
                    _k.trys.push([21, 23, , 24]);
                    mentioned = alert;
                    return [4, client.request('Timeline/getPlurk', {
                            plurk_id: mentioned.plurk_id,
                            minimal_data: true,
                            minimal_user: true,
                        })];
                case 22:
                    plurk = (_k.sent()).plurk;
                    if (plurk.replurked || !keyword.test(plurk.content_raw))
                        return [3, 24];
                    if (plurk.owner_id !== mentioned.from_user.id) {
                        rejectNotify = rejectedIds.get(plurk.owner_id);
                        if (!rejectNotify)
                            rejectedIds.set(plurk.owner_id, rejectNotify = []);
                        rejectNotify.push(mentioned.from_user.nick_name);
                        return [3, 24];
                    }
                    replurkIds.add(plurk.plurk_id);
                    return [3, 24];
                case 23:
                    e_6 = _k.sent();
                    console.error(e_6.stack || e_6);
                    return [3, 24];
                case 24:
                    alerts_1_1 = alerts_1.next();
                    return [3, 20];
                case 25: return [3, 28];
                case 26:
                    e_1_1 = _k.sent();
                    e_1 = { error: e_1_1 };
                    return [3, 28];
                case 27:
                    try {
                        if (alerts_1_1 && !alerts_1_1.done && (_a = alerts_1.return)) _a.call(alerts_1);
                    }
                    finally { if (e_1) throw e_1.error; }
                    return [7];
                case 28:
                    if (!replurkIds.size) return [3, 32];
                    console.log('Collected these plurks requested to replurk:', tslib_1.__spread(replurkIds).join(', '));
                    _k.label = 29;
                case 29:
                    _k.trys.push([29, 31, , 32]);
                    return [4, client.request('Timeline/replurk', { ids: tslib_1.__spread(replurkIds) })];
                case 30:
                    result = _k.sent();
                    if (result.success) {
                        try {
                            for (replurkIds_1 = tslib_1.__values(replurkIds), replurkIds_1_1 = replurkIds_1.next(); !replurkIds_1_1.done; replurkIds_1_1 = replurkIds_1.next()) {
                                id = replurkIds_1_1.value;
                                rejectedIds.delete(id);
                            }
                        }
                        catch (e_2_1) { e_2 = { error: e_2_1 }; }
                        finally {
                            try {
                                if (replurkIds_1_1 && !replurkIds_1_1.done && (_b = replurkIds_1.return)) _b.call(replurkIds_1);
                            }
                            finally { if (e_2) throw e_2.error; }
                        }
                    }
                    else {
                        results = result.results;
                        replurkIds.clear();
                        for (id in results)
                            if (results[id].success) {
                                i = Number.parseInt(id);
                                replurkIds.add(i);
                                rejectedIds.delete(i);
                            }
                    }
                    return [3, 32];
                case 31:
                    e_7 = _k.sent();
                    console.error(e_7.stack || e_7);
                    replurkIds.clear();
                    return [3, 32];
                case 32:
                    if (!replurkIds.size) return [3, 43];
                    console.log('Successfully replurked these plurks:', tslib_1.__spread(replurkIds).join(', '));
                    _k.label = 33;
                case 33:
                    _k.trys.push([33, 40, 41, 42]);
                    replurkIds_2 = tslib_1.__values(replurkIds), replurkIds_2_1 = replurkIds_2.next();
                    _k.label = 34;
                case 34:
                    if (!!replurkIds_2_1.done) return [3, 39];
                    plurk_id = replurkIds_2_1.value;
                    _k.label = 35;
                case 35:
                    _k.trys.push([35, 37, , 38]);
                    return [4, client.request('Responses/responseAdd', Object.assign({ plurk_id: plurk_id }, replurkNotify))];
                case 36:
                    _k.sent();
                    return [3, 38];
                case 37:
                    e_8 = _k.sent();
                    console.error(e_8.stack || e_8);
                    return [3, 38];
                case 38:
                    replurkIds_2_1 = replurkIds_2.next();
                    return [3, 34];
                case 39: return [3, 42];
                case 40:
                    e_3_1 = _k.sent();
                    e_3 = { error: e_3_1 };
                    return [3, 42];
                case 41:
                    try {
                        if (replurkIds_2_1 && !replurkIds_2_1.done && (_c = replurkIds_2.return)) _c.call(replurkIds_2);
                    }
                    finally { if (e_3) throw e_3.error; }
                    return [7];
                case 42:
                    console.log('Notified all replurked users');
                    replurkIds.clear();
                    _k.label = 43;
                case 43:
                    if (!rejectedIds.size) return [3, 54];
                    console.log('These plurks are requested from non-owner:', tslib_1.__spread(rejectedIds.keys()).join(', '));
                    _k.label = 44;
                case 44:
                    _k.trys.push([44, 51, 52, 53]);
                    rejectedIds_1 = tslib_1.__values(rejectedIds), rejectedIds_1_1 = rejectedIds_1.next();
                    _k.label = 45;
                case 45:
                    if (!!rejectedIds_1_1.done) return [3, 50];
                    kvp = rejectedIds_1_1.value;
                    _k.label = 46;
                case 46:
                    _k.trys.push([46, 48, , 49]);
                    reply = Object.assign({ plurk_id: kvp[0] }, replurkRestrictedNotify);
                    reply.content = kvp[1].map(nickName2Reply).join('') + " " + reply.content;
                    return [4, client.request('Responses/responseAdd', reply)];
                case 47:
                    _k.sent();
                    return [3, 49];
                case 48:
                    e_9 = _k.sent();
                    console.error(e_9.stack || e_9);
                    return [3, 49];
                case 49:
                    rejectedIds_1_1 = rejectedIds_1.next();
                    return [3, 45];
                case 50: return [3, 53];
                case 51:
                    e_4_1 = _k.sent();
                    e_4 = { error: e_4_1 };
                    return [3, 53];
                case 52:
                    try {
                        if (rejectedIds_1_1 && !rejectedIds_1_1.done && (_d = rejectedIds_1.return)) _d.call(rejectedIds_1);
                    }
                    finally { if (e_4) throw e_4.error; }
                    return [7];
                case 53:
                    console.log('Notified all failed users');
                    rejectedIds.clear();
                    _k.label = 54;
                case 54: return [4, utils_1.delay(15000)];
                case 55:
                    _k.sent();
                    return [3, 17];
                case 56: return [2];
            }
        });
    });
}
void (main());
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsdUNBQXFDO0FBRXJDLHlCQUFpRDtBQUNqRCw2QkFBaUM7QUFDakMscUNBQTJDO0FBQzNDLGlDQUFxQztBQUVyQyxpQ0FBeUQ7QUFFekQsSUFBTSxhQUFhLEdBQUcsZ0JBQVMsQ0FBQyxhQUFRLENBQUMsQ0FBQztBQUMxQyxJQUFNLGNBQWMsR0FBRyxnQkFBUyxDQUFDLGNBQVMsQ0FBQyxDQUFDO0FBQzVDLElBQU0sV0FBVyxHQUFHLGdCQUFTLENBQUMsV0FBTSxDQUFDLENBQUM7QUFFdEMsSUFBTSxnQkFBZ0IsR0FBRyxhQUFhLENBQUM7QUFDdkMsSUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDO0FBQ3JCLElBQU0sYUFBYSxHQUFHLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLENBQUM7QUFDM0QsSUFBTSx1QkFBdUIsR0FBRyxFQUFFLFNBQVMsRUFBRSxHQUFHLEVBQUUsT0FBTyxFQUFFLFlBQVksRUFBRSxDQUFDO0FBQzFFLFNBQVMsY0FBYyxDQUFDLFFBQWdCO0lBQ3RDLE9BQU8sTUFBSSxRQUFRLE1BQUcsQ0FBQztBQUN6QixDQUFDO0FBU0QsSUFBTSxVQUFVLEdBQUcsSUFBSSxHQUFHLEVBQVUsQ0FBQztBQUNyQyxJQUFNLFdBQVcsR0FBRyxJQUFJLEdBQUcsRUFBb0IsQ0FBQztBQUVoRCxTQUFlLElBQUk7Ozs7O3dCQUNXLFdBQU0sV0FBVyxDQUFDLGdCQUFnQixDQUFDLEVBQUE7O3lCQUFwQyxDQUFDLFNBQW1DLENBQUMsRUFBckMsY0FBcUM7b0JBQzlELEtBQUEsQ0FBQSxLQUFBLElBQUksQ0FBQSxDQUFDLEtBQUssQ0FBQTtvQkFBQyxXQUFNLGFBQWEsQ0FBQyxnQkFBZ0IsRUFBRSxPQUFPLENBQUMsRUFBQTs7b0JBQXpELEtBQUEsY0FBVyxTQUE4QyxFQUFDLENB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