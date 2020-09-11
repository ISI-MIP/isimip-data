const getValueOrNull = (obj, ...args) => {
  return args.reduce((obj, level) => obj && obj[level], obj)
}

export { getValueOrNull }
