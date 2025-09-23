import React from 'react';
import type { CardDraw, CardOrientation } from '../types';
import {
  TarotWandIcon,
  TarotCupIcon,
  TarotSwordIcon,
  TarotPentacleIcon,
  TarotMajorArcanaIcon,
  TheFoolIcon,
  TheLoversIcon,
  TheSunIcon,
  TheMoonIcon
} from '../components/icons';

type IconProps = { className?: string; };

const TAROT_DECK: string[] = [
  // Major Arcana
  "The Fool", "The Magician", "The High Priestess", "The Empress", "The Emperor",
  "The Hierophant", "The Lovers", "The Chariot", "Strength", "The Hermit",
  "Wheel of Fortune", "Justice", "The Hanged Man", "Death", "Temperance",
  "The Devil", "The Tower", "The Star", "The Moon", "The Sun",
  "Judgement", "The World",
  // Wands
  "Ace of Wands", "Two of Wands", "Three of Wands", "Four of Wands", "Five of Wands",
  "Six of Wands", "Seven of Wands", "Eight of Wands", "Nine of Wands", "Ten of Wands",
  "Page of Wands", "Knight of Wands", "Queen of Wands", "King of Wands",
  // Cups
  "Ace of Cups", "Two of Cups", "Three of Cups", "Four of Cups", "Five of Cups",
  "Six of Cups", "Seven of Cups", "Eight of Cups", "Nine of Cups", "Ten of Cups",
  "Page of Cups", "Knight of Cups", "Queen of Cups", "King of Cups",
  // Swords
  "Ace of Swords", "Two of Swords", "Three of Swords", "Four of Swords", "Five of Swords",
  "Six of Swords", "Seven of Swords", "Eight of Swords", "Nine of Swords", "Ten of Swords",
  "Page of Swords", "Knight of Swords", "Queen of Swords", "King of Swords",
  // Pentacles
  "Ace of Pentacles", "Two of Pentacles", "Three of Pentacles", "Four of Pentacles", "Five of Pentacles",
  "Six of Pentacles", "Seven of Pentacles", "Eight of Pentacles", "Nine of Pentacles", "Ten of Pentacles",
  "Page of Pentacles", "Knight of Pentacles", "Queen of Pentacles", "King of Pentacles"
];

/**
 * Shuffles an array in place using the Fisher-Yates algorithm.
 * @param array The array to shuffle.
 */
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Selects the appropriate icon component for a given Tarot card name.
 * @param cardName The name of the Tarot card.
 * @returns A React functional component for the card's icon.
 */
export const getCardVisualComponent = (cardName: string): React.FC<IconProps> => {
    // Specific Major Arcana
    switch (cardName) {
        case "The Fool":
            return TheFoolIcon;
        case "The Lovers":
            return TheLoversIcon;
        case "The Sun":
            return TheSunIcon;
        case "The Moon":
            return TheMoonIcon;
    }

    // Suits
    if (cardName.includes('Wands')) return TarotWandIcon;
    if (cardName.includes('Cups')) return TarotCupIcon;
    if (cardName.includes('Swords')) return TarotSwordIcon;
    if (cardName.includes('Pentacles')) return TarotPentacleIcon;

    // Default for other Major Arcana
    return TarotMajorArcanaIcon;
};

/**
 * Draws a specified number of unique cards from the Tarot deck.
 * @param count The number of cards to draw.
 * @returns An array of CardDraw objects.
 */
export const drawCards = (count: number): CardDraw[] => {
  const shuffledDeck = shuffleArray(TAROT_DECK);
  const drawnCards = shuffledDeck.slice(0, count);
  
  return drawnCards.map(cardName => {
    const orientation: CardOrientation = Math.random() < 0.5 ? '정방향' : '역방향';
    return {
      name: cardName,
      orientation: orientation,
    };
  });
};

/**
 * Draws one card from the Tarot deck with a random orientation.
 * @returns A single CardDraw object.
 */
export const drawOneCard = (): CardDraw => {
    const cardName = TAROT_DECK[Math.floor(Math.random() * TAROT_DECK.length)];
    const orientation: CardOrientation = Math.random() < 0.5 ? '정방향' : '역방향';
    return {
        name: cardName,
        orientation: orientation,
    };
};