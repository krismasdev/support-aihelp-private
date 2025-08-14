// Image URLs for the application
export const images = {
  // Professional headshots
  therapist1: "https://d64gsuwffb70l.cloudfront.net/688a4b7920b080f40d960f78_1755154190581_66da3fa0.png",
  therapist2: "https://d64gsuwffb70l.cloudfront.net/688a4b7920b080f40d960f78_1755154237456_6cc831da.png", 
  therapist3: "https://d64gsuwffb70l.cloudfront.net/688a4b7920b080f40d960f78_1755154330136_19346311.png",
  
  // Existing app images
  chatInterface: "https://d64gsuwffb70l.cloudfront.net/68488438be63c4b444515220_1751394831850_b4bcb584.png",
  appDemo: "https://d64gsuwffb70l.cloudfront.net/68488438be63c4b444515220_1751395153359_8b292d07.png",
  heroBackground: "https://d64gsuwffb70l.cloudfront.net/68488438be63c4b444515220_1751394344802_13b97957.png",
  founderVideo: "https://d64gsuwffb70l.cloudfront.net/68488438be63c4b444515220_1751395050017_0dde53a3.png"
} as const;

export type ImageKey = keyof typeof images;