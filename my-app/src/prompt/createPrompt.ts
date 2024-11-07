import { issueText } from "./issueText";
import { promptText } from "./promptText";

export const createPrompt = (userInput: string): string => {
  return `
        ${issueText}
        ${promptText}
        ${userInput}
    `;
};
