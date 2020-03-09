const isProduction = process.env.NODE_ENV === "production";
module.exports = {
  lintOnSave: true,
  publicPath: process.env.VUE_APP_PUBLIC_PATH,
  productionSourceMap: !isProduction,
  devServer: {
  
  },
  // chainWebpack: (config) => {
  //   config.module
  //     .rule("eslint")
  //     .use("eslint-loader")
  //     .loader("eslint-loader")
  //     .tap((options) => {
  //       options.fix = true;
  //       return options;
  //     });
  // }
};
