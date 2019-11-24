class Logger
{
    // enum
    static LEVEL = {
        INFO: "INFO",
        WARN: "WARN",
        ERROR: "ERROR",
        FATAL: "FATAL",
        DEBUG: "DEBUG",
        TRACE: "TRACE"
    };

    // fields
    static #now = function ()
    {
        const pad = n => n < 10 ? '0' + n : n;

        const warsawTime = new Date().toLocaleString("en-US", {timeZone: "Europe/Warsaw"});
        let dateTime = new Date(warsawTime);
        return `${pad(dateTime.getFullYear())}-${pad(dateTime.getMonth() + 1)}-${pad(dateTime.getDate())} ${pad(dateTime.getHours())}:${pad(dateTime.getMinutes())}:${pad(dateTime.getSeconds())}`;
    };

    static #log = function (msg, level)
    {
        if (!msg || msg === '')
        {
            msg = "empty Logger message\n" + new Error().stack;
            level = Logger.LEVEL.FATAL;
        }
        console.log(`${Logger.#now()} [${level}] ${msg}`);
    };

    #builder;

    constructor(msg = ``)
    {
        this.#builder = msg;
    }

    // methods
    // noinspection JSUnusedGlobalSymbols
    append(nextPartOfMsg)
    {
        this.#builder = this.#builder + nextPartOfMsg;
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    reset(msg = ``)
    {
        this.#builder = msg;
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    info(msg = ``)
    {
        Logger.#log(this.#builder + msg, Logger.LEVEL.INFO);
        this.#builder = ``;
    }

    // noinspection JSUnusedGlobalSymbols
    warn(msg = ``)
    {
        Logger.#log(this.#builder + msg, Logger.LEVEL.WARN);
        this.#builder = ``;
    }

    // noinspection JSUnusedGlobalSymbols
    error(msg = ``)
    {
        Logger.#log(this.#builder + msg, Logger.LEVEL.ERROR);
        this.#builder = ``;
    }

    // noinspection JSUnusedGlobalSymbols
    fatal(msg = ``)
    {
        Logger.#log(this.#builder + msg, Logger.LEVEL.FATAL);
        this.#builder = ``;
    }

    // noinspection JSUnusedGlobalSymbols
    debug(msg = ``)
    {
        Logger.#log(this.#builder + msg, Logger.LEVEL.DEBUG);
        this.#builder = ``;
    }

    // noinspection JSUnusedGlobalSymbols
    trace(msg = ``)
    {
        Logger.#log(this.#builder + msg, Logger.LEVEL.TRACE);
        this.#builder = ``;
    }

    // static methods
    static info(msg)
    {
        this.#log(msg, this.LEVEL.INFO);
    }

    static warn(msg)
    {
        this.#log(msg, this.LEVEL.WARN);
    }

    static error(msg)
    {
        this.#log(msg, this.LEVEL.ERROR);
    }

    static fatal(msg)
    {
        this.#log(msg, this.LEVEL.FATAL);
    }

    static debug(msg)
    {
        this.#log(msg, this.LEVEL.DEBUG);
    }

    static trace(msg)
    {
        this.#log(msg, this.LEVEL.TRACE);
    }
}

module.exports = Logger;
