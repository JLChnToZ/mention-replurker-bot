"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function readlineQuestionPromise(readline, question) {
    return new Promise(function (resolve) { return readline.question(question, resolve); });
}
exports.readlineQuestionPromise = readlineQuestionPromise;
function delay(timeout, value) {
    return new Promise(function (resolve) { return setTimeout(resolve, timeout, value); });
}
exports.delay = delay;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvdXRpbHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFFQSxTQUFnQix1QkFBdUIsQ0FBQyxRQUFrQixFQUFFLFFBQWdCO0lBQzFFLE9BQU8sSUFBSSxPQUFPLENBQVMsVUFBQSxPQUFPLElBQUksT0FBQSxRQUFRLENBQUMsUUFBUSxDQUFDLFFBQVEsRUFBRSxPQUFPLENBQUMsRUFBcEMsQ0FBb0MsQ0FBQyxDQUFDO0FBQzlFLENBQUM7QUFGRCwwREFFQztBQUlELFNBQWdCLEtBQUssQ0FBQyxPQUFlLEVBQUUsS0FBVztJQUNoRCxPQUFPLElBQUksT0FBTyxDQUFNLFVBQUEsT0FBTyxJQUFJLE9BQUEsVUFBVSxDQUFDLE9BQU8sRUFBRSxPQUFPLEVBQUUsS0FBSyxDQUFDLEVBQW5DLENBQW1DLENBQUMsQ0FBQztBQUMxRSxDQUFDO0FBRkQsc0JBRUMifQ==