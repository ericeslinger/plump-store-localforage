"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var localforage = require("localforage");
var plump_1 = require("plump");
function saneNumber(i) {
    return ((typeof i === 'number') && (!isNaN(i)) && (i !== Infinity) && (i !== -Infinity));
}
var LocalForageStore = (function (_super) {
    __extends(LocalForageStore, _super);
    function LocalForageStore(opts) {
        if (opts === void 0) { opts = {}; }
        var _this = _super.call(this, opts) || this;
        _this.localforage = localforage.createInstance({
            name: opts.name || 'Plump Storage',
            storeName: opts.storeName || 'localCache',
        });
        return _this;
    }
    LocalForageStore.prototype.addSchema = function (t) {
        var _this = this;
        return _super.prototype.addSchema.call(this, t)
            .then(function () {
            return _this._keys(t.type)
                .then(function (keyArray) {
                if (keyArray.length === 0) {
                    return 0;
                }
                else {
                    return keyArray.map(function (k) { return k.split(':')[1]; })
                        .map(function (k) { return parseInt(k, 10); })
                        .filter(function (i) { return saneNumber(i); })
                        .reduce(function (max, current) { return (current > max) ? current : max; }, 0);
                }
            }).then(function (n) {
                _this.maxKeys[t.type] = n;
            });
        });
    };
    LocalForageStore.prototype._keys = function (type) {
        return Promise.resolve(this.localforage.keys())
            .then(function (keyArray) { return keyArray.filter(function (k) { return k.indexOf(type + ":") === 0; }); });
    };
    LocalForageStore.prototype._get = function (k) {
        return Promise.resolve(this.localforage.getItem(k));
    };
    LocalForageStore.prototype._set = function (k, v) {
        return Promise.resolve(this.localforage.setItem(k, v));
    };
    LocalForageStore.prototype._del = function (k) {
        return Promise.resolve(this.localforage.removeItem(k)).then(function () { return null; });
    };
    return LocalForageStore;
}(plump_1.KeyValueStore));
exports.LocalForageStore = LocalForageStore;

//# sourceMappingURL=data:application/json;charset=utf8;base64,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LENBQUM7SUFDNUUsQ0FBQztJQUVELCtCQUFJLEdBQUosVUFBSyxDQUFTLEVBQUUsQ0FBWTtRQUMxQixNQUFNLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUN6RCxDQUFDO0lBRUQsK0JBQUksR0FBSixVQUFLLENBQVM7UUFDWixNQUFNLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxjQUFNLE9BQUEsSUFBSSxFQUFKLENBQUksQ0FBdUIsQ0FBQztJQUNoRyxDQUFDO0lBQ0gsdUJBQUM7QUFBRCxDQWhEQSxBQWdEQyxDQWhEcUMscUJBQWEsR0FnRGxEO0FBaERZLDRDQUFnQiIsImZpbGUiOiJsb2NhbGZvcmFnZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGxvY2FsZm9yYWdlIGZyb20gJ2xvY2FsZm9yYWdlJztcbmltcG9ydCB7IEtleVZhbHVlU3RvcmUsIE1vZGVsRGF0YSwgTW9kZWxTY2hlbWEsIFN0b3JhZ2VPcHRpb25zIH0gZnJvbSAncGx1bXAnO1xuXG5mdW5jdGlvbiBzYW5lTnVtYmVyKGkpIHtcbiAgcmV0dXJuICgodHlwZW9mIGkgPT09ICdudW1iZXInKSAmJiAoIWlzTmFOKGkpKSAmJiAoaSAhPT0gSW5maW5pdHkpICYmIChpICE9PSAtSW5maW5pdHkpKTtcbn1cblxuZXhwb3J0IGNsYXNzIExvY2FsRm9yYWdlU3RvcmUgZXh0ZW5kcyBLZXlWYWx1ZVN0b3JlIHtcblxuICBwcml2YXRlIGxvY2FsZm9yYWdlO1xuXG4gIGNvbnN0cnVjdG9yKG9wdHM6IFN0b3JhZ2VPcHRpb25zICYge25hbWU/OiBzdHJpbmcsIHN0b3JlTmFtZT86IHN0cmluZ30gPSB7fSkge1xuICAgIHN1cGVyKG9wdHMpO1xuICAgIHRoaXMubG9jYWxmb3JhZ2UgPSBsb2NhbGZvcmFnZS5jcmVhdGVJbnN0YW5jZSh7XG4gICAgICBuYW1lOiBvcHRzLm5hbWUgfHwgJ1BsdW1wIFN0b3JhZ2UnLFxuICAgICAgc3RvcmVOYW1lOiBvcHRzLnN0b3JlTmFtZSB8fCAnbG9jYWxDYWNoZScsXG4gICAgfSk7XG4gIH1cblxuICBhZGRTY2hlbWEodDoge3R5cGU6IHN0cmluZywgc2NoZW1hOiBNb2RlbFNjaGVtYX0pIHtcbiAgICByZXR1cm4gc3VwZXIuYWRkU2NoZW1hKHQpXG4gICAgLnRoZW4oKCkgPT4ge1xuICAgICAgcmV0dXJuIHRoaXMuX2tleXModC50eXBlKVxuICAgICAgLnRoZW4oKGtleUFycmF5KSA9PiB7XG4gICAgICAgIGlmIChrZXlBcnJheS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4ga2V5QXJyYXkubWFwKChrKSA9PiBrLnNwbGl0KCc6JylbMV0pXG4gICAgICAgICAgLm1hcCgoaykgPT4gcGFyc2VJbnQoaywgMTApKVxuICAgICAgICAgIC5maWx0ZXIoKGkpID0+IHNhbmVOdW1iZXIoaSkpXG4gICAgICAgICAgLnJlZHVjZSgobWF4LCBjdXJyZW50KSA9PiAoY3VycmVudCA+IG1heCkgPyBjdXJyZW50IDogbWF4LCAwKTtcbiAgICAgICAgfVxuICAgICAgfSkudGhlbigobikgPT4ge1xuICAgICAgICB0aGlzLm1heEtleXNbdC50eXBlXSA9IG47XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG5cbiAgX2tleXModHlwZTogc3RyaW5nKTogUHJvbWlzZTxzdHJpbmdbXT4ge1xuICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUodGhpcy5sb2NhbGZvcmFnZS5rZXlzKCkpXG4gICAgLnRoZW4oKGtleUFycmF5KSA9PiBrZXlBcnJheS5maWx0ZXIoKGspID0+IGsuaW5kZXhPZihgJHt0eXBlfTpgKSA9PT0gMCkpO1xuICB9XG5cbiAgX2dldChrOiBzdHJpbmcpOiBQcm9taXNlPE1vZGVsRGF0YT4ge1xuICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUodGhpcy5sb2NhbGZvcmFnZS5nZXRJdGVtKGspKSBhcyBQcm9taXNlPE1vZGVsRGF0YT47XG4gIH1cblxuICBfc2V0KGs6IHN0cmluZywgdjogTW9kZWxEYXRhKSB7XG4gICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh0aGlzLmxvY2FsZm9yYWdlLnNldEl0ZW0oaywgdikpO1xuICB9XG5cbiAgX2RlbChrOiBzdHJpbmcpOiBQcm9taXNlPE1vZGVsRGF0YT4ge1xuICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUodGhpcy5sb2NhbGZvcmFnZS5yZW1vdmVJdGVtKGspKS50aGVuKCgpID0+IG51bGwpIGFzIFByb21pc2U8TW9kZWxEYXRhPjtcbiAgfVxufVxuIl19
