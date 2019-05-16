const testsContext = require.context('./specs', true, /\.spec$/);
testsContext.keys().forEach(testsContext);

const srcContext = require.context('../../src', true,  /^\.\/(?!.*(\.less)?$)/);
srcContext.keys().forEach(srcContext);
