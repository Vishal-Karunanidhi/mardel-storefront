import { Media, MetaData } from '@Types/shared';

type HighlightedAd = {
  adImage: Media;
  blueTitle: string;
  redTitle: string;
  titleTwo: string;
  subtitle: string;
  disclaimer: string;
  descriptionColumnOne: string;
  descriptionColumnTwo: string;
  disclaimerTwo: string;
  ruleContext: string;
  __typename: 'HighlightedAd';
};

type AdTile = {
  blueTitle: string;
  redTitle: string;
  subTitle: string;
  disclaimer: string;
  description: string;
  image: Media;
  order: number;
  ruleContext: string;
  __typename: 'AdTile';
};

type WeeklyAdPage = {
  metaData: MetaData;
  title: string;
  endDate: string;
  note: string;
  disclaimer: string;
  thumbnail: Media;
  highlightedAd: HighlightedAd;
  messageBox: string;
  adTiles: AdTile[];
  generalDisclaimer: string;
};

export type { HighlightedAd, AdTile, WeeklyAdPage };
