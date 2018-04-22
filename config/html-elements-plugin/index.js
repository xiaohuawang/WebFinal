function HtmlElementsPlugin(locations) {
  this.locations = locations;
}

HtmlElementsPlugin.prototype.apply = function(compiler) {
  var self = this;
  compiler.plugin('compilation', function(compilation) {
    compilation.options.htmlElements = compilation.options.htmlElements || {};

    compilation.plugin('html-webpack-plugin-before-html-generation', function(htmlPluginData, callback) {
      const locations = self.locations;

      if (locations) {
        const publicPath = htmlPluginData.assets.publicPath;

        Object.getOwnPropertyNames(locations).forEach(function(loc) {
          compilation.options.htmlElements[loc] = getHtmlElementString(locations[loc], publicPath);
        });
      }


      callback(null, htmlPluginData);
    });
  });

};

const RE_ENDS_WITH_BS = /\/$/;

function createTag(tagName, attrMap, publicPath) {
  publicPath = publicPath || '';

  if (publicPath && !RE_ENDS_WITH_BS.test(publicPath)) {
    publicPath += '/';
  }

  const attributes = Object.getOwnPropertyNames(attrMap)
    .filter(function(name) { return name[0] !== '='; } )
    .map(function(name) {
      var value = attrMap[name];

      if (publicPath) {

        const usePublicPath = attrMap.hasOwnProperty('=' + name) ? !!attrMap['=' + name] : name === 'href';

        if (usePublicPath) {
          value = publicPath + (value[0] === '/' ? value.substr(1) : value);
        }
      }

      return `${name}="${value}"`;
    });

  const closingTag = tagName === 'script' ? '</script>' : '';

  return `<${tagName} ${attributes.join(' ')}>${closingTag}`;
}

function getHtmlElementString(dataSource, publicPath) {
  return Object.getOwnPropertyNames(dataSource)
    .map(function(name) {
      if (Array.isArray(dataSource[name])) {
        return dataSource[name].map(function(attrs) { return createTag(name, attrs, publicPath); } );
      } else {
        return [ createTag(name, dataSource[name], publicPath) ];
      }
    })
    .reduce(function(arr, curr) {
      return arr.concat(curr);
    }, [])
    .join('\n\t');
}
module.exports = HtmlElementsPlugin;
