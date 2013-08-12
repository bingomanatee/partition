Partition.browserDetect = function () {
    !function (window, undefined) {
        "use strict";
        var EMPTY = "", UNKNOWN = "?", FUNC_TYPE = "function", UNDEF_TYPE = "undefined", OBJ_TYPE = "object", MAJOR = "major", MODEL = "model", NAME = "name", TYPE = "type", VENDOR = "vendor", VERSION = "version", ARCHITECTURE = "architecture", CONSOLE = "console", MOBILE = "mobile", TABLET = "tablet";
        var util = {has: function (str1, str2) {
            return str2.toLowerCase().indexOf(str1.toLowerCase()) !== -1
        }, lowerize: function (str) {
            return str.toLowerCase()
        }};
        var mapper = {rgx: function () {
            for (var result, i = 0, j, k, p, q, matches, match, args = arguments; i < args.length; i += 2) {
                var regex = args[i], props = args[i + 1];
                if (typeof result === UNDEF_TYPE) {
                    result = {};
                    for (p in props) {
                        q = props[p];
                        if (typeof q === OBJ_TYPE) {
                            result[q[0]] = undefined
                        } else {
                            result[q] = undefined
                        }
                    }
                }
                for (j = k = 0; j < regex.length; j++) {
                    matches = regex[j].exec(this.getUA());
                    if (!!matches) {
                        for (p in props) {
                            match = matches[++k];
                            q = props[p];
                            if (typeof q === OBJ_TYPE && q.length > 0) {
                                if (q.length == 2) {
                                    if (typeof q[1] == FUNC_TYPE) {
                                        result[q[0]] = q[1].call(this, match)
                                    } else {
                                        result[q[0]] = q[1]
                                    }
                                } else if (q.length == 3) {
                                    if (typeof q[1] === FUNC_TYPE && !(q[1].exec && q[1].test)) {
                                        result[q[0]] = match ? q[1].call(this, match, q[2]) : undefined
                                    } else {
                                        result[q[0]] = match ? match.replace(q[1], q[2]) : undefined
                                    }
                                } else if (q.length == 4) {
                                    result[q[0]] = match ? q[3].call(this, match.replace(q[1], q[2])) : undefined
                                }
                            } else {
                                result[q] = match ? match : undefined
                            }
                        }
                        break
                    }
                }
                if (!!matches)break
            }
            return result
        }, str: function (str, map) {
            for (var i in map) {
                if (typeof map[i] === OBJ_TYPE && map[i].length > 0) {
                    for (var j = 0; j < map[i].length; j++) {
                        if (util.has(map[i][j], str)) {
                            return i === UNKNOWN ? undefined : i
                        }
                    }
                } else if (util.has(map[i], str)) {
                    return i === UNKNOWN ? undefined : i
                }
            }
            return str
        }};
        var maps = {browser: {oldsafari: {major: {1: ["/8", "/1", "/3"], 2: "/4", "?": "/"}, version: {"1.0": "/8", 1.2: "/1", 1.3: "/3", "2.0": "/412", "2.0.2": "/416", "2.0.3": "/417", "2.0.4": "/419", "?": "/"}}}, device: {sprint: {model: {"Evo Shift 4G": "7373KT"}, vendor: {HTC: "APA", Sprint: "Sprint"}}}, os: {windows: {version: {ME: "4.90", "NT 3.11": "NT3.51", "NT 4.0": "NT4.0", 2000: "NT 5.0", XP: ["NT 5.1", "NT 5.2"], Vista: "NT 6.0", 7: "NT 6.1", 8: "NT 6.2", RT: "ARM"}}}};
        var regexes = {browser: [
            [/(opera\smini)\/((\d+)?[\w\.-]+)/i, /(opera\s[mobiletab]+).+version\/((\d+)?[\w\.-]+)/i, /(opera).+version\/((\d+)?[\w\.]+)/i, /(opera)[\/\s]+((\d+)?[\w\.]+)/i],
            [NAME, VERSION, MAJOR],
            [/\s(opr)\/((\d+)?[\w\.]+)/i],
            [
                [NAME, "Opera"],
                VERSION,
                MAJOR
            ],
            [/(kindle)\/((\d+)?[\w\.]+)/i, /(lunascape|maxthon|netfront|jasmine|blazer)[\/\s]?((\d+)?[\w\.]+)*/i, /(avant\s|iemobile|slim|baidu)(?:browser)?[\/\s]?((\d+)?[\w\.]*)/i, /(?:ms|\()(ie)\s((\d+)?[\w\.]+)/i, /(rekonq)((?:\/)[\w\.]+)*/i, /(chromium|flock|rockmelt|midori|epiphany|silk|skyfire|ovibrowser|bolt|iron)\/((\d+)?[\w\.-]+)/i],
            [NAME, VERSION, MAJOR],
            [/(trident).+rv[:\s]((\d+)?[\w\.]+).+like\sgecko/i],
            [
                [NAME, "IE"],
                VERSION,
                MAJOR
            ],
            [/(yabrowser)\/((\d+)?[\w\.]+)/i],
            [
                [NAME, "Yandex"],
                VERSION,
                MAJOR
            ],
            [/(comodo_dragon)\/((\d+)?[\w\.]+)/i],
            [
                [NAME, /_/g, " "],
                VERSION,
                MAJOR
            ],
            [/(chrome|omniweb|arora|[tizenoka]{5}\s?browser)\/v?((\d+)?[\w\.]+)/i],
            [NAME, VERSION, MAJOR],
            [/(dolfin)\/((\d+)?[\w\.]+)/i],
            [
                [NAME, "Dolphin"],
                VERSION,
                MAJOR
            ],
            [/((?:android.+)crmo|crios)\/((\d+)?[\w\.]+)/i],
            [
                [NAME, "Chrome"],
                VERSION,
                MAJOR
            ],
            [/version\/((\d+)?[\w\.]+).+?mobile\/\w+\s(safari)/i],
            [VERSION, MAJOR, [NAME, "Mobile Safari"]],
            [/version\/((\d+)?[\w\.]+).+?(mobile\s?safari|safari)/i],
            [VERSION, MAJOR, NAME],
            [/webkit.+?(mobile\s?safari|safari)((\/[\w\.]+))/i],
            [NAME, [MAJOR, mapper.str, maps.browser.oldsafari.major], [VERSION, mapper.str, maps.browser.oldsafari.version]],
            [/(konqueror)\/((\d+)?[\w\.]+)/i, /(webkit|khtml)\/((\d+)?[\w\.]+)/i],
            [NAME, VERSION, MAJOR],
            [/(navigator|netscape)\/((\d+)?[\w\.-]+)/i],
            [
                [NAME, "Netscape"],
                VERSION,
                MAJOR
            ],
            [/(swiftfox)/i, /(icedragon|iceweasel|camino|chimera|fennec|maemo\sbrowser|minimo|conkeror)[\/\s]?((\d+)?[\w\.\+]+)/i, /(firefox|seamonkey|k-meleon|icecat|iceape|firebird|phoenix)\/((\d+)?[\w\.-]+)/i, /(mozilla)\/((\d+)?[\w\.]+).+rv\:.+gecko\/\d+/i, /(uc\s?browser|polaris|lynx|dillo|icab|doris|amaya|w3m|netsurf|qqbrowser)[\/\s]?((\d+)?[\w\.]+)/i, /(links)\s\(((\d+)?[\w\.]+)/i, /(gobrowser)\/?((\d+)?[\w\.]+)*/i, /(ice\s?browser)\/v?((\d+)?[\w\._]+)/i, /(mosaic)[\/\s]((\d+)?[\w\.]+)/i],
            [NAME, VERSION, MAJOR]
        ], cpu: [
            [/(?:(amd|x(?:(?:86|64)[_-])?|wow|win)64)[;\)]/i],
            [
                [ARCHITECTURE, "amd64"]
            ],
            [/((?:i[346]|x)86)[;\)]/i],
            [
                [ARCHITECTURE, "ia32"]
            ],
            [/windows\s(ce|mobile);\sppc;/i],
            [
                [ARCHITECTURE, "arm"]
            ],
            [/((?:ppc|powerpc)(?:64)?)(?:\smac|;|\))/i],
            [
                [ARCHITECTURE, /ower/, "", util.lowerize]
            ],
            [/(sun4\w)[;\)]/i],
            [
                [ARCHITECTURE, "sparc"]
            ],
            [/(ia64(?=;)|68k(?=\))|arm(?=v\d+;)|(?:irix|mips|sparc)(?:64)?(?=;)|pa-risc)/i],
            [ARCHITECTURE, util.lowerize]
        ], device: [
            [/\((ipad|playbook);[\w\s\);-]+(rim|apple)/i],
            [MODEL, VENDOR, [TYPE, TABLET]],
            [/(hp).+(touchpad)/i, /(kindle)\/([\w\.]+)/i, /\s(nook)[\w\s]+build\/(\w+)/i, /(dell)\s(strea[kpr\s\d]*[\dko])/i],
            [VENDOR, MODEL, [TYPE, TABLET]],
            [/\((ip[honed]+);.+(apple)/i],
            [MODEL, VENDOR, [TYPE, MOBILE]],
            [/(blackberry)[\s-]?(\w+)/i, /(blackberry|benq|palm(?=\-)|sonyericsson|acer|asus|dell|huawei|meizu|motorola)[\s_-]?([\w-]+)*/i, /(hp)\s([\w\s]+\w)/i, /(asus)-?(\w+)/i],
            [VENDOR, MODEL, [TYPE, MOBILE]],
            [/\((bb10);\s(\w+)/i],
            [
                [VENDOR, "BlackBerry"],
                MODEL,
                [TYPE, MOBILE]
            ],
            [/android.+((transfo[prime\s]{4,10}\s\w+|eeepc|slider\s\w+))/i],
            [
                [VENDOR, "Asus"],
                MODEL,
                [TYPE, TABLET]
            ],
            [/(sony)\s(tablet\s[ps])/i],
            [VENDOR, MODEL, [TYPE, TABLET]],
            [/(nintendo)\s([wids3u]+)/i],
            [VENDOR, MODEL, [TYPE, CONSOLE]],
            [/((playstation)\s[3portablevi]+)/i],
            [
                [VENDOR, "Sony"],
                MODEL,
                [TYPE, CONSOLE]
            ],
            [/(sprint\s(\w+))/i],
            [
                [VENDOR, mapper.str, maps.device.sprint.vendor],
                [MODEL, mapper.str, maps.device.sprint.model],
                [TYPE, MOBILE]
            ],
            [/(htc)[;_\s-]+([\w\s]+(?=\))|\w+)*/i, /(zte)-(\w+)*/i, /(alcatel|geeksphone|huawei|lenovo|nexian|panasonic|(?=;\s)sony)[_\s-]?([\w-]+)*/i],
            [VENDOR, [MODEL, /_/g, " "], [TYPE, MOBILE]],
            [/\s((milestone|droid(?:[2-4x]|\s(?:bionic|x2|pro|razr))?(:?\s4g)?))[\w\s]+build\//i, /(mot)[\s-]?(\w+)*/i],
            [
                [VENDOR, "Motorola"],
                MODEL,
                [TYPE, MOBILE]
            ],
            [/android.+\s((mz60\d|xoom[\s2]{0,2}))\sbuild\//i],
            [
                [VENDOR, "Motorola"],
                MODEL,
                [TYPE, TABLET]
            ],
            [/android.+((sch-i[89]0\d|shw-m380s|gt-p\d{4}|gt-n8000|sgh-t8[56]9))/i],
            [
                [VENDOR, "Samsung"],
                MODEL,
                [TYPE, TABLET]
            ],
            [/((s[cgp]h-\w+|gt-\w+|galaxy\snexus))/i, /(sam[sung]*)[\s-]*(\w+-?[\w-]*)*/i, /sec-((sgh\w+))/i],
            [
                [VENDOR, "Samsung"],
                MODEL,
                [TYPE, MOBILE]
            ],
            [/(sie)-(\w+)*/i],
            [
                [VENDOR, "Siemens"],
                MODEL,
                [TYPE, MOBILE]
            ],
            [/(maemo|nokia).*(n900|lumia\s\d+)/i, /(nokia)[\s_-]?([\w-]+)*/i],
            [
                [VENDOR, "Nokia"],
                MODEL,
                [TYPE, MOBILE]
            ],
            [/android\s3\.[\s\w-;]{10}((a\d{3}))/i],
            [
                [VENDOR, "Acer"],
                MODEL,
                [TYPE, TABLET]
            ],
            [/android\s3\.[\s\w-;]{10}(lg?)-([06cv9]{3,4})/i],
            [
                [VENDOR, "LG"],
                MODEL,
                [TYPE, TABLET]
            ],
            [/((nexus\s4))/i, /(lg)[e;\s-\/]+(\w+)*/i],
            [
                [VENDOR, "LG"],
                MODEL,
                [TYPE, MOBILE]
            ],
            [/(mobile|tablet);.+rv\:.+gecko\//i],
            [TYPE, VENDOR, MODEL]
        ], engine: [
            [/(presto)\/([\w\.]+)/i, /(webkit|trident|netfront|netsurf|amaya|lynx|w3m)\/([\w\.]+)/i, /(khtml|tasman|links)[\/\s]\(?([\w\.]+)/i, /(icab)[\/\s]([23]\.[\d\.]+)/i],
            [NAME, VERSION],
            [/rv\:([\w\.]+).*(gecko)/i],
            [VERSION, NAME]
        ], os: [
            [/(windows)\snt\s6\.2;\s(arm)/i, /(windows\sphone(?:\sos)*|windows\smobile|windows)[\s\/]?([ntce\d\.\s]+\w)/i],
            [NAME, [VERSION, mapper.str, maps.os.windows.version]],
            [/(win(?=3|9|n)|win\s9x\s)([nt\d\.]+)/i],
            [
                [NAME, "Windows"],
                [VERSION, mapper.str, maps.os.windows.version]
            ],
            [/\((bb)(10);/i],
            [
                [NAME, "BlackBerry"],
                VERSION
            ],
            [/(blackberry)\w*\/?([\w\.]+)*/i, /(tizen)\/([\w\.]+)/i, /(android|webos|palm\os|qnx|bada|rim\stablet\sos|meego)[\/\s-]?([\w\.]+)*/i],
            [NAME, VERSION],
            [/(symbian\s?os|symbos|s60(?=;))[\/\s-]?([\w\.]+)*/i],
            [
                [NAME, "Symbian"],
                VERSION
            ],
            [/mozilla.+\(mobile;.+gecko.+firefox/i],
            [
                [NAME, "Firefox OS"],
                VERSION
            ],
            [/(nintendo|playstation)\s([wids3portablevu]+)/i, /(mint)[\/\s\(]?(\w+)*/i, /(joli|[kxln]?ubuntu|debian|[open]*suse|gentoo|arch|slackware|fedora|mandriva|centos|pclinuxos|redhat|zenwalk)[\/\s-]?([\w\.-]+)*/i, /(hurd|linux)\s?([\w\.]+)*/i, /(gnu)\s?([\w\.]+)*/i],
            [NAME, VERSION],
            [/(cros)\s[\w]+\s([\w\.]+\w)/i],
            [
                [NAME, "Chromium OS"],
                VERSION
            ],
            [/(sunos)\s?([\w\.]+\d)*/i],
            [
                [NAME, "Solaris"],
                VERSION
            ],
            [/\s([frentopc-]{0,4}bsd|dragonfly)\s?([\w\.]+)*/i],
            [NAME, VERSION],
            [/(ip[honead]+)(?:.*os\s*([\w]+)*\slike\smac|;\sopera)/i],
            [
                [NAME, "iOS"],
                [VERSION, /_/g, "."]
            ],
            [/(mac\sos\sx)\s?([\w\s\.]+\w)*/i],
            [NAME, [VERSION, /_/g, "."]],
            [/(haiku)\s(\w+)/i, /(aix)\s((\d)(?=\.|\)|\s)[\w\.]*)*/i, /(macintosh|mac(?=_powerpc)|plan\s9|minix|beos|os\/2|amigaos|morphos|risc\sos)/i, /(unix)\s?([\w\.]+)*/i],
            [NAME, VERSION]
        ]};
        var UAParser = function (uastring) {
            var ua = uastring || (window && window.navigator && window.navigator.userAgent ? window.navigator.userAgent : EMPTY);
            if (!(this instanceof UAParser)) {
                return new UAParser(uastring).getResult()
            }
            this.getBrowser = function () {
                return mapper.rgx.apply(this, regexes.browser)
            };
            this.getCPU = function () {
                return mapper.rgx.apply(this, regexes.cpu)
            };
            this.getDevice = function () {
                return mapper.rgx.apply(this, regexes.device)
            };
            this.getEngine = function () {
                return mapper.rgx.apply(this, regexes.engine)
            };
            this.getOS = function () {
                return mapper.rgx.apply(this, regexes.os)
            };
            this.getResult = function () {
                return{ua: this.getUA(), browser: this.getBrowser(), engine: this.getEngine(), os: this.getOS(), device: this.getDevice(), cpu: this.getCPU()}
            };
            this.getUA = function () {
                return ua
            };
            this.setUA = function (uastring) {
                ua = uastring;
                return this
            };
            this.setUA(ua)
        };
        if (typeof exports !== UNDEF_TYPE) {
            if (typeof module !== UNDEF_TYPE && module.exports) {
                exports = module.exports = UAParser
            }
            exports.UAParser = UAParser
        } else {
            window.UAParser = UAParser;
            if (typeof define === FUNC_TYPE && define.amd) {
                define(function () {
                    return UAParser
                })
            }
            if (typeof window.jQuery !== UNDEF_TYPE) {
                var $ = window.jQuery;
                var parser = new UAParser;
                $.ua = parser.getResult();
                $.ua.get = function () {
                    return parser.getUA()
                };
                $.ua.set = function (uastring) {
                    parser.setUA(uastring);
                    var result = parser.getResult();
                    for (var prop in result) {
                        $.ua[prop] = result[prop]
                    }
                }
            }
        }
    }(this);
    return function () {
        return new UAParser
    }
}();
