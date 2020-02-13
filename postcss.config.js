module.exports = {
    plugins: [
        require('postcss-mixins'),
        require('postcss-preset-env')({
            stage: 0, // for nesting-rules
        }),
        require('postcss-inline-svg'),
        ['production', 'uat'].includes(process.env.NODE_ENV) ? require('cssnano') : null,
        require('postcss-reporter'),
    ].filter(Boolean), // remove null values
};
