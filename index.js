const Parser = require('rss-parser');
const RSS = require('rss');
const parser = new Parser();

const re = /https?:\/\/(?!(www.reddit))[^"]*/g;

exports.handler = async (event) => {
    const sub = event.queryStringParameters.sub;
    const feed = await parser.parseURL(`https://www.reddit.com/r/${sub}.rss`);
    const newFeed = new RSS(feed);


    feed.items.forEach(item => {
        const matched = item.content.match(re);

        if (!matched) {
            return;
        }

        item.url = matched[0];
        newFeed.item(item);
    });

    return {
        statusCode: 200,
        headers: {
            "Content-Type": "text/xml"
        },
        body: newFeed.xml(),
    };
};
