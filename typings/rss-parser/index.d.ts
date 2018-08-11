declare module 'rss-parser' {

  export interface IFeed {
    feedUrl: string
    title: string
    description: string
    link: string
    items: IFeedItem[]
  }

  export interface IFeedItem {
    title: string
    link: string
    pubDate: string
    creator: string
    content: string
    contentSnippet: string
    guid: string
    isoDate: string
  }

  export default class RssParser {
    parseURL (url: string): Promise<IFeed>
  }
}
