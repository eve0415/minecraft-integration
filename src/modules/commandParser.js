module.exports = class commandParser {
  constructor(opt = {}) {
    this.commands   = new Array;
    this.usePrefix  = opt.usePrefix ?? false;

    if (this.usePrefix && !opt.defaultPrefix) return new Error('Please specify defalut prefix when usePrefix is true');
    opt.defaultPrefix ? this.defaultPrefix = toArray(opt.defaultPrefix) : null;
  }

  addCommand(name, opt = {}) {
    const cmd = new Command(name, this.defaultPrefix, opt);
    if (opt.prefix) cmd.prefix(opt.prefix, opt.override ?? false);
    this.commands.push(cmd);
    return cmd;
  }

  parse(input) {
    const result = parseCommand(input, this);
    return result;
  }
};

class Command {
  constructor(name, defaultPrefix, opt) {
    this.command      = name;
    this._prefix      = defaultPrefix;
    this._aliases     = toArray(opt.alias) ?? new Array;
    this._description = opt.description ?? null;
    this.usage        = opt.usage ?? null;
    this._options     = opt.options ?? new Array;
    return this;
  }

  prefix(prefix, override) {
    if (this._prefix && override || !this._prefix) {
      this._prefix = toArray(prefix);
    } else {
      toArray(prefix).forEach(p => {
        if (this._prefix.includes(p)) return;
        this._prefix.push(prefix);
      });
    }
    return this;
  }

  alias(alias) {
    this._aliases = toArray(alias);
    return this;
  }

  description(desc) {
    this._description = desc;
    return this;
  }

  options(name, type, opt = { standalone: false, required: false }) {
    const option = new Option(name, type, opt);
    if (opt.required === true) option.require();
    this._options.push(option);
    return this;
  }
}

class Option {
  constructor(name, type, opt) {
    this.name = name;
    this._aliases     = toArray(opt.alias) ?? new Array;
    this._description = opt.description ?? null;
    this._default     = opt.default ?? null;
    this.isRequired   = false;
    this.standalone   = opt.standalone ?? false;
  }

  require() {
    if (this._default) throw new Error('Cannot set isRequired option to true while using default value');
    this.isRequired = true;
  }
}

const parseCommand = (input, instance) => {
  let command;
  if (instance.usePrefix) {
    command = getCommandByPrefix(input, instance);
  } else {
    const temp = input.split(' ')[0];
    command = instance.commands.filter(cmd => temp === cmd.command || cmd._aliases.includes(temp));
  }
  if (!command.length) return new Error('Cannot find command');
  const [cmd, ...args] = instance.usePrefix
    ? input.slice(command[0].prefix.length).split(' ')
    : input.split(' ');
  const result = checkOptions(cmd, args, command[0]);
  return result;
};

const getCommandByPrefix = (input, instance) => {
  return instance.commands.filter(command => {
    return command._prefix.some(prefix => {
      return input.startsWith(prefix)
      && input.slice(prefix.length).split(' ')[0] === command.command
      || command._aliases.includes(input.slice(prefix.length).split(' ')[0]);
    });
  });
};

const checkOptions = (cmd, args, command) => {
  const result = { command: command.command };

  for (const option of command._options) {
    const tmp = args.indexOf(`--${option.name}`);
    const index = tmp === -1 ? checkOptionsByAlias(args, option) : tmp;

    if (index === -1 && option.isRequired) return new Error(`Option: ${option.name} is required`);
    if (index === -1) continue;

    args = args.slice(0, index).concat(args.slice(index + 1, args.length));
    let tmpArg = args[index];

    if (option.standalone) {
      result[option.name] = true;
      continue;
    }

    if (!tmpArg || tmpArg?.startsWith('--') || tmpArg?.startsWith('-')) {
      if (!option._default) return new Error(`Option: ${option.name} does not have proper arguments`);
      tmpArg = option._default;
    } else {
      args = args.slice(0, index).concat(args.slice(index + 1, args.length));
    }

    result[option.name] = tmpArg;
  }
  if (args.length) return new Error(`Unknown options or arguments found: ${args}`);
  return result;
};

const checkOptionsByAlias = (args, option) => {
  for (const alias of option._aliases) {
    const tmpAlias = args.indexOf(`-${alias}`);
    if (tmpAlias !== -1) return tmpAlias;
  }
  return -1;
};

const toArray = str => Array.isArray(str) ? str : [str];
