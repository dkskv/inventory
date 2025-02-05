module.exports = (defaultConfig) => {
  defaultConfig.module.rules.push({
    test: /\.sql$/,
    use: 'raw-loader',
  });

  return defaultConfig;
};
