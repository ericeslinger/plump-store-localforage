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

//# sourceMappingURL=data:application/json;charset=utf8;base64,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RCwrQkFBSSxHQUFKLFVBQUssQ0FBUyxFQUFFLENBQVk7UUFDMUIsTUFBTSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDekQsQ0FBQztJQUVELCtCQUFJLEdBQUosVUFBSyxDQUFTO1FBQ1osTUFBTSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsY0FBTSxPQUFBLElBQUksRUFBSixDQUFJLENBQXVCLENBQUM7SUFDaEcsQ0FBQztJQUNILHVCQUFDO0FBQUQsQ0FoREEsQUFnREMsQ0FoRHFDLHFCQUFhLEdBZ0RsRDtBQWhEWSw0Q0FBZ0IiLCJmaWxlIjoibG9jYWxmb3JhZ2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBsb2NhbGZvcmFnZSBmcm9tICdsb2NhbGZvcmFnZSc7XG5pbXBvcnQgeyBLZXlWYWx1ZVN0b3JlLCBNb2RlbERhdGEsIE1vZGVsU2NoZW1hLCBTdG9yYWdlT3B0aW9ucyB9IGZyb20gJ3BsdW1wJztcblxuZnVuY3Rpb24gc2FuZU51bWJlcihpKSB7XG4gIHJldHVybiAoKHR5cGVvZiBpID09PSAnbnVtYmVyJykgJiYgKCFpc05hTihpKSkgJiYgKGkgIT09IEluZmluaXR5KSAmJiAoaSAhPT0gLUluZmluaXR5KSk7XG59XG5cbmV4cG9ydCBjbGFzcyBMb2NhbEZvcmFnZVN0b3JlIGV4dGVuZHMgS2V5VmFsdWVTdG9yZSB7XG5cbiAgcHJpdmF0ZSBsb2NhbGZvcmFnZTtcblxuICBjb25zdHJ1Y3RvcihvcHRzOiBTdG9yYWdlT3B0aW9ucyAmIHtuYW1lPzogc3RyaW5nLCBzdG9yZU5hbWU/OiBzdHJpbmd9ID0ge30pIHtcbiAgICBzdXBlcihvcHRzKTtcbiAgICB0aGlzLmxvY2FsZm9yYWdlID0gbG9jYWxmb3JhZ2UuY3JlYXRlSW5zdGFuY2Uoe1xuICAgICAgbmFtZTogb3B0cy5uYW1lIHx8ICdQbHVtcCBTdG9yYWdlJyxcbiAgICAgIHN0b3JlTmFtZTogb3B0cy5zdG9yZU5hbWUgfHwgJ2xvY2FsQ2FjaGUnLFxuICAgIH0pO1xuICB9XG5cbiAgYWRkU2NoZW1hKHQ6IHt0eXBlOiBzdHJpbmcsIHNjaGVtYTogTW9kZWxTY2hlbWF9KSB7XG4gICAgcmV0dXJuIHN1cGVyLmFkZFNjaGVtYSh0KVxuICAgIC50aGVuKCgpID0+IHtcbiAgICAgIHJldHVybiB0aGlzLl9rZXlzKHQudHlwZSlcbiAgICAgIC50aGVuKChrZXlBcnJheSkgPT4ge1xuICAgICAgICBpZiAoa2V5QXJyYXkubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIGtleUFycmF5Lm1hcCgoaykgPT4gay5zcGxpdCgnOicpWzFdKVxuICAgICAgICAgIC5tYXAoKGspID0+IHBhcnNlSW50KGssIDEwKSlcbiAgICAgICAgICAuZmlsdGVyKChpKSA9PiBzYW5lTnVtYmVyKGkpKVxuICAgICAgICAgIC5yZWR1Y2UoKG1heCwgY3VycmVudCkgPT4gKGN1cnJlbnQgPiBtYXgpID8gY3VycmVudCA6IG1heCwgMCk7XG4gICAgICAgIH1cbiAgICAgIH0pLnRoZW4oKG4pID0+IHtcbiAgICAgICAgdGhpcy5tYXhLZXlzW3QudHlwZV0gPSBuO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuXG4gIF9rZXlzKHR5cGU6IHN0cmluZyk6IFByb21pc2U8c3RyaW5nW10+IHtcbiAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHRoaXMubG9jYWxmb3JhZ2Uua2V5cygpKVxuICAgIC50aGVuKChrZXlBcnJheSkgPT4ga2V5QXJyYXkuZmlsdGVyKChrKSA9PiBrLmluZGV4T2YoYCR7dHlwZX06YCkgPT09IDApKTtcbiAgfVxuXG4gIF9nZXQoazogc3RyaW5nKTogUHJvbWlzZTxNb2RlbERhdGE+IHtcbiAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHRoaXMubG9jYWxmb3JhZ2UuZ2V0SXRlbShrKSkgYXMgUHJvbWlzZTxNb2RlbERhdGE+O1xuICB9XG5cbiAgX3NldChrOiBzdHJpbmcsIHY6IE1vZGVsRGF0YSkge1xuICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUodGhpcy5sb2NhbGZvcmFnZS5zZXRJdGVtKGssIHYpKTtcbiAgfVxuXG4gIF9kZWwoazogc3RyaW5nKTogUHJvbWlzZTxNb2RlbERhdGE+IHtcbiAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHRoaXMubG9jYWxmb3JhZ2UucmVtb3ZlSXRlbShrKSkudGhlbigoKSA9PiBudWxsKSBhcyBQcm9taXNlPE1vZGVsRGF0YT47XG4gIH1cbn1cbiJdfQ==
